"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Perf = /** @class */ (function () {
    function Perf() {
    }
    Perf.throttle = function (fn, threshold, context) {
        if (threshold === void 0) { threshold = Perf.DEFAULT_THROTTLE; }
        var last, deferTimer;
        return function () {
            var scope = context || this;
            var now = +new Date, args = arguments;
            if (last && now < last + threshold) {
                clearTimeout(deferTimer);
                deferTimer = setTimeout(function () {
                    last = now;
                    fn.apply(scope, args);
                }, threshold);
            }
            else {
                last = now;
                fn.apply(scope, args);
            }
        };
    };
    Perf.DEFAULT_THROTTLE = 1;
    return Perf;
}());
exports.Perf = Perf;
//# sourceMappingURL=perf.js.map