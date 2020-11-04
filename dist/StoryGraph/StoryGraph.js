"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoryGraph = void 0;
/**
 * @author Philipp Kessling
 */
var StoryGraph = /** @class */ (function () {
    /**
     *
     */
    function StoryGraph(nodes, edges) {
        this.nodes = nodes || [];
        this.edges = edges || [];
    }
    /**
     * @param node
     * @return
     */
    StoryGraph.prototype.addNode = function (node) {
        // TODO implement here
        return new StoryGraph();
    };
    /**
     * @param connections
     * @return
     */
    StoryGraph.prototype.connect = function (connections) {
        // TODO implement here
        return new StoryGraph();
    };
    /**
     * @param edge
     * @return
     */
    StoryGraph.prototype.disconnect = function (edge) {
        // TODO implement here
        return new StoryGraph();
    };
    /**
     *
     */
    StoryGraph.makeContentObject = function () {
        // TODO implement here
    };
    /**
     * @param nodes
     * @param edges
     * @return
     */
    StoryGraph.makeGraph = function (nodes, edges) {
        // TODO implement here
        return new StoryGraph();
    };
    /**
     * @return
     */
    StoryGraph.makeStoryObject = function () {
        // TODO implement here
        return this.makeStoryObject();
    };
    /**
     * @param graph
     * @return
     */
    StoryGraph.prototype.merge = function (graph) {
        // TODO implement here
        return new StoryGraph();
    };
    /**
     * @param node
     * @return
     */
    StoryGraph.prototype.removeNode = function (node) {
        // TODO implement here
        return new StoryGraph();
    };
    /**
     * @return
     */
    StoryGraph.prototype.flatten = function () {
        // TODO implement here
        return new StoryGraph();
    };
    /**
     * Traverses the given graph and its subgraph and returns all nodes which match the query.
     * @param predicate Object with parameters to match the graph's nodes against.
     * @return Array of nodes.
     */
    StoryGraph.prototype.getNodes = function (predicate) {
        // TODO implement here
        return [];
    };
    /**
     * Traverses the given graph and its subgraphs and returns all matching edges.
     * @param predicate
     * @return
     */
    StoryGraph.prototype.getEdges = function (predicate) {
        // TODO implement here
        return [];
    };
    /**
     *
     */
    StoryGraph.prototype.getEdgeType = function () {
        // TODO implement here
    };
    /**
     *
     */
    StoryGraph.prototype.getEdgeConditions = function () {
        // TODO implement here
    };
    /**
     * @param edge
     * @param parameters
     * @return
     */
    StoryGraph.prototype.setEdgeParameters = function (edge, parameters) {
        // TODO implement here
        return new StoryGraph();
    };
    /**
     * @param edge
     * @return
     */
    StoryGraph.prototype.setEdgeType = function (edge) {
        // TODO implement here
        return new StoryGraph();
    };
    /**
     * @param node
     * @param parameters
     * @return
     */
    StoryGraph.prototype.setNodeParameters = function (node, parameters) {
        // TODO implement here
        return new StoryGraph();
    };
    /**
     * @return
     */
    StoryGraph.prototype.toJSON = function () {
        // TODO implement here
        return "";
    };
    /**
     * @param graph
     * @return
     */
    StoryGraph.prototype.fromJSON = function (graph) {
        // TODO implement here
        return "";
    };
    /**
     * @param content?
     * @param network?
     * @param metaData?
     * @return
     */
    StoryGraph._templateStoryObject = function (content, network, metaData) {
        return {
            content: content || undefined,
            userDefinedProperties: {},
            metaData: metaData || {
                name: "",
                createdAt: new Date(),
                tags: []
            },
            outgoing: [],
            incoming: [],
            parent: undefined,
            network: network || {
                nodes: [],
                edges: []
            },
            renderingProperties: {
                width: .33,
                order: 0,
                collapsable: true
            },
            isContentNode: (content ? true : false),
            modifiers: []
        };
    };
    return StoryGraph;
}());
exports.StoryGraph = StoryGraph;
