import { ConnectorDirection, ConnectorType, Data, Flow, IConnectorPort, IDataInPort, IDataOutPort, IFlowInPort, IFlowOutPort, In, IReactionInPort, IReactionOutPort, isConnectorDirection, isConnectorType, Out, Reaction } from "./IConnectorPort";

export class ConnectorPort implements IConnectorPort {
    type: ConnectorType;
    direction: ConnectorDirection;

    constructor(type: string, direction: string) {
        // guards, assemble!
        if (!isConnectorType(type)) throw(`${type} is not a ConnectorType`);
        if (!isConnectorDirection(direction)) throw(`${direction} is not a ConnectorDirection`);

        this.type = type;
        this.direction = direction;
    }

    get name(): string {
        return [this.type, this.direction].join("-")
    }

    reverse(): ConnectorPort {
        const _dir = (this.direction === "in") ? "out" : "in";
        return new ConnectorPort(this.type, _dir);
    }
}

export class FlowConnectorInPort extends ConnectorPort implements IFlowInPort {
    public readonly type: Flow = "flow";
    public readonly direction: In = "in";
}

export class FlowConnectorOutPort extends ConnectorPort implements IFlowOutPort {
    public readonly type: Flow = "flow";
    public readonly direction: Out = "out";
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
