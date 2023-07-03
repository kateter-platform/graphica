import { OrthographicCamera, Vector3, Object3D } from "three";
import { Text as TroikaText } from "troika-three-text";
import Graphica from "../Graphica";
import Font from "../assets/fonts/Jost-Regular.ttf";
import { toVector3 } from "../utils";
import { Component } from "./interfaces";
import { InputPosition } from "./types";

type TextOptions = {
  position?: InputPosition;
  color?: string;
  fontSize?: number;
  anchorY?: "top" | "middle" | "bottom";
  anchorX?: "left" | "center" | "right";
};

type TroikaTextType = InstanceType<typeof TroikaText>;

class Text implements Component {
  position: Vector3;
  object: Object3D;
  draggable = false;
  renderText: TroikaTextType;

  constructor(
    text: string,
    {
      position = [0, 0],
      color = "black",
      fontSize = 30,
      anchorX = "left",
      anchorY = "bottom",
    }: TextOptions
  ) {
    this.position = toVector3(position);
    const renderText = new TroikaText();
    renderText.text = text;
    renderText.fontSize = fontSize;
    renderText.color = color;
    renderText.font = Font;
    renderText.sdfGlyphSize = 128; // increase for sharper rendering
    renderText.gpuAccelerateSDF = true; // requires WebGL 2.0
    renderText.anchorX = anchorX;
    renderText.anchorY = anchorY;

    renderText.position.set(this.position.x, this.position.y, 0);
    this.object = renderText;
    this.renderText = renderText;
  }

  setText(text: string) {
    this.renderText.text = text;
  }

  addToGraphica(graphica: Graphica) {
    graphica.addMesh(this.object);
  }

  removeFromGraphica(graphica: Graphica) {
    graphica.removeMesh(this.object);
  }
  
  update(camera: OrthographicCamera) {
    this.object.scale.set(1 / camera.zoom, 1 / camera.zoom, 1);
    this.object.position.set(this.position.x, this.position.y, 0);
  }
}

export default Text;
