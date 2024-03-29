import { GraphChange, SVGPlugin } from "./plugin";
import { Workflow } from "../graph/workflow";
export declare abstract class PluginBase implements SVGPlugin {
    protected workflow: Workflow;
    /** plugin should trigger before a change is about to occur on the model */
    protected onBeforeChange: (change: GraphChange) => void;
    /** plugin should trigger after a change has occurred on the model */
    protected onAfterChange: (change: GraphChange) => void;
    /** plugin should trigger when internal svg elements have been deleted and new ones created */
    protected onAfterRender: (change: GraphChange) => void;
    registerWorkflow(workflow: Workflow): void;
    registerOnBeforeChange(fn: (change: GraphChange) => void): void;
    registerOnAfterChange(fn: (change: GraphChange) => void): void;
    registerOnAfterRender(fn: (change: GraphChange) => void): void;
}
