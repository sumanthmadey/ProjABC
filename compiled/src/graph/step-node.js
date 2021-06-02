"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
var edge_1 = require("./edge");
var graph_node_1 = require("./graph-node");
var template_parser_1 = require("./template-parser");
var StepNode = /** @class */ (function () {
    function StepNode(element, stepModel) {
        this.stepEl = element;
        this.svg = element.ownerSVGElement;
        this.model = stepModel;
    }
    StepNode.prototype.update = function () {
        var tpl = graph_node_1.GraphNode.makeTemplate(this.model);
        var el = template_parser_1.TemplateParser.parse(tpl);
        this.stepEl.innerHTML = el.innerHTML;
        // Reposition all edges
        var incomingEdges = this.svg.querySelectorAll(".edge[data-destination-node=\"" + this.model.connectionId + "\"]");
        var outgoingEdges = this.svg.querySelectorAll(".edge[data-source-node=\"" + this.model.connectionId + "\"]");
        try {
            for (var _a = __values(__spread(incomingEdges, outgoingEdges)), _b = _a.next(); !_b.done; _b = _a.next()) {
                var edge = _b.value;
                edge_1.Edge.spawnBetweenConnectionIDs(this.svg.querySelector(".workflow"), edge.getAttribute("data-source-connection"), edge.getAttribute("data-destination-connection"));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_1) throw e_1.error; }
        }
        console.log("Should redraw input port", incomingEdges);
        var e_1, _c;
    };
    return StepNode;
}());
exports.StepNode = StepNode;
//# sourceMappingURL=step-node.js.map