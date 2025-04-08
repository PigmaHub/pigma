import { Viewer } from "./viewer";
import { Database } from "./database/Database";
import { Entity } from "./entitys";
import { Editor } from "./editor/Editor";
import { Container, extensions } from "pixi.js";
import { MetadataMixin } from "./utils/MetadataMin";

extensions.mixin(Container, MetadataMixin);

export type ApplicationOptions = {
  container: HTMLElement;
};

export class Application {
  private readonly container: HTMLElement;
  private _viewer: Viewer;
  private _editor: Editor;
  private _db: Database;

  constructor(options?: ApplicationOptions) {
    this.container = options?.container ?? document.createElement("div");
  }

  get Viewer() {
    return this._viewer;
  }

  async init(): Promise<void> {
    this._db = new Database();
    this._viewer = new Viewer({ container: this.container });

    await this._viewer.init();

    this._editor = new Editor(this._viewer);

    this.register();
  }

  append(object: Entity) {
    this._db.append(object);
    return object;
  }

  dispose() {
    this._viewer?.dispose();
    this._db.dispose();
  }

  private register() {
    this._db.onObjectAddedObserable.add((object) => {
      if (object instanceof Entity) {
        this._viewer?.append(object.ObjectContainer);
      }
    });
  }
}
