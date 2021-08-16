import * as express from "express"

import AdvertisementHandler from "../routers/advertisement";
import StatusHandler from "../routers/status";

export async function createApplication(): Promise<express.Application> {
    return express();
}

export function bindRouteHandlers(status: StatusHandler, advertisements: AdvertisementHandler) {
    return async (app: express.Application): Promise<express.Application> => {
        app.get('/status', status.get());
        app.get('/advertisement', advertisements.get());
        return app;
    }
}