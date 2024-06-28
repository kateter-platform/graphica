import { Vector3, CatmullRomCurve3, Vector2, OrthographicCamera } from "three";
import { parse } from "mathjs";
import { Line2, LineGeometry, LineMaterial } from "three-fatline";
import { Component } from "./interfaces";
import { EventEmitter } from "events";

type PlotOptions = {
  hideFromLegend?: boolean;
  numPoints?: number;
  dashed?: boolean;
  lineWidth?: number;
  coefficients?: Coefficients;
  plotRange?: number;
  plotBetween?: [number, number] | undefined;
};

const defaultPlotOptions = {
  numPoints: 1500,
  dashed: false,
  lineWidth: 4,
  coefficients: {},
  plotBetween: undefined,
  hideFromLegend: false,
};

type Coefficients = {
  [key: string]: number;
};

class Plot extends Component {
  draggable = undefined;
  public func: string;
  public funcName: string | undefined;
  public hideFromLegend: boolean;
  private numPoints: number;
  private currentMinX: number;
  private currentMaxX: number;
  private currentZoom: number;
  private coefficients: Coefficients;
  private plotBetween: [number, number] | undefined;
  public color: number | undefined;
  private static counter = 0;
  private static colors = [0xeea73c, 0xe15745, 0x4e0da6, 0x3874b8];

  private RENDERTHRESHOLDX = 1400;
  private RENDERTHRESHOLDZOOM = 2.5;
  private PLOTRANGE = 1450;
  private DEFAULT_RENDERTHRESHOLD = 1400;

  private plotMaterial: LineMaterial;
  static emitter = new EventEmitter();

  constructor(func: string, options?: PlotOptions) {
    super();
    this.setFuncName();
    this.setColor();

    const {
      numPoints = 1000,
      dashed = false,
      lineWidth = 1,
      coefficients = {},
      plotBetween = undefined,
      hideFromLegend,
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
      color: this.color,
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
    this.hideFromLegend = hideFromLegend;
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
    Plot.emitter.emit("expressionUpdated", this);
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

  getFunctionString() {
    return this.func;
  }

  setFuncName() {
    this.funcName = String.fromCharCode("f".charCodeAt(0) + Plot.counter);
  }

  setColor() {
    this.color = Plot.colors[Plot.counter % Plot.colors.length];
    if (this.plotMaterial) {
      this.plotMaterial.color.set(this.color);
    }
    Plot.counter++;
  }

  getColor() {
    return this.plotMaterial.color.getHexString();
  }
}

export default Plot;
