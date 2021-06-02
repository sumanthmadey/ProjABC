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
Object.defineProperty(exports, "__esModule", { value: true });
var plugin_base_1 = require("../plugin-base");
var ZoomPlugin = /** @class */ (function (_super) {
    __extends(ZoomPlugin, _super);
    function ZoomPlugin() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ZoomPlugin.prototype.registerWorkflow = function (workflow) {
        _super.prototype.registerWorkflow.call(this, workflow);
        this.svg = workflow.svgRoot;
        this.dispose = this.attachWheelListener();
    };
    ZoomPlugin.prototype.attachWheelListener = function () {
        var _this = this;
        var handler = this.onMouseWheel.bind(this);
        this.svg.addEventListener("wheel", handler, true);
        return function () { return _this.svg.removeEventListener("wheel", handler, true); };
    };
    ZoomPlugin.prototype.onMouseWheel = function (event) {
        var scale = this.workflow.scale;
        var scaleUpdate = scale - event.deltaY / 500;
        var zoominOut = scaleUpdate < scale;
        var zoomingIn = scaleUpdate > scale;
        if (zoomingIn && this.workflow.maxScale < scaleUpdate) {
            return;
        }
        if (zoominOut && this.workflow.minScale > scaleUpdate) {
            return;
        }
        this.workflow.scaleAtPoint(scaleUpdate, event.clientX, event.clientY);
        event.stopPropagation();
    };
    ZoomPlugin.prototype.destroy = function () {
        if (typeof this.dispose === "function") {
            this.dispose();
        }
        this.dispose = undefined;
    };
    return ZoomPlugin;
}(plugin_base_1.PluginBase));
exports.ZoomPlugin = ZoomPlugin;
//# sourceMappingURL=zoom.js.map