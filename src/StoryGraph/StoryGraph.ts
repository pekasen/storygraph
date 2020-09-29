/**P. Kessling *Hamburg, September 2020*/
import { IGraph } from "./IGraph"
import { IReducer } from "./IReducer"
import { IEdge } from "./IEdge"
import { IStoryObject } from "./IStoryObject"
/**
 * @author Philipp Kessling
 */
export class StoryGraph implements IReducer {

    /**
     * 
     */
    public constructor() {
    }

    /**
     * 
     */
    graph: IGraph;
    /**
     * @param connections 
     * @param graph 
     * @return
     */
    connect(connections: IEdge[], graph: IGraph) :  IGraph {
        // TODO implement here
        return null;
    }

    /**
     * @param nodes 
     * @param edges 
     * @return
     */
    makeGraph(nodes: IStoryObject[], edges: IEdge[]) :  IGraph {
        // TODO implement here
        return null;
    }

    /**
     * @param graphx 
     * @param graphy 
     * @return
     */
    merge(graphx: IGraph, graphy: IGraph) :  IGraph {
        // TODO implement here
        return null;
    }

    /**
     * @param graph 
     * @return
     */
    flatten(graph: IGraph) :  IGraph {
        // TODO implement here
        return null;
    }

}