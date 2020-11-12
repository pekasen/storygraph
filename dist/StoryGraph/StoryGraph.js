"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoryGraph = void 0;
/**
 * @author Philipp Kessling
 */
class StoryGraph {
    /**
     *
     */
    constructor(parent, nodes, edges) {
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
        const validEdges = this._areEdgesValid(connections);
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
        const validEdges = this._areEdgesValid(edges);
        validEdges.forEach(edge => {
            var _a, _b;
            this.edges.splice(this.edges.indexOf(edge), 1);
            const ins = (_a = registry.getValue(edge.to)) === null || _a === void 0 ? void 0 : _a.incoming;
            if (ins)
                ins.splice(ins.indexOf(edge), 1);
            const outs = (_b = registry.getValue(edge.from)) === null || _b === void 0 ? void 0 : _b.outgoing;
            if (outs)
                outs.splice(outs.indexOf(edge), 1);
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
    _areEdgesValid(edges) {
        return edges.filter((edge) => {
            // validate wether both ends of the edge exists in this graph
            return (this._nodeExists(edge.from) && this._nodeExists(edge.from));
        });
    }
    _updateReference(registry, parent, edge) {
        const _end1 = registry.getValue(edge.from);
        const _end2 = registry.getValue(edge.to);
        if (_end1 && _end2) {
            _end1.parent = parent;
            _end2.parent = parent;
            _end1.outgoing.push(edge);
            _end2.incoming.push(edge);
        }
    }
    _nodeExists(id) {
        const ids = this._nodeIDs;
        return ids.indexOf(id) !== -1;
    }
    get _nodeIDs() {
        return this.nodes.map(node => node.id);
    }
}
exports.StoryGraph = StoryGraph;
