import type { ObjectId } from "./ObjectId";
import type { ISerializable } from "./types";
import type { DatabaseCore } from "./database/DatabaseCore";

export class BaseObject implements ISerializable {
	protected _objectId: ObjectId;
	protected _name: string;
	protected owner: ObjectId;
	protected _db: DatabaseCore;
	constructor() {
		//
	}
	get Id() {
		return this._objectId?.Index;
	}
	get ObjectId() {
		return this._objectId;
	}
	get Owner() {
		return this.owner;
	}
	set Owner(owner: ObjectId) {
		this.owner = owner;
	}
	toJSON(): any {
		return {
			id: this._objectId?.Index,
			name: this._name,
		};
	}
	fromJSON(json: any) {
		this._name = json.name;
	}

	_SetOwnerDatabase(db: DatabaseCore) {
		if (!this._db) {
			this._db = db;
			this._objectId = db.allocateId() as ObjectId<this>;
			this._objectId.Object = this;
		} else console.warn("重复设置源Database!");

		return this;
	}
	_SetDefaultDb(db: DatabaseCore) {
		if (!this._db) this._db = db;
		else console.warn("重复设置默认Database!");

		return this;
	}
	_SetDatabase(db: DatabaseCore) {
		this._db = db;
	}
}
