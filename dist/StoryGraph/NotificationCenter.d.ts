export declare class NotificationCenter {
    private _callbacks;
    subscribe(channel: string, callback: ((data?: unknown) => void)): boolean;
    unsubscribe(channel: string, callback: ((data?: unknown) => void)): boolean;
    push(channel: string, data?: unknown): boolean;
    get channels(): string[];
}
//# sourceMappingURL=NotificationCenter.d.ts.map