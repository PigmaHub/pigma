import { Point } from "pixi.js";
import { Rectangle, Container, Graphics } from "pixi.js";
import { DisplayObject, type DisplayObjectEvents } from "@pixi/display";

// Helper functions
export function calcAngleDegrees(x: number, y: number): number {
  return (calcAngleRadians(x, y) * 180) / Math.PI;
}

export function calcAngleRadians(x: number, y: number): number {
  return Math.atan2(y, x);
}

export function calcDistance(a: Point, b: Point): number {
  return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
}

/**
 * Force a rectangle to always be inside another by
 * updating location and size.
 */
export function constrainRectTo(
  rect: Rectangle,
  container: Rectangle,
  debug?: boolean
): Rectangle {
  if (rect.width >= container.width) {
    rect.width = container.width;
    if (debug) {
      console.log("constraining width to", rect.width);
    }
  }
  if (rect.x <= container.x) {
    rect.x = container.x;
    if (debug) {
      console.log("constraining x left at", rect.x);
    }
  } else if (rect.x + rect.width > container.x + container.width) {
    rect.x = container.x + container.width - rect.width;
    if (debug) {
      console.log("constraining x right at", rect.x + rect.width);
    }
  }
  if (rect.height >= container.height) {
    rect.height = container.height;
    if (debug) {
      console.log("constraining height to", rect.height);
    }
  }
  if (rect.y <= container.y) {
    rect.y = container.y;
    if (debug) {
      console.log("constraining y top to", rect.y);
    }
  } else if (rect.y + rect.height > container.y + container.height) {
    rect.y = container.y + container.height - rect.height;
    if (debug) {
      console.log("constraining y bottom to", rect.y + rect.height);
    }
  }
  return rect;
}

/**
 * Constrains a display object to a given rect
 */
export function constrainObjectTo(
  obj: DisplayObject,
  container: Rectangle
): void {
  const bounds = obj.getBounds();
  const constrained = new Rectangle(
    bounds.x,
    bounds.y,
    bounds.width,
    bounds.height
  );
  constrainRectTo(constrained, container);
  const delta = {
    x: bounds.x - constrained.x,
    y: bounds.y - constrained.y,
  };

  // Calculate new scale to apply
  const newScale = Math.min(
    constrained.width / bounds.width,
    constrained.height / bounds.height
  );

  obj.x = obj.x - delta.x;
  obj.y = obj.y - delta.y;
  obj.scale.x *= newScale;
  obj.scale.y *= newScale;
}

// Interface for handle data
interface HandleData {
  dragging: boolean;
  globalStart?: Point;
  downGlobalPosition?: Point;
  startRotation?: number;
  startScale?: Point;
  rescaleFactor?: number;
  resolutionStart?: number;
  targetStart?: Point;
  startBounds?: Rectangle;
  downGlobal?: Point;
  dragDistance?: number;
  scaleStart?: Point;
}

/**
 * Free Transform Tool for manipulating display objects
 */
export class Transformer extends Container {
  // Properties
  public moveArea: Graphics;
  public outline: Graphics;
  public target: Container | null = null;
  public dashed: boolean;
  public boundary: Rectangle | null;

  // Internal properties
  private handleOpacity: number;
  private controlsSize: number;
  private controlsDim: number;
  private controlStrokeThickness: number;
  private movedThreshold: number;

  /**
   * Constructor for FreeTransformTool
   * @param lineColor - Color of the border lines
   * @param dashed - Whether to use dashed lines for the border
   * @param handleColor - Color of the control handles
   * @param controlsSize - Size of the control handles
   * @param boundary - Boundary rectangle to constrain the target
   */
  constructor(
    lineColor?: number,
    dashed?: boolean,
    handleColor?: number,
    controlsSize?: number,
    boundary?: Rectangle
  ) {
    super();

    // Default values
    lineColor = lineColor || 0x4285f4;
    handleColor = handleColor || 0xffffff;
    this.handleOpacity = 0.7;
    this.controlsSize = controlsSize || 10;
    this.controlsDim = 0.05;
    this.controlStrokeThickness = 1;
    this.movedThreshold = 10;

    this.dashed = dashed === undefined ? true : dashed;
    this.boundary = boundary === undefined ? null : boundary;

    this.visible = false;

    // Create border
    this.outline = new Graphics();
    this.addChild(this.outline);

    // Create handles
    this.moveArea = this.createMoveHandle();
  }

  /**
   * Selects a target display object for transformation
   * @param target - The display object to transform
   */
  public select(target: Container | null): void {
    if (!target) {
      this.unselect();
      return;
    }

    // Copy object transformation
    this.target = target;
    const bounds = target.getBounds();

    this.scale.x = target.scale.x;
    this.scale.y = target.scale.y;
    this.x = bounds.x;
    this.y = bounds.y;
    this.rotation = target.rotation;

    // Update border
    this.outline.clear();

    this.outline.rect(0, 0, bounds.width, bounds.height).stroke({
      width: this.controlStrokeThickness / this.scale.x,
      color: 0x90b0ff,
      alpha: 1,
    });

    // Update move handle hit area
    (this.moveArea.hitArea as Rectangle).x = 0;
    (this.moveArea.hitArea as Rectangle).y = 0;
    (this.moveArea.hitArea as Rectangle).width = bounds.width;
    (this.moveArea.hitArea as Rectangle).height = bounds.height;

    this.visible = true;
  }

  /**
   * Unselects the current target
   */
  public unselect(): void {
    this.target = null;
    this.visible = false;
  }

  /**
   * Updates the transform tool positioning
   */
  public update(): void {
    if (this.target) {
      this.select(this.target);
    }
  }

  /**
   * Sets the accessible title for the tool
   */
  public setTitle(title?: string): void {
    title = title || "";
    this.accessibleTitle = title;
  }

  /**
   * Sets the cursor style based on rotation
   */
  public setCursor(cursor: string): void {
    const cursors = [
      "e-resize",
      "se-resize",
      "s-resize",
      "sw-resize",
      "w-resize",
      "nw-resize",
      "n-resize",
      "ne-resize",
    ];
    const index = cursors.indexOf(cursor);
    if (index >= 0 && this.target) {
      const angle = 45;
      let rotation = this.target.rotation;
      rotation = rotation + angle / 2;
      let newIndex = index + Math.floor(rotation / angle);
      newIndex = newIndex % cursors.length;
      document.body.style.cursor = cursors[newIndex];
    } else {
      document.body.style.cursor = cursor;
    }
  }

  /**
   * Creates the move handle
   */
  private createMoveHandle(): Graphics {
    const moveHandle = new Graphics();
    moveHandle.interactive = true;
    moveHandle.hitArea = new Rectangle();

    // 使用Pixi.js v8的API添加#90b0ff颜色的边框
    moveHandle
      .rect(0, 0, 0, 0) // 尺寸将在选择目标时正确设置
      .stroke({
        width: this.controlStrokeThickness,
        color: 0x90b0ff,
        alpha: 1,
      });

    this.addChild(moveHandle);

    // Add tooltip
    this.addToolTip(moveHandle, "Move", "move");

    // Event handlers for move handle
    const handleData: HandleData = { dragging: false };

    moveHandle.on("pointerdown", (event) => {
      if (!this.target || handleData.dragging) return;

      handleData.targetStart = this.target.position.clone();
      handleData.downGlobal = event.global.clone();
      handleData.dragDistance = 0;
      handleData.dragging = true;
      handleData.startBounds = this.target.getBounds().rectangle;
    });

    moveHandle.on("pointermove", (event) => {
      if (!handleData.dragging) return;

      const moveDelta = new Point(
        event.global.x - (handleData.downGlobal?.x || 0),
        event.global.y - (handleData.downGlobal?.y || 0)
      );

      if (this.boundary && handleData.startBounds && this.target) {
        const newBounds = new Rectangle(
          moveDelta.x + handleData.startBounds.x,
          moveDelta.y + handleData.startBounds.y,
          handleData.startBounds.width,
          handleData.startBounds.height
        );
        const constrainedBounds = constrainRectTo(newBounds, this.boundary);
        moveDelta.x = constrainedBounds.x - handleData.startBounds.x;
        moveDelta.y = constrainedBounds.y - handleData.startBounds.y;
      }

      if (this.target && handleData.targetStart) {
        this.target.position.x = handleData.targetStart.x + moveDelta.x;
        this.target.position.y = handleData.targetStart.y + moveDelta.y;
      }

      if (handleData.downGlobal) {
        handleData.dragDistance = calcDistance(
          event.global,
          handleData.downGlobal
        );
      }

      this.update();
      event.stopPropagation();
    });

    const handleMoveUp = (event: any) => {
      event.stopPropagation();

      if (handleData.dragging) {
        this.alpha = 1;
        handleData.downGlobal = undefined;
        handleData.targetStart = undefined;
        handleData.dragging = false;

        // Only deselect if there was very little movement
        if (
          !handleData.dragDistance ||
          handleData.dragDistance < this.movedThreshold
        ) {
          this.unselect();
        }
      }
    };

    moveHandle.on("pointerup", handleMoveUp);
    moveHandle.on("pointerupoutside", handleMoveUp);

    // Add general handle events
    this.handleHandleEvents(moveHandle, handleData);

    return moveHandle;
  }

  /**
   * Adds a tooltip to a handle
   */
  private addToolTip(shape: Graphics, name: string, cursor: string): void {
    shape.on("pointerover" as keyof DisplayObjectEvents, () => {
      this.setTitle(name);
      this.setCursor(cursor);
    });

    shape.on("pointerout", () => {
      this.setTitle();
      this.setCursor("default");
    });
  }

  /**
   * Sets up common events for all handles
   */
  private handleHandleEvents(handle: Graphics, handleData: HandleData): void {
    handle.on("pointerdown", () => {
      handleData.dragging = true;
    });

    handle.on("pointermove", () => {
      if (handleData.dragging) {
        this.alpha = this.controlsDim;
      }
    });

    const handleUp = () => {
      this.alpha = 1;
      this.update();
      handleData.dragging = false;
    };

    handle.on("pointerup", handleUp);
    handle.on("pointerupoutside", handleUp);
  }
}
