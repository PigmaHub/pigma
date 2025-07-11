import type { FederatedPointerEvent } from "pixi.js";
import type { Viewer } from "../viewer";
import { GetPointService } from "./GetPointService";
import { SelectService } from "./select/SelectControl";
import type { EditorService } from "./service";
import { TransformService } from "./transformer/TransformerService";
import { EditorStatus } from "./types";

export class Editor {
	private _status = EditorStatus.IDLE;

	selectService: SelectService;
	transfromService: TransformService;
	getPointService: GetPointService;
	private _services: EditorService[] = [];

	constructor(private _viewer: Viewer) {
		this.selectService = new SelectService(_viewer, this);
		this.transfromService = new TransformService(_viewer, this);
		this.getPointService = new GetPointService(this, _viewer);

		this._services = [this.getPointService, this.selectService];

		this._register();
	}

	get status(): EditorStatus {
		return this._status;
	}

	set status(value: EditorStatus) {
		this._status = value;
		this._updateCursor();
	}

	private _updateCursor(): void {
		if (this.containStatus(EditorStatus.GET_POINT)) {
			this._viewer.RootContainer.cursor = "crosshair";
		} else if (this.containStatus(EditorStatus.SELECT)) {
			this._viewer.RootContainer.cursor = "default";
		} else if (this.containStatus(EditorStatus.TRANSFORM)) {
			this._viewer.RootContainer.cursor = "move";
		} else {
			this._viewer.RootContainer.cursor = "default";
		}
	}

	setStatus(status: EditorStatus) {
		this.status |= status;
	}

	containStatus(status: EditorStatus) {
		return (this.status & status) !== 0;
	}

	removeStatus(status: EditorStatus) {
		this.status &= ~status;
	}

	resetStatus() {
		this.status = EditorStatus.IDLE;
	}
	private handlePointerDown = (event: FederatedPointerEvent) => {
		for (const service of this._services) {
			if (service.getReady()) {
				if (!service.do(event)) {
					break;
				}
			}
		}
	};
	private _register() {
		this._viewer.PXApp.stage.on("pointerdown", (event) => {
			this.handlePointerDown(event);
		});

		this.selectService.onSelectObservable.add((data) => {
			this.transfromService.do(data.objects);
		});

		this._viewer.viewportControl.onZoomObservable.add((data) => {
			this.transfromService.update();
		});

		this._viewer.viewportControl.onDragObservable.add((data) => {
			this.transfromService.update();
		});
	}
	dispose() {
		//
	}
}
