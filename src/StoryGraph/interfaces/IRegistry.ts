import { IStoryObject } from "./IStoryObject";

export interface IRegistry {
    get(id: string): unknown | undefined;
    set(id: string, value: unknown): void;
    has(id: string): boolean;
    rm(id: string): boolean
    // register(value: IStoryObject): boolean
    // deregister(value: string): boolean
    // getValue(forId: string): IStoryObject | undefined
    // overwrite(value: IStoryObject): boolean
}