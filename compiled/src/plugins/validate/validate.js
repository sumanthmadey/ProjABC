"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var plugin_base_1 = require("../plugin-base");
var SVGValidatePlugin = /** @class */ (function (_super) {
    __extends(SVGValidatePlugin, _super);
    function SVGValidatePlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.modelDisposers = [];
        /** Map of CSS classes attached by this plugin */
        _this.css = {
            plugin: "__plugin-validate",
            invalid: "__validate-invalid"
        };
        return _this;
    }
    SVGValidatePlugin.prototype.registerWorkflow = function (workflow) {
        _super.prototype.registerWorkflow.call(this, workflow);
        // add plugin specific class to the svgRoot for scoping
        this.workflow.svgRoot.classList.add(this.css.plugin);
    };
    SVGValidatePlugin.prototype.afterModelChange = function () {
        this.disposeModelListeners();
        // add listener for all subsequent edge validation
        var update = this.workflow.model.on("connections.updated", this.renderEdgeValidation.bind(this));
        var create = this.workflow.model.on("connection.create", this.renderEdgeValidation.bind(this));
        this.modelDisposers.concat([update.dispose, create.dispose]);
    };
    SVGValidatePlugin.prototype.destroy = function () {
        this.disposeModelListeners();
    };
    SVGValidatePlugin.prototype.afterRender = function () {
        // do initial validation rendering for edges
        this.renderEdgeValidation();
    };
    SVGValidatePlugin.prototype.onEditableStateChange = function (enabled) {
        if (enabled) {
            // only show validation if workflow is editable
            this.renderEdgeValidation();
        }
        else {
            this.removeClasses(this.workflow.workflow.querySelectorAll(".edge"));
        }
    };
    SVGValidatePlugin.prototype.disposeModelListeners = function () {
        try {
            for (var _a = __values(this.modelDisposers), _b = _a.next(); !_b.done; _b = _a.next()) {
                var disposeListener = _b.value;
                disposeListener();
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_1) throw e_1.error; }
        }
        this.modelDisposers = [];
        var e_1, _c;
    };
    SVGValidatePlugin.prototype.removeClasses = function (edges) {
        try {
            // remove validity class on all edges
            for (var edges_1 = __values(edges), edges_1_1 = edges_1.next(); !edges_1_1.done; edges_1_1 = edges_1.next()) {
                var e = edges_1_1.value;
                e.classList.remove(this.css.invalid);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (edges_1_1 && !edges_1_1.done && (_a = edges_1.return)) _a.call(edges_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        var e_2, _a;
    };
    SVGValidatePlugin.prototype.renderEdgeValidation = function () {
        var _this = this;
        var graphEdges = this.workflow.workflow.querySelectorAll(".edge");
        this.removeClasses(graphEdges);
        // iterate through all modal connections
        this.workflow.model.connections.forEach(function (e) {
            // if the connection isn't valid (should be colored on graph)
            if (!e.isValid) {
                try {
                    // iterate through edges on the svg
                    for (var graphEdges_1 = __values(graphEdges), graphEdges_1_1 = graphEdges_1.next(); !graphEdges_1_1.done; graphEdges_1_1 = graphEdges_1.next()) {
                        var ge = graphEdges_1_1.value;
                        var sourceNodeID = ge.getAttribute("data-source-connection");
                        var destinationNodeID = ge.getAttribute("data-destination-connection");
                        // compare invalid edge source/destination with svg edge
                        if (e.source.id === sourceNodeID && e.destination.id === destinationNodeID) {
                            // if its a match, tag it with the appropriate class and break from the loop
                            ge.classList.add(_this.css.invalid);
                            break;
                        }
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (graphEdges_1_1 && !graphEdges_1_1.done && (_a = graphEdges_1.return)) _a.call(graphEdges_1);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
            }
            var e_3, _a;
        });
    };
    return SVGValidatePlugin;
}(plugin_base_1.PluginBase));
exports.SVGValidatePlugin = SVGValidatePlugin;
//# sourceMappingURL=validate.js.map