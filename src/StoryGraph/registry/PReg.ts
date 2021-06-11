import { PlugIn } from "./PlugIn";
/**
 * Internal class, a singleton Registry, that holds constructors for PlugIns
 * @internal
 */
export class PReg {

    private __registry: Map<string, any>
    
    private static __instance: PReg | undefined;

    private constructor() {
        this.__registry = new Map<string, PlugIn>();
    }
    
    /**
     * Method to get that instance
     * @returns { PReg } PReg instance
     * @static
     */
    public static instance() : PReg {
        return PReg.__instance ?? new PReg();
    }

    /**
     * 
     * @param id { string } ID string to get
     * @returns { PlugIn | undefined } a PlugIn or undefined
     */
    public get(id: string) : PlugIn | undefined {
        if (this.__registry.has(id)) return this.__registry.get(id);
    }

    /**
     * Registers a PlugIn to a specified ID.
     * @param id { string } ID string to set
     * @param value { PlugIn } PlugIn to set to the specified ID
     */
    public set(id: string, value: PlugIn) : void {
        this.__registry.set(id, value);
    }

    /**
     * Method to see wether a ID is already registered
     * @param id { string } ID
     * @returns { boolean } Boolean indicating if ID is already registered
     */
    public has(id: string) : boolean {
        return this.__registry.has(id);
    }

    public forEach(callback: (element: PlugIn, key?: string, map?: Map<string, PlugIn>) => void) : void {
        this.__registry.forEach(callback);
    }

    public toArray(): PlugIn[] {
        return Array.from(this.__registry).map(([_, val]) => val);
    }
}
