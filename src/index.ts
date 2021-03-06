import * as config from 'config'
import * as express from 'express'
import {bindRouteHandlers, createApplication, bindSwagger} from "./ferengi/internals/startup";
import { MongoClient } from 'mongodb';
import StatusHandler from './ferengi/routers/status';
import AdvertisementHandler from './ferengi/routers/advertisement';
import PartnerHandler from './ferengi/routers/partner';
import AdvertiserHandler from './ferengi/routers/advertiser';
import AdvertiserRepo from "./ferengi/dataAccess/AdvertiserRepo";
import PartnerRepo from "./ferengi/dataAccess/PartnerRepo";
import AdvertisementRepo from "./ferengi/dataAccess/AdvertisementRepo";

if(require.main == module) {
    main(process.argv);
}

export default function main(argv: string[]): Promise<void> {
    const mongoConfig: any = config.get("mongo");
    const mongo =  new MongoClient(mongoConfig['uri']);
    const advertiserRepo = new AdvertiserRepo(mongo);
    const partnerRepo = new PartnerRepo(mongo);
    const advertisementRepo = new AdvertisementRepo(mongo, partnerRepo, advertiserRepo);
    return createApplication()
        .then(bindRouteHandlers(
                new StatusHandler(),
                new AdvertisementHandler(advertisementRepo),
                new AdvertiserHandler(new AdvertiserRepo(mongo)),
                new PartnerHandler(new PartnerRepo(mongo))
            )
        )
        .then(bindSwagger())
        .then((app:express.Application) => {
            const port = config.get('serverPort');
            const server = app.listen(port);
            console.log(`Server started on: ${port}`);
        }).catch((err:any) => {
            console.log("server startup failed");
            console.log(`err: ${err}`);
        });
}