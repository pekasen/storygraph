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
        return this;
    };
    /**
     * @param connections
     * @return
     */
    StoryGraph.prototype.connect = function (connections) {
        // TODO implement here
        return this;
    };
    /**
     * @param edge
     * @return
     */
    StoryGraph.prototype.disconnect = function (edge) {
        // TODO implement here
        return this;
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
        return new this(nodes, edges);
    };
    /**
     * @return
     */
    StoryGraph.makeStoryObject = function () {
        // TODO implement here
        return new this();
    };
    /**
     * @param graph
     * @return
     */
    StoryGraph.prototype.merge = function (graph) {
        // TODO implement here
        return this;
    };
    /**
     * @param node
     * @return
     */
    StoryGraph.prototype.removeNode = function (node) {
        // TODO implement here
        return this;
    };
    /**
     * @return
     */
    StoryGraph.prototype.flatten = function () {
        // TODO implement here
        return this;
    };
    /**
     * Traverses the given graph and its subgraph and returns all nodes which match the query.
     * @param predicate Object with parameters to match the graph's nodes against.
     * @return Array of nodes.
     */
    StoryGraph.prototype.getNode = function (predicate) {
        // TODO implement here
        return [];
    };
    /**
     * Traverses the given graph and its subgraphs and returns all matching edges.
     * @param predicate
     * @return
     */
    StoryGraph.prototype.getEdge = function (predicate) {
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
    StoryGraph.prototype.setEdgeParamters = function (edge, parameters) {
        // TODO implement here
        return this;
    };
    /**
     * @param edge
     * @return
     */
    StoryGraph.prototype.setEdgeType = function (edge) {
        // TODO implement here
        return this;
    };
    /**
     * @param node
     * @param paramters
     * @return
     */
    StoryGraph.prototype.setNodeParameters = function (node, paramters) {
        // TODO implement here
        return this;
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
    return StoryGraph;
}());
exports.StoryGraph = StoryGraph;
