import { DatabaseCore, ObjectId } from "@pigma/core";
import { ObjectTable } from "./ObjectTable";
import type { Entity } from "../entitys";

export class Database extends DatabaseCore {
	protected _idIndex = 0;
	private _objectsTable: ObjectTable<Entity>;
	protected idMap = new Map<number, ObjectId>();
	constructor() {
		super();
		this._objectsTable = new ObjectTable<Entity>()._SetOwnerDatabase(this);
	}
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
	append(object: Entity) {
		this._objectsTable.append(object, false);
		return object;
	}
}
