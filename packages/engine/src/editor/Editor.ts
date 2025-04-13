import type { FederatedPointerEvent } from "pixi.js";
import type { Viewer } from "../viewer";
import { SelectService } from "./select/SelectControl";
import { EditorStatus } from "./types";
import type { EditorService } from "./service";
import { TransformService } from "./transformer/TransformerService";

export class Editor {
  status = EditorStatus.IDLE;

  selectService: SelectService;
  transfromService: TransformService;
  private _services: EditorService[] = [];

  constructor(private _viewer: Viewer) {
    this.selectService = new SelectService(_viewer, this);
    this.transfromService = new TransformService(_viewer);

    this._services = [this.selectService];

    this._register();
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
  }
  dispose() {
    //
  }
}
