"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var models_1 = require("cwlts/models");
var html_utils_1 = require("../utils/html-utils");
var svg_utils_1 = require("../utils/svg-utils");
var io_port_1 = require("./io-port");
var GraphNode = /** @class */ (function () {
    function GraphNode(position, dataModel) {
        this.dataModel = dataModel;
        this.position = { x: 0, y: 0 };
        this.dataModel = dataModel;
        Object.assign(this.position, position);
    }
    GraphNode.makeIconFragment = function (model) {
        var iconStr = "";
        if (model instanceof models_1.StepModel && model.run) {
            if (model.run.class === "Workflow") {
                iconStr = this.workflowIconSvg;
            }
            else if (model.run.class === "CommandLineTool") {
                iconStr = this.toolIconSvg;
            }
        }
        else if (model instanceof models_1.WorkflowInputParameterModel && model.type) {
            if (model.type.type === "File" || (model.type.type === "array" && model.type.items === "File")) {
                iconStr = this.fileInputIconSvg;
            }
            else {
                iconStr = this.inputIconSvg;
            }
        }
        else if (model instanceof models_1.WorkflowOutputParameterModel && model.type) {
            if (model.type.type === "File" || (model.type.type === "array" && model.type.items === "File")) {
                iconStr = this.fileOutputIconSvg;
            }
            else {
                iconStr = this.outputIconSvg;
            }
        }
        return iconStr;
    };
    GraphNode.makeTemplate = function (dataModel, labelScale) {
        if (labelScale === void 0) { labelScale = 1; }
        var x = ~~(dataModel.customProps && dataModel.customProps["sbg:x"]);
        var y = ~~(dataModel.customProps && dataModel.customProps["sbg:y"]);
        var nodeTypeClass = "step";
        if (dataModel instanceof models_1.WorkflowInputParameterModel) {
            nodeTypeClass = "input";
        }
        else if (dataModel instanceof models_1.WorkflowOutputParameterModel) {
            nodeTypeClass = "output";
        }
        var inputs = (dataModel["in"] || []).filter(function (p) { return p.isVisible; });
        var outputs = (dataModel["out"] || []).filter(function (p) { return p.isVisible; });
        var maxPorts = Math.max(inputs.length, outputs.length);
        var radius = GraphNode.radius + maxPorts * io_port_1.IOPort.radius;
        var typeClass = "";
        var itemsClass = "";
        if (dataModel.type) {
            typeClass = "type-" + dataModel.type.type;
            if (dataModel.type.items) {
                itemsClass = "items-" + dataModel.type.items;
            }
        }
        var inputPortTemplates = inputs
            .sort(function (a, b) { return -a.id.localeCompare(b.id); })
            .map(function (p, i, arr) { return GraphNode.makePortTemplate(p, "input", svg_utils_1.SVGUtils.matrixToTransformAttr(GraphNode.createPortMatrix(arr.length, i, radius, "input"))); })
            .reduce(function (acc, tpl) { return acc + tpl; }, "");
        var outputPortTemplates = outputs
            .sort(function (a, b) { return -a.id.localeCompare(b.id); })
            .map(function (p, i, arr) { return GraphNode.makePortTemplate(p, "output", svg_utils_1.SVGUtils.matrixToTransformAttr(GraphNode.createPortMatrix(arr.length, i, radius, "output"))); })
            .reduce(function (acc, tpl) { return acc + tpl; }, "");
        return "\n            <g tabindex=\"-1\" class=\"node " + nodeTypeClass + " " + typeClass + " " + itemsClass + "\"\n               data-connection-id=\"" + html_utils_1.HtmlUtils.escapeHTML(dataModel.connectionId) + "\"\n               transform=\"matrix(1, 0, 0, 1, " + x + ", " + y + ")\"\n               data-id=\"" + html_utils_1.HtmlUtils.escapeHTML(dataModel.id) + "\">\n               \n                <g class=\"core\" transform=\"matrix(1, 0, 0, 1, 0, 0)\">\n                    <circle cx=\"0\" cy=\"0\" r=\"" + radius + "\" class=\"outer\"></circle>\n                    <circle cx=\"0\" cy=\"0\" r=\"" + radius * .75 + "\" class=\"inner\"></circle>\n                    \n                    " + GraphNode.makeIconFragment(dataModel) + "\n                </g>\n                \n                <text transform=\"matrix(" + labelScale + ",0,0," + labelScale + ",0," + (radius + 30) + ")\" class=\"title label\">" + html_utils_1.HtmlUtils.escapeHTML(dataModel.label || dataModel.id) + "</text>\n                \n                " + inputPortTemplates + "\n                " + outputPortTemplates + "\n            </g>\n        ";
    };
    GraphNode.makePortTemplate = function (port, type, transform) {
        if (transform === void 0) { transform = "matrix(1, 0, 0, 1, 0, 0)"; }
        var portClass = type === "input" ? "input-port" : "output-port";
        var label = html_utils_1.HtmlUtils.escapeHTML(port.label || port.id);
        return "\n            <g class=\"port " + portClass + "\" transform=\"" + (transform || "matrix(1, 0, 0, 1, 0, 0)") + "\"\n               data-connection-id=\"" + html_utils_1.HtmlUtils.escapeHTML(port.connectionId) + "\"\n               data-port-id=\"" + html_utils_1.HtmlUtils.escapeHTML(port.id) + "\"\n            >\n                <g class=\"io-port\">\n                    <circle cx=\"0\" cy=\"0\" r=\"7\" class=\"port-handle\"></circle>\n                </g>\n                <text x=\"0\" y=\"0\" transform=\"matrix(1,0,0,1,0,0)\" class=\"label unselectable\">" + label + "</text>\n            </g>\n            \n        ";
    };
    GraphNode.createPortMatrix = function (totalPortLength, portIndex, radius, type) {
        var availableAngle = 140;
        var rotationAngle = 
        // Starting rotation angle
        (-availableAngle / 2) +
            (
            // Angular offset by element index
            (portIndex + 1)
                // Angle between elements
                * availableAngle / (totalPortLength + 1));
        if (type === "input") {
            rotationAngle =
                // Determines the starting rotation angle
                180 - (availableAngle / -2)
                    // Determines the angular offset modifier for the current index
                    - (portIndex + 1)
                        // Determines the angular offset
                        * availableAngle / (totalPortLength + 1);
        }
        var matrix = svg_utils_1.SVGUtils.createMatrix();
        return matrix.rotate(rotationAngle).translate(radius, 0).rotate(-rotationAngle);
    };
    GraphNode.patchModelPorts = function (model) {
        var patch = [{ connectionId: model.connectionId, isVisible: true, id: model.id }];
        if (model instanceof models_1.WorkflowInputParameterModel) {
            var copy = Object.create(model);
            return Object.assign(copy, { out: patch });
        }
        else if (model instanceof models_1.WorkflowOutputParameterModel) {
            var copy = Object.create(model);
            return Object.assign(copy, { in: patch });
        }
        return model;
    };
    GraphNode.radius = 30;
    /**
     * @FIXME Making icons increases the rendering time by 50-100%. Try embedding the SVG directly.
     */
    GraphNode.workflowIconSvg = "<svg class=\"node-icon\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 400.01 399.88\" x=\"-9\" y=\"-10\" width=\"20\" height=\"20\"><title>workflow</title><path d=\"M400,200a80,80,0,0,1-140.33,52.53L158.23,303.24a80,80,0,1,1-17.9-35.77l101.44-50.71a80.23,80.23,0,0,1,0-33.52L140.33,132.53a79.87,79.87,0,1,1,17.9-35.77l101.44,50.71A80,80,0,0,1,400,200Z\" transform=\"translate(0.01 -0.16)\"/></svg>";
    GraphNode.toolIconSvg = "<svg class=\"node-icon\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 398.39 397.78\" x=\"-10\" y=\"-8\" width=\"20\" height=\"15\"><title>tool2</title><polygon points=\"38.77 397.57 0 366 136.15 198.78 0 31.57 38.77 0 200.63 198.78 38.77 397.57\"/><rect x=\"198.39\" y=\"347.78\" width=\"200\" height=\"50\"/></svg>";
    GraphNode.fileInputIconSvg = "<svg class=\"node-icon\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 499 462.86\" y=\"-10\" x=\"-11\" width=\"20\" height=\"20\"><title>file_input</title><path d=\"M386.06,0H175V58.29l50,50V50H337.81V163.38h25l86.19.24V412.86H225V353.71l-50,50v59.15H499V112.94Zm1.75,113.45v-41l41.1,41.1Z\"/><polygon points=\"387.81 1.06 387.81 1.75 387.12 1.06 387.81 1.06\"/><polygon points=\"290.36 231 176.68 344.68 141.32 309.32 194.64 256 0 256 0 206 194.64 206 142.32 153.68 177.68 118.32 290.36 231\"/></svg>";
    GraphNode.fileOutputIconSvg = "<svg class=\"node-icon\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 499 462.86\" x=\"-7\" y=\"-11\" width=\"20\" height=\"20\"><title>file_output</title><polygon points=\"387.81 1.06 387.81 1.75 387.12 1.06 387.81 1.06\"/><polygon points=\"499 231 385.32 344.68 349.96 309.32 403.28 256 208.64 256 208.64 206 403.28 206 350.96 153.68 386.32 118.32 499 231\"/><path d=\"M187.81,163.38l77.69.22H324V112.94L211.06,0H0V462.86H324V298.5H274V412.86H50V50H162.81V163.38Zm25-90.92,41.1,41.1-41.1-.11Z\"/></svg>";
    GraphNode.inputIconSvg = "<svg class=\"node-icon\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 499 365\" x=\"-11\" y=\"-10\" width=\"20\" height=\"20\"><title>type_input</title><g id=\"input\"><path d=\"M316.5,68a181.72,181.72,0,0,0-114.12,40.09L238,143.72a132.5,132.5,0,1,1,1.16,214.39L203.48,393.8A182.5,182.5,0,1,0,316.5,68Z\" transform=\"translate(0 -68)\"/><g id=\"Layer_22\" data-name=\"Layer 22\"><g id=\"Layer_9_copy_4\" data-name=\"Layer 9 copy 4\"><polygon points=\"290.36 182 176.68 295.68 141.32 260.32 194.64 207 0 207 0 157 194.64 157 142.32 104.68 177.68 69.32 290.36 182\"/></g></g></g></svg>";
    GraphNode.outputIconSvg = "<svg class=\"node-icon\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 500.36 365\" x=\"-9\" y=\"-10\" width=\"20\" height=\"20\"><title>type_output</title><g id=\"output\"><path d=\"M291.95,325.23a134,134,0,0,1-15.76,19,132.5,132.5,0,1,1,0-187.38,133.9,133.9,0,0,1,16.16,19.55l35.81-35.81A182.5,182.5,0,1,0,327.73,361Z\" transform=\"translate(0 -68)\"/><g id=\"circle_source_copy\" data-name=\"circle source copy\"><g id=\"Layer_22_copy\" data-name=\"Layer 22 copy\"><g id=\"Layer_9_copy_5\" data-name=\"Layer 9 copy 5\"><polygon points=\"500.36 182 386.68 295.68 351.32 260.32 404.64 207 210 207 210 157 404.64 157 352.32 104.68 387.68 69.32 500.36 182\"/></g></g></g></g></svg>";
    return GraphNode;
}());
exports.GraphNode = GraphNode;
//# sourceMappingURL=graph-node.js.map