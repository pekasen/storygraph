/**P. Kessling *Hamburg, September 2020*/
import { IStoryObject } from "./IStoryObject";
import { IEdge } from "./IEdge";
import { IGraph } from "./IGraph";
import { INodePredicate } from "./INodePredicate";
import { IEdgePredicate } from "./IEdgePredicate";
/**
 * @author Philipp Kessling
 */
export declare class StoryGraph implements IGraph {
    /**
     *
     */
    constructor(nodes?: IStoryObject[], edges?: IEdge[]);
    /**
     *
     */
    nodes: IStoryObject[];
    /**
     *
     */
    edges: IEdge[];
    /**
     * @param node
     * @return
     */
    addNode(node: IStoryObject): StoryGraph;
    /**
     * @param connections
     * @return
     */
    connect(connections: IEdge[]): StoryGraph;
    /**
     * @param edge
     * @return
     */
    disconnect(edge: IEdge[]): StoryGraph;
    /**
     *
     */
    static makeContentObject(): void;
    /**
     * @param nodes
     * @param edges
     * @return
     */
    static makeGraph(nodes: IStoryObject[], edges: IEdge[]): StoryGraph;
    /**
     * @return
     */
    static makeStoryObject(): IStoryObject;
    /**
     * @param graph
     * @return
     */
    merge(graph: IGraph): StoryGraph;
    /**
     * @param node
     * @return
     */
    removeNode(node: IStoryObject): StoryGraph;
    /**
     * @return
     */
    flatten(): StoryGraph;
    /**
     * Traverses the given graph and its subgraph and returns all nodes which match the query.
     * @param predicate Object with parameters to match the graph's nodes against.
     * @return Array of nodes.
     */
    getNodes(predicate: INodePredicate): IStoryObject[];
    /**
     * Traverses the given graph and its subgraphs and returns all matching edges.
     * @param predicate
     * @return
     */
    getEdges(predicate: IEdgePredicate): IEdge[];
    /**
     *
     */
    getEdgeType(): void;
    /**
     *
     */
    getEdgeConditions(): void;
    /**
     * @param edge
     * @param parameters
     * @return
     */
    setEdgeParameters(edge: IEdge, parameters: any): IGraph;
    /**
     * @param edge
     * @return
     */
    setEdgeType(edge: IEdge): IGraph;
    /**
     * @param node
     * @param parameters
     * @return
     */
    setNodeParameters(node: IStoryObject, parameters: any): IGraph;
    /**
     * @return
     */
    toJSON(): string;
    /**
     * @param graph
     * @return
     */
    fromJSON(graph: IGraph): string;
    /**
     * @param content?
     * @param network?
     * @param metaData?
     * @return
     */
    private static _templateStoryObject;
}
