import type { Viewer } from "../../viewer";
import { SelectionBox } from "./SelectionBox";

export class SelectControl {
	selectRange: SelectionBox;
	doing = false;

	constructor(private _viewer: Viewer) {
		this.selectRange = new SelectionBox(_viewer);

		this.init();
	}

	init() {
		this._viewer.PXApp?.stage.on(
			"pointerdown",
			(event) => {
				console.log("event: ", event);
				if (event.button === 0) {
					this.selectRange.show();
					const local = event.getLocalPosition(this._viewer.PXApp.stage);
					this.selectRange.setStart(local);
					this.selectRange.setEnd(local);
					this.doing = true;
				}
			},
			{
				capture: true,
			},
		);
		this._viewer.PXApp?.stage.on("mousemove", (event) => {
			if (!this.doing) return;
			this.selectRange.setEnd(event.getLocalPosition(this._viewer.PXApp.stage));
			event.preventDefault();
			event.stopPropagation();
		});

		window.addEventListener("mouseup", (event) => {
			this.selectRange.hide();
			this.doing = false;
		});
	}
}
