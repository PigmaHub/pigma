import type { Entity } from "./entitys";
import { Runtime } from "./runtime";
import { Graphics, Application as PXApplication } from "pixi.js";

export type ApplicationOptions = {
  container: HTMLElement;
};

export class Application {
  private readonly container: HTMLElement;
  private _app: PXApplication | null = null;

  constructor(options?: ApplicationOptions) {
    this.container = options?.container ?? document.createElement("div");
  }

  async init(): Promise<void> {
    const app = new PXApplication();
    await app.init({
      resizeTo: this.container,
      background: "#1e1e1e",
    });
    this.container.appendChild(app.canvas);

    this._app = app;
  }

  append(object: Entity) {
    this._app?.stage.addChild(object.ObjectContainer);

    object.ObjectContainer.position.set(100, 100);

    return object;
  }
}
