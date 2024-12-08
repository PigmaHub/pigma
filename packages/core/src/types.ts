export interface ISerializable {
	toJSON(): any;
	fromJSON(json: any): void;
}

export type Nullable<T> = T | null | undefined;
