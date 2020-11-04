/**P. Kessling *Hamburg, September 2020*/
import { ConditionType } from "./ConditionType";
/**
 *
 */
export interface IEdgeCondition {
    /**
     *
     */
    key: string;
    /**
     *
     */
    value: number;
    /**
     *
     */
    type: ConditionType;
}
