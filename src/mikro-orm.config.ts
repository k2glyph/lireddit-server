import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import path from 'path'
import { Post } from "./entities/Post";
import { User } from "./entities/User";

export default {
    migrations:{
        path: path.join(__dirname,"./migrations"),
        glob: '!(*.d).{js,ts}',
    },
    allowGlobalContext: true,
    entities: [Post, User],
    dbName: 'lireddit',
    type: 'postgresql',
    user: 'lireddit',
    password: 'lireddit',
    debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0]