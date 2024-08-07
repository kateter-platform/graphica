import { Box3, Event, Object3D, OrthographicCamera, Vector3 } from "three";
import { Text as TroikaText } from "troika-three-text";
import { toVector2, toVector3 } from "../utils";
import { Collider, Component } from "./interfaces";
import { InputPosition } from "./types";

type fontWeight = "regular" | "medium" | "semi-bold" | "black";

type TextOptions = {
  position?: InputPosition;
  color?: string;
  fontSize?: number;
  anchorY?: "top" | "middle" | "bottom";
  anchorX?: "left" | "center" | "right";
  weight?: fontWeight;
  responsiveScale?: boolean;
};

const defaultTextOptions = {
  position: [0, 0] as [number, number],
  color: "black",
  fontSize: 30,
  anchorX: "left",
  anchorY: "bottom",
  weight: "regular" as fontWeight,
  responsiveScale: true,
};

const fontMap = {
  regular: "Jost-Regular.ttf",
  medium: "Jost-Medium.ttf",
  "semi-bold": "Jost-SemiBold.ttf",
  black: "Jost-Black.ttf",
};

type TroikaTextType = InstanceType<typeof TroikaText>;

class Text extends Component implements Collider {
  draggable = undefined;
  renderText: TroikaTextType;
  responsiveScale: boolean;

  constructor(text?: string, options?: TextOptions) {
    super();
    this.name = "Text";

    const {
      position,
      color,
      fontSize,
      anchorX,
      anchorY,
      weight,
      responsiveScale,
    } = {
      ...defaultTextOptions,
      ...options,
    };

    const renderText = new TroikaText();
    const pos = toVector3(position);
    renderText.text = text;
    renderText.fontSize = fontSize;
    renderText.color = color;
    renderText.font = `/public/fonts/${fontMap[weight]}`;
    renderText.sdfGlyphSize = 32;
    renderText.anchorX = anchorX;
    renderText.anchorY = anchorY;
    renderText.sync();
    this.renderText = renderText;
    this.add(renderText);
    this.position.set(pos.x, pos.y, 0.1);
    this.responsiveScale = responsiveScale;
  }

  collidesWith(other: Object3D): boolean {
    const box1 = new Box3().setFromObject(this);
    const box2 = new Box3().setFromObject(other);

    // Set Z-coordinates to 0 for both boxes
    box1.min.z = 0;
    box1.max.z = 0;
    box2.min.z = 0;
    box2.max.z = 0;

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

  setText(text: string): void {
    this.renderText.text = text;
  }

  setFontSize(fontSize: number): void {
    this.renderText.fontSize = fontSize;
  }

  update(camera: OrthographicCamera) {
    if (this.responsiveScale) {
      this.scale.set(1 / camera.zoom, 1 / camera.zoom, 1);
    }
  }

  public setZIndex(z: number): void {
    this.position.setZ(z);
  }
}

export default Text;
