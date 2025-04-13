import { Graphics, Point, Rectangle } from "pixi.js";
import type { Viewer } from "../../viewer";

export class SelectionBox {
	box: Graphics;
	private start: Point = new Point();
	private end: Point = new Point();
	constructor(private viewer: Viewer) {
		const selectionRectangle = new Graphics().rect(0, 0, 1, 1);
		viewer.append2Layer(selectionRectangle);

		this.box = selectionRectangle;
	}
	show() {
		this.box.visible = true;
	}
	hide() {
		this.box.visible = false;
	}
	setStart(v: Point) {
		Object.assign(this.start, v);
	}

	setEnd(v: Point) {
		Object.assign(this.end, v);
		this.update();
	}
	update() {
		let { x: x1, y: y1 } = this.start;
		let { x: x2, y: y2 } = this.end;

		this.box
			.clear()
			.rect(
				Math.min(x1, x2),
				Math.min(y1, y2),
				Math.abs(x2 - x1),
				Math.abs(y2 - y1),
			)
			.fill({
				color: 0x87ceeb,
				alpha: 0.5,
			});
	}

	/**
	 * Get the rectangle area of the selection box
	 * @returns Rectangle area of the selection box
	 */
	getSelectionRectangle(): Rectangle {
		const { x: x1, y: y1 } = this.start;
		const { x: x2, y: y2 } = this.end;

		return new Rectangle(
			Math.min(x1, x2),
			Math.min(y1, y2),
			Math.abs(x2 - x1),
			Math.abs(y2 - y1)
		);
	}
}
