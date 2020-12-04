export type ConnectorType = "flow" | "reaction" | "data";
export type ConnectorDirection = "in" | "out";

export interface IConnectorPort {
    name: string
    direction: ConnectorDirection
    type: ConnectorType
    associated?: IConnectorPort
}

export interface IDataInPort<T> extends IConnectorPort {
    type: "data"
    direction: "in"
    handlePull: (data: T) => void
    callback: (data: T) => void
}

export interface IDataOutPort<T> extends IConnectorPort {
    type: "data"
    direction: "out"
    pull: () => T
}

export interface IReactionInPort<T> extends IConnectorPort {
    type: "reaction"
    direction: "in"
    handleNotification: (data: T) => void
}

export interface IReactionOutPort<T> extends IConnectorPort {
    type: "reaction"
    direction: "out"
    notify: () => T
}
