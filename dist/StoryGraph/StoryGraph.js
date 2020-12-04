"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoryGraph = void 0;
/**
 * A graph to connect story content
 *
 * @author Philipp Kessling
 */
class StoryGraph {
    /**
     *
     */
    constructor(parent, nodes, edges) {
        this.ruleSet = new Map([
            ["flow", [
                    "nodes-must-exist", "ports-must-exist", "port-type-matches", "many-to-one", "no-loops", "no-self-loops"
                ]],
            ["reaction", [
                    "nodes-must-exist", "ports-must-exist", "port-type-matches", "one-to-many", "no-loops", "no-self-loops"
                ]],
            ["data", [
                    "nodes-must-exist", "ports-must-exist", "port-type-matches", "one-to-many", "no-loops", "no-self-loops"
                ]]
        ]);
        this.rules = new Map([
            ["many-to-one", (from, fromPort, to, toPort) => {
                    const fromOutDegree = from.connections.filter(edge => edge.from === (`${from.id}.${fromPort.name}`)).length;
                    const toInDegree = to.connections.filter(edge => edge.to === (`${to.id}.${toPort.name}`)).length;
                    // out degree of the from node maybe larger than one, in degree of the connected node may not
                    return (fromOutDegree >= 0 && toInDegree == 0);
                }],
            ["many-to-many", (from, fromPort, to, toPort) => {
                    const fromDegree = from.connections.filter(edge => edge.from === (`${from.id}.${fromPort.name}`)).length;
                    const toDegree = to.connections.filter(edge => edge.to === (`${to.id}.${toPort.name}`)).length;
                    return (fromDegree >= 0 && toDegree >= 0);
                }],
            ["one-to-many", (from, fromPort, to, toPort) => {
                    const fromDegree = from.connections.filter(edge => edge.from === (`${from.id}.${fromPort.name}`)).length;
                    const toDegree = to.connections.filter(edge => edge.to === (`${to.id}.${toPort.name}`)).length;
                    return (fromDegree == 0 && toDegree >= 0);
                }],
            ["port-type-matches", (form, fromPort, to, toPort) => {
                    return fromPort.type === toPort.type && fromPort.direction !== toPort.direction;
                }],
            ["nodes-must-exist", (from, fromPort, to, toPort) => {
                    return (from !== undefined && to !== undefined);
                }],
            ["ports-must-exist", (from, fromPort, to, toPort) => {
                    return (fromPort !== undefined && toPort !== undefined);
                }],
            ["no-loops", (from, fromPort, to, toPort) => {
                    return true;
                }],
            ["no-self-loops", (from, fromPort, to, toPort) => {
                    return from.id !== to.id;
                }]
        ]);
        this.parent = parent;
        this.nodes = nodes || [];
        this.edges = edges || [];
    }
    /**
     * @param node
     * @return
     */
    addNode(registry, node) {
        if (!this._nodeExists(node.id)) {
            this.nodes.push(node);
            node.parent = this.parent.id;
            registry.register(node);
        }
        else
            throw ("node exists already");
    }
    /**
     *
     * @param {string} id Node ID to parse
     * @returns {string[]} [nodeId, port-name]
     */
    static parseNodeId(id) {
        return id.split(".");
    }
    /**
     * @param nodes
     * @param edges
     * @return
     */
    static makeGraph(parent, nodes, edges) {
        return new StoryGraph(parent, nodes, edges);
    }
    /**
     * @param connections
     * @return
     */
    connect(registry, connections) {
        const validEdges = this._areEdgesValid(registry, connections);
        // push to our local edges;
        this.edges.push(...validEdges);
        // update refs on the referenced edges
        validEdges.forEach(edge => {
            this._updateReference(registry, this.parent.id, edge);
        });
    }
    /**
     * @param edge
     * @return
     */
    disconnect(registry, edges) {
        const validEdges = this._areEdgesValid(registry, edges);
        validEdges.forEach(edge => {
            var _a;
            this.edges.splice(this.edges.indexOf(edge), 1);
            const cons = (_a = registry.getValue(edge.to)) === null || _a === void 0 ? void 0 : _a.connections;
            if (cons)
                cons.splice(cons.indexOf(edge), 1);
        });
    }
    /**
     * @param node
     * @return
     */
    removeNode(registry, node) {
        if (this._nodeExists(node.id)) {
            const edges = this.edges.filter(edge => (edge.to === node.id || edge.from === node.id));
            if (edges.length >= 1) {
                this.disconnect(registry, edges);
            }
            const index = this.nodes.indexOf(node);
            this.nodes.splice(index, 1);
            registry.deregister(node.id);
        }
    }
    /**
     * This method is called before deleting and must be used to clean up lost children
     *
     * @param {IRegistry} registry object to deregister from
     */
    willDeregister(registry) {
        this._nodeIDs.forEach(id => registry.deregister(id));
    }
    traverse(registry, fromNode) {
        const recurse = (node) => {
            const _res = [node];
            const out = node
                .connections
                .filter(e => e.from === this.parent.id)
                .map(e => registry.getValue(e.to))
                .filter(e => e !== undefined);
            _res.push(...out
                .map(n => recurse(n))
                .reduce((n, m) => {
                n.push(...m);
                return n;
            }));
            return _res;
        };
        const _node = registry.getValue(fromNode);
        if (_node)
            return recurse(_node);
        else
            return [];
    }
    filterNodes(callback) {
        return this.nodes.filter(callback);
    }
    filterEdges(callback) {
        return this.edges.filter(callback);
    }
    _areEdgesValid(registry, edges) {
        return edges.filter((edge => {
            const [fromId, fromPortId] = StoryGraph.parseNodeId(edge.from);
            const [toId, toPortId] = StoryGraph.parseNodeId(edge.to);
            const from = registry.getValue(fromId);
            const to = registry.getValue(toId);
            const fromPort = from === null || from === void 0 ? void 0 : from.connectors.get(fromPortId);
            const toPort = to === null || to === void 0 ? void 0 : to.connectors.get(toPortId);
            // const initial: boolean = true;
            if (fromPort && fromPort.type) {
                const rules = this.ruleSet.get(fromPort.type);
                return rules === null || rules === void 0 ? void 0 : rules.map(e => ({ name: e, validator: this.rules.get(e) })).reduce((p, e) => {
                    if (!e.validator)
                        throw ("Validator not defined!");
                    const res = e.validator(from, fromPort, to, toPort);
                    console.log(e.name, (res) ? "passed" : "failed", "@", edge);
                    return res && p;
                }, true);
            }
            else
                return false;
        }));
        // (edge) => {
        //     // validate wether both ends of the edge exists in this graph and they have the specified port
        //     return (
        //         this._nodeExists(edge.from) &&
        //         this._nodeExists(edge.to) &&
        //         this._isCompatible(registry, edge.from, edge.to) &&
        //         this._hasConnectorPort(registry, edge.from) &&
        //         this._hasConnectorPort(registry, edge.to) &&
        //         this._isDAG(registry, edges)
        //     )
        // }
    }
    _isCompatible(registry, from, to) {
        const [fromId, fromPort] = StoryGraph.parseNodeId(from);
        const [toId, toPort] = StoryGraph.parseNodeId(to);
        const fromObj = registry.getValue(fromId);
        const fromCon = fromObj === null || fromObj === void 0 ? void 0 : fromObj.connectors.get(fromPort);
        const toObj = registry.getValue(toId);
        const toCon = toObj === null || toObj === void 0 ? void 0 : toObj.connectors.get(toPort);
        return (fromCon === null || fromCon === void 0 ? void 0 : fromCon.type) === (toCon === null || toCon === void 0 ? void 0 : toCon.type);
    }
    _hasConnectorPort(registry, id) {
        const [_id, _port] = StoryGraph.parseNodeId(id);
        const item = registry.getValue(_id);
        if (item)
            return item === null || item === void 0 ? void 0 : item.connectors.has(_port);
        else
            return false;
    }
    _updateReference(registry, parent, edge) {
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
    _isDAG(registry, newEdges) {
        this._adjacencyMatrix(registry, newEdges, "flow");
        return true;
    }
    _nodeExists(id) {
        const [_id] = StoryGraph.parseNodeId(id);
        const ids = this._nodeIDs;
        return ids.indexOf(_id) !== -1;
    }
    _adjacencyMatrix(registry, newEdges, type) {
        // get edges
        const _edges = [...this.edges, ...newEdges]
            // split'em by type
            .filter(e => {
            var _a, _b;
            const [_fromId, _fromPort] = StoryGraph.parseNodeId(e.from);
            const [_toId, _toPort] = StoryGraph.parseNodeId(e.to);
            const _from = registry.getValue(_fromId);
            const _to = registry.getValue(_toId);
            const _fromType = (_a = _from === null || _from === void 0 ? void 0 : _from.connectors.get(_fromPort)) === null || _a === void 0 ? void 0 : _a.type;
            const _toType = (_b = _to === null || _to === void 0 ? void 0 : _to.connectors.get(_toPort)) === null || _b === void 0 ? void 0 : _b.type;
            return type === _fromType && type === _toType;
        });
        // get all nodes involved
        const _nodes = _edges.map(edge => ([edge.to, edge.from]))
            .reduce((p, c) => [...p, ...c], [])
            .reduce((p, c, i, a) => {
            const isDouble = a.filter(e => e === c).length >= 1;
            const isInOut = p.filter(e => e === c).length >= 1;
            if (!isDouble) {
                return [...p, c];
            }
            else if (isInOut) {
                return p;
            }
            else
                return [...p, c];
        }, []);
        // .filter((v, i, a) => {
        //     return a.filter(_v => _v === v).length === 1
        // });
        const _adj = Array.from(Array(_nodes.length)).map(() => Array.from(Array(_nodes.length)).map(_ => 0));
        _edges.forEach(e => {
            const fn = _nodes.findIndex(v => v === e.from);
            const tn = _nodes.findIndex(v => v === e.to);
            if (fn !== -1 && tn !== -1)
                _adj[fn][tn] += 1;
        });
        console.log(_adj);
        return _adj;
    }
    get _nodeIDs() {
        return this.nodes.map(node => node.id);
    }
}
exports.StoryGraph = StoryGraph;
class Matrix {
    constructor() {
        this.columns = new Map();
    }
    get dim() {
        return [
            this.columns.size,
            this.columns.values.length
        ];
    }
    _checkDims() {
        return Array
            .from(this.columns.values())
            .map(e => {
            e.length;
        })
            .reduce((prevValue, currValue, currIndex, array) => (prevValue && (currIndex >= 1) ? (currValue === array[currIndex - 1]) : true), true);
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
