import { IRegistry, StoryObject } from "../..";
import { PlugInManifest } from "./PlugInManifest";

export class VReg implements IRegistry {
    public __registry: Map<string, StoryObject>;
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
    
    public set<T>(id: string, value: StoryObject) : void {
        this.__registry.set(id, value);
    }

    public has(id: string) : boolean {
        return this.__registry.has(id);
    }

    public get(id: string) : StoryObject | undefined {
        return this.__registry.get(id);
    }

    public rm(id: string) : boolean {
        return this.__registry.delete(id);
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
        }, [] as StoryObject[]).
        map(plugIn => ({
            name: plugIn.name,
            id: plugIn.id,
            version: "plugIn.package.version",
            url: 'plugIn.package.baseURL + "/" + plugIn.package.version + "/" + plugIn.name'
        }))
    }

    public get entries(): StoryObject[] {
        return Array.from(this.__registry).map(e => e[1]);
    }
}

createModelSchema(VReg, {
    __registry: map(custom(
        (v, k, o) => {
            const _schema = getDefaultModelSchema(v.constructor);
            if (!_schema) throw("no schema available for " + v.contructor.name);
            return serialize(_schema, v);
        },
        (j, c, cb) => {
            return deserialize(StoryObjectSchema, j, cb)
        }
    )),
    entrypoint: primitive()
});
