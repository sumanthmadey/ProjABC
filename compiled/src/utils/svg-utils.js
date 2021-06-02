"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SVGUtils = /** @class */ (function () {
    function SVGUtils() {
    }
    SVGUtils.matrixToTransformAttr = function (matrix) {
        var a = matrix.a, b = matrix.b, c = matrix.c, d = matrix.d, e = matrix.e, f = matrix.f;
        return "matrix(" + a + ", " + b + ", " + c + ", " + d + ", " + e + ", " + f + ")";
    };
    SVGUtils.createMatrix = function () {
        return document.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGMatrix();
    };
    return SVGUtils;
}());
exports.SVGUtils = SVGUtils;
//# sourceMappingURL=svg-utils.js.map