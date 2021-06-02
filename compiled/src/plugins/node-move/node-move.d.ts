import { Workflow } from "../../";
import { PluginBase } from "../plugin-base";
export interface ConstructorParams {
    movementSpeed?: number;
    scrollMargin?: number;
}
/**
 * This plugin makes node dragging and movement possible.
 *
 * @FIXME: attach events for before and after change
 */
export declare class SVGNodeMovePlugin extends PluginBase {
    /** Difference in movement on the X axis since drag start, adapted for scale and possibly panned distance */
    private sdx;
    /** Difference in movement on the Y axis since drag start, adapted for scale and possibly panned distance */
    private sdy;
    /** Stored onDragStart so we can put node to a fixed position determined by startX + ∆x */
    private startX;
    /** Stored onDragStart so we can put node to a fixed position determined by startY + ∆y */
    private startY;
    /** How far from the edge of the viewport does mouse need to be before panning is triggered */
    private scrollMargin;
    /** How fast does workflow move while panning */
    private movementSpeed;
    /** Holds an element that is currently being dragged. Stored onDragStart and translated afterwards. */
    private movingNode;
    /** Stored onDragStart to detect collision with viewport edges */
    private boundingClientRect;
    /** Cache input edges and their parsed bezier curve parameters so we don't query for them on each mouse move */
    private inputEdges;
    /** Cache output edges and their parsed bezier curve parameters so we don't query for them on each mouse move */
    private outputEdges;
    /** Workflow panning at the time of onDragStart, used to adjust ∆x and ∆y while panning */
    private startWorkflowTranslation;
    private wheelPrevent;
    private boundMoveHandler;
    private boundMoveStartHandler;
    private boundMoveEndHandler;
    private detachDragListenerFn;
    private edgePanner;
    constructor(parameters?: ConstructorParams);
    onEditableStateChange(enabled: boolean): void;
    afterRender(): void;
    destroy(): void;
    registerWorkflow(workflow: Workflow): void;
    private detachDrag();
    private attachDrag();
    private getWorkflowMatrix();
    private onMove(dx, dy, ev);
    /**
     * Triggered from {@link attachDrag} when drag starts.
     * This method initializes properties that are needed for calculations during movement.
     */
    private onMoveStart(event, handle);
    private translateNodeBy(node, x?, y?);
    private translateNodeTo(node, x?, y?);
    /**
     * Redraws stored input and output edges so as to transform them with respect to
     * scaled transformation differences, sdx and sdy.
     */
    private redrawEdges(sdx, sdy);
    /**
     * Triggered from {@link attachDrag} after move event ends
     */
    private onMoveEnd();
}
