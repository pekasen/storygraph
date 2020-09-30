/**P. Kessling *Hamburg, September 2020*/
import { IEdgeCondition } from "./IEdgeCondition"
import { IEdgeConditionPredicate } from "./IEdgeConditionPredicate"
import { IEdgeTypePredicate } from "./IEdgeTypePredicate"
/**
 * 
 */
export interface IEdgePredicate {

    /**
     * 
     */
    conditions: IEdgeCondition;
    /**
     * 
     */
    condition?: IEdgeConditionPredicate[];
    /**
     * 
     */
    type?: IEdgeTypePredicate;
}