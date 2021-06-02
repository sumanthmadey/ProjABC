"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HtmlUtils = /** @class */ (function () {
    function HtmlUtils() {
    }
    HtmlUtils.escapeHTML = function (source) {
        return String(source).replace(/[&<>"'\/]/g, function (s) { return HtmlUtils.entityMap[s]; });
    };
    HtmlUtils.entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "\"\"": "&quot;",
        "'": "&#39;",
        "/": "&#x2F;"
    };
    return HtmlUtils;
}());
exports.HtmlUtils = HtmlUtils;
//# sourceMappingURL=html-utils.js.map