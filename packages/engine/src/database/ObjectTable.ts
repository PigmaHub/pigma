import { BaseObject } from "@pigma/core";

export class ObjectTable<T extends BaseObject> extends BaseObject {
	private _objects: T[] = [];
	constructor() {
		super();
	}
	append(object: T, isCheck = true) {
		if (object.Id && isCheck) {
			console.warn(
				"Attempting to add an object that has already been assigned an ID!",
			);
			return;
		}

		if (this._db && !object.ObjectId) {
			object._SetOwnerDatabase(this._db);
		} else {
			object._SetDatabase(this._db);
		}
		object.Owner = this.ObjectId;
		this._objects.push(object);

		this._db.onObjectAddedObserable.notifyObservers(object);

		return object.ObjectId;
	}
}
