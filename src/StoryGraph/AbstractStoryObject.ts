import { FunctionComponent } from "preact";
import { v4 } from "uuid";
import { action, makeObservable, observable } from 'mobx';
import { MenuTemplate } from "preact-sidebar";
import { StoryGraph, IStoryObject, IConnectorPort, IEdge, IMetaData, IRenderingProperties, FlowConnectorInPort, FlowConnectorOutPort, DataConnectorInPort, ConnectorPort } from 'storygraph';
import { IRegistry } from 'storygraph/dist/StoryGraph/IRegistry';

import { createModelSchema, custom, deserialize, getDefaultModelSchema, identifier, list, map, object, optional, primitive, serialize } from 'serializr';
import { AbstractStoryModifier } from "./AbstractModifier";

import { IEdgeEvent } from "storygraph/dist/StoryGraph/IEdgeEvent";
import { NotificationCenter, INotificationData } from "storygraph/dist/StoryGraph/NotificationCenter";

import { EdgeSchema } from "../../renderer/store/schemas/EdgeSchema";
import { ConnectorSchema } from "../../renderer/store/schemas/ConnectorSchema";
import { UserDefinedPropertiesSchema } from '../../renderer/store/schemas/UserDefinedPropertiesSchema';
import { MetaDataSchema } from '../../renderer/store/schemas/MetaDataSchema';
import { ContentSchema } from '../../renderer/store/schemas/ContentSchema';

import { INGWebSProps } from "./INGWebSProps";
import { PReg } from "storymesh-plugin-support";

/**
 * Our second little dummy PlugIn
 * 
 * 
 */
// @
export abstract class AbstractStoryObject implements IPlugIn, IStoryObject{

    public id: string;
    public metaData: IMetaData;
    public connections: IEdge[];
    public parent?: string;
    public renderingProperties: IRenderingProperties;
    public modifiers: AbstractStoryModifier[];
    public deletable: boolean;
    public abstract name: string;
    public abstract role: string;
    public abstract isContentNode: boolean;
    public abstract userDefinedProperties: any;
    public abstract childNetwork?: StoryGraph;
    public abstract icon: string
    public abstract content?: any;
    protected _connectors = new Map<string, IConnectorPort>();
    protected _rerender?: (() => void);
    
    constructor() {
        this.id = v4();
        this.renderingProperties = {
            width: 100,
            order: 1,
            collapsable: false
        };
        this.modifiers = [];
        this.connections = [];
        this.metaData = {
            createdAt: new Date(Date.now()),
            name: "NGWebS default user",
            tags: []
        };
        this.deletable = true;

        makeObservable(this, {
            id: false,
            metaData:               observable,
            connections:            observable,
            modifiers:              observable.deep,
            // cannot makr connectors as computed as it will fuck up everything and the world.
            // connectors:             computed,
            addConnection:          action,
            addModifier:            action,
            removeModifier:         action
        });
    }
    notificationCenter?: NotificationCenter | undefined;
    
    public addConnections(edges: IEdge[]): void {
        // store locally
        this.connections.push(...edges);
    }

    public bindTo(notificationCenter: NotificationCenter): void {
        this.notificationCenter = notificationCenter;
        this.connectors.forEach((connector) => {
            console.log("binding", connector, notificationCenter);
            (connector as ConnectorPort).bindTo(notificationCenter, this.id);
        });
        notificationCenter.subscribe(this.id, (payload?: INotificationData<IEdgeEvent>) => {
            if (payload) {
                console.log("binding", payload);
                if (payload.data.add !== undefined) {
                    this.addConnections(payload.data.add);
                }
                if (payload.data.remove !== undefined) {
                    this.removeConnections(payload.data.remove);
                }
            }
        });
        notificationCenter.subscribe(this.id+"/rerender", () => {
            if (this._rerender !== undefined) this._rerender();
        })
    }


    /**
     * 
     * @param registry Registry
     * @param id their id
     * @param myport our port
     * @param theirport their port
     * @param direction which direction does the edge point? 
     */
    public addConnection(registry: IRegistry, id: string, myport: string, theirport: string, direction: "in" | "out" = "in"): void {
        if (this.parent) {
            const isIncoming = direction === "in";

            const parentNetwork = registry.getValue(this.parent)?.childNetwork;
            if (parentNetwork) {
                const newEdge: IEdge = {
                    id: (isIncoming) ? `edge.${id}.${this.id}` : `edge.${this.id}.${id}`,
                    from: ((isIncoming) ? `${id}.${theirport}` : `${this.id}.${myport}`),
                    to: ((isIncoming) ? `${this.id}.${myport}` : `${id}.${theirport}`),
                    // parent: parentNetwork
                };
                console.log("new Edge", newEdge);
                parentNetwork.connect(registry, [newEdge]);
            }
        }
    }

    public removeConnections(edges: IEdge[]): void {
        edges.forEach((edge) => {
            const _index = this.connections.findIndex((_edge) => (_edge.id === edge.id));
            if (_index !== -1) {
                if (this.connections.splice(_index, 1)[0].id === edge.id) {
                    console.log(`edge removed from node ${this.id}`);
                } else console.warn(`edge not removed in node ${this.id}`);
            } else console.warn(`edge not found in node ${this.id}`);  
        });
    }

    public addModifier(modifier: AbstractStoryModifier): void {
        modifier.updateParent(this.id);
        this.modifiers.push(modifier);
    }

    public removeModifier(modifier: AbstractStoryModifier): void {
        this.modifiers.splice(
            this.modifiers.indexOf(modifier), 1
        );
    }

    public willDeregister(registry: IRegistry): void {
        if (this.childNetwork) this.childNetwork.willDeregister(registry)
    }

    public get menuTemplate(): MenuTemplate[] {
        const ret: MenuTemplate[] = [];
        if (this.modifiers.length !== 0) {
            ret.push(
                ...this.modifiers.
                map(e => e.menuTemplate).
                reduce((p: MenuTemplate[], e: MenuTemplate[]) => (p.concat(...e)))
            );
        }
        return ret;
    }

    public get connectors(): Map<string, IConnectorPort> {
        return this._connectors;
    }

    public abstract getComponent?(): FunctionComponent<INGWebSProps>

    public abstract getEditorComponent(): FunctionComponent<INGWebSProps> 

    protected makeDefaultConnectors(): void {
        const _in = new FlowConnectorInPort();
        const _out = new FlowConnectorOutPort();
        const _data = new DataConnectorInPort("data-in", (data: unknown) => {this.content = data});

        _in.associated = _out.id;
        _out.associated = _in.id;
        
        if (this.notificationCenter) {
            _in.bindTo(this.notificationCenter, this.id)
            _out.bindTo(this.notificationCenter, this.id)
        }

        [
            _in,
            _out,
            _data
        ].forEach(e => {
            this._connectors.set(
                e.id, e
            );
        });
    }
}

export class StoryObject extends AbstractStoryObject {
    public name!: string;
    public role!: string;
    public isContentNode!: boolean;
    public userDefinedProperties: any;
    public childNetwork?: StoryGraph | undefined;
    public icon!: string;
    public content?: any;
    
    public get connectors(): Map<string, IConnectorPort> {
        const map = new Map(super.connectors);
        this.modifiers.forEach(modifier => {
            modifier.requestConnectors().forEach(([label, connector]) => {
                if (connector.needsBinding() && this.notificationCenter !== undefined) {
                    connector.bindTo(this.notificationCenter, this.id);
                }
                map.set(label, connector);
            });
        });
        return map
    }
    public getComponent(): FunctionComponent<INGWebSProps> {
        throw new Error('Method not implemented.');
    }
    public getEditorComponent(): FunctionComponent<INGWebSProps> {
        throw new Error('Method not implemented.');
    }
}

export const StoryObjectSchema = createModelSchema(StoryObject, {
    id: identifier(
        (id: string, obj) => {
            // TODO: loading from deserialized JSON should be handled in the original VReg
            const reg = rootStore._loadingCache;
            console.log("registering @valuecache", obj,reg.set(id, obj))
        }
    ),
    name: primitive(),
    role: primitive(),
    isContentNode: primitive(),
    userDefinedProperties: object(UserDefinedPropertiesSchema),
    metaData: object(MetaDataSchema),
    content: optional(object(ContentSchema)),
    parent: optional(primitive()),
    connections: list(object(EdgeSchema)),
    _connectors: map(object(ConnectorSchema)),
    modifiers: list(custom(
        (value: Record<string, unknown>) => {
            const schema = getDefaultModelSchema(value.constructor);
            if (!schema) throw("could not get schema for " + value.constructor.name);
            return serialize(schema, value);
        },
        (jsonValue, context, callback) => {
            const instance = PReg.instance().get(jsonValue.role);
            if (!instance) throw("Big time failure !!11 while fetching schema for" + jsonValue.role);
            console.log("getting schema for", instance.constructor.name);
            const _schema = getDefaultModelSchema(instance.constructor);
            if (!_schema) throw("no schema present during deserialization for " + context.target.constructor.name);
            return deserialize(_schema, jsonValue, callback);
        }
    ))
});
