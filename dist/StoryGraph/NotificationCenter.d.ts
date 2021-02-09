import { IEdge } from "..";
export declare class NotificationCenter {
    private _callbacks;
    subscribe<T>(channel: string, callback: ((payload?: INotificationData<T>) => void)): boolean;
    unsubscribe<T>(channel: string, callback: ((payload?: INotificationData<T>) => void)): boolean;
    push<T>(channel: string, payload?: INotificationData<T>): boolean;
    get channels(): string[];
}
export interface INotificationData<T> {
    data: T;
    source: any;
    type: string;
}
export interface IEdgeEvent {
    remove?: IEdge[];
    add?: IEdge[];
}
//# sourceMappingURL=NotificationCenter.d.ts.map