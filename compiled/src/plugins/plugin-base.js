"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PluginBase = /** @class */ (function () {
    function PluginBase() {
    }
    PluginBase.prototype.registerWorkflow = function (workflow) {
        this.workflow = workflow;
    };
    PluginBase.prototype.registerOnBeforeChange = function (fn) {
        this.onBeforeChange = fn;
    };
    PluginBase.prototype.registerOnAfterChange = function (fn) {
        this.onAfterChange = fn;
    };
    PluginBase.prototype.registerOnAfterRender = function (fn) {
        this.onAfterRender = fn;
    };
    return PluginBase;
}());
exports.PluginBase = PluginBase;
//# sourceMappingURL=plugin-base.js.map