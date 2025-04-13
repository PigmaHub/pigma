// abort promise
export function abortablePromise<T>(
  promise: Promise<T>,
  abortController: AbortController,
  signal: AbortSignal
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    promise.then(resolve).catch(reject);
    signal.addEventListener("abort", () => {
      reject(new Error("Aborted"));
    });
  });
}

/**
 * Creates an abortable promise that can be terminated
 * @param promise The original promise to make abortable
 * @returns An object containing the new promise and an abort function
 */
export function createAbortablePromise<T>(promise: Promise<T>): {
  promise: Promise<T>;
  abort: () => void;
} {
  const abortController = new AbortController();
  const { signal } = abortController;

  const abortablePromiseInstance = new Promise<T>((resolve, reject) => {
    promise.then(resolve).catch(reject);
    signal.addEventListener("abort", () => {
      reject(new Error("Aborted"));
    });
  });

  return {
    promise: abortablePromiseInstance,
    abort: () => abortController.abort(),
  };
}
