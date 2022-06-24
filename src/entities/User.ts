import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType({ description: "Post" })
@Entity()
export class User{
    @Field(()=>Int)
    @PrimaryKey()
    id!: number;

    @Field(()=>String)
    @Property({type: 'date', onCreate:()=>new Date()})
    createdAT=new Date();

    @Field(()=>String)
    @Property({ type: 'date', onUpdate:()=>new Date()})
    updatedAT=new Date();

    @Field(()=>String)
    @Property({type: "text", unique:true})
    username!: string;

    @Field(()=>String)
    @Property({type: "text", unique:true})
    email!: string;

    @Property({type: "text"})
    password!: string;
}