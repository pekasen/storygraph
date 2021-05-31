import { assert } from "chai";
import { PReg } from "../../src";

/**
  * Specification und unit tests for the PlugInRegistry class _PReg_
  */
describe("PReg", () => {
    describe("constructor()", () => {
        it("should be a singleton", () => {
            const instance1 = PReg.instance();
            const instance2 = PReg.instance();
            
            assert.deepEqual(instance1, instance2);
        });
    });
    it("should smell good");
});
