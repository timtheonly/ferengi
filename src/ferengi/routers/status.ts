import {Router, RouteDefinition} from "../internals/router";
import IHandler from "../internals/handler";
import * as express from "express";

class StatusHandler implements IHandler {
    public get(req: express.Request, res: express.Response): object {
        return res.json({
            name: 'ferengi',
            env: process.env.NODE_ENV,
            uptime: process.uptime(),
            memoryUsage: process.memoryUsage()
        })
    }
}

export default class StatusRouter extends Router {
    constructor() {
        let definitions = ["get"].map((method) => {
            return new RouteDefinition(method, '/server-status', new StatusHandler())
        })
        super(definitions);
    }
}