import { VReg } from "../..";
import { StoryGraph } from "../StoryGraph";
import { IContent } from "./IContent";
import { IRenderingProperties } from "./IRenderingProperties";
import { IStoryModifier } from "./IStoryModifier";

export interface INGWebSProps {
    id: string
    registry: VReg
    renderingProperties?: IRenderingProperties
    userDefinedProperties?: any;
    content?: IContent
    modifiers?: IStoryModifier[]
    graph?: StoryGraph
}
