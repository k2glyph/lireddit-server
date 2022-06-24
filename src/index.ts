import "reflect-metadata"
import { MikroORM } from '@mikro-orm/core'
import { COOKIE_NAME, __prod__ } from './constants'
import mikroOrmConfig from './mikro-orm.config'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import {buildSchema} from 'type-graphql'
import session from "express-session"
import { createClient } from "redis"
import connectRedis from "connect-redis"
import cors from 'cors'

import { HelloResolver } from './resolvers/hello'
import { PostResolver } from './resolvers/post'
import { UserResolver } from "./resolvers/user"


const main = async () => {
    // sendEmail("bob@bob.com", "Hello there")
    const orm = await MikroORM.init(mikroOrmConfig)
    
    await orm.getMigrator().up()

    const app = express()
    const RedisStore = connectRedis(session)
    const redisClient = createClient({legacyMode: true, password: "eYVX7EwVmmxKPCDmwMtyKVge8oLd2t81"})

    redisClient.connect().catch(console.error)
    const corsConfig={
        origin: ["http://localhost:3000", "https://studio.apollographql.com"],
        credentials: true
    }
    app.use(cors(corsConfig))
    app.use(
        session({
            name: COOKIE_NAME,
            store: new RedisStore({ client: redisClient, disableTouch: true}),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
                httpOnly: true,
                secure: __prod__, // cookie only works in https
                sameSite: "lax", // csrf
            },
            saveUninitialized: false,
            secret: "iawsfkjshdajfkashdfjkhwuaieyrasnhdjkfhalsdfkjhasdfljkjkhasdjkfasdfasdfsadfsad",
            resave: false,
        })
    )
    const apolloServer=new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false,
        }),
        context: ({req, res}) =>{
            return ({ em: orm.em, req, res })
        },
    })
    await apolloServer.start()
    apolloServer.applyMiddleware({app,
    cors: false })

    app.get("/",(_, res)=>res.send("Index server"))
    app.get("/healthz",(_, res)=>res.send("{\"status\": \"health ok\"}"))
    app.listen(4000, () => console.log('Server started on port 4000'))
}
console.log("Running main program...")
main().catch((err)=>{
    console.error(err)
})