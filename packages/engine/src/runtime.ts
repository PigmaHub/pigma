import type { CanvasKit, Paint, Surface } from "canvaskit-wasm";

export const Runtime = {
    canvasKit: null as unknown as CanvasKit,
    surface: null as unknown as Surface,
    paint: null as unknown as Paint,
    update(){
        this.surface.flush();
    }
} as {
    canvasKit: CanvasKit;
    surface: Surface;
    paint: Paint;
    update: () => void;
};

