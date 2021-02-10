/**P. Kessling *Hamburg, September 2020*/
import { IStoryObject } from "./IStoryObject"
import { IEdge } from "./IEdge"
import { IRegistry } from "./IRegistry"
import { IConnectorPort } from './IConnectorPort';
import { INotificationData, NotificationCenter } from "./NotificationCenter";
import { IEdgeEvent } from "./IEdgeEvent";

/**
 * A graph to connect story content
 * 
 * @author Philipp Kessling
 */
export class StoryGraph {

    /**
     * 
     */
    public constructor(parent: string, nodes?: string[], edges?: IEdge[]) {
        this.parent = parent;
        this.nodes = nodes || [];
        this.edges = edges || [];
        this.notificationCenter = new NotificationCenter();
    }
    
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
     public addNode(registry: IRegistry, node: IStoryObject) :  void {
        if (!this._nodeExists(node.id)) {
            this.nodes.push(node.id);
            node.parent = this.parent;
            node.bindTo(this.notificationCenter);
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
    public static makeGraph(parent: string, nodes: string[], edges: IEdge[]) :  StoryGraph {
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
        validEdges.forEach(edge => {
            const payload: INotificationData<IEdgeEvent> = {
                data: {
                    add: [edge]
                },
                source: this,
                type: "edge"
            };

            [
                ...StoryGraph.parseNodeId(edge.from),
                ...StoryGraph.parseNodeId(edge.to),
            ].forEach(id => {
                this.notificationCenter.push(
                    id, payload
                )
            });
        });
    }

    /**
     * @param edge 
     * @return
     */
    public disconnect(registry: IRegistry, edges: IEdge[], id: string | null = null) :  void {
       edges.forEach(edge => {
            // splice local edges    
            const index = this.edges.findIndex(_edge => _edge.id === edge.id);
            if (index === -1) return
            this.edges.splice(index, 1);

            const payload: INotificationData<IEdgeEvent> = {
                data: {
                    remove: [edge]
                },
                source: this,
                type: "edge"
            };
            
            [
                ...StoryGraph.parseNodeId(edge.from),
                ...StoryGraph.parseNodeId(edge.to),
            ].forEach(id => {
                this.notificationCenter.push(
                    id, payload
                )
            });
        });
    }

    /**
     * @param node 
     * @return
     */
    public removeNode(registry: IRegistry, id: string) :  void {
        if (this._nodeExists(id)) {
            const node = registry.getValue(id);
            if (!node) throw("Cannot delete undefined node!");
            // const edges = this.edges.filter(edge => (edge.to === id || edge.from === id))
            const edges = node.connections;

            if (edges.length >= 1) {
                this.disconnect(registry, edges, id);
            }

            const index = this.nodes.indexOf(id);
            this.nodes.splice(index, 1)

            registry.deregister(id);
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

    /**
     * Traverses the StoryGraph
     * TODO: this method does not adhere to port connectivity; this needs to be fixed!
     * 
     * @deprecated
     * @param registry 
     * @param fromNode 
     */
    // TODO: fix this method! YO!
    public traverse(registry: IRegistry, fromNode: string): IStoryObject[] {
        const recurse = (node: IStoryObject): IStoryObject[] => {
            const _res = [node];
            
            const out = node
            .connections
            .filter(e => e.from === this.parent)
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

    public filterNodes(callback: (id: string, index: number, array: string[]) => boolean): string[] {
        return this.nodes.filter(callback);
    }

    public filterEdges(callback: (edge: IEdge, index: number, array: IEdge[]) => boolean): IEdge[] {
        return this.edges.filter(callback);
    }

    private _areEdgesValid(registry: IRegistry, edges: IEdge[]) {
  
        return edges.filter((edge => {
            const [fromId, fromPortId] = StoryGraph.parseNodeId(edge.from);
            const [toId, toPortId] = StoryGraph.parseNodeId(edge.to);
            const from = registry.getValue(fromId);
            const to = registry.getValue(toId);
            const fromPort = from?.connectors.get(fromPortId);
            const toPort = to?.connectors.get(toPortId);
            // const initial: boolean = true;

            if (fromPort && fromPort.type) {
                const rules = this.ruleSet.get(fromPort.type);
                return rules?.map(e => ({name: e, validator: this.rules.get(e)})).reduce((p: boolean, e) => {
                    if (!e.validator) throw("Validator not defined!");
                    const res = e.validator(from, fromPort, to, toPort, registry);
                    // console.log(e.name, (res) ? "passed" : "failed", "@", edge);
                    return res  && p;
                }, true);
            } else return false;
        }));
    }

    private ruleSet = new Map<string, Array<string>>([
        ["flow", [
           "nodes-must-exist", "ports-must-exist", "port-type-matches", "many-to-one", "no-loops", "no-self-loops"
        ]],
        ["reaction", [
            "nodes-must-exist", "ports-must-exist", "port-type-matches", "one-to-many", "no-loops", "no-self-loops"
        ]],
        ["data", [
            "nodes-must-exist", "ports-must-exist", "port-type-matches", "one-to-many", "no-loops", "no-self-loops"
        ]]
    ])

    private rules = new Map<string, INetworkValidator>([
        ["many-to-one", (from, fromPort, to, toPort) => {
            const fromOutDegree = from!.connections.filter(edge => edge.from === (`${from!.id}.${fromPort!.id}`)).length;
            const toInDegree = to!.connections.filter(edge => edge.to === (`${to!.id}.${toPort!.id}`)).length;
            // out degree of the from node maybe larger than one, in degree of the connected node may not
            return (fromOutDegree == 0 && toInDegree >= 0);
        }],
        ["many-to-many", (from, fromPort, to, toPort) => {
            const fromDegree = from!.connections.filter(edge => edge.from === (`${from!.id}.${fromPort!.id}`)).length;
            const toDegree = to!.connections.filter(edge => edge.to === (`${to!.id}.${toPort!.id}`)).length;

            return (fromDegree >= 0 && toDegree >= 0);
        }],
        ["one-to-many", (from, fromPort, to, toPort) => {
            const fromDegree = from!.connections.filter(edge => edge.from === (`${from!.id}.${fromPort!.id}`)).length;
            const toDegree = to!.connections.filter(edge => edge.to === (`${to!.id}.${toPort!.id}`)).length;

            return (fromDegree >= 0 && toDegree == 0);
        }],
        ["port-type-matches", (form, fromPort, to, toPort) => {
            return fromPort!.type === toPort!.type && fromPort!.direction !== toPort!.direction;
        }],
        ["nodes-must-exist", (from, fromPort, to) => {
            return (from !== undefined && to !== undefined);
        }],
        ["ports-must-exist", (from, fromPort, to, toPort) => {
            return (fromPort !== undefined && toPort !== undefined);
        }],
        ["no-loops", (from, fromPort, to, toPort, registry) => {
            /**
             * DO FTUSS!
             * 
             * @param node starting node
             * @param port starting port
             * @param depth current recursion depth
             */
            const walk = (node: IStoryObject, port: IConnectorPort, depth: number = 0): IStoryObject[] => {
                const maxRecursion = 10;
                const _res: IStoryObject[] = [];

                if (port.associated) {
                    const aPort = port.associated;
                    
                    const nextNodes = node.connections.
                    filter(e => (e.from === `${node.id}.${aPort.name}`)).
                    map(e => {
                        const [_id, _portId] = StoryGraph.parseNodeId(e.to);
                        const _node = registry?.getValue(_id);
                        const _port = _node?.connectors.get(_portId);

                        return {
                            _node: _node,
                            _port: _port
                        };
                    });
                    if (nextNodes.length === 0) {
                        // console.log("leg 3", _res);
                        return _res;
                    }
                    if (depth < maxRecursion) {
                        nextNodes.forEach(({_node, _port}) => {
                            if (_node && _port) {
                                const _a = walk(_node, _port, depth + 1);
                                _res.push(..._a, _node);
                            }
                        });
                        // console.log("leg 1", _res);
                        return _res;
                    } else {
                        throw("Max recursion limit reached!")
                    }
                } else {
                    // console.log("leg 2", _res);
                    return _res;
                }
            };

            return walk(to!, toPort!).filter(_node => _node.id == from!.id).length === 0
        }],
        ["no-self-loops", (from, fromPort, to) => {
            return from!.id !== to!.id;
        }]
    ])





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

            const _fromType = _from?.connectors.get(_fromPort)?.type
            const _toType = _to?.connectors.get(_toPort)?.type

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

            if (fn !== -1 && tn !== -1) _adj[fn][tn] += 1;
        })
        console.log(_adj)
        return _adj
    }

    private get _nodeIDs () {
        return this.nodes //.map(node => node.id)
    }



}
interface INetworkValidator {
    (from?: IStoryObject, fromPort?: IConnectorPort, to?: IStoryObject, toPort?: IConnectorPort, registry?: IRegistry): boolean
}
