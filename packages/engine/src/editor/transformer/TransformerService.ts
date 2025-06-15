import type { FederatedPointerEvent, Graphics } from "pixi.js";
import type { EditorService } from "../service";
import { Transformer } from "../../utils";
import type { Viewer } from "../../viewer";
import type { Editor } from "../Editor";
import { EditorStatus } from "../types";

export class TransformService implements EditorService {
  doing = false;
  private transformer: Transformer;
  constructor(private _viewer: Viewer, private _editor: Editor) {
    this.transformer = new Transformer();
    this._viewer.append2Layer(this.transformer);

    this.transformer.onDragStartObservable.add((target) => {
      this.doing = true;
      this._editor.setStatus(EditorStatus.TRANSFORM);
    });

    this.transformer.onDragEndObservable.add(() => {
      this.doing = false;
      this._editor.removeStatus(EditorStatus.TRANSFORM);
    });
  }
  do(objects: Graphics[]) {
    this.transformer.select(objects[0]);
    return true;
  }
  cancel() {
    //
  }
  getReady() {
    return true;
  }
  reset() {
    this.doing = false;
  }
  dispose() {
    //
  }
  update() {
    this.transformer.update();
  }
}
