import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType({ description: "Post" })
@Entity()
export class Post{
    @Field(()=>Int)
    @PrimaryKey()
    id!: number;

    @Field(()=>String)
    @Property({type: 'date'})
    createdAT=new Date();

    @Field(()=>String)
    @Property({ type: 'date', onUpdate:()=>new Date()})
    updatedAT=new Date();

    @Field(()=>String)
    @Property({type: "text"})
    title!: string;
}