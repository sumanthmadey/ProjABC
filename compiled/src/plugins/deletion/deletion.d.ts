import { PluginBase } from "../plugin-base";
export declare class DeletionPlugin extends PluginBase {
    private boundDeleteFunction;
    afterRender(): void;
    onEditableStateChange(enable: boolean): void;
    private attachDeleteBehavior();
    private detachDeleteBehavior();
    private onDelete(ev);
    deleteSelection(): void;
    destroy(): void;
}
