import * as THREE from "three";
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

type GridProps = {
  cellSize?: number;
  pointRadius?: number;
  pointColor?: THREE.Color;
}

const defaultGridProps: GridProps = {
  cellSize: 50,
  pointRadius: 2,
  pointColor: new THREE.Color(0xe1e1e1)
}

class Grid implements Component {
  mesh: THREE.Mesh;
  position: THREE.Vector3;

  constructor(props: GridProps = defaultGridProps) {
    this.position = new THREE.Vector3();

    const { cellSize, pointRadius, pointColor } = props;
    const gridGeometry = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight);
    const gridMaterial = new THREE.ShaderMaterial( {
      uniforms: {
        cellSize: { value: cellSize },
        pointRadius: { value: pointRadius },
        pointColor: { value: pointColor },
        zoomLevel: { value: 1.0 },
        offset: { value: new THREE.Vector3() }
      },
      vertexShader,
      fragmentShader,
      transparent: true
    } );

    this.mesh = new THREE.Mesh(gridGeometry, gridMaterial);
  }

  addToGraphica(scene: THREE.Scene) {
    scene.add(this.mesh);
  }

  update(camera: THREE.OrthographicCamera) {
    (this.mesh.material as THREE.ShaderMaterial).uniforms.zoomLevel.value = camera.zoom;
    (this.mesh.material as THREE.ShaderMaterial).uniforms.offset.value = camera.position;

    this.mesh.position.set(camera.position.x, camera.position.y, -1);
    this.mesh.scale.set(1 / camera.zoom, 1 / camera.zoom, 1);
  }
}

export default Grid;
