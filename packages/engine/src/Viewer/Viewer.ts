import { Container, Application as PXApplication } from "pixi.js";

export class Viewer {
	private _app: PXApplication | null = null;
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
	}
	append(object: Container) {
		this._app?.stage.addChild(object);
	}
	dispose() {
		this._app?.destroy();
	}
}
