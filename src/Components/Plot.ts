import { Vector3, CatmullRomCurve3, Vector2, OrthographicCamera } from "three";
import { parse } from "mathjs";
import { Line2, LineGeometry, LineMaterial } from "three-fatline";
import { Component } from "./interfaces";

type PlotOptions = {
  numPoints?: number;
  dashed?: boolean;
  lineWidth?: number;
  color?: number;
  coefficients?: Coefficients;
};

const defaultPlotOptions = {
  numPoints: 2500,
  dashed: false,
  lineWidth: 1,
  color: 0xff0000,
  coefficients: {},
};

type Coefficients = {
  [key: string]: number;
};

const PLOTRANGE = 1250;

class Plot extends Component {
  draggable = undefined;
  public func: string;
  private numPoints: number;
  private currentMinX: number;
  private currentMaxX: number;
  private currentZoom: number;
  private coefficients: Coefficients;
  private RENDERTHRESHOLDX = 500;
  private RENDERTHRESHOLDZOOM = 2;

  constructor(func: string, options?: PlotOptions) {
    super();

    const {
      numPoints = 1000,
      dashed = false,
      lineWidth = 1,
      color = 0xff0000,
      coefficients = {},
    } = { ...defaultPlotOptions, ...options };

    const minX = (-PLOTRANGE / 1) * 2 + 0;
    const maxX = (PLOTRANGE / 1) * 2 + 0;
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

    this.currentMinX = minX;
    this.currentMaxX = maxX;
    this.currentZoom = 1;
    this.func = func;
    this.numPoints = numPoints;
    this.coefficients = coefficients;

    plot.name = "plot";
    this.add(plot);
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
      const y = compiledExpr.evaluate(scope);
      return new Vector3(x, y, 0);
    });
    return newPoints;
  }

  public setCoefficients(coefficients: Coefficients): void {
    this.coefficients = coefficients;
    this.reRenderPlot(this.currentMinX, this.currentMaxX);
  }

  private reRenderPlot(minX: number, maxX: number): void {
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
    (this.getObjectByName("plot") as Line2).geometry =
      new LineGeometry().setPositions(points.flatMap((e) => [e.x, e.y, e.z]));
    (this.getObjectByName("plot") as Line2)?.computeLineDistances();
  }

  update(camera: OrthographicCamera): void {
    const minX = (-PLOTRANGE / camera.zoom) * 2 + camera.position.x;
    const maxX = (PLOTRANGE / camera.zoom) * 2 + camera.position.x;

    if (
      Math.abs(this.currentMinX - minX) > this.RENDERTHRESHOLDX ||
      Math.abs(Math.abs(this.currentZoom - camera.zoom) / this.currentZoom) >
        this.RENDERTHRESHOLDZOOM ||
      Math.abs(this.currentMaxX - maxX) > this.RENDERTHRESHOLDX
    ) {
      console.log("re-rendering");
      this.currentMinX = minX;
      this.currentMaxX = maxX;
      this.currentZoom = camera.zoom;
      this.reRenderPlot(minX, maxX);
    }
  }
}

export default Plot;
