import { StepModel } from "cwlts/models";
export declare class StepNode {
    private svg;
    private stepEl;
    private model;
    constructor(element: SVGElement, stepModel: StepModel);
    update(): void;
}
