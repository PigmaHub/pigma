import { Runtime } from "../runtime";
import type { Vector2D } from "../types";
import { Entity } from "./Entity";

export class Rect extends Entity {
    private _width: number;
    private _height: number;
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
        const paint = new Runtime.canvasKit.Paint();
        paint.setColor(Runtime.canvasKit.Color(0, 0, 255, 1.0));
        paint.setStyle(Runtime.canvasKit.PaintStyle.Fill);

        const rect = Runtime.canvasKit.LTRBRect(this._position.x, this._position.y, this._position.x + this._width, this._position.y + this._height);
        canvas.drawRect(rect, paint);

        paint.delete();
    }
}