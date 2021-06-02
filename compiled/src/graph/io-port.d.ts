export declare class IOPort {
    static radius: number;
    /**
     * @param x1
     * @param y1
     * @param x2
     * @param y2
     * @param {"right" | "left" | string} forceDirection
     * @returns {string}
     */
    static makeConnectionPath(x1: any, y1: any, x2: any, y2: any, forceDirection?: "right" | "left" | string): string;
}
