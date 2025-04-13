export interface EditorService<T = unknown> {
  doing: boolean;
  dispose(): void;
  do(event: T): boolean;
  getReady(): boolean;
  /**
   * Cancel the current operation
   */
  cancel(): void;
}
