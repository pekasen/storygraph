/**P. Kessling *Hamburg, September 2020*/
import { IStoryObject } from "./IStoryObject";
import { IEdge } from "./IEdge";
import { IRegistry } from "./IRegistry";
/**
 * A graph to connect story content
 *
 * @author Philipp Kessling
 */
export declare class StoryGraph {
    /**
     *
     */
    constructor(parent: IStoryObject, nodes?: string[], edges?: IEdge[]);
    /**
     *
     */
    nodes: string[];
    /**
     *
     */
    edges: IEdge[];
    /**
     *
     *
     */
    parent: IStoryObject;
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
    static makeGraph(parent: IStoryObject, nodes: string[], edges: IEdge[]): StoryGraph;
    /**
     * @param connections
     * @return
     */
    connect(registry: IRegistry, connections: IEdge[]): void;
    /**
     * @param edge
     * @return
     */
    disconnect(registry: IRegistry, edges: IEdge[]): void;
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
    private _isCompatible;
    private _hasConnectorPort;
    private _updateReference;
    private _isDAG;
    private _nodeExists;
    private _adjacencyMatrix;
    private get _nodeIDs();
}
//# sourceMappingURL=StoryGraph.d.ts.map