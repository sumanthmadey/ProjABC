import { Workflow } from "../";
export declare class EdgePanner {
    /** ID of the requested animation frame for panning */
    private panAnimationFrame;
    private workflow;
    private movementSpeed;
    private scrollMargin;
    /**
     * Current state of collision on both axes, each negative if beyond top/left border,
     * positive if beyond right/bottom, zero if inside the viewport
     */
    private collision;
    private viewportClientRect;
    private panningCallback;
    constructor(workflow: Workflow, config?: {
        scrollMargin: number;
        movementSpeed: number;
    });
    /**
     * Calculates if dragged node is at or beyond the point beyond which workflow panning should be triggered.
     * If collision state has changed, {@link onBoundaryCollisionChange} will be triggered.
     */
    triggerCollisionDetection(x: number, y: number, callback: (sdx: number, sdy: number) => void): void;
    /**
     * Triggered when {@link triggerCollisionDetection} determines that collision properties have changed.
     */
    private onBoundaryCollisionChange(current, previous);
    private start(direction);
    stop(): void;
}
