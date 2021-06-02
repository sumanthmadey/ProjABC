import { ParameterTypeModel, StepModel, WorkflowInputParameterModel, WorkflowOutputParameterModel } from "cwlts/models";
export declare type NodePosition = {
    x: number;
    y: number;
};
export declare type NodeDataModel = WorkflowInputParameterModel | WorkflowOutputParameterModel | StepModel;
export declare class GraphNode {
    private dataModel;
    position: NodePosition;
    static radius: number;
    constructor(position: Partial<NodePosition>, dataModel: NodeDataModel);
    /**
     * @FIXME Making icons increases the rendering time by 50-100%. Try embedding the SVG directly.
     */
    private static workflowIconSvg;
    private static toolIconSvg;
    private static fileInputIconSvg;
    private static fileOutputIconSvg;
    private static inputIconSvg;
    private static outputIconSvg;
    private static makeIconFragment(model);
    static makeTemplate(dataModel: {
        id: string;
        connectionId: string;
        label?: string;
        in?: any[];
        type?: ParameterTypeModel;
        out?: any[];
        customProps?: {
            "sbg:x"?: number;
            "sbg:y"?: number;
        };
    }, labelScale?: number): string;
    private static makePortTemplate(port, type, transform?);
    static createPortMatrix(totalPortLength: number, portIndex: number, radius: number, type: "input" | "output"): SVGMatrix;
    static patchModelPorts<T>(model: T & {
        connectionId: string;
        id: string;
    }): T;
}
