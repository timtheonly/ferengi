import { Collection, Cursor, MongoClient, ObjectID } from "mongodb";
import { BuildArgs } from "../../../types/buildArgs";
import Partner from "../Partner";
import BaseRepo from "./BaseRepo";

export default class PartnerRepo extends BaseRepo{
    constructor(mongoClient: MongoClient) {
        super("partners", mongoClient);
    }

    public async create(buildArgs: BuildArgs): Promise<Partner> {
        let name: string = buildArgs.name;
        await this.mongoClient.connect();
        const connection = this.mongoClient.db(this.database).collection(this.collection);
        const result = await connection.insertOne({"name": name});
        if(!result.result.ok) {
             throw "Wow unable to insert Partner";
        }
        return new Partner(result.insertedId, name);

    }

    public async get(id: ObjectID | string): Promise<Partner|object>{
        id = this.parseId(id);
        await this.mongoClient.connect();
        const collection: Collection = this.mongoClient.db(this.database).collection(this.collection);
        let raw_partner = await collection.findOne({_id: id});
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