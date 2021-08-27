import * as express from "express"

import AdvertisementHandler from "../routers/advertisement";
import PartnerHandler from "../routers/partner";
import StatusHandler from "../routers/status";

export async function createApplication(): Promise<express.Application> {
    return express();
}

export function bindRouteHandlers(status: StatusHandler, advertisements: AdvertisementHandler, partners: PartnerHandler) {
    return async (app: express.Application): Promise<express.Application> => {
        app.get('/status', status.get());
        app.get('/advertisement', advertisements.get());
        app.get('/partner', partners.get());
        return app;
    }
}