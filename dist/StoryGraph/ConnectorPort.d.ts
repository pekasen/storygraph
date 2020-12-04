import { ConnectorDirection, ConnectorType, IConnectorPort, IDataInPort, IDataOutPort } from "./IConnectorPort";
export declare class ConnectorPort implements IConnectorPort {
    type: ConnectorType;
    direction: ConnectorDirection;
    constructor(type: ConnectorType, direction: ConnectorDirection);
    get name(): string;
    reverse(): ConnectorPort;
}
export declare class DataConnectorInPort<T> extends ConnectorPort implements IDataInPort<T> {
    type: "data";
    direction: "in";
    callback: (data: T) => void;
    private _name;
    constructor(name: string, callback: (data: T) => void);
    handlePull(data: T): void;
    get name(): string;
}
export declare class DataConnectorOutPort<T> extends ConnectorPort implements IDataOutPort<T> {
    type: "data";
    direction: "out";
    callback: () => T;
    private _name;
    constructor(name: string, callback: () => T);
    pull(): T;
    get name(): string;
}
//# sourceMappingURL=ConnectorPort.d.ts.map