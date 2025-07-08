import type { FederatedPointerEvent } from "pixi.js";
import type { Viewer } from "../viewer";
import type { Editor } from "./Editor";
import type { EditorService } from "./service";
import { EditorStatus, type PointServiceResult } from "./types";

export class GetPointService implements EditorService {
	doing = false;
	resolve: (value: PointServiceResult) => void;
	private _cleaners: (() => void)[] = [];
	constructor(
		private _editor: Editor,
		private _viewer: Viewer,
	) {}
	async start() {
		if (this.getReady()) return;

		console.log("start get point");

		this._editor.setStatus(EditorStatus.GET_POINT);

		// watch mouse event
		this.doing = true;
		this._initMouseEvents();

		// watch keyword event

		return new Promise<PointServiceResult>((resolve) => {
			this.resolve = resolve;
		});
	}
	do(event: FederatedPointerEvent): boolean {
		console.log("event: ", event);
		this.resolve({
			point: event.global.clone(),
		});
		this.cancel();
		return true;
	}
	getReady(): boolean {
		return this._editor.containStatus(EditorStatus.GET_POINT);
	}
	dispose() {
		this.cancel();
	}
	cancel(): void {
		this.doing = false;
		this._editor.removeStatus(EditorStatus.GET_POINT);
		this._cleaners.forEach((cleaner) => {
			cleaner();
		});
		this._cleaners.length = 0;
	}

	private _initMouseEvents() {
		const handlePointerMove = (event: FederatedPointerEvent) => {
			//
		};

		this._viewer.PXApp.stage.on("pointermove", handlePointerMove);

		this._cleaners.push(() => {
			this._viewer.PXApp.stage.off("pointermove", handlePointerMove);
		});
	}
}
