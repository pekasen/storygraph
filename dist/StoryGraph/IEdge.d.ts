import { StoryGraph } from "./StoryGraph";
/**
 *
 */
export interface IEdge {
    /**
     *
     */
    from: string;
    /**
     *
     */
    to: string;
    /**
     *
     */
    parent?: StoryGraph;
}
