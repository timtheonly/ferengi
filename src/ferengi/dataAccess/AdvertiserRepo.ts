import {Collection, Cursor, MongoClient, ObjectID} from "mongodb";
import Advertiser from "../Advertiser";

export default class AdvertiserRepo {
    public constructor(
        private readonly mongoClient: MongoClient
    ){}

    public async get(id: ObjectID | string): Promise<Advertiser| undefined> {
        if(typeof id == "string"){
            try {
                id = new ObjectID(id);
            } catch (e) {
                console.log(e);
                return;
            }
        }
        await this.mongoClient.connect();
        const collection: Collection = this.mongoClient.db("ferengi").collection("advertisers");
        const advertiser =  await collection.findOne({_id: id});
        return new Advertiser(advertiser._id, advertiser.name);
    }
}