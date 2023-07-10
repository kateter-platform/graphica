import { OrthographicCamera } from "three";
import { Text as TroikaText } from "troika-three-text";
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

const defaultTextOptions = {
  position: [0, 0] as [number, number],
  color: "black",
  fontSize: 30,
  anchorX: "left",
  anchorY: "bottom",
};

type TroikaTextType = InstanceType<typeof TroikaText>;

class Text extends Component {
  draggable = undefined;
  renderText: TroikaTextType;

  constructor(text: string, options?: TextOptions) {
    super();

    const { position, color, fontSize, anchorX, anchorY } = {
      ...defaultTextOptions,
      ...options,
    };

    const renderText = new TroikaText();
    const pos = toVector3(position);
    renderText.text = text;
    renderText.fontSize = fontSize;
    renderText.color = color;
    renderText.font = "https://files.catbox.moe/nodsjn.ttf";
    renderText.sdfGlyphSize = 32;
    renderText.anchorX = anchorX;
    renderText.anchorY = anchorY;
    this.renderText = renderText;
    this.add(renderText);
    this.position.set(pos.x, pos.y, 0.1);
  }

  setText(text: string) {
    this.renderText.text = text;
  }

  update(camera: OrthographicCamera) {
    this.scale.set(1 / camera.zoom, 1 / camera.zoom, 1);
  }
}

export default Text;
