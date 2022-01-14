import "should"
import { ObjectId } from "mongodb"
import * as sinon from "sinon";
import Advertiser from "../../../ferengi/Advertiser";
import AdvertiserRepo from "../../../ferengi/dataAccess/AdvertiserRepo";
import Sinon = require("sinon");

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
            return repo.get(new ObjectId()).should.be.rejectedWith(Error).then((err: any)=>{
                const fn = fakeClient.connect as sinon.SinonSpy;
                fn.called.should.be.true();
            });
        });
        it("should retreive advertiser for passed id (ObjectId)", () => {
            const repo = new AdvertiserRepo(fakeClient);
            const advertiserId = new ObjectId();
            sinon.stub(fakeCollection, "findOne").callsFake((query: object)=>{
                return new Promise<object>((resolve, reject)=>{
                    resolve({
                        _id: advertiserId,
                        name: "yarr beanz"
                    })
                });
            });
            return repo.get(advertiserId).should.be.fulfilled().then((res:any)=>{
                const fn = fakeCollection.findOne as sinon.SinonSpy;
                fn.calledOnceWith({_id: advertiserId}).should.be.true();
                res.name.should.equal("yarr beanz");
                res._id.should.equal(advertiserId);
         });
     });
         it("should retreive advertiser for passed id (string)", () => {
             const repo = new AdvertiserRepo(fakeClient);
             const advertiserId = new ObjectId();
             sinon.stub(fakeCollection, "findOne").callsFake((query: object)=>{
                 return {
                     _id: advertiserId,
                     name: "yarr beanz"
                 };
             });
             return repo.get(advertiserId.toHexString()).should.be.fulfilled().then((advertiser:Advertiser)=>{
                 const fn = fakeCollection.findOne as sinon.SinonSpy;
                 fn.calledOnce.should.be.true();
                 fn.calledWith({_id: advertiserId}).should.be.true();
                 advertiser.name.should.equal("yarr beanz");
                 advertiser._id.should.equal(advertiserId);
             });
         });
     });
     describe("getAll", () => {
        beforeEach(()=>{
            sinon.restore();
        });
        it("should fail if the database emits an error", () => {
            const repo = new AdvertiserRepo(fakeClient);
            repo.should.be.of.instanceOf(AdvertiserRepo);
            sinon.stub(fakeClient, "connect").callsFake(() => {
                throw new Error('ECONNREFUSED');
            });
            return repo.getAll().should.be.rejectedWith(Error).then((err: any)=>{
                const fn = fakeClient.connect as sinon.SinonSpy;
                fn.called.should.be.true();
            });
        });
        it("should return all advertisers", () => {
            const repo = new AdvertiserRepo(fakeClient);
            repo.should.be.of.instanceOf(AdvertiserRepo);
            sinon.stub(fakeCollection, "find").callsFake(() => {
                return [
                    {
                        _id: new ObjectId(),
                        name: "yarr beanz"
                    },
                    {
                        _id: new ObjectId(),
                        name: "beanz?"
                    }
                ]
            });
            return repo.getAll().should.be.fulfilled().then((res: any[]) => {
                const fn = fakeCollection.find as sinon.SinonSpy;
                fn.calledOnceWith({}).should.be.true();
                res.length.should.be.equal(2);
                res.forEach((ele: any, index: number) => {
                    ele.should.be.instanceOf(Advertiser);
                });
            });
        });
        it("should return an empty array if no advertisers are found", () => {
            const repo = new AdvertiserRepo(fakeClient);
            repo.should.be.of.instanceOf(AdvertiserRepo);
            sinon.stub(fakeCollection, "find").callsFake(() => {
                return []
            });
            return repo.getAll().should.be.fulfilled().then((res: any[]) => {
                const fn = fakeCollection.find as sinon.SinonSpy;
                fn.calledOnceWith({}).should.be.true();
                res.length.should.be.equal(0);
            });
        });
    });
});