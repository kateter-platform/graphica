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
    float dynamicCameraScale = pow(2., floor(log(1. / zoomLevel) / log(2.)));
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
  labels?: boolean;
  yLabelText?: string;
  xLabelText?: string;
};

const defaultGridOptions: GridOptions = {
  cellSize: 64,
  pointRadius: 1.5,
  pointColor: new Color(0xe1e1e1),
  labels: true,
  xLabelText: "x",
  yLabelText: "y",
};

class Grid extends Component {
  draggable = undefined;
  private shaderMesh: Mesh;
  private xAxis: Line;
  private yAxis: Line;
  private xLabel: Text;
  private yLabel: Text;
  private labelsX: Text[];
  private labelsY: Text[];
  private cellSize: number;

  constructor(options?: GridOptions) {
    super();

    const {
      cellSize,
      pointRadius,
      pointColor,
      labels,
      xLabelText,
      yLabelText,
    } = {
      ...defaultGridOptions,
      ...options,
    };
    this.cellSize = cellSize!;

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
    if (labels) {
      this.add(this.xLabel, this.yLabel);
    }

    this.add(this.shaderMesh, this.xAxis, this.yAxis);

    // Coordinate labels
    this.labelsX = [];
    this.labelsY = [];

    for (let i = 0; i < 80; i++) {
      this.labelsX.push(new Text(i.toString(), { position: [i*this.cellSize-5, -26], fontSize: 16}));
      this.add(this.labelsX[i]);
      this.labelsY.push(new Text(i.toString(), { position: [i*this.cellSize-5, -26], fontSize: 16}));
      this.add(this.labelsY[i]);
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
      camera.position.x - window.innerWidth * 0.5 / camera.zoom,
      0
    );
    this.xAxis.end = new Vector2(
      camera.position.x + (window.innerWidth * 0.5 - PADDING) / camera.zoom,
      0
    );
    this.yAxis.start = new Vector2(
      0,
      camera.position.y - window.innerHeight * 0.5 / camera.zoom
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
      camera.position.y + (window.innerHeight * 0.5 - PADDING - 15) / camera.zoom
    );
    this.yLabel.position.setX(20 / camera.zoom);

    const dynamicCameraScale = Math.pow(2, Math.floor(Math.log(1. / camera.zoom) / Math.log(2.)));
    const dynamicCameraScale2 = Math.pow(2, 6+Math.floor(Math.log(1. / camera.zoom) / Math.log(2.)));

    const dynamicSize = dynamicCameraScale * this.cellSize;
    const roundedX = dynamicSize * Math.floor(camera.position.x / dynamicSize);
    const roundedY = dynamicSize * Math.floor(camera.position.y / dynamicSize);

    for (let i = 0; i < 80; i++) {
      const size = i - 80 / 2;

      const x = (size + 1) * this.cellSize * dynamicCameraScale;
      const camX = camera.position.x + window.innerWidth / (2 * camera.zoom);
      const diffX =camX - x;
      const rdx = Math.floor(diffX / (80 * dynamicSize));

      const y = (size + 1) * this.cellSize * dynamicCameraScale;
      const camY = camera.position.y + window.innerHeight / (2 * camera.zoom);
      const diffY =camY - y;
      const rdy = Math.floor(diffY / (80 * dynamicSize));

      const contentX = ((size+1+rdx*80)*dynamicCameraScale2).toString();
      const contentY = ((size+1+rdy*80)*dynamicCameraScale2).toString();

      this.labelsX[i].position.set(80*dynamicSize*rdx + x - 5*contentX.length / camera.zoom, -26 / camera.zoom, this.labelsX[i].position.z);
      this.labelsX[i].setText(contentX);

      this.labelsY[i].position.set(-26 / camera.zoom, rdy*80*dynamicSize+(size+1) * this.cellSize * dynamicCameraScale - 5*contentY.length / camera.zoom, this.labelsY[i].position.z);
      this.labelsY[i].setText(contentY);

      if (contentY == '0') {
      this.labelsY[i].setText('');
      }
      if (contentX == '0') {
      this.labelsX[i].setText('');
      }
    }
  }
}

export default Grid;
