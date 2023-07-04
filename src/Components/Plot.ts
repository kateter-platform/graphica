import { parse } from "mathjs";
import {
  Vector3,
  Object3D,
  CatmullRomCurve3,
  Vector2,
  OrthographicCamera,
} from "three";
import { Line2, LineGeometry, LineMaterial } from "three-fatline";
import Graphica from "../Graphica";
import { Component } from "./interfaces";

type PointOptions = {
  numPoints?: number;
  dashed?: boolean;
  lineWidth?: number;
  color?: number;
  coefficients?: Coefficients;
};

type Coefficients = {
  [key: string]: number;
};

class Plot extends Component {
  position: Vector3 = new Vector3(0, 0, 0);
  object: Object3D;
  draggable = undefined;
  public func: string;
  private plotRange = 850;
  private numPoints: number;
  private minX: number;
  private maxX: number;
  private coefficients: Coefficients;

  constructor(
    func: string,
    {
      numPoints = 2500,
      dashed = false,
      lineWidth = 1,
      color = 0xff0000,
      coefficients = {},
    }: PointOptions
  ) {
    super();
    const minX = (-this.plotRange / 1) * 2 + 0;
    const maxX = (this.plotRange / 1) * 2 + 0;
    const initialCurve = new CatmullRomCurve3(
      Plot.calculatePoints(minX, maxX, numPoints, func, coefficients)
    );
    const points = initialCurve.getPoints(numPoints);
    const geometry = new LineGeometry().setPositions(
      points.flatMap((e) => [e.x, e.y, e.z])
    );
    const material = new LineMaterial({
      color: color,
      linewidth: lineWidth,
      resolution: new Vector2(window.innerWidth, window.innerHeight),
      dashed: dashed,
    });
    const plot = new Line2(geometry, material);
    plot.computeLineDistances();
    plot.scale.set(1, 1, 1);
    plot.frustumCulled = false;

    this.minX = minX;
    this.maxX = maxX;
    this.func = func;
    this.numPoints = numPoints;
    this.coefficients = coefficients;
    this.object = plot;
  }

  private static calculatePoints(
    minX: number,
    maxX: number,
    numPoints: number,
    func: string,
    coefficients: { [key: string]: number }
  ): Vector3[] {
    const step = (maxX - minX) / numPoints;
    const newPoints = Array.from({ length: numPoints }, (_, i) => {
      const x = minX + i * step;

      const expr = parse(func);
      const scope = { x, ...coefficients };
      const compiledExpr = expr.compile();
      console.log(compiledExpr);
      const y = compiledExpr.evaluate(scope);
      console.log(x, y);
      return new Vector3(x, y, 0);
    });
    return newPoints;
  }

  public setCoefficients(coefficients: Coefficients): void {
    this.coefficients = coefficients;
    this.reRenderPlot(this.minX, this.maxX);
  }

  private reRenderPlot(minX: number, maxX: number): void {
    this.minX = minX;
    const initialCurve = new CatmullRomCurve3(
      Plot.calculatePoints(
        minX,
        maxX,
        this.numPoints,
        this.func,
        this.coefficients
      )
    );
    const points = initialCurve.getPoints(this.numPoints);
    (this.object as Line2).geometry = new LineGeometry().setPositions(
      points.flatMap((e) => [e.x, e.y, e.z])
    );
    (this.object as Line2).computeLineDistances();
  }

  addToGraphica(graphica: Graphica): void {
    graphica.addMesh(this.object);
  }
  removeFromGraphica(graphica: Graphica): void {
    graphica.removeMesh(this.object);
  }

  update(camera: OrthographicCamera): void {
    const minX = (-this.plotRange / camera.zoom) * 2 + camera.position.x;
    const maxX = (this.plotRange / camera.zoom) * 2 + camera.position.x;

    if (minX !== this.minX) {
      this.reRenderPlot(minX, maxX);
    }
  }
}

export default Plot;
