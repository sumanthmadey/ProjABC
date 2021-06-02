import { PluginBase } from "../plugin-base";
import { Workflow } from "../../";
export declare class SVGPortDragPlugin extends PluginBase {
    /** Stored on drag start to detect collision with viewport edges */
    private boundingClientRect;
    private portOrigins;
    /** Group of edges (compound element) leading from origin port to ghost node */
    private edgeGroup;
    /** Coordinates of the node from which dragged port originates, stored so we can measure the distance from it */
    private nodeCoords;
    /** Reference to a node that marks a new input/output creation */
    private ghostNode;
    /** How far away from the port you need to drag in order to create a new input/output instead of snapping */
    private snapRadius;
    /** Tells if the port is on the left or on the right side of a node */
    private portType;
    /** Stores a port to which a connection would snap if user stops the drag */
    private snapPort;
    /** Map of CSS classes attached by this plugin */
    private css;
    /** Port from which we initiated the drag */
    private originPort;
    private detachDragListenerFn;
    private wheelPrevent;
    private panner;
    private ghostX;
    private ghostY;
    private portOnCanvas;
    private lastMouseMove;
    registerWorkflow(workflow: Workflow): void;
    afterRender(): void;
    onEditableStateChange(enabled: boolean): void;
    destroy(): void;
    detachPortDrag(): void;
    attachPortDrag(): void;
    onMove(dx: number, dy: number, ev: MouseEvent, portElement: SVGGElement): void;
    /**
     * @FIXME: Add panning
     * @param {MouseEvent} ev
     * @param {SVGGElement} portEl
     */
    onMoveStart(ev: MouseEvent, portEl: SVGGElement): void;
    onMoveEnd(ev: MouseEvent): void;
    private updateSnapPort(closestPort, closestPortDistance);
    private updateEdge(fromX, fromY, toX, toY);
    private updateGhostNodeVisibility(distanceToMouse, distanceToClosestPort);
    private translateGhostNode(x, y);
    private getPortCandidateTransformations(portEl);
    /**
     * Highlights ports that are model says are suggested.
     * Also marks their parent nodes as highlighted.
     *
     * @param {string} targetConnectionID ConnectionID of the origin port
     */
    private highlightSuggestedPorts(targetConnectionID);
    /**
     * @FIXME: GraphNode.radius should somehow come through Workflow,
     */
    private createGhostNode(type);
    /**
     * Finds a port closest to given SVG coordinates.
     */
    private findClosestPort(x, y);
    /**
     * Removes all dom elements and objects cached in-memory during dragging that are no longer needed.
     */
    private cleanMemory();
    /**
     * Removes all css classes attached by this plugin
     */
    private cleanStyles();
    /**
     * Creates an edge (connection) between two elements determined by their connection IDs
     * This edge is created on the model, and not rendered directly on graph, as main workflow
     * is supposed to catch the creation event and draw it.
     */
    private createEdgeBetweenPorts(source, destination);
    private findEdge(sourceID, destinationID);
}
