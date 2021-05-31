import { IContent } from "./interfaces/IContent";
import { IMetaData } from "./interfaces/IMetaData";
import { IEdge } from "./interfaces/IEdge";
import { StoryGraph } from "./StoryGraph";
import { IRenderingProperties } from "./interfaces/IRenderingProperties";
import { IConnectorPort } from './interfaces/IConnectorPort';
import { INotificationData, NotificationCenter } from "./NotificationCenter";
import { IStoryObject } from "./interfaces/IStoryObject";
import { ConnectorPort } from "..";
import { v4 } from "uuid";
import { IStoryModifier } from "./interfaces/IStoryModifier";

const NEW = "NEW";
const BINDING = "BINDING";
const BOUND = "BOUND";
const MOUNTING = "MOUNTING";
const MOUNTED = "MOUNTED";
const REMOVING = "REMOVING";
const REMOVED = "REMOVED";

type StoryObjectState = typeof NEW | typeof BINDING | typeof BOUND | typeof MOUNTING | typeof MOUNTED | typeof REMOVING | typeof REMOVED;

interface TransistionEdge {
    from: StoryObjectState
    to: StoryObjectState
    hook?: () => void
}

export interface Subscription {
    id: string
    hook: (payload?: INotificationData<unknown>) => void
}

export abstract class AbstractStoryObject implements IStoryObject {
    public id = v4();

    public abstract icon: string;
    public abstract role: string;
    public abstract name: string;
    public abstract userDefinedProperties: any;
    public abstract isContentNode: boolean;
    public abstract childNetwork?: StoryGraph | undefined;
    public abstract content?: IContent | undefined;
    public abstract connectors: Map<string, IConnectorPort>;
    public abstract connections: IEdge[];
    public abstract metaData: IMetaData;
    public abstract parent?: string | undefined;
    public abstract renderingProperties?: IRenderingProperties;
    public abstract modifiers: IStoryModifier[];
    public abstract notificationCenter?: NotificationCenter;

    // various hooks
    public abstract removeConnections(edges: IEdge[]): void    
    public abstract addConnections(edges: IEdge[]): void 
    // abstract bindTo(notificationCenter: NotificationCenter): void 
    public abstract isBound(): void
    // public abstract isBinding(): void
    public abstract mountTo(): void
    // public abstract isMounting(): void
    public abstract isMounted(): void
    public abstract subscriptions: Subscription[];
    
    public abstract addModifier(modifier: IStoryModifier) : void
    public abstract removeModifier(modifier: IStoryModifier) : void


    private __state: StoryObjectState = "NEW"
    private __allowedTransistions: TransistionEdge[] = [
        {
            from: NEW,
            to: BINDING,
            hook: () => this.isBinding()
        },
        {
            from: BINDING,
            to: BOUND,
            hook: () => this.isBound()
        },
        {
            from: BOUND,
            to: MOUNTING,
            hook: () => this.isMounting()
        },
        {
            from: MOUNTING,
            to: MOUNTED,
            hook: () => this.isMounted()
        },
        {
            from: MOUNTED,
            to: REMOVING,
            // hook: this.isMounted
        },

    ];
    
    private __advanceState(to: StoryObjectState) {
        const allowedEdge = this.__allowedTransistions.find((v) => {
            // see wether current configuration and requested transistion is in array
            return v.to === to && v.from === this.__state;
        });

        console.log("State transistion", to, this.__state, allowedEdge);
        
        if (allowedEdge !== undefined) {
            this.__state = allowedEdge.to;
            if (allowedEdge.hook !== undefined) allowedEdge.hook();
        }

        console.log("New state", this.__state);
    }

    private isBinding(): void {
        // do check ups here!
        console.log("I'am binding");
        this.__advanceState(BOUND);
    }

    private isMounting(): void {
        // do check ups here!
        this.__advanceState(MOUNTED);
    }

    public bindTo(notificationCenter: NotificationCenter): void {
        this.notificationCenter = notificationCenter;
        // bind connectors
        this.connectors.forEach((connector) => {
            // Logger.info("binding", connector, notificationCenter);
            (connector as ConnectorPort).bindTo(notificationCenter, this.id);
        });
        // subscribe all hooks
        this.subscriptions.forEach(sub => {
            this.notificationCenter?.subscribe(sub.id, sub.hook);
        });
        this.__advanceState(BINDING);
    }


}
