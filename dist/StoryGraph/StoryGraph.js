"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoryGraph = void 0;
const NotificationCenter_1 = require("./NotificationCenter");
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
                    const fromOutDegree = from.connections.filter(edge => edge.from === (`${from.id}.${fromPort.id}`)).length;
                    const toInDegree = to.connections.filter(edge => edge.to === (`${to.id}.${toPort.id}`)).length;
                    // out degree of the from node maybe larger than one, in degree of the connected node may not
                    return (fromOutDegree == 0 && toInDegree >= 0);
                }],
            ["many-to-many", (from, fromPort, to, toPort) => {
                    const fromDegree = from.connections.filter(edge => edge.from === (`${from.id}.${fromPort.id}`)).length;
                    const toDegree = to.connections.filter(edge => edge.to === (`${to.id}.${toPort.id}`)).length;
                    return (fromDegree >= 0 && toDegree >= 0);
                }],
            ["one-to-many", (from, fromPort, to, toPort) => {
                    const fromDegree = from.connections.filter(edge => edge.from === (`${from.id}.${fromPort.id}`)).length;
                    const toDegree = to.connections.filter(edge => edge.to === (`${to.id}.${toPort.id}`)).length;
                    return (fromDegree >= 0 && toDegree == 0);
                }],
            ["port-type-matches", (form, fromPort, to, toPort) => {
                    return fromPort.type === toPort.type && fromPort.direction !== toPort.direction;
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
                    const walk = (node, port, depth = 0) => {
                        const maxRecursion = 10;
                        const _res = [];
                        if (port.associated) {
                            const aPort = port.associated;
                            const nextNodes = node.connections.
                                filter(e => (e.from === `${node.id}.${aPort.name}`)).
                                map(e => {
                                const [_id, _portId] = StoryGraph.parseNodeId(e.to);
                                const _node = registry === null || registry === void 0 ? void 0 : registry.getValue(_id);
                                const _port = _node === null || _node === void 0 ? void 0 : _node.connectors.get(_portId);
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
                                nextNodes.forEach(({ _node, _port }) => {
                                    if (_node && _port) {
                                        const _a = walk(_node, _port, depth + 1);
                                        _res.push(..._a, _node);
                                    }
                                });
                                // console.log("leg 1", _res);
                                return _res;
                            }
                            else {
                                throw ("Max recursion limit reached!");
                            }
                        }
                        else {
                            // console.log("leg 2", _res);
                            return _res;
                        }
                    };
                    return walk(to, toPort).filter(_node => _node.id == from.id).length === 0;
                }],
            ["no-self-loops", (from, fromPort, to) => {
                    return from.id !== to.id;
                }]
        ]);
        this.parent = parent;
        this.nodes = nodes || [];
        this.edges = edges || [];
        this.notificationCenter = new NotificationCenter_1.NotificationCenter();
    }
    /**
     * @param node
     * @return
     */
    addNode(registry, node) {
        if (!this._nodeExists(node.id)) {
            this.nodes.push(node.id);
            node.parent = this.parent;
            node.bindTo(this.notificationCenter);
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
        validEdges.forEach(edge => {
            const payload = {
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
                this.notificationCenter.push(id, payload);
            });
        });
    }
    /**
     * @param edge
     * @return
     */
    disconnect(registry, edges, id = null) {
        edges.forEach(edge => {
            const payload = {
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
                this.notificationCenter.push(id, payload);
            });
        });
    }
    /**
     * @param node
     * @return
     */
    removeNode(registry, id) {
        if (this._nodeExists(id)) {
            const node = registry.getValue(id);
            if (!node)
                throw ("Cannot delete undefined node!");
            // const edges = this.edges.filter(edge => (edge.to === id || edge.from === id))
            const edges = node.connections;
            if (edges.length >= 1) {
                this.disconnect(registry, edges, id);
            }
            const index = this.nodes.indexOf(id);
            this.nodes.splice(index, 1);
            registry.deregister(id);
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
    /**
     * Traverses the StoryGraph
     * TODO: this method does not adhere to port connectivity; this needs to be fixed!
     *
     * @deprecated
     * @param registry
     * @param fromNode
     */
    // TODO: fix this method! YO!
    traverse(registry, fromNode) {
        const recurse = (node) => {
            const _res = [node];
            const out = node
                .connections
                .filter(e => e.from === this.parent)
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
                    const res = e.validator(from, fromPort, to, toPort, registry);
                    // console.log(e.name, (res) ? "passed" : "failed", "@", edge);
                    return res && p;
                }, true);
            }
            else
                return false;
        }));
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
            var _b, _c;
            const [_fromId, _fromPort] = StoryGraph.parseNodeId(e.from);
            const [_toId, _toPort] = StoryGraph.parseNodeId(e.to);
            const _from = registry.getValue(_fromId);
            const _to = registry.getValue(_toId);
            const _fromType = (_b = _from === null || _from === void 0 ? void 0 : _from.connectors.get(_fromPort)) === null || _b === void 0 ? void 0 : _b.type;
            const _toType = (_c = _to === null || _to === void 0 ? void 0 : _to.connectors.get(_toPort)) === null || _c === void 0 ? void 0 : _c.type;
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
        return this.nodes; //.map(node => node.id)
    }
}
exports.StoryGraph = StoryGraph;
//# sourceMappingURL=StoryGraph.js.map