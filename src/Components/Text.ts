import { OrthographicCamera } from "three";
import { Text as TroikaText } from "troika-three-text";
import Font from "../assets/fonts/Jost-Black.ttf";
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

class Text extends Component {
  draggable = undefined;
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
    super();
    const renderText = new TroikaText();
    const pos = toVector3(position);
    renderText.text = text;
    renderText.fontSize = fontSize;
    renderText.color = color;
    renderText.font = Font;
    renderText.sdfGlyphSize = 32;
    renderText.anchorX = anchorX;
    renderText.anchorY = anchorY;
    renderText.position.set(pos.x, pos.y, 0.1);
    this.renderText = renderText;
    this.add(renderText);
  }

  setText(text: string) {
    this.renderText.text = text;
  }

  update(camera: OrthographicCamera) {
    this.scale.set(1 / camera.zoom, 1 / camera.zoom, 1);
  }
}

export default Text;
