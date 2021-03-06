import IHandler from "./handler";
import BaseRepo from "../dataAccess/BaseRepo";
import {NextFunction, Request, Response} from "express";
import { BuildArgs } from "../../../types/buildArgs";

export default class BaseApiHandler implements IHandler{
    constructor(
        protected readonly repo: BaseRepo
    ) {}

    public get(){
        return async (req: Request, res: Response, next: NextFunction) => {
            if(this.repo){
                let results;
                if(req.params.id){
                    results = await this.repo.get(req.params.id as string);
                } else {
                    results = await this.repo.getAll();
                }
                return res.json(results);
            }
            return res.status(500).json({});
        }
    }

    public post(){
        return async (req: Request, res: Response, next: NextFunction) => {
            if(this.repo) {
                const result = await this.repo.create({name: req.query.name} as BuildArgs);
                return res.json(result);
            }
        }
    }
}