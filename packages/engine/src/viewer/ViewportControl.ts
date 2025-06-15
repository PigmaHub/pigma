import { Observable } from "@pigma/observable";
import { Viewport } from "pixi-viewport";
import type { MovedEvent, ZoomedEvent } from "pixi-viewport/dist/types";
import { Application, Container } from "pixi.js";

/**
 * ViewportControl class to manage scene dragging and zooming using pixi-viewport.
 */
export class ViewportControl {
  viewport: Viewport;
  private app: Application;
  onZoomObservable = new Observable<ZoomedEvent>();
  onDragObservable = new Observable<MovedEvent>();

  constructor(app: Application) {
    this.app = app;

    // Create viewport
    this.viewport = new Viewport({
      screenWidth: app.screen.width,
      screenHeight: app.screen.height,
      events: app.renderer.events,
    });

    this.viewport.label = "viewport";

    // Add viewport to stage
    app.stage.addChild(this.viewport);

    // Activate plugins for dragging and zooming with custom settings
    this.viewport
      .drag({
        mouseButtons: "middle",
      })
      .pinch()
      .wheel();

    // Custom wheel event for Ctrl + Wheel zooming
    // app.canvas.addEventListener(
    //   "wheel",
    //   (event) => {
    //     if (event.ctrlKey) {
    //       event.preventDefault();
    //       const scaleFactor = 1.1;
    //       if (event.deltaY < 0) {
    //         // Zoom in
    //         this.viewport.setZoom(this.viewport.scale.x * scaleFactor, true);
    //       } else {
    //         // Zoom out
    //         this.viewport.setZoom(this.viewport.scale.x / scaleFactor, true);
    //       }
    //     }
    //   },
    //   { passive: false }
    // );

    // Set initial position to center
    // this.viewport.moveCenter(worldWidth / 2, worldHeight / 2);

    this.viewport.on("zoomed", (event: ZoomedEvent) => {
      this.onZoomObservable.notifyObservers(event);
    });

    this.viewport.on("moved", (event) => {
      this.onDragObservable.notifyObservers(event);
    });
  }

  /**
   * Get the viewport instance.
   * @returns The Viewport instance.
   */
  public getViewport(): Viewport {
    return this.viewport;
  }

  /**
   * Add a container to the viewport.
   * @param container - The container to add.
   */
  public addChild(container: Container): void {
    this.viewport.addChild(container);
  }

  /**
   * Remove a container from the viewport.
   * @param container - The container to remove.
   */
  public removeChild(container: Container): void {
    this.viewport.removeChild(container);
  }

  /**
   * Resize the viewport when the screen size changes.
   * @param screenWidth - New screen width.
   * @param screenHeight - New screen height.
   */
  public resize(screenWidth: number, screenHeight: number): void {
    this.viewport.resize(screenWidth, screenHeight);
  }

  /**
   * Set the zoom level of the viewport.
   * @param scale - The zoom scale factor.
   * @param center - Whether to center the viewport after zooming.
   */
  public setZoom(scale: number, center: boolean = false): void {
    this.viewport.setZoom(scale, center);
  }

  /**
   * Get the current zoom level of the viewport.
   * @returns The current zoom scale.
   */
  public getZoom(): number {
    return this.viewport.scale.x;
  }

  /**
   * Move the viewport to a specific position.
   * @param x - X coordinate to move to.
   * @param y - Y coordinate to move to.
   */
  public moveTo(x: number, y: number): void {
    this.viewport.moveCenter(x, y);
  }

  /**
   * Destroy the viewport and clean up resources.
   */
  public destroy(): void {
    this.viewport.destroy();
    this.app.stage.removeChild(this.viewport);
    this.onZoomObservable.clear();
    this.onDragObservable.clear();
  }
}
