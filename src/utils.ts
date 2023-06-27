import { Vector3, Vector2 } from "three";
import { InputPosition } from "./Components/types";

export function toVector3(position: InputPosition, zValue = 0): Vector3 {
  if (position instanceof Array) {
    return new Vector3(position[0], position[1], zValue);
  }
  if (position instanceof Vector2) {
    return new Vector3(position.x, position.y, zValue);
  }
  return new Vector3();
}
