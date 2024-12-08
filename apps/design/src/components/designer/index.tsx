import { Application, Rect } from "@pigma/engine";
import { onCleanup, onMount } from "solid-js";

export function Designer() {
	let canvasRef: HTMLDivElement = null!;

	let app: Application = null!;

	onMount(async () => {
		app = new Application({
			container: canvasRef,
		});

		await app.init();

		app.append(new Rect());
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
