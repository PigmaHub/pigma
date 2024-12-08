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

	onCleanup(() => {});

	return <div ref={canvasRef} class="w-full h-full" />;
}
