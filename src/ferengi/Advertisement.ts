import {ObjectID} from "mongodb";
import Partner from "./Partner";

export default class Advertisement {
    public constructor(
        public readonly _id: ObjectID,
        public readonly name: string,
        public tags : string[],
        public dest_url: string,
        public image_url: string,
        public partner: Partner,
        public clicks: number,
        public successful: number,
        public enabled: boolean,
        public targetCountry: string,
    ) {}


}