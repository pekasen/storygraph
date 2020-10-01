/**P. Kessling *Hamburg, September 2020*/
import { IStoryObject } from "./IStoryObject"
import { IEdge } from "./IEdge"
import { IGraph } from "./IGraph"
import { INodePredicate } from "./INodePredicate"
import { IEdgePredicate } from "./IEdgePredicate"
/**
 * @author Philipp Kessling
 */
export class StoryGraph implements IGraph {

    /**
     * 
     */
    public constructor(nodes?: IStoryObject[], edges?: IEdge[]) {
        this.nodes = nodes || [];
        this.edges = edges || [];
    }

    /**
     * 
     */
    nodes: IStoryObject[];
    /**
     * 
     */
    edges: IEdge[];
    /**
     * @param node 
     * @return
     */
    public addNode(node: IStoryObject) :  StoryGraph {
        // TODO implement here
        return this;
    }

    /**
     * @param connections 
     * @return
     */
    public connect(connections: IEdge[]) :  StoryGraph {
        // TODO implement here
        return this;
    }

    /**
     * @param edge 
     * @return
     */
    public disconnect(edge: IEdge[]) :  StoryGraph {
        // TODO implement here
        return this;
    }

    /**
     * 
     */
    public static makeContentObject() :  void {
        // TODO implement here
    }

    /**
     * @param nodes 
     * @param edges 
     * @return
     */
    public static makeGraph(nodes: IStoryObject[], edges: IEdge[]) :  StoryGraph {
        // TODO implement here
        return new this(nodes, edges);
    }

    /**
     * @return
     */
    public static makeStoryObject(content?: IContent, network?: IGraph) :  IStoryObject {
        var __storyObj = this._templateStoryObject();
 
        return __storyObj;
    }
    
    /**
     * @param graph 
     * @return
     */
    public merge(graph: IGraph) :  StoryGraph {
        // TODO implement here
        return this;
    }

    /**
     * @param node 
     * @return
     */
    public removeNode(node: IStoryObject) :  StoryGraph {
        // TODO implement here
        return this;
    }

    /**
     * @return
     */
    public flatten() :  StoryGraph {
        // TODO implement here
        return this;
    }

    /**
     * Traverses the given graph and its subgraph and returns all nodes which match the query.
     * @param predicate Object with parameters to match the graph's nodes against.
     * @return Array of nodes.
     */
    public getNode(predicate: INodePredicate) :  IStoryObject[] {
        // TODO implement here
        return [];
    }

    /**
     * Traverses the given graph and its subgraphs and returns all matching edges.
     * @param predicate 
     * @return
     */
    public getEdge(predicate: IEdgePredicate) :  IEdge[] {
        // TODO implement here
        return [];
    }

    /**
     * 
     */
    public getEdgeType() :  void {
        // TODO implement here
    }

    /**
     * 
     */
    public getEdgeConditions() :  void {
        // TODO implement here
    }

    /**
     * @param edge 
     * @param parameters 
     * @return
     */
    public setEdgeParamters(edge: IEdge, parameters: any) :  IGraph {
        // TODO implement here
        return this;
    }

    /**
     * @param edge 
     * @return
     */
    public setEdgeType(edge: IEdge) :  IGraph {
        // TODO implement here
        return this;
    }

    /**
     * @param node 
     * @param paramters 
     * @return
     */
    public setNodeParameters(node: IStoryObject, paramters: any) :  IGraph {
        // TODO implement here
        return this;
    }

    /**
     * @return
     */
    public toJSON() :  string {
        // TODO implement here
        return "";
    }

    /**
     * @param graph 
     * @return
     */
    public fromJSON(graph: IGraph) :  string {
        // TODO implement here
        return "";
    }

    /**
     * 
     */
    private static _templateStoryObject(content?: IContent, network?: IGraph, metaData?: IMetaData) : IStoryObject {
        return {
                content: content || undefined,
                userDefinedProperties: {},
                metaData: metaData || undefined,
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
                isContentNode: (content ? true : false)
            }
        }

}