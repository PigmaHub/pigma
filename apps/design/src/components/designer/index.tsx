import { Application, Rect, Runtime } from "@pigma/engine";
import { onCleanup, onMount } from "solid-js";

export function Designer() {
	let canvasRef: HTMLCanvasElement = null!;
	let surface: any = null!;
	let application: Application = null!;

	onMount(async () => {
		application = new Application({
			canvas: canvasRef,
		});

		await application.init();

		const rect = new Rect({
			width: 100,
			height: 100,
		});

		rect.draw();

		const rect2 = new Rect({
			width: 200,
			height: 200,
			position: {
				x: 100,
				y: 100,
			},
		});

		rect.draw();
		rect2.draw();

		Runtime.update();
	});

	onCleanup(() => {
		if (surface) {
			surface.dispose();
		}
	});

	return (
		<div>
			<canvas ref={canvasRef} id="your-canvas-id" width="800" height="600" />
		</div>
	);
}
