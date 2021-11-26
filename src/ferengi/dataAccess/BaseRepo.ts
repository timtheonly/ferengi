import {MongoClient, ObjectID} from "mongodb";

export default class BaseRepo {
    protected readonly database: string = "ferengi";

    public constructor(
        protected readonly collection: string,
        protected readonly mongoClient: MongoClient
    ){}

    public parseId(id: string| ObjectID): ObjectID {
        if(typeof id === "string") {
            try {
                 return new ObjectID(id);
            } catch (e) {
                console.log(e);
                throw "Invalid ObjectID";
            }
        }

        return id
    }

    public async get(id: string | ObjectID): Promise<any> {}
    public async getAll(): Promise<any> {}
}