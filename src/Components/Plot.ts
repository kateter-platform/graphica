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
  plotRange?: number;
  plotBetween: [number, number] | undefined;
};

const defaultPlotOptions = {
  numPoints: 1500,
  dashed: false,
  lineWidth: 4,
  color: 0xff0000,
  coefficients: {},
  plotBetween: undefined,
};

type Coefficients = {
  [key: string]: number;
};

class Plot extends Component {
  draggable = undefined;
  public func: string;
  private numPoints: number;
  private currentMinX: number;
  private currentMaxX: number;
  private currentZoom: number;
  private coefficients: Coefficients;
  private plotBetween: [number, number] | undefined;

  private RENDERTHRESHOLDX = 1400;
  private RENDERTHRESHOLDZOOM = 2.5;
  private PLOTRANGE = 1450;
  private DEFAULT_RENDERTHRESHOLD = 1400;

  private plotMaterial: LineMaterial;

  constructor(func: string, options?: PlotOptions) {
    super();

    const {
      numPoints = 1000,
      dashed = false,
      lineWidth = 1,
      color = 0xffa500,
      coefficients = {},
      plotBetween = undefined,
    } = { ...defaultPlotOptions, ...options };

    const minX = (-this.PLOTRANGE / 1) * 2 + 0;
    const maxX = (this.PLOTRANGE / 1) * 2 + 0;
    const initialCurve = new CatmullRomCurve3(
      Plot.calculatePoints(
        minX,
        maxX,
        numPoints,
        func,
        coefficients,
        plotBetween
      )
    );
    const points = initialCurve.getPoints(numPoints);
    const geometry = new LineGeometry().setPositions(
      points.flatMap((e) => [e.x, e.y, e.z])
    );
    this.plotMaterial = new LineMaterial({
      color: color,
      linewidth: lineWidth,
      resolution: new Vector2(window.innerWidth, window.innerHeight),
      dashed: dashed,
    });
    const plot = new Line2(geometry, this.plotMaterial);
    plot.computeLineDistances();
    plot.scale.set(1, 1, 1);
    plot.frustumCulled = false;

    this.currentMinX = minX;
    this.currentMaxX = maxX;
    this.currentZoom = 1;
    this.func = func;
    this.numPoints = numPoints;
    this.coefficients = coefficients;
    this.plotBetween = plotBetween;
    plot.name = "plot";
    this.add(plot);
  }

  private static calculatePoints(
    minX: number,
    maxX: number,
    numPoints: number,
    func: string,
    coefficients: { [key: string]: number },
    plotBetween: [number, number] | undefined
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
    if (plotBetween !== undefined) {
      return newPoints.filter(
        (e) => e.x > plotBetween[0] && e.x < plotBetween[1]
      );
    }
    return newPoints;
  }

  public setCoefficients(coefficients: Coefficients): void {
    this.coefficients = coefficients;
    this.reRenderPlot(this.currentMinX, this.currentMaxX);
  }

  public setExpression(expression: string): void {
    this.func = expression;
    this.reRenderPlot(this.currentMinX, this.currentMaxX);
  }

  private reRenderPlot(minX: number, maxX: number): void {
    const initialCurve = new CatmullRomCurve3(
      Plot.calculatePoints(
        minX,
        maxX,
        this.numPoints,
        this.func,
        this.coefficients,
        this.plotBetween
      )
    );
    const points = initialCurve.getPoints(this.numPoints);
    (this.getObjectByName("plot") as Line2).geometry =
      new LineGeometry().setPositions(points.flatMap((e) => [e.x, e.y, e.z]));
    (this.getObjectByName("plot") as Line2)?.computeLineDistances();
  }

  update(camera: OrthographicCamera): void {
    const minX = (-this.PLOTRANGE / camera.zoom) * 2 + camera.position.x;
    const maxX = (this.PLOTRANGE / camera.zoom) * 2 + camera.position.x;

    if (
      Math.abs(this.currentMinX - minX) > this.RENDERTHRESHOLDX ||
      Math.abs(Math.abs(this.currentZoom - camera.zoom) / this.currentZoom) >
        this.RENDERTHRESHOLDZOOM ||
      Math.abs(this.currentMaxX - maxX) > this.RENDERTHRESHOLDX
    ) {
      this.currentMinX = minX;
      this.currentMaxX = maxX;
      this.currentZoom = camera.zoom;
      this.RENDERTHRESHOLDX = this.DEFAULT_RENDERTHRESHOLD / camera.zoom;
      this.RENDERTHRESHOLDX = Math.abs(this.RENDERTHRESHOLDX);
      this.reRenderPlot(minX, maxX);
    }
  }

  onWindowResize() {
    this.plotMaterial.resolution.set(window.innerWidth, window.innerHeight);
  }
}

export default Plot;
