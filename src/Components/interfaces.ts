import { OrthographicCamera, Mesh } from "three";

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

  checkCollision(other: Component, distance = 0.1): boolean {
    return other.position.distanceTo(this.position) <= distance;
  }

  checkDistance(other: Component): number {
    return other.position.distanceTo(this.position);
  }
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
