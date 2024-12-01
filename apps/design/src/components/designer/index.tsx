import { Application } from "@pigma/engine";
import { onCleanup, onMount } from "solid-js";

export function Designer() {
	let canvasRef: HTMLDivElement = null!;

	let application: Application = null!;

	onMount(async () => {
		application = new Application({
			container: canvasRef,
		});

		await application.init();
	});

	onCleanup(() => {});

	return <div ref={canvasRef} class="w-full h-full" />;
}
