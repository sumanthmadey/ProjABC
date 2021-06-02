import { PluginBase } from "../plugin-base";
export declare class SVGEdgeHoverPlugin extends PluginBase {
    private boundEdgeEnterFunction;
    private modelListener;
    afterRender(): void;
    destroy(): void;
    private attachEdgeHoverBehavior();
    private detachEdgeHoverBehavior();
    private onEdgeEnter(ev);
}
