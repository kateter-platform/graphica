import { OrthographicCamera, Mesh, Object3D, MeshBasicMaterial } from "three";

export class Component extends Mesh {
  draggable: Draggable;
  is_dragged: boolean;
  getX(): number {
    return this.position.x;
  }
  getY(): number {
    return this.position.y;
  }
  setZIndex(z: number): void {
    this.position.setZ(z);
  }
  getZIndex(): number {
    return this.position.z;
  }
  getName(): string {
    return this.name ?? "";
  }
  hover?(): void;
  unhover?(): void;

  update?(camera: OrthographicCamera): void;
  onWindowResize?(): void;
  dragUpdate?(): void;

  getColor() {
    const color = (this.material as MeshBasicMaterial).color.getHexString();
    return color === "ffffff" ? "faa307" : color;
  }

  getDisplayText?(): string;

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
  update?(camera?: OrthographicCamera): void;
}
