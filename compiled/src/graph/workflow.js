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
var dom_events_1 = require("../utils/dom-events");
var event_hub_1 = require("../utils/event-hub");
var edge_1 = require("./edge");
var graph_node_1 = require("./graph-node");
var step_node_1 = require("./step-node");
var template_parser_1 = require("./template-parser");
/**
 * @FIXME validation states of old and newly created edges
 */
var Workflow = /** @class */ (function () {
    function Workflow(parameters) {
        var _this = this;
        this.svgID = this.makeID();
        this.minScale = 0.2;
        this.maxScale = 2;
        this.editingEnabled = true;
        /** Scale of labels, they are different than scale of other elements in the workflow */
        this.labelScale = 1;
        this.plugins = [];
        this.disposers = [];
        this.pendingFirstDraw = true;
        /** Stored in order to ensure that once destroyed graph cannot be reused again */
        this.isDestroyed = false;
        /** Current scale of the document */
        this._scale = 1;
        this.svgRoot = parameters.svgRoot;
        this.plugins = parameters.plugins || [];
        this.domEvents = new dom_events_1.DomEvents(this.svgRoot);
        this.model = parameters.model;
        this.editingEnabled = parameters.editingEnabled !== false; // default to true if undefined
        this.svgRoot.classList.add(this.svgID);
        this.svgRoot.innerHTML = "\n            <rect x=\"0\" y=\"0\" width=\"100%\" height=\"100%\" class=\"pan-handle\" transform=\"matrix(1,0,0,1,0,0)\"></rect>\n            <g class=\"workflow\" transform=\"matrix(1,0,0,1,0,0)\"></g>\n        ";
        this.workflow = this.svgRoot.querySelector(".workflow");
        this.invokePlugins("registerWorkflow", this);
        this.eventHub = new event_hub_1.EventHub([
            "connection.create",
            "app.create.step",
            "app.create.input",
            "app.create.output",
            "beforeChange",
            "afterChange",
            "afterRender",
            "selectionChange"
        ]);
        this.hookPlugins();
        this.draw(parameters.model);
        this.eventHub.on("afterRender", function () { return _this.invokePlugins("afterRender"); });
    }
    Object.defineProperty(Workflow.prototype, "scale", {
        get: function () {
            return this._scale;
        },
        // noinspection JSUnusedGlobalSymbols
        set: function (scale) {
            this.workflowBoundingClientRect = this.svgRoot.getBoundingClientRect();
            var x = (this.workflowBoundingClientRect.right + this.workflowBoundingClientRect.left) / 2;
            var y = (this.workflowBoundingClientRect.top + this.workflowBoundingClientRect.bottom) / 2;
            this.scaleAtPoint(scale, x, y);
        },
        enumerable: true,
        configurable: true
    });
    Workflow.canDrawIn = function (element) {
        return element.getBoundingClientRect().width !== 0;
    };
    Workflow.makeConnectionPath = function (x1, y1, x2, y2, forceDirection) {
        if (forceDirection === void 0) { forceDirection = "right"; }
        if (!forceDirection) {
            return "M " + x1 + " " + y1 + " C " + (x1 + x2) / 2 + " " + y1 + " " + (x1 + x2) / 2 + " " + y2 + " " + x2 + " " + y2;
        }
        else if (forceDirection === "right") {
            var outDir = x1 + Math.abs(x1 - x2) / 2;
            var inDir = x2 - Math.abs(x1 - x2) / 2;
            return "M " + x1 + " " + y1 + " C " + outDir + " " + y1 + " " + inDir + " " + y2 + " " + x2 + " " + y2;
        }
        else if (forceDirection === "left") {
            var outDir = x1 - Math.abs(x1 - x2) / 2;
            var inDir = x2 + Math.abs(x1 - x2) / 2;
            return "M " + x1 + " " + y1 + " C " + outDir + " " + y1 + " " + inDir + " " + y2 + " " + x2 + " " + y2;
        }
    };
    Workflow.prototype.draw = function (model) {
        var _this = this;
        if (model === void 0) { model = this.model; }
        this.assertNotDestroyed("draw");
        // We will need to restore the transformations when we redraw the model, so save the current state
        var oldTransform = this.workflow.getAttribute("transform");
        var modelChanged = this.model !== model;
        if (modelChanged || this.pendingFirstDraw) {
            this.pendingFirstDraw = false;
            this.model = model;
            var stepChangeDisposer_1 = this.model.on("step.change", this.onStepChange.bind(this));
            var stepCreateDisposer_1 = this.model.on("step.create", this.onStepCreate.bind(this));
            var stepRemoveDisposer_1 = this.model.on("step.remove", this.onStepRemove.bind(this));
            var inputCreateDisposer_1 = this.model.on("input.create", this.onInputCreate.bind(this));
            var inputRemoveDisposer_1 = this.model.on("input.remove", this.onInputRemove.bind(this));
            var outputCreateDisposer_1 = this.model.on("output.create", this.onOutputCreate.bind(this));
            var outputRemoveDisposer_1 = this.model.on("output.remove", this.onOutputRemove.bind(this));
            var stepInPortShowDisposer_1 = this.model.on("step.inPort.show", this.onInputPortShow.bind(this));
            var stepInPortHideDisposer_1 = this.model.on("step.inPort.hide", this.onInputPortHide.bind(this));
            var connectionCreateDisposer_1 = this.model.on("connection.create", this.onConnectionCreate.bind(this));
            var connectionRemoveDisposer_1 = this.model.on("connection.remove", this.onConnectionRemove.bind(this));
            var stepOutPortCreateDisposer_1 = this.model.on("step.outPort.create", this.onOutputPortCreate.bind(this));
            var stepOutPortRemoveDisposer_1 = this.model.on("step.outPort.remove", this.onOutputPortRemove.bind(this));
            this.disposers.push(function () {
                stepChangeDisposer_1.dispose();
                stepCreateDisposer_1.dispose();
                stepRemoveDisposer_1.dispose();
                inputCreateDisposer_1.dispose();
                inputRemoveDisposer_1.dispose();
                outputCreateDisposer_1.dispose();
                outputRemoveDisposer_1.dispose();
                stepInPortShowDisposer_1.dispose();
                stepInPortHideDisposer_1.dispose();
                connectionCreateDisposer_1.dispose();
                connectionRemoveDisposer_1.dispose();
                stepOutPortCreateDisposer_1.dispose();
                stepOutPortRemoveDisposer_1.dispose();
            });
            this.invokePlugins("afterModelChange");
        }
        this.clearCanvas();
        var nodes = __spread(this.model.steps, this.model.inputs, this.model.outputs).filter(function (n) { return n.isVisible; });
        /**
         * If there is a missing sbg:x or sbg:y property on any node model,
         * graph should be arranged to avoid random placement.
         */
        var arrangeNecessary = false;
        var nodeTemplate = "";
        try {
            for (var nodes_1 = __values(nodes), nodes_1_1 = nodes_1.next(); !nodes_1_1.done; nodes_1_1 = nodes_1.next()) {
                var node = nodes_1_1.value;
                var patched = graph_node_1.GraphNode.patchModelPorts(node);
                var missingX = isNaN(parseInt(patched.customProps["sbg:x"]));
                var missingY = isNaN(parseInt(patched.customProps["sbg:y"]));
                if (missingX || missingY) {
                    arrangeNecessary = true;
                }
                nodeTemplate += graph_node_1.GraphNode.makeTemplate(patched);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (nodes_1_1 && !nodes_1_1.done && (_a = nodes_1.return)) _a.call(nodes_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        this.workflow.innerHTML += nodeTemplate;
        this.redrawEdges();
        Array.from(this.workflow.querySelectorAll(".node")).forEach(function (e) {
            _this.workflow.appendChild(e);
        });
        this.addEventListeners();
        this.workflow.setAttribute("transform", oldTransform);
        this.scaleAtPoint(this.scale);
        this.invokePlugins("afterRender");
        var e_1, _a;
    };
    Workflow.prototype.findParent = function (el, parentClass) {
        if (parentClass === void 0) { parentClass = "node"; }
        var parentNode = el;
        while (parentNode) {
            if (parentNode.classList.contains(parentClass)) {
                return parentNode;
            }
            parentNode = parentNode.parentElement;
        }
    };
    /**
     * Retrieves a plugin instance
     * @param {{new(...args: any[]) => T}} plugin
     * @returns {T}
     */
    Workflow.prototype.getPlugin = function (plugin) {
        return this.plugins.find(function (p) { return p instanceof plugin; });
    };
    Workflow.prototype.on = function (event, handler) {
        this.eventHub.on(event, handler);
    };
    Workflow.prototype.off = function (event, handler) {
        this.eventHub.off(event, handler);
    };
    /**
     * Scales the workflow to fit the available viewport
     */
    Workflow.prototype.fitToViewport = function (ignoreScaleLimits) {
        if (ignoreScaleLimits === void 0) { ignoreScaleLimits = false; }
        this.scaleAtPoint(1);
        Object.assign(this.workflow.transform.baseVal.getItem(0).matrix, {
            e: 0,
            f: 0
        });
        var clientBounds = this.svgRoot.getBoundingClientRect();
        var wfBounds = this.workflow.getBoundingClientRect();
        var padding = 100;
        if (clientBounds.width === 0 || clientBounds.height === 0) {
            throw new Error("Cannot fit workflow to the area that has no visible viewport.");
        }
        var verticalScale = (wfBounds.height) / (clientBounds.height - padding);
        var horizontalScale = (wfBounds.width) / (clientBounds.width - padding);
        var scaleFactor = Math.max(verticalScale, horizontalScale);
        // Cap the upscaling to 1, we don't want to zoom in workflows that would fit anyway
        var newScale = Math.min(this.scale / scaleFactor, 1);
        if (!ignoreScaleLimits) {
            newScale = Math.max(newScale, this.minScale);
        }
        this.scaleAtPoint(newScale);
        var scaledWFBounds = this.workflow.getBoundingClientRect();
        var moveY = clientBounds.top - scaledWFBounds.top + Math.abs(clientBounds.height - scaledWFBounds.height) / 2;
        var moveX = clientBounds.left - scaledWFBounds.left + Math.abs(clientBounds.width - scaledWFBounds.width) / 2;
        var matrix = this.workflow.transform.baseVal.getItem(0).matrix;
        matrix.e += moveX;
        matrix.f += moveY;
    };
    Workflow.prototype.redrawEdges = function () {
        var _this = this;
        var highlightedEdges = new Set();
        Array.from(this.workflow.querySelectorAll(".edge")).forEach(function (el) {
            if (el.classList.contains("highlighted")) {
                var edgeID = el.attributes["data-source-connection"].value + el.attributes["data-destination-connection"].value;
                highlightedEdges.add(edgeID);
            }
            el.remove();
        });
        var edgesTpl = this.model.connections
            .map(function (c) {
            var edgeId = c.source.id + c.destination.id;
            var edgeStates = highlightedEdges.has(edgeId) ? "highlighted" : "";
            return edge_1.Edge.makeTemplate(c, _this.workflow, edgeStates);
        })
            .reduce(function (acc, tpl) { return acc + tpl; }, "");
        this.workflow.innerHTML = edgesTpl + this.workflow.innerHTML;
    };
    /**
     * Scale the workflow by the scaleCoefficient (not compounded) over given coordinates
     */
    Workflow.prototype.scaleAtPoint = function (scale, x, y) {
        if (scale === void 0) { scale = 1; }
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this._scale = scale;
        this.labelScale = 1 + (1 - this._scale) / (this._scale * 2);
        var transform = this.workflow.transform.baseVal;
        var matrix = transform.getItem(0).matrix;
        var coords = this.transformScreenCTMtoCanvas(x, y);
        matrix.e += matrix.a * coords.x;
        matrix.f += matrix.a * coords.y;
        matrix.a = matrix.d = scale;
        matrix.e -= scale * coords.x;
        matrix.f -= scale * coords.y;
        var nodeLabels = this.workflow.querySelectorAll(".node .label");
        try {
            for (var nodeLabels_1 = __values(nodeLabels), nodeLabels_1_1 = nodeLabels_1.next(); !nodeLabels_1_1.done; nodeLabels_1_1 = nodeLabels_1.next()) {
                var el = nodeLabels_1_1.value;
                var matrix_1 = el.transform.baseVal.getItem(0).matrix;
                Object.assign(matrix_1, {
                    a: this.labelScale,
                    d: this.labelScale
                });
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (nodeLabels_1_1 && !nodeLabels_1_1.done && (_a = nodeLabels_1.return)) _a.call(nodeLabels_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        var e_2, _a;
    };
    Workflow.prototype.transformScreenCTMtoCanvas = function (x, y) {
        var svg = this.svgRoot;
        var ctm = this.workflow.getScreenCTM();
        var point = svg.createSVGPoint();
        point.x = x;
        point.y = y;
        var t = point.matrixTransform(ctm.inverse());
        return {
            x: t.x,
            y: t.y
        };
    };
    Workflow.prototype.enableEditing = function (enabled) {
        this.invokePlugins("onEditableStateChange", enabled);
        this.editingEnabled = enabled;
    };
    // noinspection JSUnusedGlobalSymbols
    Workflow.prototype.destroy = function () {
        this.svgRoot.classList.remove(this.svgID);
        this.clearCanvas();
        this.eventHub.empty();
        this.invokePlugins("destroy");
        try {
            for (var _a = __values(this.disposers), _b = _a.next(); !_b.done; _b = _a.next()) {
                var dispose = _b.value;
                dispose();
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_3) throw e_3.error; }
        }
        this.isDestroyed = true;
        var e_3, _c;
    };
    Workflow.prototype.resetTransform = function () {
        this.workflow.setAttribute("transform", "matrix(1,0,0,1,0,0)");
        this.scaleAtPoint();
    };
    Workflow.prototype.assertNotDestroyed = function (method) {
        if (this.isDestroyed) {
            throw new Error("Cannot call the " + method + " method on a destroyed graph. " +
                "Destroying this object removes DOM listeners, " +
                "and reusing it would result in unexpected things not working. " +
                "Instead, you can just call the “draw” method with a different model, " +
                "or create a new Workflow object.");
        }
    };
    Workflow.prototype.addEventListeners = function () {
        /**
         * Attach canvas panning
         */
        {
            var pane_1;
            var x_1;
            var y_1;
            var matrix_2;
            this.domEvents.drag(".pan-handle", function (dx, dy) {
                matrix_2.e = x_1 + dx;
                matrix_2.f = y_1 + dy;
            }, function (ev, el, root) {
                pane_1 = root.querySelector(".workflow");
                matrix_2 = pane_1.transform.baseVal.getItem(0).matrix;
                x_1 = matrix_2.e;
                y_1 = matrix_2.f;
            }, function () {
                pane_1 = undefined;
                matrix_2 = undefined;
            });
        }
    };
    Workflow.prototype.clearCanvas = function () {
        this.domEvents.detachAll();
        this.workflow.innerHTML = "";
        this.workflow.setAttribute("transform", "matrix(1,0,0,1,0,0)");
        this.workflow.setAttribute("class", "workflow");
    };
    Workflow.prototype.hookPlugins = function () {
        var _this = this;
        this.plugins.forEach(function (plugin) {
            plugin.registerOnBeforeChange(function (event) {
                _this.eventHub.emit("beforeChange", event);
            });
            plugin.registerOnAfterChange(function (event) {
                _this.eventHub.emit("afterChange", event);
            });
            plugin.registerOnAfterRender(function (event) {
                _this.eventHub.emit("afterRender", event);
            });
        });
    };
    Workflow.prototype.invokePlugins = function (methodName) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.plugins.forEach(function (plugin) {
            if (typeof plugin[methodName] === "function") {
                plugin[methodName].apply(plugin, __spread(args));
            }
        });
    };
    /**
     * Listener for “connection.create” event on model that renders new edges on canvas
     */
    Workflow.prototype.onConnectionCreate = function (source, destination) {
        if (!source.isVisible || !destination.isVisible) {
            return;
        }
        var sourceID = source.connectionId;
        var destinationID = destination.connectionId;
        edge_1.Edge.spawnBetweenConnectionIDs(this.workflow, sourceID, destinationID);
    };
    /**
     * Listener for "connection.remove" event on the model that disconnects nodes
     */
    Workflow.prototype.onConnectionRemove = function (source, destination) {
        if (!source.isVisible || !destination.isVisible) {
            return;
        }
        var sourceID = source.connectionId;
        var destinationID = destination.connectionId;
        var edge = this.svgRoot.querySelector(".edge[data-source-connection=\"" + sourceID + "\"][data-destination-connection=\"" + destinationID + "\"]");
        edge.remove();
    };
    /**
     * Listener for “input.create” event on model that renders workflow inputs
     */
    Workflow.prototype.onInputCreate = function (input) {
        if (!input.isVisible) {
            return;
        }
        var patched = graph_node_1.GraphNode.patchModelPorts(input);
        var graphTemplate = graph_node_1.GraphNode.makeTemplate(patched, this.labelScale);
        var el = template_parser_1.TemplateParser.parse(graphTemplate);
        this.workflow.appendChild(el);
    };
    /**
     * Listener for “output.create” event on model that renders workflow outputs
     */
    Workflow.prototype.onOutputCreate = function (output) {
        if (!output.isVisible) {
            return;
        }
        var patched = graph_node_1.GraphNode.patchModelPorts(output);
        var graphTemplate = graph_node_1.GraphNode.makeTemplate(patched, this.labelScale);
        var el = template_parser_1.TemplateParser.parse(graphTemplate);
        this.workflow.appendChild(el);
    };
    Workflow.prototype.onStepCreate = function (step) {
        // if the step doesn't have x & y coordinates, check if they are in the run property
        if (!step.customProps["sbg:x"] && step.run.customProps && step.run.customProps["sbg:x"]) {
            Object.assign(step.customProps, {
                "sbg:x": step.run.customProps["sbg:x"],
                "sbg:y": step.run.customProps["sbg:y"]
            });
            // remove them from the run property once finished
            delete step.run.customProps["sbg:x"];
            delete step.run.customProps["sbg:y"];
        }
        var template = graph_node_1.GraphNode.makeTemplate(step, this.labelScale);
        var element = template_parser_1.TemplateParser.parse(template);
        this.workflow.appendChild(element);
    };
    Workflow.prototype.onStepChange = function (change) {
        var title = this.workflow.querySelector(".step[data-id=\"" + change.connectionId + "\"] .title");
        if (title) {
            title.textContent = change.label;
        }
    };
    Workflow.prototype.onInputPortShow = function (input) {
        var stepEl = this.svgRoot.querySelector(".step[data-connection-id=\"" + input.parentStep.connectionId + "\"]");
        new step_node_1.StepNode(stepEl, input.parentStep).update();
    };
    Workflow.prototype.onInputPortHide = function (input) {
        var stepEl = this.svgRoot.querySelector(".step[data-connection-id=\"" + input.parentStep.connectionId + "\"]");
        new step_node_1.StepNode(stepEl, input.parentStep).update();
    };
    Workflow.prototype.onOutputPortCreate = function (output) {
        var stepEl = this.svgRoot.querySelector(".step[data-connection-id=\"" + output.parentStep.connectionId + "\"]");
        new step_node_1.StepNode(stepEl, output.parentStep).update();
    };
    Workflow.prototype.onOutputPortRemove = function (output) {
        var stepEl = this.svgRoot.querySelector(".step[data-connection-id=\"" + output.parentStep.connectionId + "\"]");
        new step_node_1.StepNode(stepEl, output.parentStep).update();
    };
    /**
     * Listener for "step.remove" event on model which removes steps
     */
    Workflow.prototype.onStepRemove = function (step) {
        var stepEl = this.svgRoot.querySelector(".step[data-connection-id=\"" + step.connectionId + "\"]");
        stepEl.remove();
    };
    /**
     * Listener for "input.remove" event on model which removes inputs
     */
    Workflow.prototype.onInputRemove = function (input) {
        if (!input.isVisible)
            return;
        var inputEl = this.svgRoot.querySelector(".node.input[data-connection-id=\"" + input.connectionId + "\"]");
        inputEl.remove();
    };
    /**
     * Listener for "output.remove" event on model which removes outputs
     */
    Workflow.prototype.onOutputRemove = function (output) {
        if (!output.isVisible)
            return;
        var outputEl = this.svgRoot.querySelector(".node.output[data-connection-id=\"" + output.connectionId + "\"]");
        outputEl.remove();
    };
    Workflow.prototype.makeID = function (length) {
        if (length === void 0) { length = 6; }
        var output = "";
        var charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        for (var i = 0; i < length; i++) {
            output += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        return output;
    };
    return Workflow;
}());
exports.Workflow = Workflow;
//# sourceMappingURL=workflow.js.map