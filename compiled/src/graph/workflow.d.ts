import { WorkflowModel } from "cwlts/models/generic/WorkflowModel";
import { SVGPlugin } from "../plugins/plugin";
import { DomEvents } from "../utils/dom-events";
import { EventHub } from "../utils/event-hub";
/**
 * @FIXME validation states of old and newly created edges
 */
export declare class Workflow {
    readonly eventHub: EventHub;
    readonly svgID: string;
    minScale: number;
    maxScale: number;
    domEvents: DomEvents;
    svgRoot: SVGSVGElement;
    workflow: SVGGElement;
    model: WorkflowModel;
    editingEnabled: boolean;
    /** Scale of labels, they are different than scale of other elements in the workflow */
    labelScale: number;
    private workflowBoundingClientRect;
    private plugins;
    private disposers;
    private pendingFirstDraw;
    /** Stored in order to ensure that once destroyed graph cannot be reused again */
    private isDestroyed;
    constructor(parameters: {
        svgRoot: SVGSVGElement;
        model: WorkflowModel;
        plugins?: SVGPlugin[];
        editingEnabled?: boolean;
    });
    /** Current scale of the document */
    private _scale;
    scale: number;
    static canDrawIn(element: SVGElement): boolean;
    static makeConnectionPath(x1: any, y1: any, x2: any, y2: any, forceDirection?: "right" | "left" | string): string;
    draw(model?: WorkflowModel): void;
    findParent(el: Element, parentClass?: string): SVGGElement | undefined;
    /**
     * Retrieves a plugin instance
     * @param {{new(...args: any[]) => T}} plugin
     * @returns {T}
     */
    getPlugin<T extends SVGPlugin>(plugin: {
        new (...args: any[]): T;
    }): T;
    on(event: string, handler: any): void;
    off(event: any, handler: any): void;
    /**
     * Scales the workflow to fit the available viewport
     */
    fitToViewport(ignoreScaleLimits?: boolean): void;
    redrawEdges(): void;
    /**
     * Scale the workflow by the scaleCoefficient (not compounded) over given coordinates
     */
    scaleAtPoint(scale?: number, x?: number, y?: number): void;
    transformScreenCTMtoCanvas(x: any, y: any): {
        x: number;
        y: number;
    };
    enableEditing(enabled: boolean): void;
    destroy(): void;
    resetTransform(): void;
    private assertNotDestroyed(method);
    private addEventListeners();
    private clearCanvas();
    private hookPlugins();
    private invokePlugins(methodName, ...args);
    /**
     * Listener for “connection.create” event on model that renders new edges on canvas
     */
    private onConnectionCreate(source, destination);
    /**
     * Listener for "connection.remove" event on the model that disconnects nodes
     */
    private onConnectionRemove(source, destination);
    /**
     * Listener for “input.create” event on model that renders workflow inputs
     */
    private onInputCreate(input);
    /**
     * Listener for “output.create” event on model that renders workflow outputs
     */
    private onOutputCreate(output);
    private onStepCreate(step);
    private onStepChange(change);
    private onInputPortShow(input);
    private onInputPortHide(input);
    private onOutputPortCreate(output);
    private onOutputPortRemove(output);
    /**
     * Listener for "step.remove" event on model which removes steps
     */
    private onStepRemove(step);
    /**
     * Listener for "input.remove" event on model which removes inputs
     */
    private onInputRemove(input);
    /**
     * Listener for "output.remove" event on model which removes outputs
     */
    private onOutputRemove(output);
    private makeID(length?);
}
