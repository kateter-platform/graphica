import { OrthographicCamera, Mesh, Object3D, Box3, Sphere } from "three";

export class Component extends Mesh {
  draggable: Draggable;
  is_dragged: boolean;
  update?(camera: OrthographicCamera): void;
  onWindowResize?(): void;
  dragUpdate?(): void;

  constructor() {
    super();
    this.is_dragged = false;
    this.draggable = undefined;
  }
}

export interface Collider extends Object3D {
  collidesWith(other: Collider): boolean;

  distanceTo(other: Collider): number;
}

export type ConstrainFunction = (x: number, y: number) => [number, number];

export type Draggable =
  | undefined
  | "unrestricted"
  | "horizontal"
  | "vertical"
  | ConstrainFunction;

export interface GuiComponent {
  htmlElement: HTMLElement;
}
