"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EdgePanner = /** @class */ (function () {
    function EdgePanner(workflow, config) {
        if (config === void 0) { config = {
            scrollMargin: 100,
            movementSpeed: 10
        }; }
        this.movementSpeed = 10;
        this.scrollMargin = 100;
        /**
         * Current state of collision on both axes, each negative if beyond top/left border,
         * positive if beyond right/bottom, zero if inside the viewport
         */
        this.collision = { x: 0, y: 0 };
        this.panningCallback = function (sdx, sdy) { return void 0; };
        var options = Object.assign({
            scrollMargin: 100,
            movementSpeed: 10
        }, config);
        this.workflow = workflow;
        this.scrollMargin = options.scrollMargin;
        this.movementSpeed = options.movementSpeed;
        this.viewportClientRect = this.workflow.svgRoot.getBoundingClientRect();
    }
    /**
     * Calculates if dragged node is at or beyond the point beyond which workflow panning should be triggered.
     * If collision state has changed, {@link onBoundaryCollisionChange} will be triggered.
     */
    EdgePanner.prototype.triggerCollisionDetection = function (x, y, callback) {
        var collision = { x: 0, y: 0 };
        this.panningCallback = callback;
        var _a = this.viewportClientRect, left = _a.left, right = _a.right, top = _a.top, bottom = _a.bottom;
        left = left + this.scrollMargin;
        right = right - this.scrollMargin;
        top = top + this.scrollMargin;
        bottom = bottom - this.scrollMargin;
        if (x < left) {
            collision.x = x - left;
        }
        else if (x > right) {
            collision.x = x - right;
        }
        if (y < top) {
            collision.y = y - top;
        }
        else if (y > bottom) {
            collision.y = y - bottom;
        }
        if (Math.sign(collision.x) !== Math.sign(this.collision.x)
            || Math.sign(collision.y) !== Math.sign(this.collision.y)) {
            var previous = this.collision;
            this.collision = collision;
            this.onBoundaryCollisionChange(collision, previous);
        }
    };
    /**
     * Triggered when {@link triggerCollisionDetection} determines that collision properties have changed.
     */
    EdgePanner.prototype.onBoundaryCollisionChange = function (current, previous) {
        this.stop();
        if (current.x === 0 && current.y === 0) {
            return;
        }
        this.start(this.collision);
    };
    EdgePanner.prototype.start = function (direction) {
        var _this = this;
        var startTimestamp;
        var scale = this.workflow.scale;
        var matrix = this.workflow.workflow.transform.baseVal.getItem(0).matrix;
        var sixtyFPS = 16.6666;
        var onFrame = function (timestamp) {
            var frameDeltaTime = timestamp - (startTimestamp || timestamp);
            startTimestamp = timestamp;
            // We need to stop the animation at some point
            // It should be stopped when there is no animation frame ID anymore,
            // which means that stopScroll() was called
            // However, don't do that if we haven't made the first move yet, which is a situation when ∆t is 0
            if (frameDeltaTime !== 0 && !_this.panAnimationFrame) {
                startTimestamp = undefined;
                return;
            }
            var moveX = Math.sign(direction.x) * _this.movementSpeed * frameDeltaTime / sixtyFPS;
            var moveY = Math.sign(direction.y) * _this.movementSpeed * frameDeltaTime / sixtyFPS;
            matrix.e -= moveX;
            matrix.f -= moveY;
            var frameDiffX = moveX / scale;
            var frameDiffY = moveY / scale;
            _this.panningCallback(frameDiffX, frameDiffY);
            _this.panAnimationFrame = window.requestAnimationFrame(onFrame);
        };
        this.panAnimationFrame = window.requestAnimationFrame(onFrame);
    };
    EdgePanner.prototype.stop = function () {
        window.cancelAnimationFrame(this.panAnimationFrame);
        this.panAnimationFrame = undefined;
    };
    return EdgePanner;
}());
exports.EdgePanner = EdgePanner;
//# sourceMappingURL=edge-panning.js.map