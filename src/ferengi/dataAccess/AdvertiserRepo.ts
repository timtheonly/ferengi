import {Collection, Cursor, MongoClient, ObjectID} from "mongodb";
import { BuildArgs } from "../../../types/buildArgs";
import Advertiser from "../Advertiser";
import BaseRepo from "./BaseRepo";

export default class AdvertiserRepo extends BaseRepo{
    constructor(mongoClient: MongoClient) {
        super("advertisers", mongoClient);
    }

    public async create(buildArgs: BuildArgs): Promise<Advertiser> {
        let name: string = buildArgs.name;
        await this.mongoClient.connect();
        const connection = this.mongoClient.db(this.database).collection(this.collection);
        const result = await connection.insertOne({"name": name});
        if(!result.result.ok) {
             throw "Wow unable to insert Partner";
        }
        return new Advertiser(result.insertedId, name);

    }

    public async get(id: ObjectID | string): Promise<Advertiser| undefined> {
        id = this.parseId(id);
        await this.mongoClient.connect();
        const collection: Collection = this.mongoClient.db(this.database).collection(this.collection);
        const advertiser =  await collection.findOne({_id: id});
        return new Advertiser(advertiser._id, advertiser.name);
    }

    public async getAll(): Promise<Array<Advertiser>> {
        await this.mongoClient.connect();
        const collection: Collection = this.mongoClient.db(this.database).collection(this.collection);
        const advertisersCursor: Cursor = await collection.find({});
        let advertisers: Advertiser[] = [];
        for await(const doc of advertisersCursor){
            advertisers.push(new Advertiser(doc._id, doc.name));
        }
        return advertisers;
    }
}