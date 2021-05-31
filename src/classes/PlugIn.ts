import { IStoryModifier, StoryObject } from "storygraph";
import { Class } from "./Class";

export interface PlugIn {
    name:   string;
    id:     string;
    icon:   string;
    public: boolean;
}

export interface StoryPlugIn extends PlugIn {
    constructor: Class<StoryObject>
}

export interface ModifierPlugIn extends PlugIn {
    constructor: Class<IStoryModifier>
}
