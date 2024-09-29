import CanvasKitInit from "canvaskit-wasm";
import { Runtime } from "./runtime";

export type ApplicationOptions = {
    canvas: HTMLCanvasElement;
}

export class Application {
    private canvas: HTMLCanvasElement;
    constructor(options?: ApplicationOptions) {
        this.canvas = options?.canvas || document.createElement("canvas");
    }

    async init() {
        const CanvasKit = await CanvasKitInit({
            locateFile: (file) => `https://unpkg.com/canvaskit-wasm@0.39.1/bin/${file}`,
        });

        Runtime.canvasKit = CanvasKit;

        const surface = CanvasKit.MakeWebGLCanvasSurface(this.canvas);
        if (!surface) {
            throw new Error("Failed to create surface");
        }
        Runtime.surface = surface;
    }

}

