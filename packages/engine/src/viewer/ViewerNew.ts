import { Container, Application as PXApplication, Rectangle } from "pixi.js";
import { ViewportControl } from "./ViewportControl";
import { ZIndex } from "../enums";

export class Viewer {
  private _app: PXApplication;
  private _viewportControl: ViewportControl | null = null;
  private abortController: AbortController | null = null;
  private toolLayer: Container;

  constructor(private options: { container: HTMLElement }) {
    this._app = new PXApplication();
  }

  get PXApp() {
    return this._app;
  }

  get app(): PXApplication {
    return this._app;
  }

  get viewportControl(): ViewportControl {
    if (!this._viewportControl) {
      throw new Error("ViewportControl has not been initialized");
    }
    return this._viewportControl;
  }

  async init() {
    await this._app.init({
      resizeTo: this.options.container,
      background: "#1e1e1e",
    });

    this.options.container.appendChild(this._app.canvas);

    this._viewportControl = new ViewportControl(this._app);

    this._app.stage.eventMode = "static";
    this._app.stage.hitArea = { contains: () => true };

    this.toolLayer = new Container({
      zIndex: ZIndex.TOOL_LAYER,
    });

    this._app.stage.addChild(this.toolLayer);

    this.register();
  }

  append(object: Container) {
    this.viewportControl.viewport.addChild(object);
  }

  append2Layer(object: Container) {
    this.toolLayer.addChild(object);
  }

  dispose() {
    try {
      if (this._app?.renderer) {
        this._app?.destroy();
      } else {
        this._app?.stage?.destroy();
      }
      this.unregister();
      this._viewportControl?.destroy();
    } catch (err) {}
  }

  private register() {
    this.abortController = new AbortController();
  }

  private unregister() {
    this.abortController?.abort();
  }
}
