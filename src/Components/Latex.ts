import { Box3, Event, Object3D, OrthographicCamera, Vector3 } from "three";
import renderToString from "katex";
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer";
import { toVector2, toVector3 } from "../utils";
import { Collider, Component, Draggable } from "./interfaces";
import { InputPosition } from "./types";

type LatexOptions = {
  position?: InputPosition;
  color?: string;
  fontSize?: number;
  anchorY?: "top" | "middle" | "bottom";
  anchorX?: "left" | "center" | "right";
  draggable?: Draggable;
};

class Latex extends Component implements Collider {
  draggable;

  constructor(
    latex: string,
    {
      position = [0, 0],
      color = "black",
      fontSize = 50,
      anchorX = "left",
      anchorY = "bottom",
      draggable = undefined,
    }: LatexOptions
  ) {
    super();
    const pos = toVector3(position);
    const renderedEquation = renderToString.renderToString(latex, {
      output: "mathml",
      strict: false,
      trust: true,
    });

    // Create a new DOM element and set its innerHTML
    const htmlElement = document.createElement("div");
    htmlElement.innerHTML = renderedEquation;

    // Create a CSS2DObject and set its properties
    const container = new CSS3DObject(htmlElement);

    this.position.set(pos.x, pos.y, 1);
    container.scale.set(fontSize, fontSize, 1);
    container.element.style.color = color;
    container.element.style.fontFamily = "Roboto";
    container.element.style.fontSize = `${fontSize}px`;
    container.element.style.fontWeight = "normal";
    container.element.style.textAlign = anchorX;
    container.element.style.verticalAlign = anchorY;
    container.element.style.pointerEvents = "none";

    container.scale.set(1, 1, 1);
    this.draggable = draggable;
    this.add(container);
  }

  collidesWith(other: Object3D): boolean {
    const box1 = new Box3().setFromObject(this);
    const box2 = new Box3().setFromObject(other);

    return box1.intersectsBox(box2);
  }

  distanceTo(other: Object3D<Event>): number {
    const box1 = new Box3().setFromObject(this);
    const box2 = new Box3().setFromObject(other);

    const center1 = new Vector3();
    const center2 = new Vector3();
    box1.getCenter(center1);
    box2.getCenter(center2);
    center1.setZ(0);
    center2.setZ(0);

    return center1.distanceTo(center2);
  }

  setPosition(position: InputPosition) {
    this.position.set(
      toVector2(position).x,
      toVector2(position).y,
      this.position.z
    );
  }
  update(camera: OrthographicCamera) {
    this.scale.set(1 / camera.zoom, 1 / camera.zoom, 1);
  }
}

export default Latex;
