import * as express from "express"
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require('../../../swagger.json');

import AdvertisementHandler from "../routers/advertisement";
import AdvertiserHandler from "../routers/advertiser";
import PartnerHandler from "../routers/partner";
import StatusHandler from "../routers/status";

export async function createApplication(): Promise<express.Application> {
    return express();
}

export function bindRouteHandlers(status: StatusHandler, advertisements: AdvertisementHandler, advertiser: AdvertiserHandler, partners: PartnerHandler) {
    return async (app: express.Application): Promise<express.Application> => {
        app.get('/status', status.get());
        app.get('/advertisement', advertisements.get());
        app.get('/advertiser', advertiser.get());
        app.get('/partner', partners.get());
        return app;
    }
}

export function bindSwagger() {
    return async (app: express.Application): Promise<express.Application> => {
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
        return app
    }
}