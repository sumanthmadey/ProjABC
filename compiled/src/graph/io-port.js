"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IOPort = /** @class */ (function () {
    function IOPort() {
    }
    /**
     * @param x1
     * @param y1
     * @param x2
     * @param y2
     * @param {"right" | "left" | string} forceDirection
     * @returns {string}
     */
    IOPort.makeConnectionPath = function (x1, y1, x2, y2, forceDirection) {
        if (forceDirection === void 0) { forceDirection = "right"; }
        if (!forceDirection) {
            return "M " + x1 + " " + y1 + " C " + (x1 + x2) / 2 + " " + y1 + " " + (x1 + x2) / 2 + " " + y2 + " " + x2 + " " + y2;
        }
        else if (forceDirection === "right") {
            var outDir = x1 + Math.abs(x1 - x2) / 2;
            var inDir = x2 - Math.abs(x1 - x2) / 2;
            return "M " + x1 + " " + y1 + " C " + outDir + " " + y1 + " " + inDir + " " + y2 + " " + x2 + " " + y2;
        }
        else if (forceDirection === "left") {
            var outDir = x1 - Math.abs(x1 - x2) / 2;
            var inDir = x2 + Math.abs(x1 - x2) / 2;
            return "M " + x1 + " " + y1 + " C " + outDir + " " + y1 + " " + inDir + " " + y2 + " " + x2 + " " + y2;
        }
    };
    IOPort.radius = 7;
    return IOPort;
}());
exports.IOPort = IOPort;
//# sourceMappingURL=io-port.js.map