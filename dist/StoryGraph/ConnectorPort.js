"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactionConnectorOutPort = exports.ReactionConnectorInPort = exports.DataConnectorOutPort = exports.DataConnectorInPort = exports.FlowConnectorOutPort = exports.FlowConnectorInPort = exports.ConnectorPort = void 0;
const IConnectorPort_1 = require("./IConnectorPort");
const uuid_1 = require("uuid");
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
    bindTo(notificationCenter) {
        this.notificationCenter = notificationCenter;
        this.notificationCenter.subscribe(this.id, (data) => {
            if (data.remove !== undefined) {
                this.removeConnections(data.remove);
            }
            if (data.add !== undefined) {
                this.addConnections(data.add);
            }
        });
    }
    addConnections(edges) {
        this.connections.push(...edges);
    }
    removeConnections(edges) {
        edges.forEach((edge) => {
            const index = this.connections.indexOf(edge);
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
        this.handleNotification = handler;
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
    constructor(name, notifier) {
        super("reaction", "out");
        this.type = "reaction";
        this.direction = "out";
        this._name = name !== null && name !== void 0 ? name : "reaction-out";
        this.notify = notifier;
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