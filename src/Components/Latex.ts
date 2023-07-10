import { OrthographicCamera } from "three";
import renderToString from "katex";
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer";
import { toVector3 } from "../utils";
import { Component, Draggable } from "./interfaces";
import { InputPosition } from "./types";

type LatexOptions = {
  position?: InputPosition;
  color?: string;
  fontSize?: number;
  anchorY?: "top" | "middle" | "bottom";
  anchorX?: "left" | "center" | "right";
  draggable?: Draggable;
};

class Latex extends Component {
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
    container.element.style.fontFamily = "sans-serif";
    container.element.style.fontSize = `${fontSize}px`;
    container.element.style.fontWeight = "normal";
    container.element.style.textAlign = anchorX;
    container.element.style.verticalAlign = anchorY;
    container.element.style.pointerEvents = "none";

    container.scale.set(1, 1, 1);
    this.draggable = draggable;
    this.add(container);
  }

  update(camera: OrthographicCamera) {
    this.scale.set(1 / camera.zoom, 1 / camera.zoom, 1);
  }
}

export default Latex;
