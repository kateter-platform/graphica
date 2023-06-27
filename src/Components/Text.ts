import { Mesh, OrthographicCamera, Vector3, Object3D } from "three";
import { Text as TroikaText } from "troika-three-text";
import Graphica from "../Graphica";
import { toVector3 } from "../utils";
import { Component } from "./interfaces";
import { InputPosition } from "./types";

type TextOptions = {
  position?: InputPosition;
  color?: string;
  fontSize?: number;
};

class Text implements Component {
  position: Vector3;
  object: Object3D;
  draggable: boolean = false;

  constructor(
    content: string,
    { position = [0, 0], color = "black", fontSize = 30 }: TextOptions
  ) {
    this.position = toVector3(position);
    const renderText = new TroikaText();
    renderText.text = content;
    renderText.fontSize = fontSize;
    renderText.color = color;
    renderText.font = "https://files.catbox.moe/sztmjl.ttf";
    this.object = renderText;
  }

  addToGraphica(graphica: Graphica) {
    graphica.addMesh(this.object);
  }

  removeFromGraphica(graphica: Graphica) {
    graphica.removeMesh(this.object);
  }
  update(camera: OrthographicCamera) {
    this.object.scale.set(1 / camera.zoom, 1 / camera.zoom, 1);
  }
}

export default Text;
