import { BaseObject } from "@pigma/core";
import { Container, Graphics } from "pixi.js";
import { ObjectType } from "../enums";
import type { Vector2D } from "../types/common";

export class Entity extends BaseObject {
	protected _position: Vector2D = {
		x: 0,
		y: 0,
	};
	protected _rotation: number = 0;
	protected _scale: Vector2D = {
		x: 1,
		y: 1,
	};
	protected _width: number = 100;
	protected _height: number = 100;
	protected _container: Container | null = null;
	constructor(options?: { position?: Vector2D; [key: string]: unknown }) {
		super();
		this._position = options?.position || { x: 0, y: 0 };
	}
	get Position() {
		return this._position;
	}
	set Position(position: Vector2D) {
		this._position = position;
		this.update();
	}

	get Width() {
		return this._width;
	}
	set Width(width: number) {
		this._width = width;
		this.update();
	}

	get Height() {
		return this._height;
	}
	set Height(height: number) {
		this._height = height;
		this.update();
	}

	get Rotation() {
		return this._rotation;
	}
	set Rotation(rotation: number) {
		this._rotation = rotation;
		this.update();
	}

	get Scale() {
		return this._scale;
	}
	set Scale(scale: Vector2D) {
		this._scale = scale;
		this.update();
	}

	get ObjectContainer() {
		if (!this._container) {
			this._container = new Container();
			this._container.label = this._name;
			this._container.setMetadataItem("OBJECT", this);
			this._container.setMetadataItem("OBJECT_TYPE", ObjectType.ROOT);

			const object = this.init();
			object.setMetadataItem("OBJECT_TYPE", ObjectType.MASTER);
			object.label = ObjectType.MASTER;
			this._container.addChild(object);
			this.update();
		}

		return this._container;
	}
	get Master() {
		if (!this._container) {
			return null;
		}

		return this._container.getChildrenByLabel(ObjectType.MASTER)[0] as Graphics;
	}
	init() {
		const container = new Container();
		return container;
	}

	update() {
		if (!this._container) return;
		this._container.position.set(this._position.x, this._position.y);
		this._container.scale.set(this._scale.x, this._scale.y);
		this._container.rotation = this._rotation;
	}
}
