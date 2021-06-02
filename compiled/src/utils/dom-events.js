"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DomEvents = /** @class */ (function () {
    function DomEvents(root) {
        this.root = root;
        this.handlers = new Map();
    }
    DomEvents.prototype.on = function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var event = args.shift();
        var selector = typeof args[0] === "string" ? args.shift() : undefined;
        var handler = typeof args[0] === "function" ? args.shift() : function () {
        };
        var root = args.shift();
        var eventHolder = root || this.root;
        if (!this.handlers.has(eventHolder)) {
            this.handlers.set(eventHolder, {});
        }
        if (!this.handlers.get(eventHolder)[event]) {
            this.handlers.get(eventHolder)[event] = [];
        }
        var evListener = function (ev) {
            var target;
            if (selector) {
                var selected = Array.from(_this.root.querySelectorAll(selector));
                target = ev.target;
                while (target) {
                    if (selected.find(function (el) { return el === target; })) {
                        break;
                    }
                    target = target.parentNode;
                }
                if (!target) {
                    return;
                }
            }
            var handlerOutput = handler(ev, target || ev.target, _this.root);
            if (handlerOutput === false) {
                return false;
            }
            return false;
        };
        eventHolder.addEventListener(event, evListener);
        this.handlers.get(eventHolder)[event].push(evListener);
        return function off() {
            eventHolder.removeEventListener(event, evListener);
        };
    };
    DomEvents.prototype.keyup = function () {
    };
    DomEvents.prototype.adaptedDrag = function (selector, move, start, end) {
        var _this = this;
        var dragging = false;
        var lastMove;
        var draggedEl;
        var moveEventCount = 0;
        var mouseDownEv;
        var threshold = 3;
        var mouseOverListeners;
        var onMouseDown = function (ev, el) {
            dragging = true;
            lastMove = ev;
            draggedEl = el;
            mouseDownEv = ev;
            ev.preventDefault();
            mouseOverListeners = _this.detachHandlers("mouseover");
            document.addEventListener("mousemove", moveHandler);
            document.addEventListener("mouseup", upHandler);
            return false;
        };
        var off = this.on("mousedown", selector, onMouseDown);
        var moveHandler = function (ev) {
            if (!dragging) {
                return;
            }
            var dx = ev.screenX - lastMove.screenX;
            var dy = ev.screenY - lastMove.screenY;
            moveEventCount++;
            if (moveEventCount === threshold && typeof start === "function") {
                start(mouseDownEv, draggedEl, _this.root);
            }
            if (moveEventCount >= threshold && typeof move === "function") {
                move(dx, dy, ev, draggedEl, _this.root);
            }
        };
        var upHandler = function (ev) {
            if (moveEventCount >= threshold) {
                if (dragging) {
                    if (typeof end === "function") {
                        end(ev, draggedEl, _this.root);
                    }
                }
                var parentNode_1 = draggedEl.parentNode;
                var clickCancellation_1 = function (ev) {
                    ev.stopPropagation();
                    parentNode_1.removeEventListener("click", clickCancellation_1, true);
                };
                parentNode_1.addEventListener("click", clickCancellation_1, true);
            }
            dragging = false;
            draggedEl = undefined;
            lastMove = undefined;
            moveEventCount = 0;
            document.removeEventListener("mouseup", upHandler);
            document.removeEventListener("mousemove", moveHandler);
            for (var i in mouseOverListeners) {
                _this.root.addEventListener("mouseover", mouseOverListeners[i]);
                _this.handlers.get(_this.root)["mouseover"] = [];
                _this.handlers.get(_this.root)["mouseover"].push(mouseOverListeners[i]);
            }
        };
        return off;
    };
    DomEvents.prototype.drag = function (selector, move, start, end) {
        var _this = this;
        var dragging = false;
        var lastMove;
        var draggedEl;
        var moveEventCount = 0;
        var mouseDownEv;
        var threshold = 3;
        var mouseOverListeners;
        var onMouseDown = function (ev, el, root) {
            dragging = true;
            lastMove = ev;
            draggedEl = el;
            mouseDownEv = ev;
            ev.preventDefault();
            mouseOverListeners = _this.detachHandlers("mouseover");
            document.addEventListener("mousemove", moveHandler);
            document.addEventListener("mouseup", upHandler);
            return false;
        };
        var off = this.on("mousedown", selector, onMouseDown);
        var moveHandler = function (ev) {
            if (!dragging) {
                return;
            }
            var dx = ev.screenX - lastMove.screenX;
            var dy = ev.screenY - lastMove.screenY;
            moveEventCount++;
            if (moveEventCount === threshold && typeof start === "function") {
                start(mouseDownEv, draggedEl, _this.root);
            }
            if (moveEventCount >= threshold && typeof move === "function") {
                move(dx, dy, ev, draggedEl, _this.root);
            }
        };
        var upHandler = function (ev) {
            if (moveEventCount >= threshold) {
                if (dragging) {
                    if (typeof end === "function") {
                        end(ev, draggedEl, _this.root);
                    }
                }
                // When releasing the mouse button, if it happens over the same element that we initially had
                // the mouseDown event, it will trigger a click event. We want to stop that, so we intercept
                // it by capturing click top-down and stopping its propagation.
                // However, if the mouseUp didn't happen above the starting element, it wouldn't trigger a click,
                // but it would intercept the next (unrelated) click event unless we prevent interception in the
                // first place by checking if we released above the starting element.
                if (draggedEl.contains(ev.target)) {
                    var parentNode_2 = draggedEl.parentNode;
                    var clickCancellation_2 = function (ev) {
                        ev.stopPropagation();
                        parentNode_2.removeEventListener("click", clickCancellation_2, true);
                    };
                    parentNode_2.addEventListener("click", clickCancellation_2, true);
                }
            }
            dragging = false;
            draggedEl = undefined;
            lastMove = undefined;
            moveEventCount = 0;
            document.removeEventListener("mouseup", upHandler);
            document.removeEventListener("mousemove", moveHandler);
            for (var i in mouseOverListeners) {
                _this.root.addEventListener("mouseover", mouseOverListeners[i]);
                _this.handlers.get(_this.root)["mouseover"] = [];
                _this.handlers.get(_this.root)["mouseover"].push(mouseOverListeners[i]);
            }
        };
        return off;
    };
    DomEvents.prototype.hover = function (element, hover, enter, leave) {
        var _this = this;
        if (hover === void 0) { hover = function () {
        }; }
        if (enter === void 0) { enter = function () {
        }; }
        if (leave === void 0) { leave = function () {
        }; }
        var hovering = false;
        element.addEventListener("mouseenter", function (ev) {
            hovering = true;
            enter(ev, element, _this.root);
        });
        element.addEventListener("mouseleave", function (ev) {
            hovering = false;
            leave(ev, element, _this.root);
        });
        element.addEventListener("mousemove", function (ev) {
            if (!hovering) {
                return;
            }
            hover(ev, element, _this.root);
        });
    };
    DomEvents.prototype.detachHandlers = function (evName, root) {
        root = root || this.root;
        var eventListeners = [];
        this.handlers.forEach(function (handlers, listenerRoot) {
            if (listenerRoot.id !== root.id || listenerRoot !== root) {
                return;
            }
            var _loop_1 = function (eventName) {
                if (eventName !== evName) {
                    return "continue";
                }
                handlers[eventName].forEach(function (handler) {
                    eventListeners.push(handler);
                    listenerRoot.removeEventListener(eventName, handler);
                });
            };
            for (var eventName in handlers) {
                _loop_1(eventName);
            }
        });
        delete this.handlers.get(this.root)[evName];
        return eventListeners;
    };
    DomEvents.prototype.detachAll = function () {
        this.handlers.forEach(function (handlers, listenerRoot) {
            var _loop_2 = function (eventName) {
                handlers[eventName].forEach(function (handler) { return listenerRoot.removeEventListener(eventName, handler); });
            };
            for (var eventName in handlers) {
                _loop_2(eventName);
            }
        });
        this.handlers.clear();
    };
    return DomEvents;
}());
exports.DomEvents = DomEvents;
//# sourceMappingURL=dom-events.js.map