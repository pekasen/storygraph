/**P. Kessling *Hamburg, September 2020*/
import { IStoryObject } from "./IStoryObject"
import { IEdge } from "./IEdge"
import { IRegistry } from "./IRegistry"

/**
 * A graph to connect story content
 * 
 * @author Philipp Kessling
 */
export class StoryGraph {

    /**
     * 
     */
    public constructor(parent: IStoryObject, nodes?: IStoryObject[], edges?: IEdge[]) {
        this.parent = parent;
        this.nodes = nodes || [];
        this.edges = edges || [];
    }
    
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
     public addNode(registry: IRegistry, node: IStoryObject) :  void {
        if (!this._nodeExists(node.id)) {
            this.nodes.push(node);
            node.parent = this.parent.id;
            registry.register(node);
        } else throw("node exists already")
    }

    /**
     * 
     * @param {string} id Node ID to parse
     * @returns {string[]} [nodeId, port-name]
     */
    public static parseNodeId(id: string): string[] {
        return id.split(".")
    }

    /**
     * @param nodes 
     * @param edges 
     * @return
     */
    public static makeGraph(parent: IStoryObject, nodes: IStoryObject[], edges: IEdge[]) :  StoryGraph {
        return new StoryGraph(parent, nodes, edges);
    }

    /**
     * @param connections 
     * @return
     */
    public connect(registry: IRegistry, connections: IEdge[]) :  void {
        const validEdges = this._areEdgesValid(registry, connections);
        
        // push to our local edges;
        this.edges.push(...validEdges);

        // update refs on the referenced edges
        validEdges.forEach(edge => {
            this._updateReference(
                registry, this.parent.id, edge
            )
        });
    }

    /**
     * @param edge 
     * @return
     */
    public disconnect(registry: IRegistry, edges: IEdge[]) :  void {
        const validEdges = this._areEdgesValid(registry, edges);

        validEdges.forEach(edge => {
            this.edges.splice(
                this.edges.indexOf(edge), 1
            );
            const cons = registry.getValue(edge.to)?.connections
            if ( cons ) cons.splice(
                cons.indexOf(edge), 1
            )
        });
    }

    /**
     * @param node 
     * @return
     */
    public removeNode(registry: IRegistry, node: IStoryObject) :  void {
        if (this._nodeExists(node.id)) {

            const edges = this.edges.filter(edge => (edge.to === node.id || edge.from === node.id))
            if (edges.length >= 1) {
                this.disconnect(registry, edges);
            }

            const index = this.nodes.indexOf(node);
            this.nodes.splice(index, 1)

            registry.deregister(node.id);
        }
    }

    /**
     * This method is called before deleting and must be used to clean up lost children
     * 
     * @param {IRegistry} registry object to deregister from
     */
    public willDeregister(registry: IRegistry) {
        this._nodeIDs.forEach(id => registry.deregister(id));
    }

    public traverse(registry: IRegistry, fromNode: string): IStoryObject[] {
        const recurse = (node: IStoryObject): IStoryObject[] => {
            const _res = [node];
            
            const out = node
            .connections
            .filter(e => e.from === this.parent.id)
            .map(e => registry.getValue(e.to))
            .filter(e => e !== undefined) as IStoryObject[];

            _res.push(
                ...out
                .map(n => recurse(n))
                .reduce((n, m) => {
                    n.push(...m);
                    return n
                })
            );

            return _res
        }
        const _node = registry.getValue(fromNode);
        if (_node) return recurse(_node)
        else return []
    }

    public filterNodes(callback: (node: IStoryObject, index: number, array: IStoryObject[]) => boolean): IStoryObject[] {
        return this.nodes.filter(callback);
    }

    public filterEdges(callback: (edge: IEdge, index: number, array: IEdge[]) => boolean): IEdge[] {
        return this.edges.filter(callback);
    }

    private _areEdgesValid(registry: IRegistry, edges: IEdge[]) {
  
        return edges.filter((edge) => {
            // validate wether both ends of the edge exists in this graph and they have the specified port
            return (
                this._nodeExists(edge.from) &&
                this._nodeExists(edge.to) &&
                this._hasConnectorPort(registry, edge.from) &&
                this._hasConnectorPort(registry, edge.to) &&
                this._isDAG(registry, edges)
            )
        })
    }

    private _hasConnectorPort(registry: IRegistry, id: string): boolean {
        const [_id, _port] = StoryGraph.parseNodeId(id);
        const item = registry.getValue(_id);
        if (item) return item?.connectors.findIndex(con => (
            con.name === _port
        )) !== -1
        else return false
    }

    private _updateReference(registry: IRegistry, parent: string, edge: IEdge): void {
        const [fromId] = StoryGraph.parseNodeId(edge.from);
        const [toId] = StoryGraph.parseNodeId(edge.to);
        
        const _end1 = registry.getValue(fromId);
        const _end2 = registry.getValue(toId);

        if (_end1 && _end2) {
            _end1.parent = parent;
            _end2.parent = parent;
    
            _end1.connections.push(edge);
            _end2.connections.push(edge);
        }
    }

    private _isDAG(registry: IRegistry, newEdges: IEdge[]): boolean {
        this._adjacencyMatrix(registry, newEdges, "flow");

        return true
    }

    private _nodeExists(id: string): boolean {
        const [_id] = StoryGraph.parseNodeId(id);
        const ids = this._nodeIDs;
        return ids.indexOf(_id) !== -1
    }

    private _adjacencyMatrix(registry: IRegistry, newEdges: IEdge[], type: "flow" | "reaction" | "data"): number[][] {
        // get edges
        const _edges = [...this.edges, ...newEdges]
        // split'em by type
        .filter(e => {
            const [_fromId, _fromPort ] = StoryGraph.parseNodeId(e.from);
            const [_toId, _toPort ] = StoryGraph.parseNodeId(e.to);
            const _from = registry.getValue(_fromId);
            const _to   = registry.getValue(_toId);

            const _fromType = _from?.connectors.find(e => e.name === _fromPort)?.type
            const _toType = _to?.connectors.find(e => e.name === _toPort)?.type

            return type === _fromType && type === _toType
        });
        
        // get all nodes involved
        const _nodes = _edges.map(edge => ([edge.to, edge.from]))
        .reduce((p, c) => [...p, ...c], [])
        .reduce<string[]>((p, c, i, a) => {
            const isDouble = a.filter(e => e === c).length >= 1;
            const isInOut = p.filter(e => e === c).length >= 1;

            if (!isDouble) {
                return [...p, c]
            } else if (isInOut) {
                return p
            } else return [...p, c]
        }, []);
        // .filter((v, i, a) => {
        //     return a.filter(_v => _v === v).length === 1
        // });
        
        const _adj: number[][] = Array.from(Array(_nodes.length)).map(
            () => Array.from(Array(_nodes.length)).map(_ => 0)
        );
        _edges.forEach(e => {
            const fn = _nodes.findIndex(v => v === e.from);
            const tn = _nodes.findIndex(v => v === e.to);

            if (fn !== -1 && tn !== -1) _adj[fn][tn] = 1;
        })
        console.log(_adj)
        return _adj
    }

    private get _nodeIDs () {
        return this.nodes.map(node => node.id)
    }

}

interface Column {
    [index: string]: number[]
}

class Matrix {
    
    columns: Map<string, number[]>

    constructor() {
        this.columns = new Map();
    }

    get dim(): number[] {
        return [
            this.columns.size,
            this.columns.values. length
        ]
    }

    private _checkDims(): boolean {
        return Array
        .from(this.columns.values())
        .map(e => {
            e.length
        })
        .reduce<boolean>((prevValue, currValue, currIndex, array) => (
            prevValue && (currIndex >= 1) ? (currValue === array[currIndex - 1]) : true
           ) , true)
    }
}


    // /**
    //  * @param graph 
    //  * @return
    //  */
    // public merge(graph: IGraph) :  StoryGraph {
    //     // TODO implement here
    //     return new StoryGraph();
    // }

    // /**
    //  * @return
    //  */
    // public flatten() :  StoryGraph {
    //     // TODO implement here
    //     return new StoryGraph();
    // }

    // /**
    //  * Traverses the given graph and its subgraph and returns all nodes which match the query.
    //  * @param predicate Object with parameters to match the graph's nodes against.
    //  * @return Array of nodes.
    //  */
    // public getNodes(predicate: INodePredicate) :  IStoryObject[] {
    //     // TODO implement here
    //     return [];
    // }

    // /**
    //  * Traverses the given graph and its subgraphs and returns all matching edges.
    //  * @param predicate 
    //  * @return
    //  */
    // public getEdges(predicate: IEdgePredicate) :  IEdge[] {
    //     // TODO implement here
    //     return [];
    // }

    // /**
    //  * 
    //  */
    // public getEdgeType() :  void {
    //     // TODO implement here
    // }

    // /**
    //  * 
    //  */
    // public getEdgeConditions() :  void {
    //     // TODO implement here
    // }

    // /**
    //  * @param edge 
    //  * @param parameters 
    //  * @return
    //  */
    // public setEdgeParameters(edge: IEdge, parameters: any) :  IGraph {
    //     // TODO implement here
    //     return new StoryGraph();
    // }

    // /**
    //  * @param edge 
    //  * @return
    //  */
    // public setEdgeType(edge: IEdge) :  IGraph {
    //     // TODO implement here
    //     return new StoryGraph();
    // }

    // /**
    //  * @param node 
    //  * @param parameters 
    //  * @return
    //  */
    // public setNodeParameters(node: IStoryObject, parameters: any) :  IGraph {
    //     // TODO implement here
    //     return new StoryGraph();
    // }

    // /**
    //  * @return
    //  */
    // public toJSON() :  string {
    //     // TODO implement here
    //     return "";
    // }

    // /**
    //  * @param graph 
    //  * @return
    //  */
    // public fromJSON(graph: IGraph) :  string {
    //     // TODO implement here
    //     return "";
    // }

    // /**
    //  * @param content? 
    //  * @param network? 
    //  * @param metaData? 
    //  * @return
    //  */
    // private static _templateStoryObject(content?: IContent, network?: IGraph, metaData?: IMetaData) : IStoryObject {
    //     return {
    //             content: content || undefined,
    //             userDefinedProperties: {},
    //             metaData: metaData || {
    //                 name: "",
    //                 createdAt: new Date(),
    //                 tags: []
    //             },
    //             outgoing: [],
    //             incoming: [],
    //             parent: undefined,
    //             network: network || {
    //                 nodes: [],
    //                 edges: []
    //             },
    //             renderingProperties: {
    //                 width: .33,
    //                 order: 0,
    //                 collapsable: true
    //             },
    //             isContentNode: (content ? true : false),
    //             modifiers: []
    //         }
    // }
