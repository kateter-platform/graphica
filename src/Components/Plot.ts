import { evaluate, parse } from "mathjs";
import {
  Vector3,
  Object3D,
  Mesh,
  MeshBasicMaterial,
  CatmullRomCurve3,
  BufferGeometry,
  LineBasicMaterial,
  Line,
} from "three";
import { ParametricGeometry } from "three/examples/jsm/geometries/ParametricGeometry";
import Graphica from "../Graphica";
import { Component } from "./interfaces";

type PointOptions = {
  expression?: string;
  draggable?: boolean;
};

class Plot implements Component {
  position: Vector3 = new Vector3(0, 0, 0);
  object: Object3D;
  draggable = undefined;

  constructor(plotRange: number, numPoints: number, func: string) {
    const initialCurve = new CatmullRomCurve3(
      Plot.calculatePoints(plotRange, numPoints, func)
    );
    const points = initialCurve.getPoints(numPoints);
    const geometry = new BufferGeometry().setFromPoints(points);
    console.log(geometry);
    const material = new LineBasicMaterial({ color: 0x000000 });
    const mesh = new Mesh(geometry, material);
    mesh.frustumCulled = false;
    mesh.scale.set(1, 1, 1);
    const a = new Line(geometry, material);

    this.object = a;
  }

  private static calculatePoints(
    plotRange: number,
    numPoints: number,
    func: string
  ): Vector3[] {
    const minX = -plotRange * 2;
    const maxX = plotRange * 2;
    const step = (maxX - minX) / numPoints;
    const newPoints = Array.from({ length: numPoints }, (_, i) => {
      const x = minX + i * step;
      const y = evaluate(parse(func).toString(), { x });
      console.log(x, y);
      return new Vector3(x, y, 0);
    });
    console.log(newPoints);
    return newPoints;
  }

  addToGraphica(graphica: Graphica): void {
    graphica.addMesh(this.object);
  }
  removeFromGraphica(graphica: Graphica): void {
    graphica.removeMesh(this.object);
  }
}

export default Plot;
