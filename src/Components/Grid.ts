import {
  Color,
  Vector2,
  Vector3,
  PlaneGeometry,
  ShaderMaterial,
  OrthographicCamera,
  Mesh,
} from "three";
import Line from "./Line";
import Text from "./Text";
import { Component } from "./interfaces";

const vertexShader = `
  varying vec3 worldPosition;

  void main() {
    worldPosition = position;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(worldPosition, 1.0);
  }
`;

const fragmentShader = `
    varying vec3 worldPosition;
    uniform float zoomLevel;
    uniform float cellSize;
    uniform float pointRadius;
    uniform vec3 pointColor;
    uniform vec3 offset;

  void main() {
    float dynamicCameraScale1 = pow(10., floor(log(45. / zoomLevel) / log(10.)));
    float dynamicCameraScale2 = 2. * pow(10., floor(log(45. / (2. * zoomLevel)) / log(10.)));
    float dynamicCameraScale3 = 5. * pow(10., floor(log(45. / (5. * zoomLevel)) / log(10.)));

    float dynamicCameraScale = min(dynamicCameraScale1, min(dynamicCameraScale2, dynamicCameraScale3));

    float size = cellSize * dynamicCameraScale * zoomLevel;
    vec2 r = (offset.xy * zoomLevel + worldPosition.xy) / size;
    vec2 roundedR = round(r);

    if (roundedR.x == 0. || roundedR.y == 0.) discard;

    float distFromRounded = distance(roundedR, r);
    float edgeWidth = pointRadius / 2.;
    float alpha = 1. - smoothstep(pointRadius, pointRadius + edgeWidth, distFromRounded * cellSize * dynamicCameraScale * zoomLevel);

    gl_FragColor = vec4(pointColor, alpha);
  }
`;

type GridOptions = {
  cellSize?: number;
  pointRadius?: number;
  pointColor?: Color;
  labels: boolean;
  yLabelText?: string;
  xLabelText?: string;
  hasAxis?: boolean;
};

const defaultGridOptions: GridOptions = {
  cellSize: 10,
  pointRadius: 1.5,
  pointColor: new Color(0xe1e1e1),
  labels: true,
  xLabelText: "x",
  yLabelText: "y",
  hasAxis: true,
};

const LABELS_LENGTH = 81;

class Grid extends Component {
  draggable = undefined;
  private cellSize: number;
  private shaderMesh: Mesh;
  private xAxis: Line;
  private yAxis: Line;
  private xLabel: Text;
  private yLabel: Text;

  // Axis labels
  private labelsX: Text[];
  private labelsY: Text[];

  private hasLabels: boolean;

  constructor(options?: GridOptions) {
    super();

    const {
      cellSize,
      pointRadius,
      pointColor,
      labels,
      xLabelText,
      yLabelText,
      hasAxis,
    } = {
      ...defaultGridOptions,
      ...options,
    };
    this.cellSize = cellSize ?? 10;
    this.hasLabels = labels;
    const gridGeometry = new PlaneGeometry(
      window.innerWidth,
      window.innerHeight
    );

    const gridMaterial = new ShaderMaterial({
      uniforms: {
        cellSize: { value: cellSize },
        pointRadius: { value: pointRadius },
        pointColor: { value: pointColor },
        zoomLevel: { value: 1.0 },
        offset: { value: new Vector3() },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
    });

    this.shaderMesh = new Mesh(gridGeometry, gridMaterial);

    this.xAxis = new Line(
      new Vector2(-window.innerWidth, 0),
      new Vector2(window.innerWidth - 1000, 0),
      { arrowhead: true, lineWidth: 3 }
    );
    this.yAxis = new Line(
      new Vector2(0, -window.innerHeight),
      new Vector2(0, window.innerHeight - 1000),
      { arrowhead: true, lineWidth: 3 }
    );
    this.xLabel = new Text(xLabelText, { color: "#000000", fontSize: 22 });
    this.yLabel = new Text(yLabelText, { color: "#000000", fontSize: 22 });

    this.add(this.shaderMesh);

    if (labels) {
      this.add(this.xLabel, this.yLabel);
    }

    if (hasAxis) {
      this.add(this.xAxis, this.yAxis);
    }

    // Coordinate labels
    this.labelsX = [];
    this.labelsY = [];
    if (labels) {
      for (let i = 0; i < LABELS_LENGTH; i++) {
        const worldIndex = i - LABELS_LENGTH / 2;
        this.labelsX.push(
          new Text(worldIndex.toString(), {
            position: [worldIndex, 0],
            fontSize: 16,
            anchorX: "center",
            anchorY: "top",
          })
        );
        this.labelsY.push(
          new Text(worldIndex.toString(), {
            position: [0, worldIndex],
            fontSize: 16,
            anchorX: "right",
            anchorY: "middle",
          })
        );
        this.add(this.labelsX[i]);
        this.add(this.labelsY[i]);
      }
    }
  }

  _updateAxisLabels(camera: OrthographicCamera) {
    const dynamicCameraScale1 = Math.pow(
      10,
      Math.floor(Math.log(45 / camera.zoom) / Math.log(10))
    );
    const dynamicCameraScale2 =
      2 *
      Math.pow(10, Math.floor(Math.log(45 / (2 * camera.zoom)) / Math.log(10)));
    const dynamicCameraScale3 =
      5 *
      Math.pow(10, Math.floor(Math.log(45 / (5 * camera.zoom)) / Math.log(10)));
    const dynamicCellSize =
      Math.min(dynamicCameraScale1, dynamicCameraScale2, dynamicCameraScale3) *
      this.cellSize;

    const centeredCameraX =
      camera.position.x + window.innerWidth / (2 * camera.zoom);
    const centeredCameraY =
      camera.position.y + window.innerHeight / (2 * camera.zoom);
    const axisMargin = -9 / camera.zoom;

    for (let i = 0; i < LABELS_LENGTH; i++) {
      const worldIndex = Math.floor(i - LABELS_LENGTH / 2);

      const worldX = worldIndex * dynamicCellSize;
      const worldY = worldIndex * dynamicCellSize;

      const diffX = centeredCameraX - worldX;
      const diffY = centeredCameraY - worldY;

      const roundedOffsetX =
        LABELS_LENGTH *
        dynamicCellSize *
        Math.floor(diffX / (LABELS_LENGTH * dynamicCellSize));
      const roundedOffsetY =
        LABELS_LENGTH *
        dynamicCellSize *
        Math.floor(diffY / (LABELS_LENGTH * dynamicCellSize));

      const numberX =
        Math.round((worldIndex * dynamicCellSize + roundedOffsetX) * 1000) /
        1000;
      const numberY =
        Math.round((worldIndex * dynamicCellSize + roundedOffsetY) * 1000) /
        1000;
      let contentX =
        dynamicCellSize >= 10000 ? numberX.toExponential() : numberX.toString();
      let contentY =
        dynamicCellSize >= 10000 ? numberY.toExponential() : numberY.toString();
      if (numberX === 0) contentX = "";
      if (numberY === 0) contentY = "";

      if (this.hasLabels) {
        this.labelsX[i].setText(contentX);
        this.labelsX[i].position.set(
          roundedOffsetX + worldX,
          axisMargin,
          this.labelsX[i].position.z
        );

        this.labelsY[i].setText(contentY);
        this.labelsY[i].position.set(
          axisMargin,
          roundedOffsetY + worldY,
          this.labelsY[i].position.z
        );
      }
    }
  }

  update(camera: OrthographicCamera) {
    (this.shaderMesh.material as ShaderMaterial).uniforms.zoomLevel.value =
      camera.zoom;
    (this.shaderMesh.material as ShaderMaterial).uniforms.offset.value =
      camera.position;

    this.shaderMesh.position.set(camera.position.x, camera.position.y, -1);
    this.shaderMesh.scale.set(1 / camera.zoom, 1 / camera.zoom, 1);

    const PADDING = 25;
    this.xAxis.start = new Vector2(
      camera.position.x - (window.innerWidth * 0.5) / camera.zoom,
      0
    );
    this.xAxis.end = new Vector2(
      camera.position.x + (window.innerWidth * 0.5 - PADDING) / camera.zoom,
      0
    );
    this.yAxis.start = new Vector2(
      0,
      camera.position.y - (window.innerHeight * 0.5) / camera.zoom
    );
    this.yAxis.end = new Vector2(
      0,
      camera.position.y + (window.innerHeight * 0.5 - PADDING) / camera.zoom
    );
    this.xLabel.position.setX(
      camera.position.x + (window.innerWidth * 0.5 - PADDING - 10) / camera.zoom
    );
    this.xLabel.position.setY(10 / camera.zoom);
    this.yLabel.position.setY(
      camera.position.y +
        (window.innerHeight * 0.5 - PADDING - 15) / camera.zoom
    );
    this.yLabel.position.setX(20 / camera.zoom);

    this._updateAxisLabels(camera);
  }

  onWindowResize() {
    this.shaderMesh.geometry = new PlaneGeometry(
      window.innerWidth,
      window.innerHeight
    );
  }

  public setZIndex(): void {
    this.position.setZ(1);
  }
}

export default Grid;
