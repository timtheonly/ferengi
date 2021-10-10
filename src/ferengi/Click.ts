import Advertiser from "./Advertiser";

export default class Click {
    public constructor(
        public advertiser: Advertiser,
        public count: number,
        public successful: number
    ) {}
}