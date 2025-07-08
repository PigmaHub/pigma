import { Graphics } from "pixi.js";
import { Entity } from "./Entity";

export class Shape extends Entity {
	protected _styles = {
		fill: "#D9D9D9",
		stroke: "#004400",
		strokeWidth: 10,
		cornerRadius: 5,
	};
	protected _container: Graphics | null = null;

	applyShape() {
		//
	}

	applyStyles() {
		if (!this.Master) return;

		this.Master.fill(this._styles.fill).stroke({
			color: this._styles.stroke,
			width: this._styles.strokeWidth,
		});
	}

	init() {
		const graphics = new Graphics();

		return graphics;
	}
	update(): void {
		if (!this._container) return;
		super.update();
		// this._container.position.set(this._position.x, this._position.y);
		this.applyShape();
		this.applyStyles();
	}
}
