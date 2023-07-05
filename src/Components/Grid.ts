import {
  Color,
  Vector3,
  Vector2,
  PlaneGeometry,
  ShaderMaterial,
  OrthographicCamera,
  Mesh,
} from "three";
import { Line2, LineGeometry, LineMaterial } from "three-fatline";
import { Component } from "./Component";
import Line from "./Primitives/Line";
import Text from "./Primitives/Text";

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

type GridProps = {
  cellSize?: number;
  pointRadius?: number;
  pointColor?: Color;
  labels?: boolean;
  yLabelText?: string;
  xLabelText?: string;
};


class Grid extends Component {
  draggable = undefined;
  private shaderMesh: Mesh;
  private xAxis: Line;
  private yAxis: Line;
  private xLabel: Text;
  private yLabel: Text;


  constructor({cellSize = 50, pointRadius = 1.5, pointColor = new Color(0xe1e1e1), labels = true, xLabelText = "x", yLabelText = "y"}: GridProps) {
    super();

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
      new Vector2(window.innerWidth-1000, 0),
      {arrowhead: true, lineWidth: 3}
    )
    this.yAxis = new Line(
      new Vector2(0, -window.innerHeight),
      new Vector2(0, window.innerHeight-1000),
      {arrowhead: true, lineWidth: 3}
    )
    this.xLabel = new Text(xLabelText, {color: "#000000", fontSize: 22});
    this.yLabel = new Text(yLabelText, {color: "#000000", fontSize: 22});
    if (labels) {
      this.add(this.xLabel, this.yLabel);
    }

    this.add(this.shaderMesh, this.xAxis, this.yAxis);
  }

  update(camera: OrthographicCamera) {
    (this.shaderMesh.material as ShaderMaterial).uniforms.zoomLevel.value = camera.zoom;
    (this.shaderMesh.material as ShaderMaterial).uniforms.offset.value = camera.position;

    this.shaderMesh.position.set(camera.position.x, camera.position.y, -1);
    this.shaderMesh.scale.set(1 / camera.zoom, 1 / camera.zoom, 1);
    this.xAxis.start = new Vector2(camera.position.x-window.innerWidth/camera.zoom, 0);
    this.xAxis.end = new Vector2(camera.position.x+((window.innerWidth-780)/camera.zoom), 0);
    this.yAxis.start = new Vector2(0, camera.position.y-window.innerHeight/camera.zoom);
    this.yAxis.end = new Vector2(0, camera.position.y+((window.innerHeight-400)/camera.zoom));
    this.xLabel.position.setX(camera.position.x+((window.innerWidth-792)/camera.zoom));
    this.xLabel.position.setY(15/camera.zoom);
    this.yLabel.position.setY(camera.position.y+((window.innerHeight-420)/camera.zoom));
    this.yLabel.position.setX(23/camera.zoom);
  }
}

export default Grid;
