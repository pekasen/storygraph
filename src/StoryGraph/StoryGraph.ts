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
    public constructor(graph?: IGraph) {
        this.graph = graph || this.makeGraph([], []);
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

    /**
     * 
     */
    makeStoryObject() :  void {
        // TODO implement here
    }

    /**
     * 
     */
    makeConentObject() :  void {
        // TODO implement here
    }

    /**
     * 
     */
    getNode() :  void {
        // TODO implement here
    }

    /**
     * 
     */
    getEdge() :  void {
        // TODO implement here
    }

    /**
     * 
     */
    setEdgeType() :  void {
        // TODO implement here
    }

    /**
     * 
     */
    getEdgeType() :  void {
        // TODO implement here
    }

    /**
     * 
     */
    setContentType() :  void {
        // TODO implement here
    }

    /**
     * 
     */
    getEdgeConditions() :  void {
        // TODO implement here
    }

    /**
     * 
     */
    setEdgeConditions() :  void {
        // TODO implement here
    }

}