import {ObjectID} from "mongodb";

export default class Advertiser {
    public constructor(
        public readonly _id: ObjectID,
        public readonly name: string
    ) {}
}