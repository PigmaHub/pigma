import type { BaseObject } from "./BaseObject";
import type { Nullable } from "./types";

export class ObjectId<T = BaseObject> {
	private _index: number;
	private _object: Nullable<T> = null;
	constructor(index: number, object?: T) {
		this._index = index;
		this._object = object;
	}
	get Index(): number {
		return this._index;
	}
	set Index(index: number) {
		this._index = index;
	}
	get Object(): Nullable<T> {
		return this._object;
	}
	set Object(object: T) {
		this._object = object;
	}
}
