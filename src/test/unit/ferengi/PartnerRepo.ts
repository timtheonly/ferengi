import "should"
import * as sinon from "sinon";
import PartnerRepo from "../../../ferengi/dataAccess/PartnerRepo"
import {ObjectId} from "mongodb";
import Partner from "../../../ferengi/Partner";

describe("PartnerRepo", () => {
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

    describe("get", () => {
        beforeEach(()=>{
            sinon.restore();
        });
        it("should fail if the database emits an error", () => {
            const repo = new PartnerRepo(fakeClient);
            repo.should.be.of.instanceOf(PartnerRepo);
            sinon.stub(fakeClient, "connect").callsFake(() => {
                throw new Error('ECONNREFUSED');
            });
            return repo.get(new ObjectId()).should.be.rejectedWith(Error).then((err: any)=>{
                const fn = fakeClient.connect as sinon.SinonSpy;
                fn.called.should.be.true();
            });
        });
        it("should retreive partner for passed id (ObjectId)", () => {
            const repo = new PartnerRepo(fakeClient);
            const partnerId = new ObjectId();
            sinon.stub(fakeCollection, "findOne").callsFake((query: object)=>{
                return new Promise<object>((resolve, reject)=>{
                    resolve({
                        _id: partnerId,
                        name: "yarr beanz"
                    })
                });
            });
            return repo.get(partnerId).should.be.fulfilled().then((res:any)=>{
                const fn = fakeCollection.findOne as sinon.SinonSpy;
                fn.calledOnceWith({_id: partnerId}).should.be.true();
                res.name.should.equal("yarr beanz");
                res._id.should.equal(partnerId);
         });
        });
        it("should retreive partner for passed id (string)", () => {
            const repo = new PartnerRepo(fakeClient);
            const partnerId = new ObjectId();
            sinon.stub(fakeCollection, "findOne").callsFake((query: object)=>{
                return {
                    _id: partnerId,
                    name: "yarr beanz"
                };
            });
            return repo.get(partnerId.toHexString()).should.be.fulfilled().then((advertiser:Partner)=>{
                const fn = fakeCollection.findOne as sinon.SinonSpy;
                fn.calledOnce.should.be.true();
                fn.calledWith({_id: partnerId}).should.be.true();
                advertiser.name.should.equal("yarr beanz");
                advertiser._id.should.equal(partnerId);
            });
        });
    });
    describe("getAll", () => {
        beforeEach(()=>{
            sinon.restore();
        });
        it("should fail if the database emits an error", () => {
            const repo = new PartnerRepo(fakeClient);
            repo.should.be.of.instanceOf(PartnerRepo);
            sinon.stub(fakeClient, "connect").callsFake(() => {
                throw new Error('ECONNREFUSED');
            });
            return repo.getAll().should.be.rejectedWith(Error).then((err: any)=>{
                const fn = fakeClient.connect as sinon.SinonSpy;
                fn.called.should.be.true();
            });
        });
        it("should return all advertisers", () => {
            const repo = new PartnerRepo(fakeClient);
            repo.should.be.of.instanceOf(PartnerRepo);
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
                    ele.should.be.instanceOf(Partner);
                });
            });
        });
        it("should return an empty array if no advertisers are found", () => {
            const repo = new PartnerRepo(fakeClient);
            repo.should.be.of.instanceOf(PartnerRepo);
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