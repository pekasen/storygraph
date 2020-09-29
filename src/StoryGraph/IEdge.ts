/**P. Kessling *Hamburg, September 2020*/
import { EdgeType } from "./EdgeType"
import { IEdgeCondition } from "./IEdgeCondition"
import { IStoryObject } from "./IStoryObject"
import { IGraph } from "./IGraph"
/**
 * 
 */
export interface IEdge {

    /**
     * 
     */
    type: EdgeType;
    /**
     * 
     */
    conditions: IEdgeCondition[];
    /**
     * 
     */
    from: IStoryObject;
    /**
     * 
     */
    to: IStoryObject;
    /**
     * 
     */
    parent: IGraph;
}