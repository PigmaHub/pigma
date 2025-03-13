import { Application, Rect, Transformer } from "@pigma/engine";
import { onCleanup, onMount } from "solid-js";

export function Designer() {
	let canvasRef: HTMLDivElement = null!;

	let app: Application = null!;

	onMount(async () => {
		app = new Application({
			container: canvasRef,
		});

		await app.init();

		const en = app.append(new Rect());

		en.Position = { x: 100, y: 100 };

		const tool = new Transformer();

		app.Viewer.append(tool);

		setTimeout(() => {
			tool.select(en.ObjectContainer);
		}, 100);
	});

	onCleanup(() => {
		app?.dispose();
	});

	return (
		<div class="w-full h-full flex-1">
			<div ref={canvasRef} class="w-full h-full"></div>
		</div>
	);
}
