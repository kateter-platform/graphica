import { Mesh, OrthographicCamera, Vector3 } from "three";
import { Text as TroikaText } from "troika-three-text";
import Graphica from "../Graphica";
import { toVector3 } from "../utils";
import { Component } from "./interfaces";
import { InputPosition } from "./types";

class Text implements Component {
  position: Vector3;
  mesh: Mesh;

  constructor(
    content: string,
    position: InputPosition = [0, 0],
    color = "black",
    fontSize = 30
  ) {
    this.position = toVector3(position);
    const renderText = new TroikaText();
    renderText.text = content;
    renderText.fontSize = fontSize;
    renderText.color = color;
    renderText.font = "https://files.catbox.moe/sztmjl.ttf";
    this.mesh = renderText;
  }

  addToGraphica(graphica: Graphica) {
    graphica.addMesh(this.mesh);
  }

  removeFromGraphica(graphica: Graphica) {
    graphica.removeMesh(this.mesh);
  }
  update(camera: OrthographicCamera) {
    this.mesh.scale.set(1 / camera.zoom, 1 / camera.zoom, 1);
  }
}

export default Text;
