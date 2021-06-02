"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../../../assets/styles/theme");
var models_1 = require("cwlts/models");
var _1 = require("../../../");
var app = require(__dirname + "/app.json");
var model = models_1.WorkflowFactory.from(app);
var svgRoot = document.getElementById("svg");
var graph = new _1.Workflow({
    model: model,
    svgRoot: svgRoot,
    plugins: [new _1.ZoomPlugin()],
    editingEnabled: true
});
graph.fitToViewport();
Object.assign(window, {
    graph: graph,
    app: app,
    model: model
});
//# sourceMappingURL=zoom.e2e.init.js.map