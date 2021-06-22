import * as express from "express"

export default interface IHandler {
    get?: (req: express.Request, res: express.Response) => object;
    post?: (req: express.Request, res: express.Response) => object;
    put?: (req: express.Request, res: express.Response) => object;
    delete?: (req: express.Request, res: express.Response) => object;
}