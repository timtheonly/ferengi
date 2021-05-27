import {ObjectID} from "mongodb";

export default class Partner{
    public constructor(
        public readonly _id: ObjectID,
        public name: string,
    ) {
    }
}