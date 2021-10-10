import * as config from 'config'
import * as express from 'express'
import {bindRouteHandlers, createApplication} from "./ferengi/internals/startup";
import { MongoClient } from 'mongodb';
import StatusHandler from './ferengi/routers/status';
import AdvertisementHandler from './ferengi/routers/advertisement';
import PartnerHandler from './ferengi/routers/partner';
import AdvertiserHandler from './ferengi/routers/advertiser';

if(require.main == module) {
    main(process.argv);
}

export default function main(argv: string[]): Promise<void> {
    const mongoConfig: any = config.get("mongo");
    const mongo =  new MongoClient(mongoConfig['uri']);
    return createApplication()
        .then(bindRouteHandlers(new StatusHandler(), new AdvertisementHandler(mongo), new AdvertiserHandler(mongo), new PartnerHandler(mongo)))
        .then((app:express.Application) => {
            const port = config.get('serverPort');
            const server = app.listen(port);
            console.log(`Server started on: ${port}`);
        }).catch((err:any) => {
            console.log("server startup failed");
            console.log(`err: ${err}`);
        });
}