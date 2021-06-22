import {Router, RouteDefinition} from "../internals/router";
import IHandler from "../internals/handler";
import * as express from "express";

class AdvertisementHandler implements IHandler {
    public get(req: express.Request, res: express.Response): object {
        return res.json({woot:"yarr"})
    }
}

export default class AdvertisementRouter extends Router {
    constructor() {
        let definitions = ["get"].map((method) => {
            return new RouteDefinition(method, '/advertisement', new AdvertisementHandler())
        })
        super(definitions);
    }
}


