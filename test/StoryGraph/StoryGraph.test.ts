import { assert } from "chai";
import { StoryGraph } from "../../src/index";
import { IRegistry } from "../../src/StoryGraph/IRegistry";
import { IStoryObject } from "../../src/StoryGraph/IStoryObject";

describe('StoryGraph', () => {
    const makeStoryObject = (id: string, name: string, isContentNode: boolean): IStoryObject => ({
        id: id,
        name: name,
        incoming: [],
        outgoing: [],
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
        it('should connect two nodes in a graph', () => {
            story.childNetwork?.connect(
                reg,
                [{
                    from: ernie.id,
                    to: bert.id,
                    parent: story.childNetwork
                }]
            )

            assert(story.childNetwork?.edges === [
                {
                    from: ernie.id,
                    to: bert.id,
                    parent: story.childNetwork
                }
            ])
        });
    });
 
});
