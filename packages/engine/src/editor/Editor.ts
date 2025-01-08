import type { Viewer } from "../viewer";
import { SelectControl } from "./select/SelectControl";
import { EditorStatus } from "./types";

export class Editor {
	status = EditorStatus.IDLE;

	selectControl: SelectControl;

	constructor(private _viewer: Viewer) {
		this.selectControl = new SelectControl(_viewer);
	}

	setStatus(status: EditorStatus) {
		this.status |= status;
	}

	removeStatus(status: EditorStatus) {
		this.status &= ~status;
	}

	resetStatus() {
		this.status = EditorStatus.IDLE;
	}
}
