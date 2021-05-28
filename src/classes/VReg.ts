import { PlugIn } from "./PlugIn";
import { PlugInManifest } from "./PlugInManifest";

export class VReg {
    private __registry: Map<string, PlugIn>;
    private static __instance: VReg | undefined;

    private constructor() {
        this.__registry = new Map();
    }

    public static instance() : VReg {
        if (VReg.__instance === undefined) {
            VReg.__instance = new VReg();
        }
        return VReg.__instance!;
    }
    
    public set(id: string, value: PlugIn) : void {
        this.__registry.set(id, value);
    }

    public has(id: string) : boolean {
        return this.__registry.has(id);
    }

    public getManifest() : PlugInManifest[] {
        // throw new Error("not implemented yet!");
        return Array.
        from(this.__registry.values()).
        // map(e => e.id).
        reduce((p, c) => {
            if (p.indexOf(c) !== -1) {
                return p
            } else {
                p.push(c);
                return p;
            }
        }, [] as PlugIn[]).
        map(plugIn => ({
            name: plugIn.name,
            id: plugIn.id,
            version: plugIn.package.version,
            url: plugIn.package.baseURL + "/" + plugIn.package.version + "/" + plugIn.name
        }))
    }
}
