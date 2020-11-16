/**P. Kessling *Hamburg, September 2020*/
import { IContent } from "./IContent"
import { IMetaData } from "./IMetaData"
import { IEdge } from "./IEdge"
import { StoryGraph } from "./StoryGraph"
import { IRenderingProperties } from "./IRenderingProperties"
import { IStoryModifier } from "./IStoryModifier"
import { IConnectorPort } from './IConnectorPort'
/**
 * 
 */
export interface IStoryObject {

    /**
     * 
     */
    id: string;
    /**
     * string indicating which class this object belongs to
     * when rehydrated from persistance
     */
    role: string;
    /**
     * user-settable name
     */
    name: string;
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
    childNetwork?: StoryGraph;
    /**
     * 
     */
    content?: IContent;
    /**
     * 
     */
    connectors: IConnectorPort[]
    /**
     * 
     */
    metaData: IMetaData;
    /**
     * 
     */
    connections: IEdge[];
    /**
     * 
     */
    parent?: string;
    /**
     * 
     */
    renderingProperties?: IRenderingProperties;
    /**
     * 
     */
    modifiers: IStoryModifier[];
}