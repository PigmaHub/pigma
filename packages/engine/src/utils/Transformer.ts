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
  public moveHandle: Graphics;
  public hScaleHandle: Graphics;
  public vScaleHandle: Graphics;
  public scaleHandle: Graphics;
  public rotateTool: Graphics;
  public target: Container | null = null;
  public border: Graphics;
  public anchorMark: Graphics;
  public dashed: boolean;
  public boundary: Rectangle | null;

  // Internal properties
  private handleOpacity: number;
  private controlsSize: number;
  private controlsDim: number;
  private controlStrokeThickness: number;
  private movedThreshold: number;
  private left: number = 0;
  private right: number = 0;
  private top: number = 0;
  private bottom: number = 0;

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
    this.controlStrokeThickness = 4;
    this.movedThreshold = 10;

    this.dashed = dashed === undefined ? true : dashed;
    this.boundary = boundary === undefined ? null : boundary;

    this.visible = false;

    // Create border
    this.border = new Graphics();
    this.addChild(this.border);

    // Create anchor mark
    this.anchorMark = new Graphics();
    this.anchorMark.alpha = this.handleOpacity;
    this.addChild(this.anchorMark);

    // Create handles
    this.moveHandle = this.createMoveHandle();
    this.hScaleHandle = this.createHScaleHandle(lineColor, handleColor);
    this.vScaleHandle = this.createVScaleHandle(lineColor, handleColor);
    this.scaleHandle = this.createScaleHandle(lineColor, handleColor);
    this.rotateTool = this.createRotateHandle(lineColor, handleColor);
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
    const width = (this.width = bounds.width);
    const height = (this.height = bounds.height);
    this.scale.x = target.scale.x;
    this.scale.y = target.scale.y;
    this.x = bounds.x;
    this.y = bounds.y;
    this.rotation = target.rotation;

    // Handle anchor points
    let anchor: Point = target.pivot;

    // Calculate bounds
    this.left = bounds.left;
    console.log("this.left: ", this.left);
    this.top = bounds.top;
    console.log("this.top: ", this.top);
    // this.bottom = bounds.bottom;
    // this.right = bounds.right;

    // Update anchor mark
    this.anchorMark
      .clear()
      .star(
        bounds.width / 2,
        bounds.height / 2,
        4,
        this.controlsSize * 0.8,
        this.controlsSize * 0.1
      )
      .fill(0x333);
    this.anchorMark.scale.x = 1 / this.scale.x;
    this.anchorMark.scale.y = 1 / this.scale.y;
    this.anchorMark.rotation = -this.rotation;

    this.border.clear();

    this.border
      .rect(0, 0, bounds.width, bounds.height)
      .stroke({ width: this.controlStrokeThickness / this.scale.x });

    // Tools size should stay consistent
    const toolScaleX = 1 / this.scale.x;
    const toolScaleY = 1 / this.scale.y;

    // Update move handle hit area
    (this.moveHandle.hitArea as Rectangle).x = 0;
    (this.moveHandle.hitArea as Rectangle).y = 0;
    (this.moveHandle.hitArea as Rectangle).width = bounds.width;
    (this.moveHandle.hitArea as Rectangle).height = bounds.height;

    // Position scale handle (bottom right)
    console.log(" this.width: ", this.width);
    this.scaleHandle.x = width;
    this.scaleHandle.y = height;
    this.scaleHandle.scale.x = toolScaleX;
    this.scaleHandle.scale.y = toolScaleY;

    // Position hScale handle (right edge)
    this.hScaleHandle.x = width;
    this.hScaleHandle.y = height / 2;
    this.hScaleHandle.scale.x = toolScaleX;
    this.hScaleHandle.scale.y = toolScaleY;

    // Position vScale handle (bottom edge)
    this.vScaleHandle.x = width / 2;
    this.vScaleHandle.y = height;
    this.vScaleHandle.scale.x = toolScaleX;
    this.vScaleHandle.scale.y = toolScaleY;

    // Position rotate handle
    this.rotateTool.x = width;
    this.rotateTool.y = 0;
    this.rotateTool.scale.x = toolScaleX;
    this.rotateTool.scale.y = toolScaleY;

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
   * Creates the horizontal scale handle
   */
  private createHScaleHandle(lineColor: number, handleColor: number): Graphics {
    const handle = this.createHandle(
      "Stretch",
      "e-resize",
      lineColor,
      handleColor
    );
    handle
      .rect(0, 0, this.controlsSize, this.controlsSize)
      .fill(handleColor)
      .stroke({ width: this.controlStrokeThickness, color: lineColor });

    const handleData: HandleData = { dragging: false };

    handle.on("pointerdown", (event) => {
      handleData.globalStart = new Point(event.global.x, event.global.y);
      if (this.target) {
        handleData.scaleStart = new Point(
          this.target.scale.x,
          this.target.scale.y
        );
      }
    });

    handle.on("pointermove", (event) => {
      if (
        !handleData.dragging ||
        !this.target ||
        !handleData.globalStart ||
        !handleData.scaleStart
      )
        return;

      const distStart = calcDistance(
        handleData.globalStart,
        new Point(this.target.x, this.target.y)
      );
      const distEnd = calcDistance(
        event.global,
        new Point(this.target.x, this.target.y)
      );
      const rescaleFactor = distEnd / distStart;

      this.target.scale.x = handleData.scaleStart.x * rescaleFactor;
      this.update();
    });

    this.addChild(handle);
    return handle;
  }

  /**
   * Creates the vertical scale handle
   */
  private createVScaleHandle(lineColor: number, handleColor: number): Graphics {
    const handle = this.createHandle(
      "Stretch",
      "s-resize",
      lineColor,
      handleColor
    );
    handle
      .rect(0, 0, this.controlsSize, this.controlsSize)
      .fill(handleColor)
      .stroke({ width: this.controlStrokeThickness, color: lineColor });

    const handleData: HandleData = { dragging: false };

    handle.on("pointerdown", (event) => {
      handleData.globalStart = new Point(event.global.x, event.global.y);
      if (this.target) {
        handleData.scaleStart = new Point(
          this.target.scale.x,
          this.target.scale.y
        );
      }
    });

    handle.on("pointermove", (event) => {
      if (
        !handleData.dragging ||
        !this.target ||
        !handleData.globalStart ||
        !handleData.scaleStart
      )
        return;

      const distStart = calcDistance(
        handleData.globalStart,
        new Point(this.target.x, this.target.y)
      );
      const distEnd = calcDistance(
        event.global,
        new Point(this.target.x, this.target.y)
      );
      const rescaleFactor = distEnd / distStart;

      this.target.scale.y = handleData.scaleStart.y * rescaleFactor;
      this.update();
    });

    this.addChild(handle);
    return handle;
  }

  /**
   * Creates the scale handle (bottom-right corner)
   */
  private createScaleHandle(lineColor: number, handleColor: number): Graphics {
    const handle = this.createHandle(
      "Resize",
      "se-resize",
      lineColor,
      handleColor
    );
    handle
      .rect(0, 0, this.controlsSize, this.controlsSize)
      .fill(handleColor)
      .stroke({ width: this.controlStrokeThickness, color: lineColor });

    const handleData: HandleData = { dragging: false };

    handle.on("pointerdown", (event) => {
      handleData.downGlobalPosition = new Point(event.global.x, event.global.y);
      if (this.target) {
        handleData.startScale = new Point(
          this.target.scale.x,
          this.target.scale.y
        );
        handleData.resolutionStart =
          "resolution" in this.target ? (this.target as any).resolution : 1;
        handleData.targetStart = this.target.position.clone();
        handleData.startBounds = this.target.getBounds().rectangle;
      }
    });

    handle.on("pointermove", (event) => {
      if (
        !handleData.dragging ||
        !this.target ||
        !handleData.downGlobalPosition ||
        !handleData.startScale ||
        !handleData.targetStart
      )
        return;

      const distStart = calcDistance(
        handleData.downGlobalPosition,
        new Point(this.target.x, this.target.y)
      );
      const distEnd = calcDistance(
        event.global,
        new Point(this.target.x, this.target.y)
      );
      handleData.rescaleFactor = distEnd / distStart;

      if (this.boundary && handleData.startBounds) {
        const boundsAnchor = {
          x:
            ("anchor" in this.target ? (this.target as any).anchor.x : 0.5) *
            handleData.startBounds.width,
          y:
            ("anchor" in this.target ? (this.target as any).anchor.y : 0.5) *
            handleData.startBounds.height,
        };

        const bounds = new Rectangle(
          handleData.startBounds.x -
            boundsAnchor.x * handleData.rescaleFactor +
            boundsAnchor.x,
          handleData.startBounds.y -
            boundsAnchor.y * handleData.rescaleFactor +
            boundsAnchor.y,
          handleData.startBounds.width * handleData.rescaleFactor,
          handleData.startBounds.height * handleData.rescaleFactor
        );

        const constrainedBounds = constrainRectTo(
          bounds.clone(),
          this.boundary,
          true
        );
        const boundsPositionDelta = {
          x: bounds.x - constrainedBounds.x,
          y: bounds.y - constrainedBounds.y,
        };

        handleData.rescaleFactor = Math.min(
          constrainedBounds.width / handleData.startBounds.width,
          constrainedBounds.height / handleData.startBounds.height
        );

        this.target.position.x =
          handleData.targetStart.x - boundsPositionDelta.x;
        this.target.position.y =
          handleData.targetStart.y - boundsPositionDelta.y;
      }

      this.target.scale.x = handleData.startScale.x * handleData.rescaleFactor;
      this.target.scale.y = handleData.startScale.y * handleData.rescaleFactor;

      this.update();
    });

    const handleScaleUp = () => {
      if (
        this.target &&
        "resolution" in this.target &&
        handleData.resolutionStart !== undefined &&
        handleData.rescaleFactor !== undefined
      ) {
        (this.target as any).resolution =
          handleData.resolutionStart * handleData.rescaleFactor;
        this.update();
      }
    };

    handle.on("pointerupoutside", handleScaleUp);
    handle.on("pointerup", handleScaleUp);

    this.addChild(handle);
    return handle;
  }

  /**
   * Creates the rotate handle
   */
  private createRotateHandle(lineColor: number, handleColor: number): Graphics {
    const handle = this.createHandle(
      "Rotate",
      "pointer",
      lineColor,
      handleColor
    );
    // 使用 PixiJS v8 的 API
    handle
      .circle(
        this.controlsSize / 2,
        this.controlsSize / 2,
        this.controlsSize / 2
      )
      .fill(handleColor)
      .stroke({ width: this.controlStrokeThickness, color: lineColor });

    const handleData: HandleData = { dragging: false };

    handle.on("pointerdown", (event) => {
      handleData.downGlobalPosition = new Point(event.global.x, event.global.y);
      if (this.target) {
        handleData.startRotation = this.target.rotation;
      }
    });

    handle.on("pointermove", (event) => {
      if (
        !handleData.dragging ||
        !this.target ||
        !handleData.downGlobalPosition ||
        handleData.startRotation === undefined
      )
        return;

      // The drag point is relative to the display object position
      const relativeStartPoint = {
        x: handleData.downGlobalPosition.x - this.target.x,
        y: handleData.downGlobalPosition.y - this.target.y,
      };

      const relativeEndPoint = {
        x: event.global.x - this.target.x,
        y: event.global.y - this.target.y,
      };

      const endAngle = calcAngleRadians(relativeEndPoint.x, relativeEndPoint.y);
      const startAngle = calcAngleRadians(
        relativeStartPoint.x,
        relativeStartPoint.y
      );
      const deltaAngle = endAngle - startAngle;

      // TODO: constrain to bounds if needed
      this.target.rotation = handleData.startRotation + deltaAngle;
      this.update();
    });

    this.addChild(handle);
    return handle;
  }

  /**
   * Creates a generic handle with common properties
   */
  private createHandle(
    name: string,
    cursor: string,
    lineColor: number,
    handleColor: number
  ): Graphics {
    const handle = new Graphics();
    handle.interactive = true;
    handle.alpha = this.handleOpacity;

    this.addToolTip(handle, name, cursor);

    const handleData: HandleData = { dragging: false };
    this.handleHandleEvents(handle, handleData);

    return handle;
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
