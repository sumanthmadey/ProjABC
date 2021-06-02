import { Workflow } from "../../";
import { PluginBase } from "../plugin-base";
export declare class SelectionPlugin extends PluginBase {
    static edgePortsDelimiter: string;
    private svg;
    private selection;
    private cleanups;
    private detachModelEvents;
    private selectionChangeCallbacks;
    private css;
    registerWorkflow(workflow: Workflow): void;
    afterRender(): void;
    afterModelChange(): void;
    destroy(): void;
    clearSelection(): void;
    getSelection(): Map<string, "edge" | "node">;
    registerOnSelectionChange(fn: (node: any) => any): void;
    selectStep(stepID: string): void;
    private bindModelEvents();
    private restoreSelection();
    private onClick(click);
    private materializeClickOnElement(target);
    private selectNode(element);
    private selectEdge(element);
    private emitChange(change);
}
