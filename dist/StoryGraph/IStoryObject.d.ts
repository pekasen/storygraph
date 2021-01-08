/**P. Kessling *Hamburg, September 2020*/
import { IContent } from "./IContent";
import { IMetaData } from "./IMetaData";
import { IEdge } from "./IEdge";
import { StoryGraph } from "./StoryGraph";
import { IRenderingProperties } from "./IRenderingProperties";
import { IStoryModifier } from "./IStoryModifier";
import { IConnectorPort } from './IConnectorPort';
/**
 *
 */
export interface IStoryObject {
    /**
     *
     */
    icon: string;
    /**
     *
     */
    id: string;
    /**
     * string indicating which class this object belongs to
     * when rehydrated from persistance
     */
    role: string;
    /**
     * user-settable name
     */
    name: string;
    /**
     *
     */
    userDefinedProperties: any;
    /**
     *
     */
    isContentNode: boolean;
    /**
     *
     */
    childNetwork?: StoryGraph;
    /**
     *
     */
    content?: IContent;
    /**
     *
     */
    connectors: Map<string, IConnectorPort>;
    /**
     *
     */
    connections: IEdge[];
    /**
     *
     */
    metaData: IMetaData;
    /**
     *
     */
    parent?: string;
    /**
     *
     */
    renderingProperties?: IRenderingProperties;
    /**
     *
     */
    modifiers: IStoryModifier[];
    removeConnections(edges: IEdge[]): void;
}
//# sourceMappingURL=IStoryObject.d.ts.map