import { ObjectId } from "mongodb";

interface BuildArgs {
    name: string;
}

interface AdvertisementBuildArgs extends BuildArgs{
    tags? : string[];
    dest_url: string;
    image_url: string;
    partner: string | ObjectId;
    enabled: boolean;
    targetCountry: string;
}