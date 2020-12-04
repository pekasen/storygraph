/**P. Kessling *Hamburg, September 2020*/
import { IGraph } from "./IGraph";
import { IEdge } from "./IEdge";
/**
 *
 */
export interface IReducer {
    /**
     * @param graphx
     * @param graphy
     * @return
     */
    merge(graphx: IGraph, graphy: IGraph): IGraph;
    /**
     * @param connections
     * @param graph
     * @return
     */
    connect(connections: IEdge[], graph: IGraph): IGraph;
}
//# sourceMappingURL=IReducer.d.ts.map