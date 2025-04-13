import { BaseObject } from "../BaseObject";
import { Observable } from "@pigma/observable";
import type { IDatabasePlugin } from "./iDatabasePlugin";
import { ObjectId } from "../ObjectId";

export class DatabaseCore {
  static MAX_INTER_ID = 999;
  protected _idIndex = 0;
  protected pluginIdIndex = 100;
  protected idMap = new Map<number, ObjectId>();
  public onObjectAddedObserable = new Observable<BaseObject>();
  plugins = new Map<string, IDatabasePlugin>();
  constructor() {}
  allocateId() {
    this._idIndex++;
    return new ObjectId(this._idIndex);
  }

  getObjectId(index: number, create = false) {
    if (index === 0) return undefined;

    let id = this.idMap.get(index);
    if (id || !create) return id;

    id = new ObjectId(index);
    this.idMap.set(index, id);

    return id;
  }

  allocatePluginId() {
    const id = this.pluginIdIndex++;
    if (id > DatabaseCore.MAX_INTER_ID) {
      throw new Error("Max plugin id reached");
    }
    return this.getObjectId(id, true);
  }
  dispose() {
    this.onObjectAddedObserable.clear();
  }
}
