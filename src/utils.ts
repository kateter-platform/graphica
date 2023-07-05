import { Vector3, Vector2 } from "three";
import Point from "./Components/Primitives/Point";
import { InputPosition } from "./Components/Types/InputPosition";

export function toVector3(position: InputPosition, zValue = 0): Vector3 {
  if (position instanceof Array) {
    return new Vector3(position[0], position[1], zValue);
  }
  if (position instanceof Vector2) {
    return new Vector3(position.x, position.y, zValue);
  }
  if (position instanceof Point) {
    return new Vector3(
      position.position.x,
      position.position.y,
      position.position.z
    );
  }
  return new Vector3();
}

export function toVector2(position: InputPosition): Vector2 {
  if (position instanceof Array) {
    return new Vector2(position[0], position[1]);
  }
  if (position instanceof Vector2) {
    return new Vector2(position.x, position.y);
  }
  if (position instanceof Point) {
    return new Vector2(position.position.x, position.position.y);
  }
  return new Vector2();
}

export function isPoint(position: InputPosition): boolean {
  return position instanceof Point;
}
