import "should"
import * as sinon from "sinon";
import AdvertisementRepo from "../../../ferengi/AdvertisementRepo";
import {ObjectID} from "mongodb";
import Advertisement from "../../../ferengi/Advertisement";

describe("AdvertisementRepo", () => {
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

    const fakePartnerRepo = {
        get: (objectId: any) => {
            return {_id: new ObjectID(), name:"airia"};
        }
    }

    describe("getByTag", () => {
        beforeEach(() => {
           sinon.restore();
        });
        it("should fail if the database emits an error", () => {
            const repo = new AdvertisementRepo(fakeClient, fakePartnerRepo as any);
            repo.should.be.of.instanceOf(AdvertisementRepo);
            sinon.stub(fakeClient, "connect").callsFake(() => {
                throw new Error('ECONNREFUSED');
            });
            return repo.getByTag("yarr").should.be.rejectedWith(Error).then((err:any)=> {
                const fn = fakeClient.connect as sinon.SinonSpy;
                fn.called.should.be.true();
            });
        });
        it("should retrieve all advertisements with the specified tag", () => {
            const repo = new AdvertisementRepo(fakeClient, fakePartnerRepo as any);
            sinon.stub(fakeCollection, 'find').callsFake((query: object)=>{
                return [
                    {_id:new ObjectID(), name: "yarr beans", tags: ['yarr'], dest_url:'http://someurl.com', image_url:'http://someurl.com/images/dope.png', partner: new ObjectID(), clicks: 0, successful: 0, enabled: true, targetCountry:"IQ"},
                    {_id:new ObjectID(), name: "yarr for all", tags: ['yarr', 'all'], dest_url:'http://someurl.com', image_url:'http://someurl.com/images/dope.png', partner: new ObjectID(), clicks: 0, successful: 0, enabled: true, targetCountry:"IQ"}
                ]
            });
            return repo.getByTag("yarr").should.be.fulfilled().then((res: any[])=>{
                const fn = fakeCollection.find as sinon.SinonSpy;
                fn.calledOnce.should.be.true();
                fn.calledWith({tags: "yarr"}).should.be.true();
                res.length.should.be.equal(2);
                res.forEach((ele: any, index: number)=>{
                    ele.should.be.instanceOf(Advertisement);
                });
            });
        });
        it("should return an empty array if no advertisements are found", () => {
            const repo = new AdvertisementRepo(fakeClient, fakePartnerRepo as any);
            sinon.stub(fakeCollection, 'find').callsFake((query: object)=>{
                return []
            });
            return repo.getByTag("yarr").should.be.fulfilled().then((res: any[])=>{
                const fn = fakeCollection.find as sinon.SinonSpy;
                fn.calledOnce.should.be.true();
                fn.calledWith({tags: "yarr"}).should.be.true();
                res.length.should.be.equal(0);
            });
        });
    });
    describe("getByTargetCountry", () => {
        beforeEach(() => {
            sinon.restore();
        });
        it("should fail if the database emits an error", () => {
            const repo = new AdvertisementRepo(fakeClient, fakePartnerRepo as any);
            repo.should.be.of.instanceOf(AdvertisementRepo);
            sinon.stub(fakeClient, "connect").callsFake(() => {
                throw new Error('ECONNREFUSED');
            });
            return repo.getByTargetCountry("yarr").should.be.rejectedWith(Error).then((err: any) => {
                const fn = fakeClient.connect as sinon.SinonSpy;
                fn.called.should.be.true();
            });
        });
        it("should retrieve all advertisements with the specified country", () => {
            const repo = new AdvertisementRepo(fakeClient, fakePartnerRepo as any);
            sinon.stub(fakeCollection, 'find').callsFake((query: object)=>{
                return [
                    {_id:new ObjectID(), name: "yarr for all", tags: ['yarr', 'all'], dest_url:'http://someurl.com', image_url:'http://someurl.com/images/dope.png', partner: new ObjectID(), clicks: 0, successful: 0, enabled: true, targetCountry:"IE"}
                ]
            });

            return repo.getByTargetCountry("IE").should.be.fulfilled().then((res: any[]) => {
                const fn = fakeCollection.find as sinon.SinonSpy;
                fn.called.should.be.true();
                fn.calledWith({targetCountry: "IE"}).should.be.true();
                res.length.should.be.equal(1)
                const ad: Advertisement = res[0];
                ad.targetCountry.should.be.equal("IE");
            });
        });
        it("should return an empty array if no advertisements are found", () => {
            const repo = new AdvertisementRepo(fakeClient, fakePartnerRepo as any);
            sinon.stub(fakeCollection, 'find').callsFake((query: object) => {
                return []
            });

            return repo.getByTargetCountry("IE").should.be.fulfilled().then((res: any[]) => {
                const fn = fakeCollection.find as sinon.SinonSpy;
                fn.called.should.be.true();
                fn.calledWith({targetCountry: "IE"}).should.be.true();
                res.length.should.be.equal(0);
            });
        });
    });
    describe("getByPartner", () => {
        beforeEach(() => {
            sinon.restore();
        });
        it("should fail if the database emits an error", () => {
            const repo = new AdvertisementRepo(fakeClient, fakePartnerRepo as any);
            repo.should.be.of.instanceOf(AdvertisementRepo);
            sinon.stub(fakeClient, "connect").callsFake(() => {
                throw new Error('ECONNREFUSED');
            });
            return repo.getByPartnerId(new ObjectID().toString()).should.be.rejectedWith(Error).then((err: any) => {
                const fn = fakeClient.connect as sinon.SinonSpy;
                fn.called.should.be.true();
            });
        });
        it("should retrieve all advertisements for the specified partner", () => {
            const repo = new AdvertisementRepo(fakeClient, fakePartnerRepo as any);
            const obj_id = new ObjectID();
            sinon.stub(fakeCollection, 'find').callsFake((query: object) => {
                return [
                    {_id:new ObjectID(), name: "yarr for all", tags: ['yarr', 'all'], dest_url:'http://someurl.com', image_url:'http://someurl.com/images/dope.png', partner: obj_id, clicks: 0, successful: 0, enabled: true, targetCountry:"IE"}
                ]
            });

            repo.should.be.instanceOf(AdvertisementRepo);
           
            return repo.getByPartnerId(obj_id.toString()).should.be.fulfilled().then((res: any[]) => {
                const fn = fakeCollection.find as sinon.SinonSpy;
                fn.called.should.be.true();
                fn.calledWith({partner: obj_id.toString()}).should.be.true();
                res.length.should.equal(1);
                res[0].should.be.instanceOf(Advertisement);
            });
        });
        it("should return an empty array if no advertisements are found", () => {
            const repo = new AdvertisementRepo(fakeClient, fakePartnerRepo as any);
            const obj_id = new ObjectID();
            sinon.stub(fakeCollection, 'find').callsFake((query: object) => {
                return []
            });

            repo.should.be.instanceOf(AdvertisementRepo);

            return repo.getByPartnerId(obj_id.toString()).should.be.fulfilled().then((res: any[]) => {
                const fn = fakeCollection.find as sinon.SinonSpy;
                fn.called.should.be.true();
                fn.calledWith({partner: obj_id.toString()}).should.be.true();
                res.length.should.equal(0);
            });
        });
    });
});