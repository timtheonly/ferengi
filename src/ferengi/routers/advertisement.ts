import IHandler from "../internals/handler";
import {Request, Response, NextFunction, RequestHandler, ErrorRequestHandler} from "express"
import AdvertisementRepo from "../AdvertisementRepo";
import { MongoClient } from "mongodb";
import Advertisement from "../Advertisement";

export default class AdvertisementHandler implements IHandler{
    constructor(private mongo: MongoClient, private repo?: AdvertisementRepo) {
        this.repo = new AdvertisementRepo(mongo);
    }

    public get() {
        return async (req: Request, res: Response, next: NextFunction) => {
            if(this.repo){
                let result;
                if (req.query.partner) {
                    result = await this.repo.getByPartnerId(req.query.partner as string);
                } else if (req.query.tag) {
                    result = await this.repo.getByTag(req.query.tag as string);
                } else if (req.query.targetCountry) {
                    result = await this.repo.getByTargetCountry(req.query.targetCountry as string);
                }
                else {
                    result = await this.repo.getAll();
                }
                return res.json(result);
            }
            return res.status(500).json({});
        }
    }
}
