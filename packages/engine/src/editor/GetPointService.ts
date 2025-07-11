import type { FederatedPointerEvent, Point } from "pixi.js";
import type { Viewer } from "../viewer";
import type { Editor } from "./Editor";
import type { EditorService } from "./service";
import {
	EditorStatus,
	type GetPointServiceOption,
	type PointServiceResult,
} from "./types";

export class GetPointService implements EditorService {
	doing = false;
	resolve: (value: PointServiceResult) => void;
	private _cleaners: (() => void)[] = [];
	private _pointerMoveHandler: (event: { point: Point }) => void;
	private _pointerDownHandler: (event: { point: Point }) => void;
	private _allowHold: boolean = false;
	constructor(
		private _editor: Editor,
		private _viewer: Viewer,
	) {}
	async start(option?: GetPointServiceOption) {
		if (this.getReady()) return;

		this._pointerMoveHandler = option?.onPointerMove || (() => {});
		this._pointerDownHandler = option?.onPointerDown || (() => {});
		this._allowHold = option?.allowHold || false;
		this._editor.setStatus(EditorStatus.GET_POINT);

		// watch mouse event

		this._initMouseEvents();

		// watch keyword event

		return new Promise<PointServiceResult>((resolve) => {
			this.resolve = resolve;
		});
	}
	do(event: FederatedPointerEvent): boolean {
		this.doing = true;
		// If allowHold is true, don't resolve immediately on pointerDown
		this._pointerDownHandler({
			point: event.global.clone(),
		});
		if (!this._allowHold) {
			this.returnResult(event.global.clone());
		}
		return false;
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

	private returnResult(point: Point) {
		this.resolve({
			point: point,
		});
		this.cancel();
	}

	private _initMouseEvents() {
		const handlePointerMove = (event: FederatedPointerEvent) => {
			if (this.doing)
				this._pointerMoveHandler({
					point: event.global.clone(),
				});
		};

		const handlePointerUp = (event: FederatedPointerEvent) => {
			// If allowHold is true, resolve on pointerUp
			if (this._allowHold) {
				this.returnResult(event.global.clone());
			}
		};

		this._viewer.PXApp.stage.on("pointermove", handlePointerMove);
		this._viewer.PXApp.stage.on("pointerup", handlePointerUp);

		this._cleaners.push(() => {
			this._viewer.PXApp.stage.off("pointermove", handlePointerMove);
			this._viewer.PXApp.stage.off("pointerup", handlePointerUp);
		});
	}
}
