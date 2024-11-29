import { Runtime } from "./runtime";
import { Graphics, Application as PXApplication } from "pixi.js";

export type ApplicationOptions = {
  container: HTMLElement;
};

export class Application {
  private readonly container: HTMLElement;

  constructor(options?: ApplicationOptions) {
    this.container = options?.container ?? document.createElement("div");
  }

  async init(): Promise<void> {
    const app = new PXApplication();
    await app.init({
      resizeTo: this.container,
    });
    this.container.appendChild(app.canvas);

    const obj = new Graphics().rect(0, 0, 200, 100).fill(0xff0000);

    app.stage.addChild(obj);
  }
}
