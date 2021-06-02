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
var _1 = require("../../");
var plugin_base_1 = require("../plugin-base");
var edge_panning_1 = require("../../behaviors/edge-panning");
/**
 * This plugin makes node dragging and movement possible.
 *
 * @FIXME: attach events for before and after change
 */
var SVGNodeMovePlugin = /** @class */ (function (_super) {
    __extends(SVGNodeMovePlugin, _super);
    function SVGNodeMovePlugin(parameters) {
        if (parameters === void 0) { parameters = {}; }
        var _this = _super.call(this) || this;
        /** How far from the edge of the viewport does mouse need to be before panning is triggered */
        _this.scrollMargin = 50;
        /** How fast does workflow move while panning */
        _this.movementSpeed = 10;
        _this.wheelPrevent = function (ev) { return ev.stopPropagation(); };
        _this.boundMoveHandler = _this.onMove.bind(_this);
        _this.boundMoveStartHandler = _this.onMoveStart.bind(_this);
        _this.boundMoveEndHandler = _this.onMoveEnd.bind(_this);
        _this.detachDragListenerFn = undefined;
        Object.assign(_this, parameters);
        return _this;
    }
    SVGNodeMovePlugin.prototype.onEditableStateChange = function (enabled) {
        if (enabled) {
            this.attachDrag();
        }
        else {
            this.detachDrag();
        }
    };
    SVGNodeMovePlugin.prototype.afterRender = function () {
        if (this.workflow.editingEnabled) {
            this.attachDrag();
        }
    };
    SVGNodeMovePlugin.prototype.destroy = function () {
        this.detachDrag();
    };
    SVGNodeMovePlugin.prototype.registerWorkflow = function (workflow) {
        _super.prototype.registerWorkflow.call(this, workflow);
        this.edgePanner = new edge_panning_1.EdgePanner(this.workflow, {
            scrollMargin: this.scrollMargin,
            movementSpeed: this.movementSpeed
        });
    };
    SVGNodeMovePlugin.prototype.detachDrag = function () {
        if (typeof this.detachDragListenerFn === "function") {
            this.detachDragListenerFn();
        }
        this.detachDragListenerFn = undefined;
    };
    SVGNodeMovePlugin.prototype.attachDrag = function () {
        this.detachDrag();
        this.detachDragListenerFn = this.workflow.domEvents.drag(".node .core", this.boundMoveHandler, this.boundMoveStartHandler, this.boundMoveEndHandler);
    };
    SVGNodeMovePlugin.prototype.getWorkflowMatrix = function () {
        return this.workflow.workflow.transform.baseVal.getItem(0).matrix;
    };
    SVGNodeMovePlugin.prototype.onMove = function (dx, dy, ev) {
        var _this = this;
        /** We will use workflow scale to determine how our mouse movement translate to svg proportions */
        var scale = this.workflow.scale;
        /** Need to know how far did the workflow itself move since when we started dragging */
        var matrixMovement = {
            x: this.getWorkflowMatrix().e - this.startWorkflowTranslation.x,
            y: this.getWorkflowMatrix().f - this.startWorkflowTranslation.y
        };
        /** We might have hit the boundary and need to start panning */
        this.edgePanner.triggerCollisionDetection(ev.clientX, ev.clientY, function (sdx, sdy) {
            _this.sdx += sdx;
            _this.sdy += sdy;
            _this.translateNodeBy(_this.movingNode, sdx, sdy);
            _this.redrawEdges(_this.sdx, _this.sdy);
        });
        /**
         * We need to store scaled ∆x and ∆y because this is not the only place from which node is being moved.
         * If mouse is outside the viewport, and the workflow is panning, startScroll will continue moving
         * this node, so it needs to know where to start from and update it, so this method can take
         * over when mouse gets back to the viewport.
         *
         * If there was no handoff, node would jump back and forth to
         * last positions for each movement initiator separately.
         */
        this.sdx = (dx - matrixMovement.x) / scale;
        this.sdy = (dy - matrixMovement.y) / scale;
        var moveX = this.sdx + this.startX;
        var moveY = this.sdy + this.startY;
        this.translateNodeTo(this.movingNode, moveX, moveY);
        this.redrawEdges(this.sdx, this.sdy);
    };
    /**
     * Triggered from {@link attachDrag} when drag starts.
     * This method initializes properties that are needed for calculations during movement.
     */
    SVGNodeMovePlugin.prototype.onMoveStart = function (event, handle) {
        /** We will query the SVG dom for edges that we need to move, so store svg element for easy access */
        var svg = this.workflow.svgRoot;
        document.addEventListener("mousewheel", this.wheelPrevent, true);
        /** Our drag handle is not the whole node because that would include ports and labels, but a child of it*/
        var node = handle.parentNode;
        /** Store initial transform values so we know how much we've moved relative from the starting position */
        var nodeMatrix = node.transform.baseVal.getItem(0).matrix;
        this.startX = nodeMatrix.e;
        this.startY = nodeMatrix.f;
        /** We have to query for edges that are attached to this node because we will move them as well */
        var nodeID = node.getAttribute("data-id");
        /**
         * When user drags the node to the edge and waits while workflow pans to the side,
         * mouse movement stops, but workflow movement starts.
         * We then utilize this to get movement ∆ of the workflow, and use that for translation instead.
         */
        this.startWorkflowTranslation = {
            x: this.getWorkflowMatrix().e,
            y: this.getWorkflowMatrix().f
        };
        /** Used to determine whether dragged node is hitting the edge, so we can pan the Workflow*/
        this.boundingClientRect = svg.getBoundingClientRect();
        /** Node movement can be initiated from both mouse events and animationFrame, so make it accessible */
        this.movingNode = handle.parentNode;
        /**
         * While node is being moved, incoming and outgoing edges also need to be moved in order to stay attached.
         * We don't want to query them all the time, so we cache them in maps that point from their dom elements
         * to an array of numbers that represent their bezier curves, since we will update those curves.
         */
        this.inputEdges = new Map();
        this.outputEdges = new Map();
        var outputsSelector = ".edge[data-source-node='" + nodeID + "'] .sub-edge";
        var inputsSelector = ".edge[data-destination-node='" + nodeID + "'] .sub-edge";
        var query = svg.querySelectorAll([inputsSelector, outputsSelector].join(", "));
        try {
            for (var query_1 = __values(query), query_1_1 = query_1.next(); !query_1_1.done; query_1_1 = query_1.next()) {
                var subEdge = query_1_1.value;
                var isInput = subEdge.parentElement.getAttribute("data-destination-node") === nodeID;
                var path = subEdge.getAttribute("d").split(" ").map(Number).filter(function (e) { return !isNaN(e); });
                isInput ? this.inputEdges.set(subEdge, path) : this.outputEdges.set(subEdge, path);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (query_1_1 && !query_1_1.done && (_a = query_1.return)) _a.call(query_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var e_1, _a;
    };
    SVGNodeMovePlugin.prototype.translateNodeBy = function (node, x, y) {
        var matrix = node.transform.baseVal.getItem(0).matrix;
        this.translateNodeTo(node, matrix.e + x, matrix.f + y);
    };
    SVGNodeMovePlugin.prototype.translateNodeTo = function (node, x, y) {
        node.transform.baseVal.getItem(0).setTranslate(x, y);
    };
    /**
     * Redraws stored input and output edges so as to transform them with respect to
     * scaled transformation differences, sdx and sdy.
     */
    SVGNodeMovePlugin.prototype.redrawEdges = function (sdx, sdy) {
        this.inputEdges.forEach(function (p, el) {
            var path = _1.Workflow.makeConnectionPath(p[0], p[1], p[6] + sdx, p[7] + sdy);
            el.setAttribute("d", path);
        });
        this.outputEdges.forEach(function (p, el) {
            var path = _1.Workflow.makeConnectionPath(p[0] + sdx, p[1] + sdy, p[6], p[7]);
            el.setAttribute("d", path);
        });
    };
    /**
     * Triggered from {@link attachDrag} after move event ends
     */
    SVGNodeMovePlugin.prototype.onMoveEnd = function () {
        this.edgePanner.stop();
        var id = this.movingNode.getAttribute("data-connection-id");
        var nodeModel = this.workflow.model.findById(id);
        if (!nodeModel.customProps) {
            nodeModel.customProps = {};
        }
        var matrix = this.movingNode.transform.baseVal.getItem(0).matrix;
        Object.assign(nodeModel.customProps, {
            "sbg:x": matrix.e,
            "sbg:y": matrix.f,
        });
        this.onAfterChange({ type: "node-move" });
        document.removeEventListener("mousewheel", this.wheelPrevent, true);
        delete this.startX;
        delete this.startY;
        delete this.movingNode;
        delete this.inputEdges;
        delete this.outputEdges;
        delete this.boundingClientRect;
        delete this.startWorkflowTranslation;
    };
    return SVGNodeMovePlugin;
}(plugin_base_1.PluginBase));
exports.SVGNodeMovePlugin = SVGNodeMovePlugin;
//# sourceMappingURL=node-move.js.map