"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactionConnectorOutPort = exports.ReactionConnectorInPort = exports.DataConnectorOutPort = exports.DataConnectorInPort = exports.FlowConnectorOutPort = exports.FlowConnectorInPort = exports.ConnectorPort = void 0;
const IConnectorPort_1 = require("./IConnectorPort");
const uuid_1 = require("uuid");
const __1 = require("..");
class ConnectorPort {
    constructor(type, direction) {
        this.id = uuid_1.v4();
        // guards, assemble!
        if (!IConnectorPort_1.isConnectorType(type))
            throw (`${type} is not a ConnectorType`);
        if (!IConnectorPort_1.isConnectorDirection(direction))
            throw (`${direction} is not a ConnectorDirection`);
        this.type = type;
        this.direction = direction;
        this.connections = [];
    }
    get name() {
        return [this.type, this.direction].join("-");
    }
    reverse() {
        const _dir = (this.direction === "in") ? "out" : "in";
        return new ConnectorPort(this.type, _dir);
    }
    /**
     * Binds the connector to a notification center.
     * This method binds callbacks for both addition and deletion of edges.
     * Overwrite in sub-methods if necessary.
     * @param notificationCenter
     */
    bindTo(notificationCenter) {
        if (this.notificationCenter === undefined || this.notificationCenter !== notificationCenter) {
            this.notificationCenter = notificationCenter;
            this.notificationCenter.subscribe(this.id, (payload) => {
                if (payload && payload.data) {
                    if (payload.data.remove !== undefined) {
                        this.removeConnections(payload.data.remove);
                    }
                    if (payload.data.add !== undefined) {
                        this.addConnections(payload.data.add);
                    }
                }
            });
        }
    }
    addConnections(edges) {
        this.connections.push(...edges);
    }
    removeConnections(edges) {
        edges.forEach((edge) => {
            const index = this.connections.findIndex(_edge => _edge.id === edge.id);
            if (index !== -1) {
                this.connections.splice(index, 1);
            }
        });
    }
}
exports.ConnectorPort = ConnectorPort;
class FlowConnectorInPort extends ConnectorPort {
    constructor() {
        super("flow", "in");
        this.type = "flow";
        this.direction = "in";
    }
}
exports.FlowConnectorInPort = FlowConnectorInPort;
class FlowConnectorOutPort extends ConnectorPort {
    constructor() {
        super("flow", "out");
        this.type = "flow";
        this.direction = "out";
    }
}
exports.FlowConnectorOutPort = FlowConnectorOutPort;
class DataConnectorInPort extends ConnectorPort {
    constructor(name, callback) {
        super("data", "in");
        this.type = "data";
        this.direction = "in";
        this._name = name;
        this.callback = callback;
    }
    handlePull(data) {
        this.callback(data);
    }
    get name() {
        return this._name;
    }
}
exports.DataConnectorInPort = DataConnectorInPort;
class DataConnectorOutPort extends ConnectorPort {
    constructor(name, callback) {
        super("data", "out");
        this.type = "data";
        this.direction = "out";
        this._name = name;
        this.callback = callback;
    }
    pull() {
        return this.callback();
    }
    get name() {
        return this._name;
    }
}
exports.DataConnectorOutPort = DataConnectorOutPort;
class ReactionConnectorInPort extends ConnectorPort {
    constructor(name, handler) {
        super("reaction", "in");
        this.type = "reaction";
        this.direction = "in";
        this._name = name !== null && name !== void 0 ? name : "reaction-in";
        this._handleNotification = handler;
    }
    bindTo(notificationCenter) {
        super.bindTo(notificationCenter);
        notificationCenter.subscribe(this.id, (payload) => {
            if (payload !== undefined && payload.type === "reaction")
                this.handleNotification();
        });
    }
    get handleNotification() {
        return this._handleNotification;
    }
    set handleNotification(handler) {
        if (typeof handler === "function") {
            this._handleNotification = handler;
        }
    }
    get name() {
        return this._name;
    }
    set name(newName) {
        this._name = newName;
    }
}
exports.ReactionConnectorInPort = ReactionConnectorInPort;
class ReactionConnectorOutPort extends ConnectorPort {
    constructor(name) {
        super("reaction", "out");
        this.type = "reaction";
        this.direction = "out";
        this._name = name !== null && name !== void 0 ? name : "reaction-out";
    }
    notify() {
        const payload = {
            type: "reaction",
            source: this,
            data: undefined
        };
        this.connections.forEach((edge) => {
            var _a;
            const [, portId] = __1.StoryGraph.parseNodeId(edge.to);
            (_a = this.notificationCenter) === null || _a === void 0 ? void 0 : _a.push(portId, payload);
        });
    }
    get name() {
        return this._name;
    }
    set name(newName) {
        this._name = newName;
    }
}
exports.ReactionConnectorOutPort = ReactionConnectorOutPort;
//# sourceMappingURL=ConnectorPort.js.map