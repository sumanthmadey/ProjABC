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
var _1 = require("../../");
var graph_node_1 = require("../../graph/graph-node");
var geometry_1 = require("../../utils/geometry");
var edge_1 = require("../../graph/edge");
var edge_panning_1 = require("../../behaviors/edge-panning");
var SVGPortDragPlugin = /** @class */ (function (_super) {
    __extends(SVGPortDragPlugin, _super);
    function SVGPortDragPlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** How far away from the port you need to drag in order to create a new input/output instead of snapping */
        _this.snapRadius = 120;
        /** Map of CSS classes attached by this plugin */
        _this.css = {
            /** Added to svgRoot as a sign that this plugin is active */
            plugin: "__plugin-port-drag",
            /** Suggests that an element that contains it will be the one to snap to */
            snap: "__port-drag-snap",
            /** Added to svgRoot while dragging is in progress */
            dragging: "__port-drag-dragging",
            /** Will be added to suggested ports and their parent nodes */
            suggestion: "__port-drag-suggestion",
        };
        _this.detachDragListenerFn = undefined;
        _this.wheelPrevent = function (ev) { return ev.stopPropagation(); };
        _this.ghostX = 0;
        _this.ghostY = 0;
        return _this;
    }
    SVGPortDragPlugin.prototype.registerWorkflow = function (workflow) {
        _super.prototype.registerWorkflow.call(this, workflow);
        this.panner = new edge_panning_1.EdgePanner(this.workflow);
        this.workflow.svgRoot.classList.add(this.css.plugin);
    };
    SVGPortDragPlugin.prototype.afterRender = function () {
        if (this.workflow.editingEnabled) {
            this.attachPortDrag();
        }
    };
    SVGPortDragPlugin.prototype.onEditableStateChange = function (enabled) {
        if (enabled) {
            this.attachPortDrag();
        }
        else {
            this.detachPortDrag();
        }
    };
    SVGPortDragPlugin.prototype.destroy = function () {
        this.detachPortDrag();
    };
    SVGPortDragPlugin.prototype.detachPortDrag = function () {
        if (typeof this.detachDragListenerFn === "function") {
            this.detachDragListenerFn();
        }
        this.detachDragListenerFn = undefined;
    };
    SVGPortDragPlugin.prototype.attachPortDrag = function () {
        this.detachPortDrag();
        this.detachDragListenerFn = this.workflow.domEvents.drag(".port", this.onMove.bind(this), this.onMoveStart.bind(this), this.onMoveEnd.bind(this));
    };
    SVGPortDragPlugin.prototype.onMove = function (dx, dy, ev, portElement) {
        var _this = this;
        document.addEventListener("mousewheel", this.wheelPrevent, true);
        var mouseOnSVG = this.workflow.transformScreenCTMtoCanvas(ev.clientX, ev.clientY);
        var scale = this.workflow.scale;
        var sdx = (dx - this.lastMouseMove.x) / scale;
        var sdy = (dy - this.lastMouseMove.y) / scale;
        /** We might have hit the boundary and need to start panning */
        this.panner.triggerCollisionDetection(ev.clientX, ev.clientY, function (sdx, sdy) {
            _this.ghostX += sdx;
            _this.ghostY += sdy;
            _this.translateGhostNode(_this.ghostX, _this.ghostY);
            _this.updateEdge(_this.portOnCanvas.x, _this.portOnCanvas.y, _this.ghostX, _this.ghostY);
        });
        var nodeToMouseDistance = geometry_1.Geometry.distance(this.nodeCoords.x, this.nodeCoords.y, mouseOnSVG.x, mouseOnSVG.y);
        var closestPort = this.findClosestPort(mouseOnSVG.x, mouseOnSVG.y);
        this.updateSnapPort(closestPort.portEl, closestPort.distance);
        this.ghostX += sdx;
        this.ghostY += sdy;
        this.translateGhostNode(this.ghostX, this.ghostY);
        this.updateGhostNodeVisibility(nodeToMouseDistance, closestPort.distance);
        this.updateEdge(this.portOnCanvas.x, this.portOnCanvas.y, this.ghostX, this.ghostY);
        this.lastMouseMove = { x: dx, y: dy };
    };
    /**
     * @FIXME: Add panning
     * @param {MouseEvent} ev
     * @param {SVGGElement} portEl
     */
    SVGPortDragPlugin.prototype.onMoveStart = function (ev, portEl) {
        this.lastMouseMove = { x: 0, y: 0 };
        this.originPort = portEl;
        var portCTM = portEl.getScreenCTM();
        this.portOnCanvas = this.workflow.transformScreenCTMtoCanvas(portCTM.e, portCTM.f);
        this.ghostX = this.portOnCanvas.x;
        this.ghostY = this.portOnCanvas.y;
        // Needed for collision detection
        this.boundingClientRect = this.workflow.svgRoot.getBoundingClientRect();
        var nodeMatrix = this.workflow.findParent(portEl).transform.baseVal.getItem(0).matrix;
        this.nodeCoords = {
            x: nodeMatrix.e,
            y: nodeMatrix.f
        };
        var workflowGroup = this.workflow.workflow;
        this.portType = portEl.classList.contains("input-port") ? "input" : "output";
        this.ghostNode = this.createGhostNode(this.portType);
        workflowGroup.appendChild(this.ghostNode);
        /** @FIXME: this should come from workflow */
        this.edgeGroup = edge_1.Edge.spawn();
        this.edgeGroup.classList.add(this.css.dragging);
        workflowGroup.appendChild(this.edgeGroup);
        this.workflow.svgRoot.classList.add(this.css.dragging);
        this.portOrigins = this.getPortCandidateTransformations(portEl);
        this.highlightSuggestedPorts(portEl.getAttribute("data-connection-id"));
    };
    SVGPortDragPlugin.prototype.onMoveEnd = function (ev) {
        document.removeEventListener("mousewheel", this.wheelPrevent, true);
        this.panner.stop();
        var ghostType = this.ghostNode.getAttribute("data-type");
        var ghostIsVisible = !this.ghostNode.classList.contains("hidden");
        var shouldSnap = this.snapPort !== undefined;
        var shouldCreateInput = ghostIsVisible && ghostType === "input";
        var shouldCreateOutput = ghostIsVisible && ghostType === "output";
        var portID = this.originPort.getAttribute("data-connection-id");
        if (shouldSnap) {
            this.createEdgeBetweenPorts(this.originPort, this.snapPort);
        }
        else if (shouldCreateInput || shouldCreateOutput) {
            var svgCoordsUnderMouse = this.workflow.transformScreenCTMtoCanvas(ev.clientX, ev.clientY);
            var customProps = {
                "sbg:x": svgCoordsUnderMouse.x,
                "sbg:y": svgCoordsUnderMouse.y
            };
            if (shouldCreateInput) {
                this.workflow.model.createInputFromPort(portID, { customProps: customProps });
            }
            else {
                this.workflow.model.createOutputFromPort(portID, { customProps: customProps });
            }
        }
        this.cleanMemory();
        this.cleanStyles();
    };
    SVGPortDragPlugin.prototype.updateSnapPort = function (closestPort, closestPortDistance) {
        var closestPortChanged = closestPort !== this.snapPort;
        var closestPortIsOutOfRange = closestPortDistance > this.snapRadius;
        // We might need to remove old class for snapping if we are closer to some other port now
        if (this.snapPort && (closestPortChanged || closestPortIsOutOfRange)) {
            var node_1 = this.workflow.findParent(this.snapPort);
            this.snapPort.classList.remove(this.css.snap);
            node_1.classList.remove(this.css.snap);
            delete this.snapPort;
        }
        // If closest port is further away than our snapRadius, no highlighting should be done
        if (closestPortDistance > this.snapRadius) {
            return;
        }
        var originID = this.originPort.getAttribute("data-connection-id");
        var targetID = closestPort.getAttribute("data-connection-id");
        if (this.findEdge(originID, targetID)) {
            delete this.snapPort;
            return;
        }
        this.snapPort = closestPort;
        var node = this.workflow.findParent(closestPort);
        var oppositePortType = this.portType === "input" ? "output" : "input";
        closestPort.classList.add(this.css.snap);
        node.classList.add(this.css.snap);
        node.classList.add(this.css.snap + "-" + oppositePortType);
    };
    SVGPortDragPlugin.prototype.updateEdge = function (fromX, fromY, toX, toY) {
        var subEdges = this.edgeGroup.children;
        try {
            for (var _a = __values(subEdges), _b = _a.next(); !_b.done; _b = _a.next()) {
                var subEdge = _b.value;
                var path = _1.Workflow.makeConnectionPath(fromX, fromY, toX, toY, this.portType === "input" ? "left" : "right");
                subEdge.setAttribute("d", path);
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
    SVGPortDragPlugin.prototype.updateGhostNodeVisibility = function (distanceToMouse, distanceToClosestPort) {
        var isHidden = this.ghostNode.classList.contains("hidden");
        var shouldBeVisible = distanceToMouse > this.snapRadius && distanceToClosestPort > this.snapRadius;
        if (shouldBeVisible && isHidden) {
            this.ghostNode.classList.remove("hidden");
        }
        else if (!shouldBeVisible && !isHidden) {
            this.ghostNode.classList.add("hidden");
        }
    };
    SVGPortDragPlugin.prototype.translateGhostNode = function (x, y) {
        this.ghostNode.transform.baseVal.getItem(0).setTranslate(x, y);
    };
    SVGPortDragPlugin.prototype.getPortCandidateTransformations = function (portEl) {
        var nodeEl = this.workflow.findParent(portEl);
        var nodeConnectionID = nodeEl.getAttribute("data-connection-id");
        var otherPortType = this.portType === "input" ? "output" : "input";
        var portQuery = ".node:not([data-connection-id=\"" + nodeConnectionID + "\"]) .port." + otherPortType + "-port";
        var candidates = this.workflow.workflow.querySelectorAll(portQuery);
        var matrices = new Map();
        try {
            for (var candidates_1 = __values(candidates), candidates_1_1 = candidates_1.next(); !candidates_1_1.done; candidates_1_1 = candidates_1.next()) {
                var port = candidates_1_1.value;
                matrices.set(port, geometry_1.Geometry.getTransformToElement(port, this.workflow.workflow));
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (candidates_1_1 && !candidates_1_1.done && (_a = candidates_1.return)) _a.call(candidates_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return matrices;
        var e_2, _a;
    };
    /**
     * Highlights ports that are model says are suggested.
     * Also marks their parent nodes as highlighted.
     *
     * @param {string} targetConnectionID ConnectionID of the origin port
     */
    SVGPortDragPlugin.prototype.highlightSuggestedPorts = function (targetConnectionID) {
        // Find all ports that we can validly connect to
        // Note that we can connect to any port, but some of them are suggested based on hypothetical validity.
        var portModels = this.workflow.model.gatherValidConnectionPoints(targetConnectionID);
        for (var i = 0; i < portModels.length; i++) {
            var portModel = portModels[i];
            if (!portModel.isVisible)
                continue;
            // Find port element by this connectionID and it's parent node element
            var portQuery = ".port[data-connection-id=\"" + portModel.connectionId + "\"]";
            var portElement = this.workflow.workflow.querySelector(portQuery);
            var parentNode = this.workflow.findParent(portElement);
            // Add highlighting classes to port and it's parent node
            parentNode.classList.add(this.css.suggestion);
            portElement.classList.add(this.css.suggestion);
        }
    };
    /**
     * @FIXME: GraphNode.radius should somehow come through Workflow,
     */
    SVGPortDragPlugin.prototype.createGhostNode = function (type) {
        var namespace = "http://www.w3.org/2000/svg";
        var node = document.createElementNS(namespace, "g");
        node.setAttribute("transform", "matrix(1,0,0,1,0,0)");
        node.setAttribute("data-type", type);
        node.classList.add("ghost");
        node.classList.add("node");
        node.innerHTML = "<circle class=\"ghost-circle\" cx=\"0\" cy=\"0\" r=\"" + graph_node_1.GraphNode.radius / 1.5 + "\"></circle>";
        return node;
    };
    /**
     * Finds a port closest to given SVG coordinates.
     */
    SVGPortDragPlugin.prototype.findClosestPort = function (x, y) {
        var closestPort = undefined;
        var closestDistance = Infinity;
        this.portOrigins.forEach(function (matrix, port) {
            var distance = geometry_1.Geometry.distance(x, y, matrix.e, matrix.f);
            if (distance < closestDistance) {
                closestPort = port;
                closestDistance = distance;
            }
        });
        return {
            portEl: closestPort,
            distance: closestDistance
        };
    };
    /**
     * Removes all dom elements and objects cached in-memory during dragging that are no longer needed.
     */
    SVGPortDragPlugin.prototype.cleanMemory = function () {
        this.edgeGroup.remove();
        this.ghostNode.remove();
        this.snapPort = undefined;
        this.edgeGroup = undefined;
        this.nodeCoords = undefined;
        this.originPort = undefined;
        this.portOrigins = undefined;
        this.boundingClientRect = undefined;
    };
    /**
     * Removes all css classes attached by this plugin
     */
    SVGPortDragPlugin.prototype.cleanStyles = function () {
        this.workflow.svgRoot.classList.remove(this.css.dragging);
        for (var cls in this.css) {
            var query = this.workflow.svgRoot.querySelectorAll("." + this.css[cls]);
            try {
                for (var query_1 = __values(query), query_1_1 = query_1.next(); !query_1_1.done; query_1_1 = query_1.next()) {
                    var el = query_1_1.value;
                    el.classList.remove(this.css[cls]);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (query_1_1 && !query_1_1.done && (_a = query_1.return)) _a.call(query_1);
                }
                finally { if (e_3) throw e_3.error; }
            }
        }
        var e_3, _a;
    };
    /**
     * Creates an edge (connection) between two elements determined by their connection IDs
     * This edge is created on the model, and not rendered directly on graph, as main workflow
     * is supposed to catch the creation event and draw it.
     */
    SVGPortDragPlugin.prototype.createEdgeBetweenPorts = function (source, destination) {
        // Find the connection ids of origin port and the highlighted port
        var sourceID = source.getAttribute("data-connection-id");
        var destinationID = destination.getAttribute("data-connection-id");
        // Swap their places in case you dragged out from input to output, since they have to be ordered output->input
        if (sourceID.startsWith("in")) {
            var tmp = sourceID;
            sourceID = destinationID;
            destinationID = tmp;
        }
        this.workflow.model.connect(sourceID, destinationID);
    };
    SVGPortDragPlugin.prototype.findEdge = function (sourceID, destinationID) {
        var ltrQuery = "[data-source-connection=\"" + sourceID + "\"][data-destination-connection=\"" + destinationID + "\"]";
        var rtlQuery = "[data-source-connection=\"" + destinationID + "\"][data-destination-connection=\"" + sourceID + "\"]";
        return this.workflow.workflow.querySelector(ltrQuery + "," + rtlQuery);
    };
    return SVGPortDragPlugin;
}(plugin_base_1.PluginBase));
exports.SVGPortDragPlugin = SVGPortDragPlugin;
//# sourceMappingURL=port-drag.js.map