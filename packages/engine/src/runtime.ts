import type { CanvasKit, Surface } from "canvaskit-wasm";

export const Runtime = {
    canvasKit: null as unknown as CanvasKit,
    surface: null as unknown as Surface,
    update(){
        this.surface.flush();
    }
} as {
    canvasKit: CanvasKit;
    surface: Surface;
    update: () => void;
};

