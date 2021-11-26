import {Collection, Cursor, MongoClient, ObjectID} from "mongodb"
import Partner from "../Partner";
import Advertisement from "../Advertisement";
import PartnerRepo from "./PartnerRepo";
import Click from "../Click";
import AdvertiserRepo from "./AdvertiserRepo";
import Advertiser from "../Advertiser";
import BaseRepo from "./BaseRepo";

export default class AdvertisementRepo extends BaseRepo{
    public constructor(
        protected readonly mongoClient: MongoClient,
        private readonly partnerRepo: PartnerRepo,
        private readonly advertiserRepo: AdvertiserRepo,
    ) {
        super("advertisements", mongoClient);
    }

    public async get(id: ObjectID | string): Promise<Partner|object>{
        id = this.parseId(id);
        await this.mongoClient.connect();
        const collection: Collection = this.mongoClient.db(this.database).collection(this.collection);
        let doc = await collection.findOne({_id: id}).catch((error: any) => {console.log(error);});
        doc.partner = await this.partnerRepo.get(new ObjectID(doc.partner));
        doc.clicks = await this.populateClicks(doc.clicks);
        return new Advertisement(doc._id, doc.name, doc.tags, doc.dest_url, doc.image_url, doc.partner, doc.clicks, doc.enabled, doc.targetCountry);
    }

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

    private async populateClicks(rawClicks: Array<any>): Promise<Array<Click>>{
        const clicks: Array<Click> = [];
        for await(const rawClick of rawClicks){
            const advertiser: Advertiser | undefined = await this.advertiserRepo.get(new ObjectID(rawClick.advertiser));
            if (advertiser !== undefined) {
                clicks.push(new Click(advertiser, rawClick.count, rawClick.successful));
            }
        }
        return clicks;
    }

    private async query(queryParams: object): Promise<Advertisement[]>{
        await this.mongoClient.connect();
        const collection: Collection = this.mongoClient.db(this.database).collection(this.collection);
        let adsCursor: Cursor = collection.find(queryParams);
        let ads: Advertisement[]  = [];
        for await (const doc of adsCursor) {
            doc.partner = await this.partnerRepo.get(new ObjectID(doc.partner));
            doc.clicks = await this.populateClicks(doc.clicks);
            ads.push(new Advertisement(doc._id, doc.name, doc.tags, doc.dest_url, doc.image_url, doc.partner, doc.clicks, doc.enabled, doc.targetCountry));
        }
        return ads;
    }
}