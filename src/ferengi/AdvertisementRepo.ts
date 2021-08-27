import {Collection, Cursor, MongoClient, ObjectID} from "mongodb"
import Partner from "./Partner";
import Advertisement from "./Advertisement";
import PartnerRepo from "./PartnerRepo";

export default class AdvertisementRepo {
    public constructor(
        private readonly mongoClient: MongoClient,
        private readonly partnerRepo: PartnerRepo
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

    public async getAll(): Promise<Advertisement[]>{
        return this.query({});
    }

    private async query(queryParams: object): Promise<Advertisement[]>{
        await this.mongoClient.connect();
        const collection: Collection = this.mongoClient.db("ferengi").collection("advertisements");
        let adsCursor: Cursor = collection.find(queryParams);
        let ads: Advertisement[]  = [];
        for await (const doc of adsCursor) {
            doc.partner = await this.partnerRepo.get(new ObjectID(doc.partner));
            ads.push(new Advertisement(doc._id, doc.name, doc.tags, doc.dest_url, doc.image_url, doc.partner, doc.clicks, doc.successful, doc.enabled, doc.targetCountry));
        }
        return ads;
    }
}