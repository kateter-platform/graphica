import { Vector3, Vector2, Object3D, PlaneGeometry } from "three";
import Graphica from "../Graphica";
import { toVector3 } from "../utils";
import { Component } from "./interfaces";
import { InputPosition } from "./types";
import { Line2, LineGeometry, LineMaterial } from 'three-fatline';

type LineProps = {
  color: number;
  lineWidth: number;
};

const defaultLineProps: LineProps = {
  color: 0x000000,
  lineWidth: 4,
};

class Line implements Component {
  start: Vector3;
  end: Vector3;
  draggable = false;
  position: Vector3;
  object: Object3D;

  constructor(
    start: InputPosition = [0, 0],
    end: InputPosition = [0, 0],
    { color, lineWidth }: LineProps = defaultLineProps
  ) {

    this.start = toVector3(start);
    this.end = toVector3(end);
    this.position = new Vector3();

    const geometry = new LineGeometry();
    geometry.setPositions([this.start.x, this.start.y, 0, this.end.x, this.end.y, 0]);

    const material = new LineMaterial({
      color: color,
      linewidth: lineWidth,
      resolution: new Vector2(window.innerWidth, window.innerHeight),
      dashed: false,
    });

    const line = new Line2(geometry, material);
    line.computeLineDistances();
    line.scale.set(1, 1, 1);
    this.object = line;
  }

  addToGraphica(graphica: Graphica) {
    graphica.addMesh(this.object);
  }

  removeFromGraphica(graphica: Graphica) {
    graphica.removeMesh(this.object);
  }
  update() {
    return;
  }
}

export default Line;
