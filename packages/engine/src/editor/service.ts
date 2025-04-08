import type { FederatedPointerEvent } from "pixi.js";

export interface EditorService {
  doing: boolean;
  dispose(): void;
  /**
   * Handle pointer down event
   * @param event Pointer event
   * @returns Whether the event is handled
   */
  do(event: FederatedPointerEvent): boolean;
  getReady(): boolean;
  /**
   * Cancel the current operation
   */
  cancel(): void;
}
