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
var SelectionPlugin = /** @class */ (function (_super) {
    __extends(SelectionPlugin, _super);
    function SelectionPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.selection = new Map();
        _this.cleanups = [];
        _this.selectionChangeCallbacks = [];
        _this.css = {
            selected: "__selection-plugin-selected",
            highlight: "__selection-plugin-highlight",
            fade: "__selection-plugin-fade",
            plugin: "__plugin-selection"
        };
        return _this;
    }
    SelectionPlugin.prototype.registerWorkflow = function (workflow) {
        var _this = this;
        _super.prototype.registerWorkflow.call(this, workflow);
        this.svg = this.workflow.svgRoot;
        this.svg.classList.add(this.css.plugin);
        var clickListener = this.onClick.bind(this);
        this.svg.addEventListener("click", clickListener);
        this.cleanups.push(function () { return _this.svg.removeEventListener("click", clickListener); });
    };
    SelectionPlugin.prototype.afterRender = function () {
        this.restoreSelection();
    };
    SelectionPlugin.prototype.afterModelChange = function () {
        if (typeof this.detachModelEvents === "function") {
            this.detachModelEvents();
        }
        this.detachModelEvents = this.bindModelEvents();
    };
    SelectionPlugin.prototype.destroy = function () {
        this.detachModelEvents();
        this.detachModelEvents = undefined;
        this.svg.classList.remove(this.css.plugin);
        try {
            for (var _a = __values(this.cleanups), _b = _a.next(); !_b.done; _b = _a.next()) {
                var fn = _b.value;
                fn();
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var e_1, _c;
    };
    SelectionPlugin.prototype.clearSelection = function () {
        var selection = this.svg.querySelectorAll("." + this.css.selected);
        var highlights = this.svg.querySelectorAll("." + this.css.highlight);
        try {
            for (var selection_1 = __values(selection), selection_1_1 = selection_1.next(); !selection_1_1.done; selection_1_1 = selection_1.next()) {
                var el = selection_1_1.value;
                el.classList.remove(this.css.selected);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (selection_1_1 && !selection_1_1.done && (_a = selection_1.return)) _a.call(selection_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        try {
            for (var highlights_1 = __values(highlights), highlights_1_1 = highlights_1.next(); !highlights_1_1.done; highlights_1_1 = highlights_1.next()) {
                var el = highlights_1_1.value;
                el.classList.remove(this.css.highlight);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (highlights_1_1 && !highlights_1_1.done && (_b = highlights_1.return)) _b.call(highlights_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        this.svg.classList.remove(this.css.fade);
        this.selection.clear();
        this.emitChange(null);
        var e_2, _a, e_3, _b;
    };
    SelectionPlugin.prototype.getSelection = function () {
        return this.selection;
    };
    SelectionPlugin.prototype.registerOnSelectionChange = function (fn) {
        this.selectionChangeCallbacks.push(fn);
    };
    SelectionPlugin.prototype.selectStep = function (stepID) {
        var query = "[data-connection-id=\"" + stepID + "\"]";
        var el = this.svg.querySelector(query);
        if (el) {
            this.materializeClickOnElement(el);
        }
    };
    SelectionPlugin.prototype.bindModelEvents = function () {
        var _this = this;
        var handler = function () { return _this.restoreSelection(); };
        var cleanup = [];
        var events = ["connection.create", "connection.remove"];
        var _loop_1 = function (ev) {
            var dispose = this_1.workflow.model.on(ev, handler);
            cleanup.push(function () { return dispose.dispose(); });
        };
        var this_1 = this;
        try {
            for (var events_1 = __values(events), events_1_1 = events_1.next(); !events_1_1.done; events_1_1 = events_1.next()) {
                var ev = events_1_1.value;
                _loop_1(ev);
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (events_1_1 && !events_1_1.done && (_a = events_1.return)) _a.call(events_1);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return function () { return cleanup.forEach(function (fn) { return fn(); }); };
        var e_4, _a;
    };
    SelectionPlugin.prototype.restoreSelection = function () {
        var _this = this;
        this.selection.forEach(function (type, connectionID) {
            if (type === "node") {
                var el = _this.svg.querySelector("[data-connection-id=\"" + connectionID + "\"]");
                if (el) {
                    _this.selectNode(el);
                }
            }
            else if (type === "edge") {
                var _a = __read(connectionID.split(SelectionPlugin.edgePortsDelimiter), 2), sID = _a[0], dID = _a[1];
                var edgeSelector = "[data-source-connection=\"" + sID + "\"][data-destination-connection=\"" + dID + "\"]";
                var edge = _this.svg.querySelector(edgeSelector);
                if (edge) {
                    _this.selectEdge(edge);
                }
            }
        });
    };
    SelectionPlugin.prototype.onClick = function (click) {
        var target = click.target;
        this.clearSelection();
        this.materializeClickOnElement(target);
    };
    SelectionPlugin.prototype.materializeClickOnElement = function (target) {
        var element;
        if (element = this.workflow.findParent(target, "node")) {
            this.selectNode(element);
            this.selection.set(element.getAttribute("data-connection-id"), "node");
            this.emitChange(element);
        }
        else if (element = this.workflow.findParent(target, "edge")) {
            this.selectEdge(element);
            var cid = [
                element.getAttribute("data-source-connection"),
                SelectionPlugin.edgePortsDelimiter,
                element.getAttribute("data-destination-connection")
            ].join("");
            this.selection.set(cid, "edge");
            this.emitChange(cid);
        }
    };
    SelectionPlugin.prototype.selectNode = function (element) {
        /**
         * Bring it to the front (there is no Z-index in svg so top element is the one latest in DOM)
         */
        element.parentElement.appendChild(element);
        // Fade everything on canvas so we can highlight only selected stuff
        this.svg.classList.add(this.css.fade);
        // Mark this node as selected
        element.classList.add(this.css.selected);
        // Highlight it in case there are no edges on the graph
        element.classList.add(this.css.highlight);
        // Take all adjacent edges since we should highlight them and move them above the other edges
        var nodeID = element.getAttribute("data-id");
        var adjacentEdges = this.svg.querySelectorAll(".edge[data-source-node=\"" + nodeID + "\"]," +
            (".edge[data-destination-node=\"" + nodeID + "\"]"));
        // Find the first node to be an anchor, so we can put all those edges just before that one.
        var firstNode = this.svg.getElementsByClassName("node")[0];
        try {
            for (var adjacentEdges_1 = __values(adjacentEdges), adjacentEdges_1_1 = adjacentEdges_1.next(); !adjacentEdges_1_1.done; adjacentEdges_1_1 = adjacentEdges_1.next()) {
                var edge = adjacentEdges_1_1.value;
                // Highlight each adjacent edge
                edge.classList.add(this.css.highlight);
                // Move it above other edges
                this.workflow.workflow.insertBefore(edge, firstNode);
                // Find all adjacent nodes so we can highlight them
                var sourceNodeID = edge.getAttribute("data-source-node");
                var destinationNodeID = edge.getAttribute("data-destination-node");
                var connectedNodes = this.svg.querySelectorAll(".node[data-id=\"" + sourceNodeID + "\"]," +
                    (".node[data-id=\"" + destinationNodeID + "\"]"));
                try {
                    // Highlight each adjacent node
                    for (var connectedNodes_1 = __values(connectedNodes), connectedNodes_1_1 = connectedNodes_1.next(); !connectedNodes_1_1.done; connectedNodes_1_1 = connectedNodes_1.next()) {
                        var n = connectedNodes_1_1.value;
                        n.classList.add(this.css.highlight);
                    }
                }
                catch (e_5_1) { e_5 = { error: e_5_1 }; }
                finally {
                    try {
                        if (connectedNodes_1_1 && !connectedNodes_1_1.done && (_a = connectedNodes_1.return)) _a.call(connectedNodes_1);
                    }
                    finally { if (e_5) throw e_5.error; }
                }
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (adjacentEdges_1_1 && !adjacentEdges_1_1.done && (_b = adjacentEdges_1.return)) _b.call(adjacentEdges_1);
            }
            finally { if (e_6) throw e_6.error; }
        }
        var e_6, _b, e_5, _a;
    };
    SelectionPlugin.prototype.selectEdge = function (element) {
        element.classList.add(this.css.highlight);
        element.classList.add(this.css.selected);
        var sourceNode = element.getAttribute("data-source-node");
        var destNode = element.getAttribute("data-destination-node");
        var sourcePort = element.getAttribute("data-source-port");
        var destPort = element.getAttribute("data-destination-port");
        var inputPortSelector = ".node[data-id=\"" + destNode + "\"] .input-port[data-port-id=\"" + destPort + "\"]";
        var outputPortSelector = ".node[data-id=\"" + sourceNode + "\"] .output-port[data-port-id=\"" + sourcePort + "\"]";
        var connectedPorts = this.svg.querySelectorAll(inputPortSelector + ", " + outputPortSelector);
        try {
            for (var connectedPorts_1 = __values(connectedPorts), connectedPorts_1_1 = connectedPorts_1.next(); !connectedPorts_1_1.done; connectedPorts_1_1 = connectedPorts_1.next()) {
                var port = connectedPorts_1_1.value;
                port.classList.add(this.css.highlight);
            }
        }
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (connectedPorts_1_1 && !connectedPorts_1_1.done && (_a = connectedPorts_1.return)) _a.call(connectedPorts_1);
            }
            finally { if (e_7) throw e_7.error; }
        }
        var e_7, _a;
    };
    SelectionPlugin.prototype.emitChange = function (change) {
        try {
            for (var _a = __values(this.selectionChangeCallbacks), _b = _a.next(); !_b.done; _b = _a.next()) {
                var fn = _b.value;
                fn(change);
            }
        }
        catch (e_8_1) { e_8 = { error: e_8_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_8) throw e_8.error; }
        }
        var e_8, _c;
    };
    SelectionPlugin.edgePortsDelimiter = "$!$";
    return SelectionPlugin;
}(plugin_base_1.PluginBase));
exports.SelectionPlugin = SelectionPlugin;
//# sourceMappingURL=selection.js.map