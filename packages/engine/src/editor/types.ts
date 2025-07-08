import type { Point } from "pixi.js";

export enum EditorStatus {
	IDLE = 0,
	SELECT = 0b000001,
	TRANSFORM = 0b000010,
	GET_POINT = 0b000100,
}

export interface PointServiceResult {
	point: Point;
}
