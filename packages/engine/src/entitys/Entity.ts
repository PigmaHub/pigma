import { BaseObject } from "@pigma/core";
import type { Vector2D } from "../types/common";

export class Entity extends BaseObject {
    protected _position: Vector2D = {
        x: 0,
        y: 0,
    };
    constructor(options?: {
        position?: Vector2D;
        [key: string]: unknown;
    }) {
        super();
        this._position = options?.position || { x: 0, y: 0 };
    }
    get Position() {
        return this._position;
    }
    set Position(position: Vector2D) {
        this._position = position;
    }

    draw() {
        //
    }
    update() {
        //
    }
}
