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
var geometry_1 = require("../utils/geometry");
var io_port_1 = require("./io-port");
var workflow_1 = require("./workflow");
var Edge = /** @class */ (function () {
    function Edge() {
    }
    Edge.makeTemplate = function (edge, containerNode, connectionStates) {
        if (!edge.isVisible || edge.source.type === "Step" || edge.destination.type === "Step") {
            return "";
        }
        var _a = __read(edge.source.id.split("/"), 3), sourceSide = _a[0], sourceStepId = _a[1], sourcePort = _a[2];
        var _b = __read(edge.destination.id.split("/"), 3), destSide = _b[0], destStepId = _b[1], destPort = _b[2];
        var sourceVertex = containerNode.querySelector(".node[data-id=\"" + sourceStepId + "\"] .output-port[data-port-id=\"" + sourcePort + "\"] .io-port");
        var destVertex = containerNode.querySelector(".node[data-id=\"" + destStepId + "\"] .input-port[data-port-id=\"" + destPort + "\"] .io-port");
        if (edge.source.type === edge.destination.type) {
            console.error("Can't update edge between nodes of the same type.", edge);
            return;
        }
        if (!sourceVertex) {
            console.error("Source vertex not found for edge " + edge.source.id, edge);
            return;
        }
        if (!destVertex) {
            console.error("Destination vertex not found for edge " + edge.destination.id, edge);
            return;
        }
        var sourceCTM = sourceVertex.getCTM();
        var destCTM = destVertex.getCTM();
        var wfMatrix = containerNode.transform.baseVal.getItem(0).matrix;
        var pathStr = workflow_1.Workflow.makeConnectionPath((sourceCTM.e - wfMatrix.e) / sourceCTM.a, (sourceCTM.f - wfMatrix.f) / sourceCTM.a, (destCTM.e - wfMatrix.e) / sourceCTM.a, (destCTM.f - wfMatrix.f) / sourceCTM.a);
        return "\n            <g tabindex=\"-1\" class=\"edge " + connectionStates + "\"\n               data-source-port=\"" + sourcePort + "\"\n               data-destination-port=\"" + destPort + "\"\n               data-source-node=\"" + sourceStepId + "\"\n               data-source-connection=\"" + edge.source.id + "\"\n               data-destination-connection=\"" + edge.destination.id + "\"\n               data-destination-node=\"" + destStepId + "\">\n                <path class=\"sub-edge outer\" d=\"" + pathStr + "\"></path>\n                <path class=\"sub-edge inner\" d=\"" + pathStr + "\"></path>\n            </g>\n        ";
    };
    Edge.spawn = function (pathStr, connectionIDs) {
        if (pathStr === void 0) { pathStr = ""; }
        if (connectionIDs === void 0) { connectionIDs = {}; }
        var ns = "http://www.w3.org/2000/svg";
        var edge = document.createElementNS(ns, "g");
        var _a = __read((connectionIDs.source || "//").split("/"), 3), sourceSide = _a[0], sourceStepId = _a[1], sourcePort = _a[2];
        var _b = __read((connectionIDs.destination || "//").split("/"), 3), destSide = _b[0], destStepId = _b[1], destPort = _b[2];
        edge.classList.add("edge");
        if (sourceStepId) {
            edge.classList.add(sourceStepId);
        }
        if (destStepId) {
            edge.classList.add(destStepId);
        }
        edge.setAttribute("tabindex", "-1");
        edge.setAttribute("data-destination-node", destStepId);
        edge.setAttribute("data-destination-port", destPort);
        edge.setAttribute("data-source-port", sourcePort);
        edge.setAttribute("data-source-node", sourceStepId);
        edge.setAttribute("data-source-connection", connectionIDs.source);
        edge.setAttribute("data-destination-connection", connectionIDs.destination);
        edge.innerHTML = "\n            <path class=\"sub-edge outer\" d=\"" + pathStr + "\"></path>\n            <path class=\"sub-edge inner\" d=\"" + pathStr + "\"></path>\n        ";
        return edge;
    };
    Edge.spawnBetweenConnectionIDs = function (root, source, destination) {
        if (source.startsWith("in")) {
            var tmp = source;
            source = destination;
            destination = tmp;
        }
        var sourceNode = root.querySelector(".port[data-connection-id=\"" + source + "\"]");
        var destinationNode = root.querySelector(".port[data-connection-id=\"" + destination + "\"]");
        var sourceCTM = geometry_1.Geometry.getTransformToElement(sourceNode, root);
        var destCTM = geometry_1.Geometry.getTransformToElement(destinationNode, root);
        var path = io_port_1.IOPort.makeConnectionPath(sourceCTM.e, sourceCTM.f, destCTM.e, destCTM.f);
        // If there is already a connection between these ports, update that one instead
        var existingEdge = root.querySelector(".edge[data-source-connection=\"" + source + "\"][data-destination-connection=\"" + destination + "\"]");
        if (existingEdge) {
            console.log("Updating existing edge");
            try {
                for (var _a = __values(existingEdge.querySelectorAll(".sub-edge")), _b = _a.next(); !_b.done; _b = _a.next()) {
                    var sub = _b.value;
                    sub.setAttribute("d", path);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return existingEdge;
        }
        var edge = Edge.spawn(path, {
            source: source,
            destination: destination
        });
        var firstNode = root.querySelector(".node");
        root.insertBefore(edge, firstNode);
        return edge;
        var e_1, _c;
    };
    ;
    Edge.findEdge = function (root, sourceConnectionID, destinationConnectionID) {
        return root.querySelector("[data-source-connection=\"" + sourceConnectionID + "\"][data-destination-connection=\"" + destinationConnectionID + "\"]");
    };
    Edge.parseConnectionID = function (cid) {
        var _a = __read((cid || "//").split("/"), 3), side = _a[0], stepID = _a[1], portID = _a[2];
        return { side: side, stepID: stepID, portID: portID };
    };
    return Edge;
}());
exports.Edge = Edge;
//# sourceMappingURL=edge.js.map