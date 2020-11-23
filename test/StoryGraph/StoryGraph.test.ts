import { assert } from "chai";
import { IEdge, StoryGraph } from "../../src/index";
import { IRegistry } from "../../src/StoryGraph/IRegistry";
import { IStoryObject } from "../../src/StoryGraph/IStoryObject";

describe('StoryGraph', () => {
    const makeStoryObject = (id: string, name: string, isContentNode: boolean): IStoryObject => ({
        id: id,
        name: name,
        role: "none",
        connectors: [
            {
                name: "flow-in",
                type: "flow",
                direction: "in"
            },
            {
                name: "flow-out",
                type: "flow",
                direction: "out"
            }
        ],
        connections: [],
        isContentNode: (isContentNode) ?  isContentNode : true,
        userDefinedProperties: [],
        modifiers: [],
        metaData: {
            name: "Bert",
            createdAt: new Date(Date.now()),
            tags: []
        },
        childNetwork: undefined,
        renderingProperties: undefined
    })

    class Registry implements IRegistry {
        registry = new Map<string, IStoryObject>();

        register(value: IStoryObject) {
            this.registry.set(value.id, value);

            return true
        }

        deregister(value: string) {
            this.registry.delete(value);

            return true
        }

        getValue(forId: string) {
            return this.registry.get(forId)
        }

        overwrite = this.register
    }

    const reg = new Registry();

    const story: IStoryObject =  makeStoryObject("parent", "Bert", false);
    describe('constructor', () => {
       
        it('should instantiate', () => {
            story.childNetwork = new StoryGraph(story);

            assert(story.id === story.childNetwork.parent.id);
        });
        it('should accept a template graph');
    });
    
    const ernie = makeStoryObject("child1", "Ernie", true);
    const bert  = makeStoryObject("child2", "Bert", true);

    describe('.addNode', () => {
        it('accept a IStoryObject as new node', () => {
            story.childNetwork?.addNode(
                reg, ernie
            );
            story.childNetwork?.addNode(
                reg, bert
            );
            assert(story.childNetwork?.nodes.length === 2);
        });
    });

    describe('.connect', () => {
        const reg2 = new Registry()
        const ids = Array.from(Array(5))
        .map(() => String(Math.ceil(Math.random() * 5000)));

        console.log(ids);

        ids.map(e => makeStoryObject(e, e, true))
        .forEach(e => reg2.register(e));

        const story2: IStoryObject =  makeStoryObject("parent", "Bert", false);
        story2.childNetwork = new StoryGraph(story2);
        reg2.register(story2);
        it('should connect two nodes in a graph', () => {
            const edges: IEdge[] = ids.map(e => {
                return {
                    from: e + ".flow-out",
                    to: ids[Math.floor(Math.random() * ids.length)] + ".flow-in",
                    parent: story2.childNetwork,
                    id: "something"
                }
            });

            story2.childNetwork?.connect(reg2, edges);
        });
    });
});
