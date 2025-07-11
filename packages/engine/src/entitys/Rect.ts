import { Graphics } from "pixi.js";
import { Entity } from "./Entity";
import { Shape } from "./Shape";

export class Rect extends Shape {
	protected _name = "rect";
	applyShape() {
		if (!this.Master) return;

		this.Master.clear();

		if (this._styles.cornerRadius) {
			this.Master.rect(0, 0, this._width, this._height);
		} else {
			this.Master.roundRect(
				0,
				0,
				this._width,
				this._height,
				this._styles.cornerRadius,
			);
		}
	}
}
