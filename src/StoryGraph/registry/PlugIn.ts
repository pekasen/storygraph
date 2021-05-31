import { StoryObject } from "../..";
import { IStoryModifier } from "../interfaces/IStoryModifier";
import { Class } from "./Class";

export interface PlugIn {
    name:   string;
    id:     string;
    icon:   string;
    public: boolean;
    constructor: Class<unknown>
}

export interface StoryPlugIn extends PlugIn {
    constructor: Class<StoryObject>
}

export interface ModifierPlugIn extends PlugIn {
    constructor: Class<IStoryModifier>
}
