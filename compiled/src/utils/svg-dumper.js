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
Object.defineProperty(exports, "__esModule", { value: true });
var SvgDumper = /** @class */ (function () {
    function SvgDumper(svg) {
        this.containerElements = ["svg", "g"];
        this.embeddableStyles = {
            "rect": ["fill", "stroke", "stroke-width"],
            "path": ["fill", "stroke", "stroke-width"],
            "circle": ["fill", "stroke", "stroke-width"],
            "line": ["stroke", "stroke-width"],
            "text": ["fill", "font-size", "text-anchor", "font-family"],
            "polygon": ["stroke", "fill"]
        };
        this.svg = svg;
    }
    SvgDumper.prototype.dump = function (_a) {
        var padding = (_a === void 0 ? { padding: 50 } : _a).padding;
        this.adaptViewbox(this.svg, padding);
        var clone = this.svg.cloneNode(true);
        var portLabels = clone.querySelectorAll(".port .label");
        try {
            for (var portLabels_1 = __values(portLabels), portLabels_1_1 = portLabels_1.next(); !portLabels_1_1.done; portLabels_1_1 = portLabels_1.next()) {
                var label = portLabels_1_1.value;
                label.parentNode.removeChild(label);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (portLabels_1_1 && !portLabels_1_1.done && (_b = portLabels_1.return)) _b.call(portLabels_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        this.treeShakeStyles(clone, this.svg);
        // Remove panning handle so we don't have to align it
        var panHandle = clone.querySelector(".pan-handle");
        if (panHandle) {
            clone.removeChild(panHandle);
        }
        return new XMLSerializer().serializeToString(clone);
        var e_1, _b;
    };
    SvgDumper.prototype.adaptViewbox = function (svg, padding) {
        if (padding === void 0) { padding = 50; }
        var workflow = svg.querySelector(".workflow");
        var rect = workflow.getBoundingClientRect();
        var origin = this.getPointOnSVG(rect.left, rect.top);
        var viewBox = this.svg.viewBox.baseVal;
        viewBox.x = origin.x - padding / 2;
        viewBox.y = origin.y - padding / 2;
        viewBox.height = rect.height + padding;
        viewBox.width = rect.width + padding;
    };
    SvgDumper.prototype.getPointOnSVG = function (x, y) {
        var svgCTM = this.svg.getScreenCTM();
        var point = this.svg.createSVGPoint();
        point.x = x;
        point.y = y;
        return point.matrixTransform(svgCTM.inverse());
    };
    SvgDumper.prototype.treeShakeStyles = function (clone, original) {
        var children = clone.childNodes;
        var originalChildrenData = original.childNodes;
        for (var childIndex = 0; childIndex < children.length; childIndex++) {
            var child = children[childIndex];
            var tagName = child.tagName;
            if (this.containerElements.indexOf(tagName) !== -1) {
                this.treeShakeStyles(child, originalChildrenData[childIndex]);
            }
            else if (tagName in this.embeddableStyles) {
                var styleDefinition = window.getComputedStyle(originalChildrenData[childIndex]);
                var styleString = "";
                for (var st = 0; st < this.embeddableStyles[tagName].length; st++) {
                    styleString +=
                        this.embeddableStyles[tagName][st]
                            + ":"
                            + styleDefinition.getPropertyValue(this.embeddableStyles[tagName][st])
                            + "; ";
                }
                child.setAttribute("style", styleString);
            }
        }
    };
    return SvgDumper;
}());
exports.SvgDumper = SvgDumper;
//# sourceMappingURL=svg-dumper.js.map