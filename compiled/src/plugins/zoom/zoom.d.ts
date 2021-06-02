import { Workflow } from "../../";
import { PluginBase } from "../plugin-base";
export declare class ZoomPlugin extends PluginBase {
    private svg;
    private dispose;
    registerWorkflow(workflow: Workflow): void;
    attachWheelListener(): () => void;
    onMouseWheel(event: MouseWheelEvent): void;
    destroy(): void;
}
