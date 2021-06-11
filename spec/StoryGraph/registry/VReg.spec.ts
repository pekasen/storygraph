import { assert } from "chai";
import { IConnectorPort, IEdge, IMetaData, IRenderingProperties, IStoryModifier, StoryGraph, StoryObject, Subscription } from "storygraph";
import { VReg, PlugIn, PlugInPack } from "../../../src";
import { IContent } from "../../../src/StoryGraph/interfaces/IContent";
import { NotificationCenter } from "../../../src/StoryGraph/NotificationCenter";

class Dummy extends StoryObject {
    icon: string;
    role: string;
    name: string;
    userDefinedProperties: any;
    isContentNode: boolean;
    childNetwork?: StoryGraph;
    content?: IContent;
    connectors: Map<string, IConnectorPort>;
    connections: IEdge[];
    metaData: IMetaData;
    parent?: string;
    renderingProperties?: IRenderingProperties;
    modifiers: IStoryModifier[];
    notificationCenter?: NotificationCenter;
    removeConnections(edges: IEdge[]): void {
        throw new Error("Method not implemented.");
    }
    addConnections(edges: IEdge[]): void {
        throw new Error("Method not implemented.");
    }
    isBound(): void {
        throw new Error("Method not implemented.");
    }
    mountTo(): void {
        throw new Error("Method not implemented.");
    }
    isMounted(): void {
        throw new Error("Method not implemented.");
    }
    subscriptions: Subscription[];

}

describe("VReg", () => {
    describe("basic testing", () => {  
        describe("constructor()", () => {
            it("should be a singleton", () => {
                const instance1 = VReg.instance();
                const instance2 = VReg.instance();
                
                assert.deepEqual(instance1, instance2);
            });
        });
        describe("getManifest()", () => {
            it("should include only unique keys", () => {
                const { r, ps }: { r: VReg; ps: PlugIn[]; } = setupVReg();

                assert.includeMembers(
                    r.getManifest().map(e => e.id),
                    ps.map(e => e.id)
                );
            });
            it("should flatten a PlugIn to PlugInManifest", () => {
                const { r, ps }: { r: VReg; ps: PlugIn[]; } = setupVReg();
    
                assert.includeDeepMembers(
                    r.getManifest(),
                    ps.map(plugIn => ({
                        name: plugIn.name,
                        id: plugIn.id,
                        version: plugIn.package.version,
                        url: plugIn.package.baseURL + "/" + plugIn.package.version + "/" + plugIn.name
                    }))
                );
            });
        });
    });
});

function setupVReg() {
    const r = VReg.instance();
    const keys = ["A", "B", "C", "D", "F", "G"];
    const pp: PlugInPack = {
        baseURL: "https://cdn.something.somewhere/pp",
        version: "1.0.0",
        name: "somepp",
        publisher: {
            id: "abcdefg.org",
            name: "ABCDEFG.org",
            mail: "hello@abcedfg.org"
        },
        __index: keys
    };
    const ps: PlugIn[] = keys.map(e => ({
        name: e,
        id: e,
        package: pp,
        constructor: Dummy
    }));

    new Array(128).
        fill(0).
        map((__, index) => ({
            id: String(index),
            value: ps[index % ps.length]
        })).
        forEach(e => r.set(e.id, e.value));
    return { r, ps };
}

