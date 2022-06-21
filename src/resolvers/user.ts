import { User } from "../entities/User";
import { MyContext } from "src/types";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import argon2 from "argon2";
import { EntityManager } from "@mikro-orm/postgresql";

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;

  @Field()
  password: string;
}
@ObjectType()
class FieldError {
  @Field(() => String)
  field: string;

  @Field(() => String)
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}
@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req, em }: MyContext) {
    // You are not login
    if (!req.session.userId) {
      return null;
    }
    const user = await em.findOne(User, { id: req.session.userId });
    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ) {
    if (options.username.length < 4) {
      return {
        errors: [
          {
            field: "username",
            message: "username must be at least 4 characters",
          },
        ],
      };
    }
    if (options.password.length < 8) {
      return {
        errors: [
          {
            field: "password",
            message: "password must be at least 8 characters",
          },
        ],
      };
    }
    const hashedPassword = await argon2.hash(options.password);
    let user;
    // const user=em.create(User, {username: options.username, password: hashedPassword, createdAT: new Date(), updatedAT: new Date()})
    try {
      const result = await (em as EntityManager)
        .createQueryBuilder(User)
        .getKnexQuery()
        .insert({
          username: options.username,
          password: hashedPassword,
          createAt: new Date(),
          updatedAt: new Date(),
        })
        .returning("*");
      user = result[0];
      // await em.persistAndFlush(user)
    } catch (err) {
      // duplicate username
      if (err.detail.includes("already exists")) {
        return {
          errors: [{ field: "username", message: "username already taken" }],
        };
      }
    }
    
    return { user: user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ) {
    const user = await em.findOne(User, { username: options.username });
    if (!user) {
      return {
        errors: [
          { field: "username", message: "that username does not exist" },
        ],
      };
    }
    const validate = await argon2.verify(user.password, options.password);
    if (!validate) {
      return {
        errors: [{ field: "password", message: "incorrect password" }],
      };
    }
    // store user id in session
    // this will set a cookie on the user
    // keep them logged in
    req.session.userId = user.id;

    return {
      user,
    };
  }
}
