import { Container, Application as PXApplication, Rectangle } from "pixi.js";
import { ZIndex } from "../enums";

export class Viewer {
	private _app: PXApplication;
	private abortController: AbortController;
	private toolLayer: Container;
	constructor(private options: { container: HTMLElement }) {}
	get PXApp() {
		return this._app;
	}
	async init() {
		const app = new PXApplication();
		await app.init({
			resizeTo: this.options.container,
			background: "#1e1e1e",
		});

		this.options.container.appendChild(app.canvas);

		this._app = app;

		app.stage.eventMode = "static";
		app.stage.hitArea = { contains: () => true };

		this.toolLayer = new Container({
			zIndex: ZIndex.TOOL_LAYER,
		});
		app.stage.addChild(this.toolLayer);

		this.register();
	}
	append(object: Container) {
		this._app?.stage.addChild(object);
	}
	append2Layer(object: Container) {
		this.toolLayer.addChild(object);
	}
	dispose() {
		this._app?.destroy();
		this.unregister;
	}

	private register() {
		let isDragging = false;
		let dragStart = { x: 0, y: 0 };
		this.abortController = new AbortController();

		this._app?.canvas.addEventListener(
			"mousedown",
			(event) => {
				if (event.button === 1) {
					// Middle mouse button
					isDragging = true;
					dragStart.x = event.clientX;
					dragStart.y = event.clientY;
				}
			},
			{
				signal: this.abortController.signal,
			},
		);

		window.addEventListener(
			"mousemove",
			(event) => {
				if (isDragging) {
					const dx = event.clientX - dragStart.x;
					const dy = event.clientY - dragStart.y;

					this._app.stage.position.x += dx;
					this._app.stage.position.y += dy;

					dragStart.x = event.clientX;
					dragStart.y = event.clientY;
				}
			},
			{
				signal: this.abortController.signal,
			},
		);

		window.addEventListener(
			"mouseup",
			(event) => {
				if (event.button === 1) {
					// Middle mouse button
					isDragging = false;
				}
			},
			{
				signal: this.abortController.signal,
			},
		);

		window.addEventListener(
			"mouseleave",
			() => {
				isDragging = false;
			},
			{
				signal: this.abortController.signal,
			},
		);

		this._app.canvas.addEventListener(
			"wheel",
			(event) => {
				event.preventDefault();
				const scaleFactor = 1.1;
				if (event.deltaY < 0) {
					// Zoom in
					this._app.stage.scale.x *= scaleFactor;
					this._app.stage.scale.y *= scaleFactor;
				} else {
					// Zoom out
					this._app.stage.scale.x /= scaleFactor;
					this._app.stage.scale.y /= scaleFactor;
				}
			},
			{
				signal: this.abortController.signal,
			},
		);
	}
	private unregister() {
		this.abortController?.abort();
	}
}
