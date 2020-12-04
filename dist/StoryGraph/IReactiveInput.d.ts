/**P. Kessling *Hamburg, September 2020*/
import { IStoryObject } from "./IStoryObject";
import { IReactiveOutput } from "./IReactiveOutput";
/**
 *
 */
export interface IReactiveInput {
    /**
     *
     */
    parent: IStoryObject;
    /**
     *
     */
    connectedOutputs?: IReactiveOutput[];
}
