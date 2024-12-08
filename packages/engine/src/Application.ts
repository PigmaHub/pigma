import { Viewer } from "./Viewer";
import { Database } from "./database/Database";
import { Entity } from "./entitys";

export type ApplicationOptions = {
	container: HTMLElement;
};

export class Application {
	private readonly container: HTMLElement;
	private _viewer: Viewer;
	private _db: Database;

	constructor(options?: ApplicationOptions) {
		this.container = options?.container ?? document.createElement("div");
	}

	async init(): Promise<void> {
		this._db = new Database();
		this._viewer = new Viewer({ container: this.container });

		await this._viewer.init();

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
