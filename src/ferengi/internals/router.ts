import Handler from "./handler";

export class RouteDefinition {
    public constructor(
        public readonly httpMethod: string,
        public readonly path: string,
        public readonly handler: Handler,
    ) {}
}

export class Router {
    public constructor(
        public definitions: RouteDefinition[]
    ) {}
}