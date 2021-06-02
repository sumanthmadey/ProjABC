"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Geometry = /** @class */ (function () {
    function Geometry() {
    }
    Geometry.distance = function (x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    };
    Geometry.getTransformToElement = function (from, to) {
        var getPosition = function (node, addE, addF) {
            if (addE === void 0) { addE = 0; }
            if (addF === void 0) { addF = 0; }
            if (!node.ownerSVGElement) {
                // node is the root svg element
                var matrix = node.createSVGMatrix();
                matrix.e = addE;
                matrix.f = addF;
                return matrix;
            }
            else {
                // node still has parent elements
                var _a = node.transform.baseVal.getItem(0).matrix, e = _a.e, f = _a.f;
                return getPosition(node.parentNode, e + addE, f + addF);
            }
        };
        var toPosition = getPosition(to);
        var fromPosition = getPosition(from);
        var result = from.ownerSVGElement.createSVGMatrix();
        result.e = toPosition.e - fromPosition.e;
        result.f = toPosition.f - fromPosition.f;
        return result.inverse();
    };
    return Geometry;
}());
exports.Geometry = Geometry;
//# sourceMappingURL=geometry.js.map