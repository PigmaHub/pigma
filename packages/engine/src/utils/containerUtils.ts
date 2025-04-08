import { Container } from "pixi.js";
import { ObjectType } from "../enums";

/**
 * Find parent container with specified OBJECT_TYPE
 * @param container Starting container
 * @param objectType Object type to find, defaults to ROOT
 * @returns Found parent container, or null if not found
 */
export function findParentWithObjectType(
  container: Container,
  objectType: string = ObjectType.ROOT
): Container | null {
  let current: Container | null = container;
  
  // Traverse up through parents
  while (current) {
    // Check if current object has the specified type
    if (current.getMetadataItem && current.getMetadataItem("OBJECT_TYPE") === objectType) {
      return current;
    }
    
    // Move up to parent
    current = current.parent as Container;
  }
  
  return null;
}

/**
 * Check if container has the specified object type
 * @param container Container to check
 * @param objectType Object type to check for, defaults to ROOT
 * @returns True if container has the specified type, false otherwise
 */
export function hasObjectType(
  container: Container,
  objectType: string = ObjectType.ROOT
): boolean {
  return !!(
    container && 
    container.getMetadataItem && 
    container.getMetadataItem("OBJECT_TYPE") === objectType
  );
}
