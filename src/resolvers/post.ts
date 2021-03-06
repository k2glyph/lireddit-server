import { Post } from "../entities/Post";
import { MyContext } from "src/types";
import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { sleep } from "../utils/sleep";

@Resolver()
export class PostResolver {
    @Query(() => [Post])
    posts(@Ctx() { em }: MyContext): Promise<Post[]> {
        sleep(3000)
        return em.find(Post, {})
    }
    @Query(() => Post, { nullable: true })
    post(
        @Arg("id", () => Int) id: number,
        @Ctx() { em }: MyContext): Promise<Post | null> {
        return em.findOne(Post, { id })
    }
    @Mutation(() => Post)
    async createPost(
        @Arg("title", () => String, {nullable:true}) title: string,
        @Ctx() { em }: MyContext): Promise<Post> {

        const post = em.create(Post, { title, createdAT: new Date(), updatedAT: new Date() })
        await em.persistAndFlush(post)
        return post
    }

    @Mutation(() => Post, { nullable:true })
    async updatePost(
        @Arg("id", () => Int) id: number,
        @Arg("title", () => String, {nullable:true}) title: string,
        @Ctx() { em }: MyContext): Promise<Post|null> {
        const post = await em.findOne(Post, { id })
        if (!post){
            return null
        }
        if (typeof title!=="undefined"){
            post.title=title
            em.persistAndFlush(post)
        }
        return post
    }

    @Mutation(()=> Boolean)
    async deletePost(
        @Arg("id", () => Int) id: number,
        @Ctx() { em }: MyContext): Promise<boolean> {
        const post = await em.findOne(Post, { id })
        if (!post){
            return false
        }
        em.remove(post)
        await em.flush()
        return true
    }
    
}