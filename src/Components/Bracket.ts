import { OrthographicCamera, Vector2 } from "three";
import { Line2, LineGeometry, LineMaterial } from "three-fatline";
import { toVector3 } from "../utils";
import { Component } from "./interfaces";
import { InputPosition } from "./types";

class Bracket extends Component {
  content: string;
  start: InputPosition;
  end: InputPosition;

  constructor(content: string, start: InputPosition, end: InputPosition) {
    super();
    this.content = content;
    this.start = start;
    this.end = end;

    const bracket = this.createBracket(content, start, end, 1);
    this.add(bracket);
  }

  update(camera: OrthographicCamera) {
    this.removeLines();

    const bracket = this.createBracket(
      this.content,
      this.start,
      this.end,
      camera.zoom
    );

    this.add(bracket);
  }

  createBracket(
    content: string,
    start: InputPosition,
    end: InputPosition,
    cameraZoom: number
  ) {
    const start3 = toVector3(end);
    const end3 = toVector3(start);
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

    const textPosition = new Vector2(
      punkt3.x + formelCos * 40,
      punkt3.y + formelSin * 40
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
    const tempLine = new LineGeometry();
    tempLine.setPositions(points.flatMap((v) => [v.x, v.y, 3]));
    const bracket = new Line2(
      tempLine,
      new LineMaterial({
        color: 0x080007,
        linewidth: 4,
        resolution: new Vector2(window.innerWidth, window.innerHeight),
      })
    );

    return bracket;
  }

  removeLines() {
    this.children.forEach((child) => {
      this.remove(child);
    });
  }
}
export default Bracket;
