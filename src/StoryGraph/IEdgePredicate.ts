/**P. Kessling *Hamburg, September 2020*/
import { IEdgeCondition } from "./IEdgeCondition"
import { IEdgeTypePredicate } from "./IEdgeTypePredicate"
import { IEdgeConditionPredicate } from "./IEdgeConditionPredicate"
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
    type?: IEdgeTypePredicate;
    /**
     * 
     */
    condition?: IEdgeConditionPredicate[];
}