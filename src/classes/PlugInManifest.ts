import { VReg } from "./VReg";

/**
 * Basically a list of the PlugIns used in a story.
 */
export interface PlugInManifest {
    id: string;
    version: string;
    name: string;
    /**
     * Full URL for the specific PlugIn, composed of $pack-baseURL/$version/$plugin-id.js
     */
    url: string;
}
