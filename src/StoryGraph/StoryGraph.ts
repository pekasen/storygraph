/**P. Kessling *Hamburg, September 2020*/
import { IReducer } from "./IReducer"
import { IEdge } from "./IEdge"
import { IGraph } from "./IGraph"
import { IStoryObject } from "./IStoryObject"
import { INodePredicate } from "./INodePredicate"
import { IEdgePredicate } from "./IEdgePredicate"
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
     * @param connections 
     * @param graph 
     * @return
     */
    connect(connections: IEdge[], graph: IGraph) :  IGraph {
        // TODO implement here
        return null;
    }

    /**
     * @param edge 
     * @param graph 
     * @return
     */
    disconnect(edge: IEdge[], graph: IGraph) :  IGraph {
        // TODO implement here
        return null;
    }

    /**
     * 
     */
    makeContentObject() :  void {
        // TODO implement here
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
     * @return
     */
    makeStoryObject() :  IStoryObject {
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
     * @param node 
     * @param graph 
     * @return
     */
    removeNode(node: IStoryObject, graph: IGraph) :  IGraph {
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
     * Traverses the given graph and its subgraph and returns all nodes which match the query.
     * @param predicate Object with parameters to match the graph's nodes against.
     * @return Array of nodes.
     */
    getNode(predicate: INodePredicate) :  IStoryObject[] {
        // TODO implement here
        return null;
    }

    /**
     * Traverses the given graph and its subgraphs and returns all matching edges.
     * @param predicate 
     * @return
     */
    getEdge(predicate: IEdgePredicate) :  IEdge[] {
        // TODO implement here
        return null;
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
    getEdgeConditions() :  void {
        // TODO implement here
    }

    /**
     * @param edge 
     * @param parameters 
     * @return
     */
    setEdgeParamters(edge: IEdge, parameters: any) :  IGraph {
        // TODO implement here
        return null;
    }

    /**
     * @param edge 
     * @return
     */
    setEdgeType(edge: IEdge) :  IGraph {
        // TODO implement here
        return null;
    }

    /**
     * @param node 
     * @param paramters 
     * @return
     */
    setNodeParameters(node: IStoryObject, paramters: any) :  IGraph {
        // TODO implement here
        return null;
    }

    /**
     * @param graph 
     * @return
     */
    toJSON(graph: IGraph) :  string {
        // TODO implement here
        return "";
    }

    /**
     * @param graph 
     * @return
     */
    fromJSON(graph: IGraph) :  string {
        // TODO implement here
        return "";
    }

    /**
     * @param node 
     * @param graph 
     * @return
     */
    addNode(node: IStoryObject, graph: IGraph) :  IGraph {
        // TODO implement here
        return null;
    }

}