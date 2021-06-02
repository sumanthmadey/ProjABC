import { PluginBase } from "../plugin-base";
import { Workflow } from "../../graph/workflow";
export declare class SVGValidatePlugin extends PluginBase {
    private modelDisposers;
    /** Map of CSS classes attached by this plugin */
    private css;
    registerWorkflow(workflow: Workflow): void;
    afterModelChange(): void;
    destroy(): void;
    afterRender(): void;
    onEditableStateChange(enabled: boolean): void;
    private disposeModelListeners();
    private removeClasses(edges);
    private renderEdgeValidation();
}
