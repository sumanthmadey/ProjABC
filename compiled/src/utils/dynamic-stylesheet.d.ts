import { Workflow } from "../";
export declare class DynamicStylesheet {
    private styleElement;
    private scopedSelector;
    private innerStyle;
    constructor(workflow: Workflow);
    remove(): void;
    set(style: string): void;
}
