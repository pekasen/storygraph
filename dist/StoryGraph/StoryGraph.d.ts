/**P. Kessling *Hamburg, September 2020*/
import { IStoryObject } from "./IStoryObject";
import { IEdge } from "./IEdge";
import { IRegistry } from "./IRegistry";
import { NotificationCenter } from "./NotificationCenter";
/**
 * A graph to connect story content
 *
 * @author Philipp Kessling
 */
export declare class StoryGraph {
    /**
     *
     */
    constructor(parent: string, nodes?: string[], edges?: IEdge[]);
    /**
     * Array of node IDs
     */
    nodes: string[];
    /**
     * Array of edges
     */
    edges: IEdge[];
    /**
     * Parent ID
     */
    parent: string;
    /**
     * Provides a communication channel for all node and connectors in the graph's context
     */
    notificationCenter: NotificationCenter;
    /**
     * @param node
     * @return
     */
    addNode(registry: IRegistry, node: IStoryObject): void;
    /**
     *
     * @param {string} id Node ID to parse
     * @returns {string[]} [nodeId, port-name]
     */
    static parseNodeId(id: string): string[];
    /**
     * @param nodes
     * @param edges
     * @return
     */
    static makeGraph(parent: string, nodes: string[], edges: IEdge[]): StoryGraph;
    /**
     * @param connections
     * @return
     */
    connect(registry: IRegistry, connections: IEdge[]): void;
    /**
     * @param edge
     * @return
     */
    disconnect(registry: IRegistry, edges: IEdge[], id?: string | null): void;
    /**
     * @param node
     * @return
     */
    removeNode(registry: IRegistry, id: string): void;
    /**
     * This method is called before deleting and must be used to clean up lost children
     *
     * @param {IRegistry} registry object to deregister from
     */
    willDeregister(registry: IRegistry): void;
    /**
     * Traverses the StoryGraph
     * TODO: this method does not adhere to port connectivity; this needs to be fixed!
     *
     * @deprecated
     * @param registry
     * @param fromNode
     */
    traverse(registry: IRegistry, fromNode: string): IStoryObject[];
    filterNodes(callback: (id: string, index: number, array: string[]) => boolean): string[];
    filterEdges(callback: (edge: IEdge, index: number, array: IEdge[]) => boolean): IEdge[];
    private _areEdgesValid;
    private ruleSet;
    private rules;
    private _nodeExists;
    private _adjacencyMatrix;
    private get _nodeIDs();
}
//# sourceMappingURL=StoryGraph.d.ts.map