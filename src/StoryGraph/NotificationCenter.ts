export class NotificationCenter {
    
    private _callbacks: Map<string, ((data?: unknown) => void)[]> = new Map();

    public subscribe(channel: string, callback: ((data?: unknown) => void)): boolean {
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

    public unsubscribe(channel: string, callback: ((data?: unknown) => void)): boolean {
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

    public push(channel: string, data?: unknown): boolean {
        if (this._callbacks.has(channel)) {
            return this._callbacks.
            get(channel)!.
            map(e => {
                e(data);
                return true;
            }).
            reduce((p, v) => (p && v), true);
        } else return false;
    }

    public get channels(): string[] {
        return Array.from(this._callbacks.keys());
    }
}