import {Collection, Cursor, MongoClient, ObjectID} from "mongodb"
import Partner from "./Partner";
import Advertisement from "./Advertisement";

export default class AdvertisementRepo {
    public constructor(
        private readonly mongoClient: MongoClient
    ) {}

    public async getByTag(tag: string): Promise<Advertisement[]>{
        return this.query({tags:tag});
    }

    public async getByTargetCountry(targetCountry: string): Promise<Advertisement[]>{
        return this.query({targetCountry: targetCountry});
    }

    public async getByPartnerId(partnerId: string): Promise<Advertisement[]>{
        return this.query({partner: partnerId});
    }

    private async query(queryParams: object): Promise<Advertisement[]>{
        await this.mongoClient.connect();
        const collection: Collection = this.mongoClient.db("ferengi").collection("advertisements");
        let adsCursor: Cursor = collection.find(queryParams);
        let ads: Advertisement[]  = [];
        await adsCursor.forEach((doc) => {
            doc.partner = this.getPartner(doc.partner);
            ads.push(new Advertisement(doc._id, doc.name, doc.tags, doc.dest_url, doc.image_url, doc.partner, doc.clicks, doc.successful, doc.enabled, doc.targetCountry));
        });

        return ads;
    }

    private  async getPartner(partnerId: ObjectID): Promise<Partner>{
        await this.mongoClient.connect();
        const collection: Collection = await this.mongoClient.db("ferengi").collection("partners");
        let raw_partner = await collection.findOne({_id: partnerId});
        return new Partner(raw_partner._id, raw_partner.name);
    }
}