import type { FederatedPointerEvent } from "pixi.js";
import type { Viewer } from "../viewer";
import { SelectService } from "./select/SelectControl";
import { EditorStatus } from "./types";
import type { EditorService } from "./service";
import { TransformService } from "./transformer/TransformerService";
import { GetPointService } from "./GetPointService";

export class Editor {
  status = EditorStatus.IDLE;

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

  setStatus(status: EditorStatus) {
    if (status === EditorStatus.GET_POINT) {
      this._viewer.RootContainer.cursor = "crosshair";
    } else {
      this._viewer.RootContainer.cursor = "default";
    }

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
