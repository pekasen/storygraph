/**P. Kessling *Hamburg, September 2020*/
/**
 * 
 */
export interface IEdge {

    // /**
    //  * 
    //  */
    // type: EdgeType;
    // /**
    //  * 
    //  */
    // conditions: IEdgeCondition[];
    /**
     * edge id
     */
    id: string
    /**
     * node id + connector name
     */
    from: string;
    /**
     * node id + connector name
     */
    to: string;
    /**
     * 
     */
    // parent?: StoryGraph;
}