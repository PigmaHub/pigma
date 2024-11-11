import { Runtime } from "../runtime";
import type { Vector2D } from "../types";
import { Entity } from "./Entity";
import Color from "color";

export class Rect extends Entity {
  private _width: number;
  private _height: number;
  private _styles = {
    backgroundColor: "red",
    strokeColor: "#000",
    strokeWidth: 10,
  };
  constructor(options?: {
    width: number;
    position?: Vector2D;
    height: number;
  }) {
    super(options);
    this._width = options?.width || 10;
    this._height = options?.height || 10;
  }
  draw(): void {
    super.draw();
    const canvas = Runtime.surface.getCanvas();
    const fillPaint = new Runtime.canvasKit.Paint();
    const stokePaint = new Runtime.canvasKit.Paint();
    const Skia = Runtime.canvasKit;

    const bgColor = Color(this._styles.backgroundColor).object();
    const strokeColor = Color(this._styles.strokeColor).object();

    fillPaint.setColor(
      Runtime.canvasKit.Color(bgColor.r, bgColor.g, bgColor.b, bgColor.alpha)
    );
    fillPaint.setStyle(Runtime.canvasKit.PaintStyle.Fill);

    const rect = Runtime.canvasKit.XYWHRect(
      this._position.x,
      this._position.y,
      this._position.x + this._width,
      this._position.y + this._height
    );

    stokePaint.setStyle(Runtime.canvasKit.PaintStyle.Stroke);
    stokePaint.setColor(
      Runtime.canvasKit.Color(
        strokeColor.r,
        strokeColor.g,
        strokeColor.b,
        strokeColor.alpha
      )
    );
    stokePaint.setStrokeWidth(this._styles.strokeWidth);

    canvas.drawRect(rect, fillPaint);

    canvas.drawRect(rect, stokePaint);

    fillPaint.delete();
    stokePaint.delete();
  }
}
