"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../../../assets/styles/theme");
var models_1 = require("cwlts/models");
var _1 = require("../../../");
var node_move_1 = require("../node-move");
var model = models_1.WorkflowFactory.from(require(__dirname + "/app.json"));
var svgRoot = document.getElementById("svg");
new _1.Workflow({
    model: model,
    svgRoot: svgRoot,
    plugins: [
        new node_move_1.SVGNodeMovePlugin({
            movementSpeed: 10
        })
    ]
});
//# sourceMappingURL=node-move.e2e.init.js.map