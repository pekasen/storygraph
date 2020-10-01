/**P. Kessling *Hamburg, September 2020*/
import { EdgeType } from "./EdgeType"
import { IEdgeCondition } from "./IEdgeCondition"
import { IStoryObject } from "./IStoryObject"
import { StoryGraph } from "./StoryGraph"
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
    parent?: StoryGraph;
}