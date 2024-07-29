import CanvasKitInit from "canvaskit-wasm";
import { onCleanup, onMount } from "solid-js";

// src/canvasKitInit.js

async function initCanvasKit() {
  const CanvasKit = await CanvasKitInit({
    locateFile: (file) => `https://unpkg.com/canvaskit-wasm@0.39.1/bin/${file}`,
  });
  return CanvasKit;
}

export function Designer() {
  let canvasRef: HTMLCanvasElement = null!;
  let surface: any = null!;

  onMount(async () => {
    const CanvasKit = await initCanvasKit();
    surface = CanvasKit.MakeCanvasSurface(canvasRef);
    if (!surface) {
      throw new Error("Cannot find canvas");
    }
    const canvas = surface.getCanvas();

    const paint = new CanvasKit.Paint();
    paint.setColor(CanvasKit.Color(0, 0, 255, 1.0)); // 蓝色
    paint.setStyle(CanvasKit.PaintStyle.Fill);

    const rect = CanvasKit.LTRBRect(10, 10, 50, 50);
    canvas.drawRect(rect, paint);

    surface.flush();
    paint.delete();
  });

  onCleanup(() => {
    if (surface) {
      surface.dispose();
    }
  });

  return (
    <div>
      <canvas
        ref={canvasRef}
        id="your-canvas-id"
        width="800"
        height="600"
      ></canvas>
    </div>
  );
}
