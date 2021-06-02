"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TemplateParser = /** @class */ (function () {
    function TemplateParser() {
    }
    TemplateParser.parse = function (tpl) {
        var ns = "http://www.w3.org/2000/svg";
        var node = document.createElementNS(ns, "g");
        node.innerHTML = tpl;
        return node.firstElementChild;
    };
    return TemplateParser;
}());
exports.TemplateParser = TemplateParser;
//# sourceMappingURL=template-parser.js.map