import { PlugIn } from "./PlugIn";
import { Publisher } from "./Publisher";

export interface PlugInPack {
    /**
     * either a url to a external host or empty for a relative path? 
     */
    baseURL: string;
    /**
     * NPM-like version string
     */
    version: string;
    name:    string;
    publisher: Publisher;
    __index: PlugIn[];
}
