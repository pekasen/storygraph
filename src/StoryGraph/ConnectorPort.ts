import { ConnectorDirection, ConnectorType, IConnectorPort, IDataInPort, IDataOutPort } from "./IConnectorPort";

export class ConnectorPort implements IConnectorPort {
    type: ConnectorType;
    direction: ConnectorDirection;

    constructor(type: ConnectorType, direction: ConnectorDirection) {
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

export class DataConnectorInPort<T> extends ConnectorPort implements IDataInPort<T> {
    
    type: "data" = "data"
    direction: "in" = "in"
    callback: (data: T) => void

    private _name: string
    
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
    
    type: "data" = "data"
    direction: "out" = "out"
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
