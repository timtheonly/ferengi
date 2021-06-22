import * as express from "express"
import {Router, RouteDefinition} from "./router"
export async function createApplication(): Promise<express.Application> {
    return express();
}

export function bindRouteHandlers(routers: Router[]) {
    return async (app: express.Application): Promise<express.Application> => {
        await routers.forEach((router) => {
            router.definitions.forEach((definition : RouteDefinition) => {
                switch (definition.httpMethod) {
                    case 'get': {
                        app.get(definition.path, definition.handler[definition.httpMethod] as any);
                        return;
                    }
                    case 'delete': {
                        app.delete(definition.path, definition.handler[definition.httpMethod] as any);
                        return;
                    }
                    case 'post': {
                        app.post(definition.path, definition.handler[definition.httpMethod] as any);
                        return;
                    }
                    case 'put': {
                        app.put(definition.path, definition.handler[definition.httpMethod] as any);
                        return;
                    }
                }
            });
        });
        return app;
    }
}