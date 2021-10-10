import {ObjectID} from "mongodb";
import Partner from "./Partner";
import Click from "./Click";

export default class Advertisement {
    public constructor(
        public readonly _id: ObjectID,
        public readonly name: string,
        public tags : string[],
        public dest_url: string,
        public image_url: string,
        public partner: Partner,
        public clicks: Array<Click>,
        public enabled: boolean,
        public targetCountry: string,
    ) {}
}