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
var SVGEdgeHoverPlugin = /** @class */ (function (_super) {
    __extends(SVGEdgeHoverPlugin, _super);
    function SVGEdgeHoverPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.boundEdgeEnterFunction = _this.onEdgeEnter.bind(_this);
        _this.modelListener = {
            dispose: function () { return void 0; }
        };
        return _this;
    }
    SVGEdgeHoverPlugin.prototype.afterRender = function () {
        this.attachEdgeHoverBehavior();
    };
    SVGEdgeHoverPlugin.prototype.destroy = function () {
        this.detachEdgeHoverBehavior();
        this.modelListener.dispose();
    };
    SVGEdgeHoverPlugin.prototype.attachEdgeHoverBehavior = function () {
        this.detachEdgeHoverBehavior();
        this.workflow.workflow.addEventListener("mouseenter", this.boundEdgeEnterFunction, true);
    };
    SVGEdgeHoverPlugin.prototype.detachEdgeHoverBehavior = function () {
        this.workflow.workflow.removeEventListener("mouseenter", this.boundEdgeEnterFunction, true);
    };
    SVGEdgeHoverPlugin.prototype.onEdgeEnter = function (ev) {
        var _this = this;
        // Ignore if we did not enter an edge
        if (!ev.srcElement.classList.contains("edge"))
            return;
        var target = ev.srcElement;
        var tipEl;
        var onMouseMove = (function (ev) {
            var coords = _this.workflow.transformScreenCTMtoCanvas(ev.clientX, ev.clientY);
            tipEl.setAttribute("x", String(coords.x));
            tipEl.setAttribute("y", String(coords.y - 16));
        }).bind(this);
        var onMouseLeave = (function (ev) {
            tipEl.remove();
            target.removeEventListener("mousemove", onMouseMove);
            target.removeEventListener("mouseleave", onMouseLeave);
        }).bind(this);
        this.modelListener = this.workflow.model.on("connection.remove", function (source, destination) {
            if (!tipEl)
                return;
            var _a = __read(tipEl.getAttribute("data-source-destination").split("$!$"), 2), tipS = _a[0], tipD = _a[1];
            if (tipS === source.connectionId && tipD === destination.connectionId) {
                tipEl.remove();
            }
        });
        var sourceNode = target.getAttribute("data-source-node");
        var destNode = target.getAttribute("data-destination-node");
        var sourcePort = target.getAttribute("data-source-port");
        var destPort = target.getAttribute("data-destination-port");
        var sourceConnect = target.getAttribute("data-source-connection");
        var destConnect = target.getAttribute("data-destination-connection");
        var sourceLabel = sourceNode === sourcePort ? sourceNode : sourceNode + " (" + sourcePort + ")";
        var destLabel = destNode === destPort ? destNode : destNode + " (" + destPort + ")";
        var coords = this.workflow.transformScreenCTMtoCanvas(ev.clientX, ev.clientY);
        var ns = "http://www.w3.org/2000/svg";
        tipEl = document.createElementNS(ns, "text");
        tipEl.classList.add("label");
        tipEl.classList.add("label-edge");
        tipEl.setAttribute("x", String(coords.x));
        tipEl.setAttribute("y", String(coords.y));
        tipEl.setAttribute("data-source-destination", sourceConnect + "$!$" + destConnect);
        tipEl.innerHTML = sourceLabel + " → " + destLabel;
        this.workflow.workflow.appendChild(tipEl);
        target.addEventListener("mousemove", onMouseMove);
        target.addEventListener("mouseleave", onMouseLeave);
    };
    return SVGEdgeHoverPlugin;
}(plugin_base_1.PluginBase));
exports.SVGEdgeHoverPlugin = SVGEdgeHoverPlugin;
//# sourceMappingURL=edge-hover.js.map