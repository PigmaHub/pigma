import CanvasKitInit from "canvaskit-wasm";
import { Runtime } from "./runtime";

export type ApplicationOptions = {
	canvas: HTMLCanvasElement;
};

export class Application {
	private readonly canvas: HTMLCanvasElement;

	constructor(options?: ApplicationOptions) {
		this.canvas = options?.canvas ?? document.createElement("canvas");
	}

	async init(): Promise<void> {
		try {
			const CanvasKit = await CanvasKitInit({
				locateFile: (file) => {
					return `https://cdn.jsdelivr.net/gh/ZoeLeee/cdn@pigma/script/${file}`
				},
			});

			Runtime.canvasKit = CanvasKit;

			const surface = CanvasKit.MakeWebGLCanvasSurface(this.canvas);
			if (!surface) {
				throw new Error("无法创建surface");
			}

			Runtime.surface = surface;
			Runtime.paint = new CanvasKit.Paint();
		} catch (error) {
			console.error("初始化失败:", error);
			throw error;
		}
	}
}
