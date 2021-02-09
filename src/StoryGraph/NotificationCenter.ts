import { IEdge } from "..";

export class NotificationCenter {
    
    private _callbacks: Map<string, ((payload?: INotificationData<any>) => void)[]> = new Map();

    public subscribe<T>(channel: string, callback: ((payload?: INotificationData<T>) => void)): boolean {
        // type guard callback
        if (typeof callback === "function") {
            // check wether channel exists
            if (this._callbacks.has(channel)) {
                // put cb in stack
                this._callbacks.get(channel)!.push(callback);
                return true;
            } else {
                // create new channel
                this._callbacks.set(channel, [callback]);
                return true;
            }
        }
        return false;
    }

    public unsubscribe<T>(channel: string, callback: ((payload?: INotificationData<T>) => void)): boolean {
        if (typeof callback === "function") {
            if (this._callbacks.has(channel)) {
                const stack = this._callbacks.get(channel);
                const index = stack?.indexOf(callback);
                if (index !== undefined && index !== -1) {
                    stack?.splice(index, 1);
                    return true;
                }
            }
        }
        return false;
    }

    public push<T>(channel: string, payload?: INotificationData<T>): boolean {
        if (this._callbacks.has(channel)) {
            return this._callbacks.
            get(channel)!.
            map(e => {
                e(payload);
                return true;
            }).
            reduce((p, v) => (p && v), true);
        } else return false;
    }

    public get channels(): string[] {
        return Array.from(this._callbacks.keys());
    }
}

export interface INotificationData<T> {
    data: T
    source: any
    type: string
}

export interface IEdgeEvent {
    remove?: IEdge[]
    add?: IEdge[]
}