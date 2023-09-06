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
