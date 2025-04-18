import { Viewer } from "./viewer";
import { Database } from "./database/Database";
import { Entity } from "./entitys";
import { Editor } from "./editor/Editor";
import { Container, extensions } from "pixi.js";
import { MetadataMixin } from "./utils/MetadataMin";
import { createAbortablePromise } from "./utils/promise";

extensions.mixin(Container, MetadataMixin);

export type ApplicationOptions = {
  container: HTMLElement;
};

export class Application {
  private readonly container: HTMLElement;
  private _viewer: Viewer;
  private _editor: Editor;
  private _db: Database;
  private cleaners: (() => void)[] = [];

  constructor(options?: ApplicationOptions) {
    this.container = options?.container ?? document.createElement("div");
  }

  get Viewer() {
    return this._viewer;
  }

  async init(): Promise<void> {
    this._db = new Database();
    this._viewer = new Viewer({ container: this.container });

    const { promise, abort } = createAbortablePromise(this._viewer.init());

    this.cleaners.push(abort);

    try {
      await promise;
      this._editor = new Editor(this._viewer);
      this.register();
    } catch (err) {
      console.warn("Viewer initialization failed");
    }
  }

  append(object: Entity) {
    this._db.append(object);
    return object;
  }

  dispose() {
    this.cleaners.forEach((cleaner) => {
      cleaner();
    });
    this.cleaners.length = 0;
    this._viewer?.dispose();
    this._db?.dispose();
    this._editor?.dispose();
  }

  private register() {
    this._db.onObjectAddedObserable.add((object) => {
      if (object instanceof Entity) {
        this._viewer?.append(object.ObjectContainer);
      }
    });
  }
}
