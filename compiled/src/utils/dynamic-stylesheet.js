"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DynamicStylesheet = /** @class */ (function () {
    function DynamicStylesheet(workflow) {
        this.innerStyle = "";
        this.styleElement = document.createElement("style");
        this.styleElement.type = "text/css";
        this.scopedSelector = "svg." + workflow.svgID;
        document.getElementsByTagName("head")[0].appendChild(this.styleElement);
    }
    DynamicStylesheet.prototype.remove = function () {
        this.styleElement.remove();
    };
    DynamicStylesheet.prototype.set = function (style) {
        this.innerStyle = style;
        this.styleElement.innerHTML = "\n            " + this.scopedSelector + " {\n                " + this.innerStyle + "\n            }\n        ";
    };
    return DynamicStylesheet;
}());
exports.DynamicStylesheet = DynamicStylesheet;
//# sourceMappingURL=dynamic-stylesheet.js.map