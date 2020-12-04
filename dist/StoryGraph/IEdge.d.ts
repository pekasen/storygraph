/**P. Kessling *Hamburg, September 2020*/
import { StoryGraph } from "./StoryGraph";
/**
 *
 */
export interface IEdge {
    /**
     * edge id
     */
    id: string;
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
    parent?: StoryGraph;
}
//# sourceMappingURL=IEdge.d.ts.map