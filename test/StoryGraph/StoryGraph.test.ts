import { assert } from "chai";
import StoryGraph from "../../src/index";

describe('StoryGraph', () => {
    describe('constructor', () => {
        it('should instantiate', () => {
            let story = new StoryGraph();
            
            assert.exists(story, 'instantiated');
        });
        it('should accept a template graph');
    });
    
    describe('.connect', () => {
        it('should connect two nodes in a graph');
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
});
