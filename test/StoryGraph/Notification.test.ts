import { assert } from "chai";
import { NotificationCenter } from "../../src/StoryGraph/NotificationCenter";

describe("Notification Center", () => {
    const center = new NotificationCenter();
    describe(".subscribe", () => {
        it("should accept a channel id and a callback", () => {
            assert.equal(center.subscribe("test1", () => console.log("Hello!")), true);
        });
        it("should return true on succesful subscription");
        it("should return false on a rejected subscription");
        
        it("should reject subscriptions if no callback is supplied");
    });
    describe(".unsubscribe", () => {
        it("should accept a channel id and a callback", () => {
            const center = new NotificationCenter();
            const tester = () => console.log("");
            center.subscribe("test", tester);

            assert.equal(
                center.unsubscribe("test", tester),
                true
            )
        });
        it("should reject unsubscibtion if id or callback are not present");
    });
    describe(".push", () => {
        it("should return false if channel not present", () => {
            const center = new NotificationCenter();
            let counter = 0;
            center.subscribe("counter", () => {
                counter += 1;
            });
            center.push("counter");
            assert.equal(counter, 1);
        });
        it("");
    });
});