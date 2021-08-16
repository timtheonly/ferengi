import IHandler from "../internals/handler";
import {Request, Response, NextFunction, RequestHandler, ErrorRequestHandler} from "express"

export default class StatusHandler implements IHandler {
    public get(){
        return (req: Request, res: Response, next: NextFunction) => {
            res.json({
                name: 'ferengi',
                env: process.env.NODE_ENV,
                uptime: process.uptime(),
                memoryUsage: process.memoryUsage()
            })
        }
    }
}