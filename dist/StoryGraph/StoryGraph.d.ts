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
    constructor(parent: IStoryObject, nodes?: IStoryObject[], edges?: IEdge[]);
    /**
     *
     */
    nodes: (IStoryObject)[];
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
     * @param nodes
     * @param edges
     * @return
     */
    static makeGraph(parent: IStoryObject, nodes: IStoryObject[], edges: IEdge[]): StoryGraph;
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
    removeNode(registry: IRegistry, node: IStoryObject): void;
    /**
     * This method is called before deleting and must be used to clean up lost children
     *
     * @param {IRegistry} registry object to deregister from
     */
    willDeregister(registry: IRegistry): void;
    traverse(registry: IRegistry, fromNode: string): IStoryObject[];
    private _areEdgesValid;
    private _hasConnectorPort;
    static parseNodeId(id: string): string[];
    private _updateReference;
    private _isDAG;
    private _nodeExists;
    private _adjacencyMatrix;
    private get _nodeIDs();
}
