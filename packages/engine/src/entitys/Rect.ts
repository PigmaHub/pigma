import { Graphics } from "pixi.js";
import { Entity } from "./Entity";
import { Shape } from "./Shape";

export class Rect extends Shape {
  private _width: number = 100;
  private _height: number = 100;
  protected _name = "rect";
  applyShape(conainer = this._container) {
    if (this._styles.cornerRadius) {
      conainer?.rect(0, 0, this._width, this._height);
    } else {
      conainer?.roundRect(
        0,
        0,
        this._width,
        this._height,
        this._styles.cornerRadius
      );
    }
  }
}
