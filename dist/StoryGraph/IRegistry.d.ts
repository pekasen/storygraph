import { IStoryObject } from "./IStoryObject";
export interface IRegistry {
    register(value: IStoryObject): boolean;
    deregister(value: string): boolean;
    getValue(forId: string): IStoryObject | undefined;
    overwrite(value: IStoryObject): boolean;
}
//# sourceMappingURL=IRegistry.d.ts.map