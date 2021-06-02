export declare class SvgDumper {
    private svg;
    private containerElements;
    private embeddableStyles;
    constructor(svg: SVGSVGElement);
    dump({padding}?: {
        padding: number;
    }): string;
    private adaptViewbox(svg, padding?);
    private getPointOnSVG(x, y);
    private treeShakeStyles(clone, original);
}
