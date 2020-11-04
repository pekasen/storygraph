/**P. Kessling *Hamburg, September 2020*/
import { ContentType } from "./ContentType";
/**
 *
 */
export interface IContent {
    /**
     *
     */
    resource: string;
    /**
     *
     */
    altText: string;
    /**
     *
     */
    type: ContentType;
}
