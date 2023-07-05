import {
  Color,
  Vector3,
  PlaneGeometry,
  ShaderMaterial,
  OrthographicCamera,
} from "three";
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
};

const defaultGridOptions: GridOptions = {
  cellSize: 50,
  pointRadius: 1.5,
  pointColor: new Color(0xe1e1e1),
};

class Grid extends Component {
  draggable = undefined;

  constructor(options?: GridOptions) {
    super();

    const { cellSize, pointRadius, pointColor } = {
      ...defaultGridOptions,
      ...options,
    };

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

    this.geometry = gridGeometry;
    this.material = gridMaterial;
  }

  update(camera: OrthographicCamera) {
    (this.material as ShaderMaterial).uniforms.zoomLevel.value = camera.zoom;
    (this.material as ShaderMaterial).uniforms.offset.value = camera.position;

    this.position.set(camera.position.x, camera.position.y, -1);
    this.scale.set(1 / camera.zoom, 1 / camera.zoom, 1);
  }
}

export default Grid;
