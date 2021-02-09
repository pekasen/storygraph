"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationCenter = void 0;
class NotificationCenter {
    constructor() {
        this._callbacks = new Map();
    }
    subscribe(channel, callback) {
        // type guard callback
        if (typeof callback === "function") {
            // check wether channel exists
            if (this._callbacks.has(channel)) {
                // put cb in stack
                this._callbacks.get(channel).push(callback);
                return true;
            }
            else {
                // create new channel
                this._callbacks.set(channel, [callback]);
                return true;
            }
        }
        return false;
    }
    unsubscribe(channel, callback) {
        if (typeof callback === "function") {
            if (this._callbacks.has(channel)) {
                const stack = this._callbacks.get(channel);
                const index = stack === null || stack === void 0 ? void 0 : stack.indexOf(callback);
                if (index !== undefined && index !== -1) {
                    stack === null || stack === void 0 ? void 0 : stack.splice(index, 1);
                    return true;
                }
            }
        }
        return false;
    }
    push(channel, payload) {
        if (this._callbacks.has(channel)) {
            return this._callbacks.
                get(channel).
                map(e => {
                e(payload);
                return true;
            }).
                reduce((p, v) => (p && v), true);
        }
        else
            return false;
    }
    get channels() {
        return Array.from(this._callbacks.keys());
    }
}
exports.NotificationCenter = NotificationCenter;
//# sourceMappingURL=NotificationCenter.js.map