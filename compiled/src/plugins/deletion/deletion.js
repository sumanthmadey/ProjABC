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
Object.defineProperty(exports, "__esModule", { value: true });
var plugin_base_1 = require("../plugin-base");
var selection_1 = require("../selection/selection");
var models_1 = require("cwlts/models");
var DeletionPlugin = /** @class */ (function (_super) {
    __extends(DeletionPlugin, _super);
    function DeletionPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.boundDeleteFunction = _this.onDelete.bind(_this);
        return _this;
    }
    DeletionPlugin.prototype.afterRender = function () {
        this.attachDeleteBehavior();
    };
    DeletionPlugin.prototype.onEditableStateChange = function (enable) {
        if (enable) {
            this.attachDeleteBehavior();
        }
        else {
            this.detachDeleteBehavior();
        }
    };
    DeletionPlugin.prototype.attachDeleteBehavior = function () {
        this.detachDeleteBehavior();
        window.addEventListener("keyup", this.boundDeleteFunction, true);
    };
    DeletionPlugin.prototype.detachDeleteBehavior = function () {
        window.removeEventListener("keyup", this.boundDeleteFunction, true);
    };
    DeletionPlugin.prototype.onDelete = function (ev) {
        if (ev.which !== 8 && ev.which !== 46 || !(ev.target instanceof SVGElement)) {
            return;
        }
        this.deleteSelection();
    };
    DeletionPlugin.prototype.deleteSelection = function () {
        var _this = this;
        var selection = this.workflow.getPlugin(selection_1.SelectionPlugin);
        if (!selection || !this.workflow.editingEnabled) {
            return;
        }
        var selected = selection.getSelection();
        selected.forEach(function (type, id) {
            if (type === "node") {
                var model = _this.workflow.model.findById(id);
                if (model instanceof models_1.StepModel) {
                    _this.workflow.model.removeStep(model);
                    selection.clearSelection();
                }
                else if (model instanceof models_1.WorkflowInputParameterModel) {
                    _this.workflow.model.removeInput(model);
                    selection.clearSelection();
                }
                else if (model instanceof models_1.WorkflowOutputParameterModel) {
                    _this.workflow.model.removeOutput(model);
                    selection.clearSelection();
                }
            }
            else {
                var _a = __read(id.split(selection_1.SelectionPlugin.edgePortsDelimiter), 2), source = _a[0], destination = _a[1];
                _this.workflow.model.disconnect(source, destination);
                selection.clearSelection();
            }
        });
    };
    DeletionPlugin.prototype.destroy = function () {
        this.detachDeleteBehavior();
    };
    return DeletionPlugin;
}(plugin_base_1.PluginBase));
exports.DeletionPlugin = DeletionPlugin;
//# sourceMappingURL=deletion.js.map