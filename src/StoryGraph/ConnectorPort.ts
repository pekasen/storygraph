import { ConnectorDirection, ConnectorType, Data, Flow, IConnectorPort, IDataInPort, IDataOutPort, IFlowInPort, IFlowOutPort, In, IReactionInPort, IReactionOutPort, isConnectorDirection, isConnectorType, Out, Reaction } from "./IConnectorPort";
import { v4 } from "uuid";
import { IEdge, StoryGraph } from "..";
import { INotificationData, NotificationCenter } from "./NotificationCenter";
import { IEdgeEvent } from "./IEdgeEvent";
export class ConnectorPort implements IConnectorPort {
    type: ConnectorType;
    direction: ConnectorDirection;
    notificationCenter?: NotificationCenter;
    associated?: string;
    parent?: string;
    connections: IEdge[];
    id = v4();

    constructor(type: string, direction: string) {
        // guards, assemble!
        if (!isConnectorType(type)) throw(`${type} is not a ConnectorType`);
        if (!isConnectorDirection(direction)) throw(`${direction} is not a ConnectorDirection`);

        this.type = type;
        this.direction = direction;
        this.connections = [];
    }

    get name(): string {
        return [this.type, this.direction].join("-")
    }

    reverse(): ConnectorPort {
        const _dir = (this.direction === "in") ? "out" : "in";
        return new ConnectorPort(this.type, _dir);
    }
    /**
     * Binds the connector to a notification center.
     * This method binds callbacks for both addition and deletion of edges.
     * Overwrite in sub-methods if necessary.
     * @param notificationCenter 
     */
    bindTo(notificationCenter: NotificationCenter, parentID: string) {
        if (
            (this.notificationCenter == undefined || this.notificationCenter !== notificationCenter) &&
            (this.parent == undefined && this.parent !== parentID)
        ) {
            this.notificationCenter = notificationCenter;
            this.notificationCenter.subscribe(this.id, (payload?: INotificationData<IEdgeEvent>) => {
                if (payload && payload.data) {
                    if (payload.data.remove !== undefined) {
                        this.removeConnections(payload.data.remove);
                    }
                    if (payload.data.add !== undefined) {
                        this.addConnections(payload.data.add);
                    }
                }
            });
            this.parent = parentID;
        }
    }

    needsBinding(notificationCenter: NotificationCenter): boolean {
        return this.notificationCenter === undefined || this.notificationCenter === notificationCenter;
    }

    addConnections(edges: IEdge[]) {
        this.connections.push(...edges)
    }

    removeConnections(edges: IEdge[]) {
        edges.forEach((edge) => {
            const index = this.connections.findIndex(_edge => _edge.id === edge.id);
            if (index !== -1) {
                this.connections.splice(index, 1)
            }
        })
    }
}

export class FlowConnectorInPort extends ConnectorPort implements IFlowInPort {
    public readonly type: Flow = "flow";
    public readonly direction: In = "in";

    constructor() {
        super("flow", "in");
    }
}

export class FlowConnectorOutPort extends ConnectorPort implements IFlowOutPort {
    public readonly type: Flow = "flow";
    public readonly direction: Out = "out";

    constructor() {
        super("flow", "out");
    }
}

export class DataConnectorInPort<T> extends ConnectorPort implements IDataInPort<T> {
    
    public readonly type: Data = "data";
    public readonly direction: In = "in";
    callback: (data: T) => void;

    private _name: string;
    
    constructor(name: string, callback: (data: T) => void) {
        super(
            "data", "in"
        );

        this._name = name;
        this.callback = callback;
    }

    handlePull (data: T): void {
        this.callback(data);
    }

    get name() {
        return this._name;
    }
}

export class DataConnectorOutPort<T> extends ConnectorPort implements IDataOutPort<T> {
    
    public readonly type: Data = "data"
    public readonly direction: Out = "out"

    callback: () => T

    private _name: string
    
    constructor(name: string, callback: () => T) {
        super(
            "data", "out"
        );

        this._name = name;
        this.callback = callback;
    }

    pull(): T {
        return this.callback();
    }

    get name() {
        return this._name;
    }
}

export class ReactionConnectorInPort extends ConnectorPort implements IReactionInPort {
    public readonly type: Reaction = "reaction";
    public readonly direction: In = "in";
    private _handleNotification: () => void;
    private _name: string

    constructor(name: string, handler: () => void) {
        super("reaction", "in");

        this._name = name ?? "reaction-in";
        this._handleNotification = handler;
    }

    public bindTo(notificationCenter: NotificationCenter, parentID: string) {
        super.bindTo(notificationCenter, parentID);
        notificationCenter.subscribe(this.id, (payload?: INotificationData<undefined>) => {
            if (payload !== undefined && payload.type === "reaction") this.handleNotification();
        });
    }

    public get handleNotification(): () => void {
        return this._handleNotification;
    }

    public set handleNotification(handler: () => void) {
        if (typeof handler === "function") {
            this._handleNotification = handler;
        }
    }

    public get name() {
        return this._name;
    }

    public set name(newName: string) {
        this._name = newName;
    }
}

export class ReactionConnectorOutPort extends ConnectorPort implements IReactionOutPort {
    public readonly type: Reaction = "reaction";
    public readonly direction: Out = "out";
    private _name: string;
    
    constructor(name: string) {
        super("reaction", "out");
        this._name = name ?? "reaction-out"
    }
    
    public notify() {
        const payload: INotificationData<undefined> = {
            type: "reaction",
            source: this,
            data: undefined
        };

        this.connections.forEach((edge) => {
            const [, portId] = StoryGraph.parseNodeId(edge.to);
            this.notificationCenter?.push(portId, payload);
        })
    }

    public get name() {
        return this._name;
    }

    public set name(newName: string) {
        this._name = newName;
    }
}
