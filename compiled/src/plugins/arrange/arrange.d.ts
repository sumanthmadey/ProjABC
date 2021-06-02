import { Workflow } from '../../graph/workflow';
import { GraphChange, SVGPlugin } from '../plugin';
export declare class SVGArrangePlugin implements SVGPlugin {
    private workflow;
    private svgRoot;
    private onBeforeChange;
    private onAfterChange;
    private triggerAfterRender;
    registerWorkflow(workflow: Workflow): void;
    registerOnBeforeChange(fn: (change: GraphChange) => void): void;
    registerOnAfterChange(fn: (change: GraphChange) => void): void;
    registerOnAfterRender(fn: (change: GraphChange) => void): void;
    afterRender(): void;
    arrange(): NodePositionUpdates;
    /**
     * Calculates column dimensions and total graph area
     * @param {NodeIO[][]} columns
     */
    private calculateColumnSizes(columns);
    /**
     * Maps node's connectionID to a 1-indexed column number
     */
    private distributeNodesIntoColumns(graph);
    /**
     * Finds all nodes in the graph, and indexes them by their "data-connection-id" attribute
     */
    private indexNodesByID();
    /**
     * Finds length of the longest possible path from the graph root to a node.
     * Lengths are 1-indexed. When a node has no predecessors, it will have length of 1.
     */
    private traceLongestNodePathLength(node, nodeGraph, visited?);
    private makeNodeGraphs();
}
export declare type NodeIO = {
    inputs: string[];
    outputs: string[];
    connectionID: string;
    el: SVGGElement;
    rect: ClientRect;
    type: "step" | "input" | "output" | string;
};
export declare type NodeMap = {
    [connectionID: string]: NodeIO;
};
export declare type NodePositionUpdates = {
    [connectionID: string]: {
        x: number;
        y: number;
    };
};
