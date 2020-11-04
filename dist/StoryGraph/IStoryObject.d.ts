/**P. Kessling *Hamburg, September 2020*/
import { IContent } from "./IContent";
import { IMetaData } from "./IMetaData";
import { IEdge } from "./IEdge";
import { StoryGraph } from "./StoryGraph";
import { IGraph } from "./IGraph";
import { IRenderingProperties } from "./IRenderingProperties";
import { IStoryModifier } from "./IStoryModifier";
import { IReactiveOutput } from "./IReactiveOutput";
import { IReactiveInput } from "./IReactiveInput";
/**
 *
 */
export interface IStoryObject {
    /**
     *
     */
    userDefinedProperties: any;
    /**
     *
     */
    isContentNode: boolean;
    /**
     *
     */
    content?: IContent;
    /**
     *
     */
    metaData: IMetaData;
    /**
     *
     */
    outgoing: IEdge[];
    /**
     *
     */
    incoming: IEdge[];
    /**
     *
     */
    parent?: StoryGraph;
    /**
     *
     */
    network?: IGraph;
    /**
     *
     */
    renderingProperties: IRenderingProperties;
    /**
     *
     */
    modifiers: IStoryModifier[];
    /**
     *
     */
    outputs?: IReactiveOutput;
    /**
     *
     */
    inputs?: IReactiveInput[];
}
