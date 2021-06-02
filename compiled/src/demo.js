"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./assets/styles/themes/rabix-dark/theme");
require("./plugins/port-drag/theme.dark.scss");
require("./plugins/selection/theme.dark.scss");
// import "./assets/styles/theme";
// import "./plugins/port-drag/theme.scss";
// import "./plugins/selection/theme.scss";
var models_1 = require("cwlts/models");
var workflow_1 = require("./graph/workflow");
var arrange_1 = require("./plugins/arrange/arrange");
var node_move_1 = require("./plugins/node-move/node-move");
var port_drag_1 = require("./plugins/port-drag/port-drag");
var selection_1 = require("./plugins/selection/selection");
var edge_hover_1 = require("./plugins/edge-hover/edge-hover");
var zoom_1 = require("./plugins/zoom/zoom");
var sample = require(__dirname + "/../cwl-samples/rna-seq-alignment.json");
var wf = models_1.WorkflowFactory.from(sample);
var svgRoot = document.getElementById("svg");
var workflow = new workflow_1.Workflow({
    model: wf,
    svgRoot: svgRoot,
    plugins: [
        new arrange_1.SVGArrangePlugin(),
        new edge_hover_1.SVGEdgeHoverPlugin(),
        new node_move_1.SVGNodeMovePlugin({
            movementSpeed: 10
        }),
        new port_drag_1.SVGPortDragPlugin(),
        new selection_1.SelectionPlugin(),
        new zoom_1.ZoomPlugin(),
    ]
});
// workflow.getPlugin(SVGArrangePlugin).arrange();
window["wf"] = workflow;
//# sourceMappingURL=demo.js.map