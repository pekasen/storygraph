/**P. Kessling *Hamburg, September 2020*/
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
    contentType: string;
}

export type ContentType = "reference" | "instant-load" | "lazy-load";

export interface ICacheable<Value> {
    loaded: boolean
    lazy: boolean
    cache: Value
    get(): Value | Promise<Value> | undefined
}