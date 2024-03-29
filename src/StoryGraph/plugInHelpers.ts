import { IRegistry } from './interfaces/IRegistry';
import { Button, DropDown, MenuTemplate, Table, Text } from 'preact-sidebar';
import { ConnectorType, ConnectorDirection, ConnectorPort, IConnectorPort, StoryGraph, IStoryObject, AbstractStoryObject } from '..';
import { VReg } from './registry/VReg';
import { AbstractStoryModifier } from './AbstractModifier';

interface IDefaultFieldsMethods {
    addConnection: (registry: IRegistry, ids: string,  myport: string, theirport: string, direction: "in" | "out") => void
}

interface INameFieldMethods {
    updateName: (name: string) => void
}

interface IBooleanFieldMethods {
    updateValue: (val: boolean) => void
}

interface IConnectorMethods {
    addConnector: (type: ConnectorType, dir: ConnectorDirection) => void
    removeConnector: (port: ConnectorPort) => void
}

type Target = AbstractStoryObject | AbstractStoryModifier;

export function connectionField(target: IStoryObject & IDefaultFieldsMethods): MenuTemplate[] {
    interface IConnectionTableEntry {
        thisPort: string
        otherPort?: string
        // incoming: boolean
    }

    const mapper = (arr: IConnectorPort[]): IConnectionTableEntry[] => {
        const reg = VReg.instance();
        
        return arr.
        map(connector => {
            const connections = connector.connections.map(connection => {
                const [toId, toConnectorId] = StoryGraph.parseNodeId(connection.to);
                const [fromId, fromConnectorId] = StoryGraph.parseNodeId(connection.from);

                const toObj = reg.get(toId);
                const fromObj = reg.get(fromId);
                const toPort = toObj?.connectors.get(toConnectorId);
                const fromPort = fromObj?.connectors.get(fromConnectorId);

                const otherPort = (toPort == connector) ? fromPort : toPort;
                const otherObj = (toPort == connector) ? fromObj: toObj;

                return {
                    thisPort: connector.name,
                    otherPort: `${otherObj?.name}.${otherPort?.name}`,
                }
            }) as IConnectionTableEntry[];

            if (connections.length !== 0) {
                return connections;
            } else return [{
                thisPort: connector.name,
                otherPort: "–"
            }]

            // .filter(e => e !== undefined) as {
            //     fromName: ConnectorPort
            //     toName: ConnectorPort
            //     incoming: boolean
            // }[];
        }).
        reduce((p, v) => {
            p.push(...v);
            return p;
        }, [])
    }

    return [
        new Table<IConnectionTableEntry>(
            "Connections",
            {
                columns: [
                    {
                        name: "Connector",
                        property: "thisPort",
                        type: "",
                        setter: () => undefined,
                        editable: false
                    },
                    {
                        name: "Connection",
                        property: "otherPort",
                        type: "",
                        setter: () => undefined,
                        editable: false
                    },
                ]
            },
            () => mapper(Array.from(target.connectors.values()))
        )
        // {
        //     label: "Connections",
        //     type: "connectiontable",
        //     value: () => ({
        //         connections: target.connections,
        //         connectors: target.connectors,
        //         id: target.id
        //     }),
        //     valueReference: (registry: IRegistry, id: string, myport: string, theirport: string, direction: "in" | "out") => {target.addConnection(registry, id, myport, theirport, direction)}
        // }
    ]
}

export function addConnectionPortField(target: Target & IConnectorMethods): MenuTemplate[] {
    return [
        new Button("Add Port", () => target.addConnector("flow", "in"))
        // {
        //     label: "Add Port",
        //     type: "button",
        //     value: () => {
        //         return target.connectors
        //     },
        //     valueReference: (type: ConnectorType, direction: ConnectorDirection) => {
        //         target.addConnector(type, direction);
        //     }
        // }
    ]
}

export function nameField(target: Target & INameFieldMethods): MenuTemplate[] {
    return [
        new Text(
            "Name",
            {
                defaultValue: "Name"
            },
            () => target.name,
            (name: string) => target.updateName(name)
        )
        // {
        //     label: "Name",
        //     type: "text",
        //     value: () => target.name,
        //     valueReference: (name: string) => target.updateName(name)
        // }
    ]
}

export function dropDownField(
    target: Target,
    options: () => string[], //  = ["h1", "h2", "h3", "p", "b"]
    value: () => string,
    handler: (selection: string) => void
    ) : MenuTemplate[] {
    return [
        new DropDown("Style", {
            options: options()
        },
        value,
        handler)
        // {
        //     label: "Style",
        //     type: "dropdown",
        //     value: value,
        //     valueReference: handler,
        //     options: options()
        // }
    ]
}

// export function checkboxField(
//     target: AbstractStoryObject & IBooleanFieldMethods,
//     value: () => boolean,
//     handler: (selection: boolean) => void): MenuTemplate[] {
//     return [
//         new CheckBox(
//             "Name",
//             {
//                 defaultValue: "Name"
//             },
//             value,
//             handler)
        
//         // {
//         //     label: "Name",
//         //     type: "text",
//         //     value: () => target.name,
//         //     valueReference: (name: string) => target.updateName(name)
//         // }
//     ]
// }
