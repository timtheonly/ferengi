import { ObjectId } from "mongodb";
import "should"
import * as sinon from "sinon";
import Advertiser from "../../../ferengi/Advertiser";
import AdvertiserRepo from "../../../ferengi/dataAccess/AdvertiserRepo";

describe("AdvertiserRepo", ()=>{
    const fakeClient = {
        connect: () => {},
        db: (name: string) => {return fakeDB}
    } as any;

    const fakeDB = {
        collection: (name: string) => {return fakeCollection},
    } as any;

    const fakeCollection = {
        find: (query: any) => {},findOne: (query: any) => {},
    } as any;

    describe("get", ()=> {
        beforeEach(()=>{
            sinon.restore();
        });
        it("should fail if the database emits an error", () => {
            const repo = new AdvertiserRepo(fakeClient);
            repo.should.be.of.instanceOf(AdvertiserRepo);
            sinon.stub(fakeClient, "connect").callsFake(() => {
                throw new Error('ECONNREFUSED');
            });
            repo.get(new ObjectId()).should.be.rejectedWith(Error).then((err: any)=>{
                const fn = fakeClient.connect as sinon.SinonSpy;
                fn.called.should.be.true();
            });
        });
        it("should retreive advertiser for passed id (ObjectId)", () => {
            const repo = new AdvertiserRepo(fakeClient);
            const advertiserId = new ObjectId();
            sinon.stub(fakeCollection, "find").callsFake((query: object)=>{
                return {
                    _id: advertiserId,
                    name: "yarr beanz"
                };
            });
            repo.get(advertiserId).should.be.fulfilled().then((advertiser:Advertiser)=>{
                const fn = fakeCollection.find as sinon.SinonSpy;
                fn.calledOnce.should.be.true();
                fn.calledWith({_id: advertiserId}).should.be.true();
                advertiser.name.should.equal("yarr beanz");
                advertiser._id.should.equal(advertiserId);
            });
        });
        it("should retreive advertiser for passed id (string)", () => {
            const repo = new AdvertiserRepo(fakeClient);
            const advertiserId = new ObjectId();
            sinon.stub(fakeCollection, "find").callsFake((query: object)=>{
                return {
                    _id: advertiserId,
                    name: "yarr beanz"
                };
            });
            repo.get(advertiserId.toHexString()).should.be.fulfilled().then((advertiser:Advertiser)=>{
                const fn = fakeCollection.find as sinon.SinonSpy;
                fn.calledOnce.should.be.true();
                fn.calledWith({_id: advertiserId}).should.be.true();
                advertiser.name.should.equal("yarr beanz");
                advertiser._id.should.equal(advertiserId);
            });
        });
    });
});