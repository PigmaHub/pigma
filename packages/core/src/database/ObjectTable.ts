import { BaseObject } from "../BaseObject";

export class ObjectTable extends BaseObject {
  private _objects: BaseObject[] = [];
  constructor() {
    super();
  }
  append(object: BaseObject) {
    this._objects.push(object);
  }
}
