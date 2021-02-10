import { IEdge } from "..";
import { NotificationCenter } from "./NotificationCenter";
export declare type Reaction = "reaction";
export declare type Flow = "flow";
export declare type Data = "data";
export declare type In = "in";
export declare type Out = "out";
export declare type ConnectorType = Flow | Reaction | Data;
export declare type ConnectorDirection = In | Out;
export declare function isConnectorType(arg: any): arg is ConnectorType;
export declare function isConnectorDirection(arg: any): arg is ConnectorDirection;
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
    type: Reaction;
}
export interface IFlowPort {
    type: Flow;
}
export interface IDataPort {
    type: Data;
}
export interface IInPort {
    direction: In;
}
export interface IOutPort {
    direction: Out;
}
export interface IFlowInPort extends IFlowPort, IInPort {
}
export interface IFlowOutPort extends IFlowPort, IOutPort {
}
export interface IDataInPort<T> extends IDataPort, IInPort {
    handlePull: (data: T) => void;
    callback: (data: T) => void;
}
export interface IDataOutPort<T> extends IDataPort, IOutPort {
    pull: () => T;
}
export interface IReactionInPort extends IReactionPort, IInPort {
    handleNotification: () => void;
}
export interface IReactionOutPort extends IReactionPort, IOutPort {
    notify: () => void;
}
//# sourceMappingURL=IConnectorPort.d.ts.map