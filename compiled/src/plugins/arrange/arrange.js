"use strict";
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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var graph_node_1 = require("../../graph/graph-node");
var svg_utils_1 = require("../../utils/svg-utils");
var SVGArrangePlugin = /** @class */ (function () {
    function SVGArrangePlugin() {
    }
    SVGArrangePlugin.prototype.registerWorkflow = function (workflow) {
        this.workflow = workflow;
        this.svgRoot = workflow.svgRoot;
    };
    SVGArrangePlugin.prototype.registerOnBeforeChange = function (fn) {
        this.onBeforeChange = function () { return fn({ type: "arrange" }); };
    };
    SVGArrangePlugin.prototype.registerOnAfterChange = function (fn) {
        this.onAfterChange = function () { return fn({ type: "arrange" }); };
    };
    SVGArrangePlugin.prototype.registerOnAfterRender = function (fn) {
        this.triggerAfterRender = function () { return fn({ type: "arrange" }); };
    };
    SVGArrangePlugin.prototype.afterRender = function () {
        var model = this.workflow.model;
        var drawables = [].concat(model.steps || [], model.inputs || [], model.outputs || []);
        try {
            for (var drawables_1 = __values(drawables), drawables_1_1 = drawables_1.next(); !drawables_1_1.done; drawables_1_1 = drawables_1.next()) {
                var node = drawables_1_1.value;
                if (node.isVisible) {
                    var missingCoordinate = isNaN(parseInt(node.customProps["sbg:x"]));
                    if (missingCoordinate) {
                        this.arrange();
                        return;
                    }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (drawables_1_1 && !drawables_1_1.done && (_a = drawables_1.return)) _a.call(drawables_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var e_1, _a;
    };
    SVGArrangePlugin.prototype.arrange = function () {
        this.onBeforeChange();
        // We need to reset all transformations on the workflow for now.
        // @TODO Make arranging work without this
        this.workflow.resetTransform();
        // We need main graph and dangling nodes separately, they will be distributed differently
        var _a = this.makeNodeGraphs(), mainGraph = _a.mainGraph, danglingNodes = _a.danglingNodes;
        // Create an array of columns, each containing a list of NodeIOs
        var columns = this.distributeNodesIntoColumns(mainGraph);
        // Get total area in which we will fit the graph, and per-column dimensions
        var _b = this.calculateColumnSizes(columns), distributionArea = _b.distributionArea, columnDimensions = _b.columnDimensions;
        // This will be the vertical middle around which the graph should be centered
        var verticalBaseline = distributionArea.height / 2;
        var xOffset = 0;
        var maxYOffset = 0;
        // Here we will store positions for each node that is to be updated.
        // This should then be emitted as an afterChange event.
        var nodePositionUpdates = {};
        columns.forEach(function (column, index) {
            var colSize = columnDimensions[index];
            var yOffset = verticalBaseline - (colSize.height / 2) - column[0].rect.height / 2;
            column.forEach(function (node) {
                yOffset += node.rect.height / 2;
                var matrix = svg_utils_1.SVGUtils.createMatrix().translate(xOffset, yOffset);
                yOffset += node.rect.height / 2;
                if (yOffset > maxYOffset) {
                    maxYOffset = yOffset;
                }
                node.el.setAttribute("transform", svg_utils_1.SVGUtils.matrixToTransformAttr(matrix));
                nodePositionUpdates[node.connectionID] = {
                    x: matrix.e,
                    y: matrix.f
                };
            });
            xOffset += colSize.width;
        });
        var danglingNodeKeys = Object.keys(danglingNodes).sort(function (a, b) {
            var aIsInput = a.startsWith("out/");
            var aIsOutput = a.startsWith("in/");
            var bIsInput = b.startsWith("out/");
            var bIsOutput = b.startsWith("in/");
            var lowerA = a.toLowerCase();
            var lowerB = b.toLowerCase();
            if (aIsOutput) {
                if (bIsOutput) {
                    return lowerB.localeCompare(lowerA);
                }
                else {
                    return 1;
                }
            }
            else if (aIsInput) {
                if (bIsOutput) {
                    return -1;
                }
                if (bIsInput) {
                    return lowerB.localeCompare(lowerA);
                }
                else {
                    return 1;
                }
            }
            else {
                if (!bIsOutput && !bIsInput) {
                    return lowerB.localeCompare(lowerA);
                }
                else {
                    return -1;
                }
            }
        });
        var danglingNodeMarginOffset = 30;
        var danglingNodeSideLength = graph_node_1.GraphNode.radius * 5;
        var maxNodeHeightInRow = 0;
        var row = 0;
        var indexWidthMap = new Map();
        var rowMaxHeightMap = new Map();
        xOffset = 0;
        var danglingRowAreaWidth = Math.max(distributionArea.width, danglingNodeSideLength * 3);
        danglingNodeKeys.forEach(function (connectionID, index) {
            var el = danglingNodes[connectionID];
            var rect = el.firstElementChild.getBoundingClientRect();
            indexWidthMap.set(index, rect.width);
            if (xOffset === 0) {
                xOffset -= rect.width / 2;
            }
            if (rect.height > maxNodeHeightInRow) {
                maxNodeHeightInRow = rect.height;
            }
            xOffset += rect.width + danglingNodeMarginOffset + Math.max(150 - rect.width, 0);
            if (xOffset >= danglingRowAreaWidth && index < danglingNodeKeys.length - 1) {
                rowMaxHeightMap.set(row++, maxNodeHeightInRow);
                maxNodeHeightInRow = 0;
                xOffset = 0;
            }
        });
        rowMaxHeightMap.set(row, maxNodeHeightInRow);
        var colYOffset = maxYOffset;
        xOffset = 0;
        row = 0;
        danglingNodeKeys.forEach(function (connectionID, index) {
            var el = danglingNodes[connectionID];
            var width = indexWidthMap.get(index);
            var rowHeight = rowMaxHeightMap.get(row);
            var left = xOffset + width / 2;
            var top = colYOffset
                + danglingNodeMarginOffset
                + Math.ceil(rowHeight / 2)
                + ((xOffset === 0 ? 0 : left) / danglingRowAreaWidth) * danglingNodeSideLength;
            if (xOffset === 0) {
                left -= width / 2;
                xOffset -= width / 2;
            }
            xOffset += width + danglingNodeMarginOffset + Math.max(150 - width, 0);
            var matrix = svg_utils_1.SVGUtils.createMatrix().translate(left, top);
            el.setAttribute("transform", svg_utils_1.SVGUtils.matrixToTransformAttr(matrix));
            nodePositionUpdates[connectionID] = { x: matrix.e, y: matrix.f };
            if (xOffset >= danglingRowAreaWidth) {
                colYOffset += Math.ceil(rowHeight) + danglingNodeMarginOffset;
                xOffset = 0;
                maxNodeHeightInRow = 0;
                row++;
            }
        });
        this.workflow.redrawEdges();
        this.workflow.fitToViewport();
        this.onAfterChange(nodePositionUpdates);
        this.triggerAfterRender();
        for (var id in nodePositionUpdates) {
            var pos = nodePositionUpdates[id];
            var nodeModel = this.workflow.model.findById(id);
            if (!nodeModel.customProps) {
                nodeModel.customProps = {};
            }
            Object.assign(nodeModel.customProps, {
                "sbg:x": pos.x,
                "sbg:y": pos.y
            });
        }
        return nodePositionUpdates;
    };
    /**
     * Calculates column dimensions and total graph area
     * @param {NodeIO[][]} columns
     */
    SVGArrangePlugin.prototype.calculateColumnSizes = function (columns) {
        var distributionArea = { width: 0, height: 0 };
        var columnDimensions = [];
        for (var i = 1; i < columns.length; i++) {
            var width = 0;
            var height = 0;
            for (var j = 0; j < columns[i].length; j++) {
                var entry = columns[i][j];
                height += entry.rect.height;
                if (width < entry.rect.width) {
                    width = entry.rect.width;
                }
            }
            columnDimensions[i] = { height: height, width: width };
            distributionArea.width += width;
            if (height > distributionArea.height) {
                distributionArea.height = height;
            }
        }
        return {
            columnDimensions: columnDimensions,
            distributionArea: distributionArea
        };
    };
    /**
     * Maps node's connectionID to a 1-indexed column number
     */
    SVGArrangePlugin.prototype.distributeNodesIntoColumns = function (graph) {
        var idToZoneMap = {};
        var sortedNodeIDs = Object.keys(graph).sort(function (a, b) { return b.localeCompare(a); });
        var zones = [];
        for (var i = 0; i < sortedNodeIDs.length; i++) {
            var nodeID = sortedNodeIDs[i];
            var node = graph[nodeID];
            // For outputs and steps, we calculate the zone as a longest path you can take to them
            if (node.type !== "input") {
                idToZoneMap[nodeID] = this.traceLongestNodePathLength(node, graph);
            }
            else {
                //
                // Longest trace methods would put all inputs in the first column,
                // but we want it just behind the leftmost step that it is connected to
                // So instead of:
                //
                // (input)<----------------->(step)---
                // (input)<---------->(step)----------
                //
                // It should be:
                //
                // ---------------(input)<--->(step)---
                // --------(input)<-->(step)-----------
                //
                var closestNodeZone = Infinity;
                for (var i_1 = 0; i_1 < node.outputs.length; i_1++) {
                    var successorNodeZone = idToZoneMap[node.outputs[i_1]];
                    if (successorNodeZone < closestNodeZone) {
                        closestNodeZone = successorNodeZone;
                    }
                }
                if (closestNodeZone === Infinity) {
                    idToZoneMap[nodeID] = 1;
                }
                else {
                    idToZoneMap[nodeID] = closestNodeZone - 1;
                }
            }
            var zone = idToZoneMap[nodeID];
            zones[zone] || (zones[zone] = []);
            zones[zone].push(graph[nodeID]);
        }
        return zones;
    };
    /**
     * Finds all nodes in the graph, and indexes them by their "data-connection-id" attribute
     */
    SVGArrangePlugin.prototype.indexNodesByID = function () {
        var indexed = {};
        var nodes = this.svgRoot.querySelectorAll(".node");
        for (var i = 0; i < nodes.length; i++) {
            indexed[nodes[i].getAttribute("data-connection-id")] = nodes[i];
        }
        return indexed;
    };
    /**
     * Finds length of the longest possible path from the graph root to a node.
     * Lengths are 1-indexed. When a node has no predecessors, it will have length of 1.
     */
    SVGArrangePlugin.prototype.traceLongestNodePathLength = function (node, nodeGraph, visited) {
        if (visited === void 0) { visited = new Set(); }
        visited.add(node);
        if (node.inputs.length === 0) {
            return 1;
        }
        var inputPathLengths = [];
        for (var i = 0; i < node.inputs.length; i++) {
            var el = nodeGraph[node.inputs[i]];
            if (visited.has(el)) {
                continue;
            }
            inputPathLengths.push(this.traceLongestNodePathLength(el, nodeGraph, visited));
        }
        return Math.max.apply(Math, __spread(inputPathLengths)) + 1;
    };
    SVGArrangePlugin.prototype.makeNodeGraphs = function () {
        // We need all nodes in order to find the dangling ones, those will be sorted separately
        var allNodes = this.indexNodesByID();
        // Make a graph representation where you can trace inputs and outputs from/to connection ids
        var nodeGraph = {};
        // Edges are the main source of information from which we will distribute nodes
        var edges = this.svgRoot.querySelectorAll(".edge");
        for (var i = 0; i < edges.length; i++) {
            var edge = edges[i];
            var sourceConnectionID = edge.getAttribute("data-source-connection");
            var destinationConnectionID = edge.getAttribute("data-destination-connection");
            var _a = __read(sourceConnectionID.split("/"), 3), sourceSide = _a[0], sourceNodeID = _a[1], sourcePortID = _a[2];
            var _b = __read(destinationConnectionID.split("/"), 3), destinationSide = _b[0], destinationNodeID = _b[1], destinationPortID = _b[2];
            // Both source and destination are considered to be steps by default
            var sourceType = "step";
            var destinationType = "step";
            // Ports have the same node and port ids
            if (sourceNodeID === sourcePortID) {
                sourceType = sourceSide === "in" ? "output" : "input";
            }
            if (destinationNodeID === destinationPortID) {
                destinationType = destinationSide === "in" ? "output" : "input";
            }
            // Initialize keys on graph if they don't exist
            var sourceNode = this.svgRoot.querySelector(".node[data-id=\"" + sourceNodeID + "\"]");
            var destinationNode = this.svgRoot.querySelector(".node[data-id=\"" + destinationNodeID + "\"]");
            var sourceNodeConnectionID = sourceNode.getAttribute("data-connection-id");
            var destinationNodeConnectionID = destinationNode.getAttribute("data-connection-id");
            // Source and destination of this edge are obviously not dangling, so we can remove them
            // from the set of potentially dangling nodes
            delete allNodes[sourceNodeConnectionID];
            delete allNodes[destinationNodeConnectionID];
            // Ensure that the source node has its entry in the node graph
            (nodeGraph[sourceNodeID] || (nodeGraph[sourceNodeID] = {
                inputs: [],
                outputs: [],
                type: sourceType,
                connectionID: sourceNodeConnectionID,
                el: sourceNode,
                rect: sourceNode.getBoundingClientRect()
            }));
            // Ensure that the source node has its entry in the node graph
            (nodeGraph[destinationNodeID] || (nodeGraph[destinationNodeID] = {
                inputs: [],
                outputs: [],
                type: destinationType,
                connectionID: destinationNodeConnectionID,
                el: destinationNode,
                rect: destinationNode.getBoundingClientRect()
            }));
            nodeGraph[sourceNodeID].outputs.push(destinationNodeID);
            nodeGraph[destinationNodeID].inputs.push(sourceNodeID);
        }
        return {
            mainGraph: nodeGraph,
            danglingNodes: allNodes
        };
    };
    return SVGArrangePlugin;
}());
exports.SVGArrangePlugin = SVGArrangePlugin;
//# sourceMappingURL=arrange.js.map