import { ConnectorDirection, ConnectorType, Data, Flow, IConnectorPort, IDataInPort, IDataOutPort, IFlowInPort, IFlowOutPort, In, IReactionInPort, IReactionOutPort, isConnectorDirection, isConnectorType, Out, Reaction } from "./IConnectorPort";
import { v4 } from "uuid";
import { IEdge } from "..";
import { NotificationCenter } from "./NotificationCenter";
export class ConnectorPort implements IConnectorPort {
    type: ConnectorType;
    direction: ConnectorDirection;
    notificationCenter?: NotificationCenter;
    associated?: ConnectorPort;
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
    bindTo(notificationCenter: NotificationCenter) {
        this.notificationCenter = notificationCenter;
        this.notificationCenter.subscribe(this.id, (data: any) => {
            if (data.remove !== undefined) {
                this.removeConnections(data.remove);
            }
            if (data.add !== undefined) {
                this.addConnections(data.add);
            }
        });
    }

    addConnections(edges: IEdge[]) {
        this.connections.push(...edges)
    }

    removeConnections(edges: IEdge[]) {
        edges.forEach((edge) => {
            const index = this.connections.indexOf(edge);
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
    public readonly handleNotification: () => void;
    private _name: string

    constructor(name: string, handler: () => void) {
        super("reaction", "in");

        this._name = name ?? "reaction-in";
        this.handleNotification = handler;
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
    public notify: () => void;
    private _name: string;

    constructor(name: string, notifier: () => void) {
        super("reaction", "out");
        this._name = name ?? "reaction-out"
        this.notify = notifier;
    }


    public get name() {
        return this._name;
    }

    public set name(newName: string) {
        this._name = newName;
    }
}
