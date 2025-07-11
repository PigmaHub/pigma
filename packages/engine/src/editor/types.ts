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

export type GetPointServiceOption = {
	/** Whether holding is allowed to maintain the get state */
	allowHold?: boolean;
	onPointerDown?: (event: { point: Point }) => void;
	onPointerMove?: (event: { point: Point }) => void;
};
