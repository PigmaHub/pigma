import { BaseObject } from "../BaseObject";
import { ObjectId } from "../ObjectId";
import type { ISerializable } from "../types";
import type { DatabaseCore } from "./DatabaseCore";

export interface IDatabasePlugin<
	T extends BaseObject | ISerializable = BaseObject,
> {
	Objects: T[];
	append: (e: T) => void;
	reset(): void;
	remove: (o: T | T[]) => void;
	dispose(): void;
}

export abstract class DatabasePlugin<
		T extends BaseObject | ISerializable = BaseObject,
	>
	extends BaseObject
	implements IDatabasePlugin<T>
{
	protected _objects: T[] = [];
	get Objects() {
		return this._objects;
	}
	_SetOwnerDatabase(db: DatabaseCore) {
		if (!this._db) {
			this._db = db;
			this._objectId = db.allocatePluginId() as ObjectId<this>;
			this._objectId.Object = this;
		} else console.warn("重复设置源Database!");

		return this;
	}
	append(e: T) {}
	reset(): void {}
	remove(o: T | T[]) {}
	dispose(): void {}
}
