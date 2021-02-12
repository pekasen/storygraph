import { ConnectorDirection, ConnectorType, Data, Flow, IConnectorPort, IDataInPort, IDataOutPort, IFlowInPort, IFlowOutPort, In, IReactionInPort, IReactionOutPort, Out, Reaction } from "./IConnectorPort";
import { IEdge } from "..";
import { NotificationCenter } from "./NotificationCenter";
export declare class ConnectorPort implements IConnectorPort {
    type: ConnectorType;
    direction: ConnectorDirection;
    notificationCenter?: NotificationCenter;
    associated?: string;
    connections: IEdge[];
    id: string;
    constructor(type: string, direction: string);
    get name(): string;
    reverse(): ConnectorPort;
    /**
     * Binds the connector to a notification center.
     * This method binds callbacks for both addition and deletion of edges.
     * Overwrite in sub-methods if necessary.
     * @param notificationCenter
     */
    bindTo(notificationCenter: NotificationCenter): void;
    needsBinding(notificationCenter: NotificationCenter): boolean;
    addConnections(edges: IEdge[]): void;
    removeConnections(edges: IEdge[]): void;
}
export declare class FlowConnectorInPort extends ConnectorPort implements IFlowInPort {
    readonly type: Flow;
    readonly direction: In;
    constructor();
}
export declare class FlowConnectorOutPort extends ConnectorPort implements IFlowOutPort {
    readonly type: Flow;
    readonly direction: Out;
    constructor();
}
export declare class DataConnectorInPort<T> extends ConnectorPort implements IDataInPort<T> {
    readonly type: Data;
    readonly direction: In;
    callback: (data: T) => void;
    private _name;
    constructor(name: string, callback: (data: T) => void);
    handlePull(data: T): void;
    get name(): string;
}
export declare class DataConnectorOutPort<T> extends ConnectorPort implements IDataOutPort<T> {
    readonly type: Data;
    readonly direction: Out;
    callback: () => T;
    private _name;
    constructor(name: string, callback: () => T);
    pull(): T;
    get name(): string;
}
export declare class ReactionConnectorInPort extends ConnectorPort implements IReactionInPort {
    readonly type: Reaction;
    readonly direction: In;
    private _handleNotification;
    private _name;
    constructor(name: string, handler: () => void);
    bindTo(notificationCenter: NotificationCenter): void;
    get handleNotification(): () => void;
    set handleNotification(handler: () => void);
    get name(): string;
    set name(newName: string);
}
export declare class ReactionConnectorOutPort extends ConnectorPort implements IReactionOutPort {
    readonly type: Reaction;
    readonly direction: Out;
    private _name;
    constructor(name: string);
    notify(): void;
    get name(): string;
    set name(newName: string);
}
//# sourceMappingURL=ConnectorPort.d.ts.map