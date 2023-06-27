import { Mesh, Vector3 } from "three";
import { Line2 } from "three/examples/jsm/lines/Line2";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial";
import Graphica from "../Graphica";
import { toVector3 } from "../utils";
import { Component } from "./interfaces";
import { InputPosition } from "./types";

type LineProps = {
  color?: number;
  lineWidth?: number;
};

const defaultLineProps: LineProps = {
  color: 0x000000,
  lineWidth: 1,
};

class Line implements Component {
  start: Vector3;
  end: Vector3;
  position: Vector3;
  mesh: Mesh;

  constructor(
    start: InputPosition = [0, 0],
    end: InputPosition = [0, 0],
    props: LineProps = defaultLineProps
  ) {
    const { color, lineWidth } = props;

    this.start = toVector3(start);
    this.end = toVector3(end);
    this.position = new Vector3();

    const points = [this.start, this.end]
      .map((v) => [v.x, v.y, v.z])
      .flatMap((e) => e);

    const geometry = new LineGeometry();
    geometry.setPositions(points);

    const matLine = new LineMaterial({
      color: color,
      linewidth: lineWidth !== undefined ? lineWidth * 0.001 : lineWidth,
      vertexColors: true,
      dashed: false,
      alphaToCoverage: true,
    });

    const line = new Line2(geometry, matLine);
    line.computeLineDistances();
    line.scale.set(1, 1, 1);
    this.mesh = line;
  }

  addToGraphica(graphica: Graphica) {
    graphica.addMesh(this.mesh);
  }

  removeFromGraphica(graphica: Graphica) {
    graphica.removeMesh(this.mesh);
  }
  update() {
    return;
  }
}

export default Line;
