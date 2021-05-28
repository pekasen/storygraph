import { StoryObject } from "storygraph";
import { PlugInPack } from "./PlugInPack";

interface Class<Type> {
    new(): Type
}

export interface PlugIn {
    name: string;
    id:   string;
    package: PlugInPack;
    constructor: Class<StoryObject>
}
