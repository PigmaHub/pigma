import { BaseObject } from "@pigma/core";
import type { Vector2D } from "../types/common";
import { Container } from "pixi.js";

export class Entity<T = Container> extends BaseObject {
  protected _position: Vector2D = {
    x: 0,
    y: 0,
  };
  protected _container: T | null = null;
  constructor(options?: { position?: Vector2D; [key: string]: unknown }) {
    super();
    this._position = options?.position || { x: 0, y: 0 };
  }
  get Position() {
    return this._position;
  }
  set Position(position: Vector2D) {
    this._position = position;
  }

  get ObjectContainer() {
    if (!this._container) {
      this._container = this.init();
    }
    return this._container;
  }

  init(): T {
    return new Container() as T;
  }

  update() {
    //
  }
}
