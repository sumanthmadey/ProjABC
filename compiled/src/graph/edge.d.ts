import { Edge as ModelEdge } from "cwlts/models";
export declare class Edge {
    static makeTemplate(edge: ModelEdge, containerNode: SVGGElement, connectionStates?: string): string;
    static spawn(pathStr?: string, connectionIDs?: {
        source?: string;
        destination?: string;
    }): SVGGElement;
    static spawnBetweenConnectionIDs(root: SVGElement, source: any, destination: any): Element | SVGGElement;
    static findEdge(root: any, sourceConnectionID: any, destinationConnectionID: any): any;
    static parseConnectionID(cid: any): {
        side: any;
        stepID: any;
        portID: any;
    };
}
