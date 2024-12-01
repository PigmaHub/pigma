import { Entity } from "./Entity";
import { Graphics } from "pixi.js";

export class Shape extends Entity<Graphics> {
  protected _styles = {
    fill: "#D9D9D9",
    stroke: "#004400",
    strokeWidth: 10,
    cornerRadius: 5,
  };

  applyShape(container = this._container) {
    //
  }

  applyStyles(container = this._container) {
    if (!container) return;

    container.fill(this._styles.fill).stroke({
      color: this._styles.stroke,
      width: this._styles.strokeWidth,
    });
  }

  init() {
    const graphics = new Graphics();

    this.applyShape(graphics);
    this.applyStyles(graphics);

    return graphics;
  }
}
