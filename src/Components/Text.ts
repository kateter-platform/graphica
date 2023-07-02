import { OrthographicCamera, Vector3, Object3D } from "three";
import { Text as TroikaText } from "troika-three-text";
import Graphica from "../Graphica";
import { toVector3 } from "../utils";
import { Component } from "./interfaces";
import { InputPosition } from "./types";
import Font from "../assets/fonts/Jost-Regular.ttf";

type TextOptions = {
  position?: InputPosition;
  color?: string;
  fontSize?: number;
  anchorY?: "top" | "middle" | "bottom";
  anchorX?: "left" | "center" | "right";
};

class Text implements Component {
  position: Vector3;
  object: Object3D;
  draggable = false;
  size = {width: 0, height: 0}

  constructor(
    content: string,
    { position = [0, 0], color = "black", fontSize = 30, anchorX = "left", anchorY = "bottom" }: TextOptions
  ) {
    this.position = toVector3(position);
    const renderText = new TroikaText();
    renderText.text = content;
    renderText.fontSize = fontSize;
    renderText.color = color;
    renderText.font = Font;
    renderText.sdfGlyphSize = 128; // increase for sharper rendering
    renderText.gpuAccelerateSDF = true; // requires WebGL 2.0
    renderText.anchorX = anchorX;
    renderText.anchorY = anchorY;

    renderText.position.set(this.position.x, this.position.y, 0);
    this.object = renderText;

    renderText.sync(() => {
      this.size.width = renderText.textRenderInfo.blockBounds[2]-renderText.textRenderInfo.blockBounds[0]
      this.size.height = renderText.textRenderInfo.blockBounds[3]-renderText.textRenderInfo.blockBounds[1]
    })
    
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
