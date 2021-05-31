import { VReg } from "storymesh-plugin-support";
import { IRenderingProperties, IStoryModifier, StoryGraph } from "..";
import { IContent } from "./IContent";

export interface INGWebSProps {
    id: string
    registry: VReg
    renderingProperties?: IRenderingProperties
    userDefinedProperties?: any;
    content?: IContent
    modifiers?: IStoryModifier[]
    graph?: StoryGraph
}
