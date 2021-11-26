import { Collection, Cursor, MongoClient, ObjectID } from "mongodb";
import Partner from "../Partner";
import BaseRepo from "./BaseRepo";

export default class PartnerRepo extends BaseRepo{
    constructor(mongoClient: MongoClient) {
        super("partners", mongoClient);
    }
    public async get(id: ObjectID | string): Promise<Partner|object>{
        id = this.parseId(id);
        await this.mongoClient.connect();
        const collection: Collection = this.mongoClient.db(this.database).collection(this.collection);
        let raw_partner = await collection.findOne({_id: id}).catch((error: any) => {console.log(error);});
        return new Partner(raw_partner._id, raw_partner.name);
    }

    public async getAll(): Promise<Partner[]>{
        await this.mongoClient.connect();
        const collection: Collection = this.mongoClient.db(this.database).collection(this.collection);
        let partnerCursor: Cursor = collection.find({});
        let partners: Partner[] = [];
        for await (const doc of partnerCursor) {
            partners.push(new Partner(doc._id, doc.name));
        }
        return partners;
    }
}