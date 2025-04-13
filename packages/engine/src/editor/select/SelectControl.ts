import type { FederatedPointerEvent, Graphics } from "pixi.js";
import type { Viewer } from "../../viewer";
import type { EditorService } from "../service";
import { SelectionBox } from "./SelectionBox";
import { MouseKey, ObjectType } from "../../enums";
import type { Editor } from "../Editor";
import { EditorStatus } from "../types";
import { Observable } from "@pigma/observable";
import { Container, Rectangle } from "pixi.js";
import { Entity } from "../../entitys";
import {
  findParentWithObjectType,
  hasObjectType,
} from "../../utils/containerUtils";

/**
 * Selection mode enum
 */
export enum SelectionMode {
  /** Contain mode: objects must be completely inside the selection box */
  CONTAIN = 0,
  /** Intersect mode: objects that intersect with the selection box will be selected */
  INTERSECT = 1,
}

export type SelectableObject = {
  objects: Graphics[];
  entitys: Entity[];
};

export class SelectService implements EditorService<FederatedPointerEvent> {
  selectRange: SelectionBox;
  doing = false;
  onSelectObservable = new Observable<SelectableObject>();
  /** Selection mode, default is intersect mode */
  selectionMode: SelectionMode = SelectionMode.INTERSECT;

  constructor(private _viewer: Viewer, private _editor: Editor) {
    this.selectRange = new SelectionBox(_viewer);

    this._registry();
  }
  getReady() {
    return this._editor.status === EditorStatus.IDLE;
  }
  do(event: FederatedPointerEvent) {
    if (event.button === MouseKey.LEFT) {
      this.selectRange.show();
      const local = event.getLocalPosition(this._viewer.PXApp.stage);
      this.selectRange.setStart(local);
      this.selectRange.setEnd(local);
      this.doing = true;
      this._editor.setStatus(EditorStatus.SELECT);
    }

    return true;
  }
  reset() {
    this._editor.removeStatus(EditorStatus.SELECT);
    this.doing = false;
  }
  cancel(): void {
    //
  }
  dispose() {
    //
  }

  /**
   * Set selection mode
   * @param mode Selection mode
   */
  setSelectionMode(mode: SelectionMode): void {
    this.selectionMode = mode;
  }

  /**
   * Detect all objects within the selection box
   * @returns Array of objects within the selection box
   */
  private getObjectsInSelectionBox(): Container[] {
    const selectionRect = this.selectRange.getSelectionRectangle();
    const selectedObjects: Container[] = [];
    const processedRootObjects = new Set<Container>();

    // Recursively check all objects in containers
    const checkContainer = (container: Container) => {
      for (const child of container.children) {
        // Skip tool layer objects (like the selection box itself)
        if (child === this.selectRange.box) continue;

        // Get the global bounds of the object
        const bounds = child.getBounds();
        const childRect = new Rectangle(
          bounds.x,
          bounds.y,
          bounds.width,
          bounds.height
        );

        // Check if the object is selected based on current selection mode
        if (this.isObjectSelected(childRect, selectionRect)) {
          // If the object itself is a ROOT type, add it directly
          if (child instanceof Container && hasObjectType(child)) {
            if (!processedRootObjects.has(child)) {
              selectedObjects.push(child);
              processedRootObjects.add(child);
            }
          } else {
            // If not a ROOT type, find its ROOT parent
            const rootParent = findParentWithObjectType(
              child.parent as Container
            );
            if (rootParent && !processedRootObjects.has(rootParent)) {
              selectedObjects.push(rootParent);
              processedRootObjects.add(rootParent);
            }
          }
        }

        // If it's a container, recursively check its children
        if (child instanceof Container) {
          checkContainer(child);
        }
      }
    };

    // Start checking from the stage
    checkContainer(this._viewer.PXApp.stage);

    return selectedObjects;
  }

  /**
   * Determine if an object is selected based on current selection mode
   * @param objectBounds Object's bounding rectangle
   * @param selectionRect Selection box rectangle
   * @returns Whether the object is selected
   */
  private isObjectSelected(
    objectBounds: Rectangle,
    selectionRect: Rectangle
  ): boolean {
    // Determine based on selection mode
    if (this.selectionMode === SelectionMode.CONTAIN) {
      // Contain mode: object must be completely inside the selection box
      return this.isObjectContained(objectBounds, selectionRect);
    } else {
      // Intersect mode: object only needs to intersect with the selection box
      return this.isObjectIntersect(objectBounds, selectionRect);
    }
  }

  /**
   * Check if an object is completely contained within the selection box
   * @param objectBounds Object's bounding rectangle
   * @param selectionRect Selection box rectangle
   * @returns Whether the object is completely contained
   */
  private isObjectContained(
    objectBounds: Rectangle,
    selectionRect: Rectangle
  ): boolean {
    // Completely contained: all corners of the object must be inside the selection box
    return (
      selectionRect.contains(objectBounds.x, objectBounds.y) &&
      selectionRect.contains(
        objectBounds.x + objectBounds.width,
        objectBounds.y
      ) &&
      selectionRect.contains(
        objectBounds.x,
        objectBounds.y + objectBounds.height
      ) &&
      selectionRect.contains(
        objectBounds.x + objectBounds.width,
        objectBounds.y + objectBounds.height
      )
    );
  }

  /**
   * Check if an object intersects with the selection box
   * @param objectBounds Object's bounding rectangle
   * @param selectionRect Selection box rectangle
   * @returns Whether the object intersects
   */
  private isObjectIntersect(
    objectBounds: Rectangle,
    selectionRect: Rectangle
  ): boolean {
    // Intersection: rectangles overlap in any way
    return (
      objectBounds.x < selectionRect.x + selectionRect.width &&
      objectBounds.x + objectBounds.width > selectionRect.x &&
      objectBounds.y < selectionRect.y + selectionRect.height &&
      objectBounds.y + objectBounds.height > selectionRect.y
    );
  }

  private _registry() {
    this._viewer.PXApp?.stage.on("mousemove", (event) => {
      if (!this.doing) return;
      this.selectRange.setEnd(event.getLocalPosition(this._viewer.PXApp.stage));
      event.preventDefault();
      event.stopPropagation();
    });

    window.addEventListener("mouseup", (event) => {
      if (this.doing) {
        // Get all objects within the selection box
        const selectedObjects = this.getObjectsInSelectionBox();

        // Notify observers with the selected objects
        this.onSelectObservable.notifyObservers({
          objects: selectedObjects as Graphics[],
          entitys: selectedObjects.map((o) => o.metadata.OBJECT),
        });
      }

      this.selectRange.hide();
      this.doing = false;
      this.reset();
    });
  }
}
