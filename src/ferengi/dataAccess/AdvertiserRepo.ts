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

    public async getAll(): Promise<Array<Advertiser>> {
        await this.mongoClient.connect();
        const collection: Collection = this.mongoClient.db("ferengi").collection("advertisers");
        const advertisersCuror: Cursor = collection.find({});
        let advertisers: Advertiser[] = [];
        for await(const doc of advertisersCuror){
            advertisers.push(new Advertiser(doc._id, doc.name));
        }
        return advertisers;
    }
}