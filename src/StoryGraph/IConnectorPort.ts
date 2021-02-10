import { IEdge } from "..";
import { NotificationCenter } from "./NotificationCenter";

export type Reaction = "reaction";
export type Flow = "flow";
export type Data = "data";

export type In = "in";
export type Out = "out";

export type ConnectorType = Flow | Reaction | Data;
export type ConnectorDirection = In | Out;

export function isConnectorType(arg: any): arg is ConnectorType {
    return arg === "flow" || arg === "reaction" || arg === "data";
}

export function isConnectorDirection(arg: any): arg is ConnectorDirection {
    return arg === "in" || arg === "out";
}

export interface IConnectorPort {
    id: string;
    name: string;
    type: ConnectorType;
    direction: ConnectorDirection;
    connections: IEdge[];
    associated?: IConnectorPort;
    notificationCenter?: NotificationCenter;
}

export interface IReactionPort {
    type: Reaction
}

export interface IFlowPort {
    type: Flow
}

export interface IDataPort {
    type: Data
}
export interface IInPort {
    direction: In
}
export interface IOutPort {
    direction: Out
}

export interface IFlowInPort extends IFlowPort, IInPort {
    
}

export interface IFlowOutPort extends IFlowPort, IOutPort {

}

export interface IDataInPort<T> extends IDataPort, IInPort {
    handlePull: (data: T) => void
    callback: (data: T) => void
}

export interface IDataOutPort<T> extends IDataPort, IOutPort {
    pull: () => T
}

export interface IReactionInPort extends IReactionPort, IInPort {
    handleNotification: () => void
}

export interface IReactionOutPort extends IReactionPort, IOutPort {
    notify: () => void
}
