import * as config from 'config'
import * as express from 'express'
import {bindRouteHandlers, createApplication} from "./ferengi/internals/startup";
import {Router, RouteDefinition} from "./ferengi/internals/router";
import AdvertisementRouter from "./ferengi/routers/advertisement";
import StatusRouter from "./ferengi/routers/status";

if(require.main == module) {
    main(process.argv);
}

function buildRouteHandlers(): Router[]{
    let routers: Router[] = [];
    routers.push(new StatusRouter());
    routers.push(new AdvertisementRouter());
    return routers;
}

export default function main(argv: string[]): Promise<void> {
    let routers: Router[] = buildRouteHandlers();
    return createApplication()
        .then(bindRouteHandlers(routers))
        .then((app:express.Application) => {
            const port = config.get('serverPort');
            const server = app.listen(port);
            console.log(`Server started on: ${port}`);
        }).catch((err:any) => {
            console.log("server startup failed");
            console.log(`err: ${err}`);
        });
}