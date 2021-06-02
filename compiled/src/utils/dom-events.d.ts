export declare class DomEvents {
    private root;
    private handlers;
    constructor(root: HTMLElement);
    on(event: string, selector: string, handler: (UIEvent, target?: Element, root?: Element) => any, root?: any): any;
    on(event: string, handler: (UIEvent, target?: Element, root?: Element) => any, root?: any): any;
    keyup(): void;
    adaptedDrag(selector: string, move?: (dx: number, dy: number, UIEvent, target?: Element, root?: Element) => any, start?: (UIEvent, target?: Element, root?: Element) => any, end?: (UIEvent, target?: Element, root?: Element) => any): any;
    drag(selector: any, move?: (dx: number, dy: number, UIEvent, target?: Element, root?: Element) => any, start?: (UIEvent, target?: Element, root?: Element) => any, end?: (UIEvent, target?: Element, root?: Element) => any): any;
    hover(element: any, hover?: (UIEvent, target?: HTMLElement, root?: HTMLElement) => any, enter?: (UIEvent, target?: HTMLElement, root?: HTMLElement) => any, leave?: (UIEvent, target?: HTMLElement, root?: HTMLElement) => any): void;
    detachHandlers(evName: string, root?: any): EventListener[];
    detachAll(): void;
}
