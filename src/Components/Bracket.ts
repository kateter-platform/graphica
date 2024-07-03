import { OrthographicCamera, Vector2 } from "three";
import { Line2, LineMaterial } from "three-fatline";
import { toVector3 } from "../utils";
import Text from "./Text";
import { Component } from "./interfaces";
import { InputPosition } from "./types";

class Bracket extends Component {
  start: InputPosition;
  end: InputPosition;

  _bracket: Line2;
  _text: Text;

  constructor(content: string, start: InputPosition, end: InputPosition) {
    super();
    this.start = start;
    this.end = end;

    this._bracket = new Line2(
      undefined,
      new LineMaterial({
        color: 0x080007,
        linewidth: 4,
        resolution: new Vector2(window.innerWidth, window.innerHeight),
      })
    );
    this.add(this._bracket);
    this._updateBracketGeometry();
    this.name = "Bracket";

    this._text = new Text(content, {
      fontSize: 20,
      position: [0, 0],
      anchorX: "center",
    });
    this.add(this._text);
    this._updateBracketText();
  }

  update(camera: OrthographicCamera) {
    this._updateBracketGeometry(camera.zoom);
    this._updateBracketText(camera.zoom);
  }

  _updateBracketText(cameraZoom = 1) {
    const start3 = toVector3(this.end);
    const end3 = toVector3(this.start);
    const diff = end3.clone().sub(start3.clone());
    const middle = diff.clone().divideScalar(2).add(start3.clone());
    const angle = Math.atan2(diff.y, diff.x);

    this._text.position.set(
      middle.x + (Math.cos(angle + Math.PI / 2) * 70) / cameraZoom,
      middle.y + (Math.sin(angle + Math.PI / 2) * 70) / cameraZoom,
      this._text.position.z
    );
  }

  _updateBracketGeometry(cameraZoom = 1) {
    const start3 = toVector3(this.end);
    const end3 = toVector3(this.start);
    const diff = end3.clone().sub(start3.clone());
    const middle = diff.clone().divideScalar(2).add(start3.clone());
    const angle = Math.atan2(diff.y, diff.x);

    const formelCos = Math.cos(angle + Math.PI / 2);
    const formelSin = Math.sin(angle + Math.PI / 2);

    const startLine = new Vector2(
      start3.x + (formelCos * 20) / cameraZoom,
      start3.y + (formelSin * 20) / cameraZoom
    );
    const punkt1 = new Vector2(
      startLine.x + (formelCos * 10) / cameraZoom,
      startLine.y + (formelSin * 10) / cameraZoom
    );
    const punkt2 = new Vector2(
      middle.x + (formelCos * 30) / cameraZoom,
      middle.y + (formelSin * 30) / cameraZoom
    );
    const punkt3 = new Vector2(
      punkt2.x + (formelCos * 10) / cameraZoom,
      punkt2.y + (formelSin * 10) / cameraZoom
    );
    const endLine = new Vector2(
      end3.x + (formelCos * 20) / cameraZoom,
      end3.y + (formelSin * 20) / cameraZoom
    );
    const punkt4 = new Vector2(
      endLine.x + (formelCos * 10) / cameraZoom,
      endLine.y + (formelSin * 10) / cameraZoom
    );

    const brekkHøyre = new Vector2(
      punkt2.x + (Math.cos(angle) * 10) / cameraZoom,
      punkt2.y + (Math.sin(angle) * 10) / cameraZoom
    );
    const brekkVenstre = new Vector2(
      punkt2.x - (Math.cos(angle) * 10) / cameraZoom,
      punkt2.y - (Math.sin(angle) * 10) / cameraZoom
    );

    const points = [
      startLine,
      punkt1,
      brekkVenstre,
      punkt3,
      brekkHøyre,
      punkt4,
      endLine,
    ];
    this._bracket.geometry.setPositions(points.flatMap((v) => [v.x, v.y, 3]));
  }
}
export default Bracket;
