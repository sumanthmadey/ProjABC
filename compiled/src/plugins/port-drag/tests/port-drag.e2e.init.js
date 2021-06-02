"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../../../assets/styles/theme");
require("../theme");
var models_1 = require("cwlts/models");
var _1 = require("../../../");
var port_drag_1 = require("../port-drag");
var model = models_1.WorkflowFactory.from(require(__dirname + "/app.json"));
var svgRoot = document.getElementById("svg");
var wf = new _1.Workflow({
    model: model,
    svgRoot: svgRoot,
    plugins: [
        new port_drag_1.SVGPortDragPlugin(),
        new _1.SVGEdgeHoverPlugin(),
        new _1.SVGNodeMovePlugin()
    ]
});
wf.fitToViewport();
wf.enableEditing(true);
window["wf"] = wf;
//# sourceMappingURL=port-drag.e2e.init.js.map