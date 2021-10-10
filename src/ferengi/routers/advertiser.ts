import { MongoClient } from "mongodb";
import {Request, Response, NextFunction} from "express"
import IHandler from "../internals/handler";
import AdvertiserRepo from "../dataAccess/AdvertiserRepo";

export default class AdvertiserHandler implements IHandler {
    constructor(
        private readonly mongo: MongoClient,
        private readonly repo?: AdvertiserRepo
    ){
        this.repo = new AdvertiserRepo(mongo);
    }

    public get(){
        return async (req: Request, res: Response, next: NextFunction) => {
            if(this.repo){
                let results;
                if(req.query.id){
                    results = await this.repo.get(req.query.id as string);
                } else {
                    results = await this.repo.getAll();
                }
                return res.json(results);
            }
            return res.status(500).json({});
        }
    }
}