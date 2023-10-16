import { OrthographicCamera, Mesh, Object3D } from "three";

export class Component extends Mesh {
  draggable: Draggable;
  is_dragged: boolean;
  setZIndex(z: number): void {
    this.position.setZ(z);
  }
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
  //The bounding box does take into account Z level meaning this is not a fully good solution yet but it works in the meantime
  collidesWith(other: Object3D): boolean;

  distanceTo(other: Object3D): number;
}

export interface DragListener<T> {
  dragListeners: ((value: T) => void)[];
  dragUpdate(): void;
  addDragListener: (listener: (value: T) => void) => void;
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
