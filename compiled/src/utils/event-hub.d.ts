export declare class EventHub {
    readonly handlers: {
        [event: string]: Function[];
    };
    constructor(validEventList: string[]);
    on(event: keyof this["handlers"], handler: any): () => Function[];
    off(event: keyof this["handlers"], handler: any): Function[];
    emit(event: any, ...data: any[]): void;
    empty(): void;
    private guard(event, verb);
}
