import { Vector3, OrthographicCamera, Object3D } from "three";

export interface Component {
  position: Vector3;
  object: Object3D;
  draggable: Draggable;
  update?(camera: OrthographicCamera): void;
}

export type ConstrainFunction = (x: number, y: number) => [number, number];
export type Draggable =
  | undefined
  | "unrestricted"
  | "horizontal"
  | "vertical"
  | ConstrainFunction;
