/**P. Kessling *Hamburg, September 2020*/
import { IContent } from "./IContent"
import { IMetaData } from "./IMetaData"
import { IEdge } from "./IEdge"
import { IGraph } from "./IGraph"
import { IRenderingProperties } from "./IRenderingProperties"
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
    content: IContent;
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
    parent: IGraph;
    /**
     * 
     */
    network: IGraph;
    /**
     * 
     */
    renderingProperties: IRenderingProperties;
}