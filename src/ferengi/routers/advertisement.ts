import IHandler from "../internals/handler";
import {Request, Response, NextFunction} from "express"
import AdvertisementRepo from "../dataAccess/AdvertisementRepo";
import { MongoClient } from "mongodb";
import PartnerRepo from "../dataAccess/PartnerRepo";
import AdvertiserRepo from "../dataAccess/AdvertiserRepo";
import BaseApiHandler from "../internals/BaseApi";

export default class AdvertisementHandler extends BaseApiHandler{
    constructor(
        protected repo : AdvertisementRepo,
    ) {
        super(repo);
    }
    public get() {
        return async (req: Request, res: Response, next: NextFunction) => {
            if(this.repo){
                let result;
                if (req.params.partner) {
                    result = await this.repo.getByPartnerId(req.params.partner as string);
                } else if (req.params.tag) {
                    result = await this.repo.getByTag(req.params.tag as string);
                } else if (req.params.targetCountry) {
                    result = await this.repo.getByTargetCountry(req.params.targetCountry as string);
                } else if (req.params.id) {
                    result = await this.repo.get(req.params.id);
                } else {
                    result = await this.repo.getAll();
                }
                return res.json(result);
            }
            return res.status(500).json({});
        }
    }
}
