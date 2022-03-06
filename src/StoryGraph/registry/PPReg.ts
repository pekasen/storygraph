import { PlugInPack, PReg } from "../..";
import { PlugIn } from "./PlugIn";

export class PPReg {

    private __registry: Map<string, any>
    
    private static __instance: PPReg | undefined;

    constructor() {
        this.__registry = new Map<string, PlugIn>();
        
        if (PPReg.__instance === undefined) {
            PPReg.__instance = this

            return this
        } else {
            return PPReg.__instance
        }
    }
    
    public static instance() {
        return PPReg.__instance ?? new PPReg();
    }

    public get(id: string): PlugInPack | undefined {
        if (this.__registry.has(id)) return this.__registry.get(id);
    }

    public set(id: string, value: PlugInPack) {
        this.__registry.set(id, value);
        // automagically fill the PReg
        value.__index.forEach(plugin => {
            PReg.instance().set(plugin.id, plugin);
            console.log("Setting", plugin.id);
        });
    }
}
