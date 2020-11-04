import { assert } from "chai";
import { beforeEach } from "mocha";
import StoryGraph from "../../src/index";

describe('StoryGraph', () => {
    describe('constructor', () => {
        beforeEach(() => {
            
        });
        it('should instantiate', () => {
            let story = new StoryGraph();

            assert.exists(story, 'instantiated');
        });
        it('should accept a template graph');
    });
    
    describe('.connect', () => {
        it('should connect two nodes in a graph'), () => {
            let nodes = StoryGraph.makeStoryObject();
            let story = new StoryGraph([nodes],[]);

            story.connect([]);
        };
    });
    
    describe('.makeGraph', () => {
        it('should construct a new graph');
    });
    
    describe('.merge', () => {
        it('should merge two graphs');
    });
    
    describe('.flatten', () => {
        it('should flatten nested graphs');
    });
    describe('.getNodes', () => {
        it('should traverse all subgraphs');
        it('should ')
    });
});
