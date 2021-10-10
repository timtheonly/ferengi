import { Collection, Cursor, MongoClient, ObjectID } from "mongodb";
import Partner from "../Partner";

export default class PartnerRepo{
    constructor(
        private readonly mongoClient: MongoClient
    ){}

    public async get(id: ObjectID | string): Promise<Partner|object>{
        if(typeof id === "string") {
            try {
                id = new ObjectID(id);
            } catch (e) {
                console.log(e);
                return {};
            }
        }
        await this.mongoClient.connect();
        const collection: Collection = this.mongoClient.db("ferengi").collection("partners");
        let raw_partner = await collection.findOne({_id: id}).catch((error: any) => {console.log(error);});
        return new Partner(raw_partner._id, raw_partner.name);
    }

    public async getAll(): Promise<Partner[]>{
        await this.mongoClient.connect();
        const collection: Collection = this.mongoClient.db("ferengi").collection("partners");
        let partnerCursor: Cursor = collection.find({});
        let partners: Partner[] = [];
        for await (const doc of partnerCursor) {
            partners.push(new Partner(doc._id, doc.name));
        }
        return partners;
    }
}