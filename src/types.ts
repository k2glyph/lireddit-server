import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";
import { Request, Response} from "express"
import { Session } from "express-session";

export type SessionWithUser = Session & { userId: number};

export type MyContext = {
    em: EntityManager<IDatabaseDriver<Connection>> & EntityManager<any>;
    req: Request & {session: SessionWithUser};
    res: Response;
}