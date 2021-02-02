"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isConnectorDirection = exports.isConnectorType = void 0;
function isConnectorType(arg) {
    return arg === "flow" || arg === "reaction" || arg === "data";
}
exports.isConnectorType = isConnectorType;
function isConnectorDirection(arg) {
    return arg === "in" || arg === "out";
}
exports.isConnectorDirection = isConnectorDirection;
//# sourceMappingURL=IConnectorPort.js.map