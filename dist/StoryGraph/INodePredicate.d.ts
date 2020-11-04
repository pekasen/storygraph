/**P. Kessling *Hamburg, September 2020*/
import { IMetaDataPredicate } from "./IMetaDataPredicate";
import { IContentPredicate } from "./IContentPredicate";
/**
 *
 */
export interface INodePredicate {
    /**
     *
     */
    metadata?: IMetaDataPredicate;
    /**
     *
     */
    content?: IContentPredicate;
}
