export interface IConnectorPort {
    name: string;
    direction: "in" | "out";
    type: "flow" | "reaction" | "data";
    call?: (data?: any) => void;
}
