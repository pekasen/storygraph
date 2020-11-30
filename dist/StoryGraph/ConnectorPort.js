"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataConnectorOutPort = exports.DataConnectorInPort = exports.ConnectorPort = void 0;
class ConnectorPort {
    constructor(type, direction) {
        this.type = type;
        this.direction = direction;
    }
    get name() {
        return [this.type, this.direction].join("-");
    }
    reverse() {
        const _dir = (this.direction === "in") ? "out" : "in";
        return new ConnectorPort(this.type, _dir);
    }
}
exports.ConnectorPort = ConnectorPort;
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
