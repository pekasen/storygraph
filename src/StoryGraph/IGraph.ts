/**P. Kessling *Hamburg, September 2020*/
import { IStoryObject } from "./IStoryObject"
import { IEdge } from "./IEdge"
/**
 * 
 */
export interface IGraph {

    /**
     * 
     */
    nodes: IStoryObject[];
    /**
     * 
     */
    edges: IEdge[];
}