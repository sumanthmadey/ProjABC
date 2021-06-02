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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var EventHub = /** @class */ (function () {
    function EventHub(validEventList) {
        this.handlers = validEventList.reduce(function (acc, ev) {
            return Object.assign(acc, (_a = {}, _a[ev] = [], _a));
            var _a;
        }, {});
    }
    EventHub.prototype.on = function (event, handler) {
        var _this = this;
        this.guard(event, "subscribe to");
        this.handlers[event].push(handler);
        return function () { return _this.off(event, handler); };
    };
    EventHub.prototype.off = function (event, handler) {
        this.guard(event, "unsubscribe from");
        return this.handlers[event].splice(this.handlers[event].findIndex(function (h) { return handler === h; }), 1);
    };
    EventHub.prototype.emit = function (event) {
        var data = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            data[_i - 1] = arguments[_i];
        }
        this.guard(event, "emit");
        for (var i = 0; i < this.handlers[event].length; i++) {
            (_a = this.handlers[event])[i].apply(_a, __spread(data));
        }
        var _a;
    };
    EventHub.prototype.empty = function () {
        for (var event_1 in this.handlers) {
            this.handlers[event_1] = [];
        }
    };
    EventHub.prototype.guard = function (event, verb) {
        if (!this.handlers[event]) {
            console.warn("Trying to " + verb + " a non-supported event \u201C" + event + "\u201D. \n            Supported events are: " + Object.keys(this.handlers).join(", ") + "\u201D");
        }
    };
    return EventHub;
}());
exports.EventHub = EventHub;
//# sourceMappingURL=event-hub.js.map