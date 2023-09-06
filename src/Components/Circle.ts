import {
  MeshBasicMaterial,
  Mesh,
  CircleGeometry,
  RingGeometry,
  OrthographicCamera,
} from "three";
import { Component } from "./interfaces";

export type CircleOptions = {
  color?: number;
  segments?: number;
};

export const defaultShapeOptions: CircleOptions = {
  color: 0xfaa307,
  segments: 64,
};

class Circle extends Component {
  radius: number;
  _strokeMesh: Mesh;

  constructor(x = 0, y = 0, radius = 30, options?: CircleOptions) {
    super();
    this.radius = radius;

    const { color, segments } = { ...defaultShapeOptions, ...options };

    const geometry = new CircleGeometry(radius, segments);
    const material = new MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.5,
    });
    const strokeGeometry = new RingGeometry(radius - 1, radius, 50);
    const strokeMaterial = new MeshBasicMaterial({ color: "#080007" });
    // set mesh of the point instance
    const circleMesh = new Mesh(geometry, material);
    this._strokeMesh = new Mesh(strokeGeometry, strokeMaterial);
    this._strokeMesh.position.set(0, 0, 1);
    this.geometry = circleMesh.geometry;
    this.material = circleMesh.material;
    this.add(this._strokeMesh);
    // set position of the mesh
    this.position.set(x, y, 0);
  }

  update(camera: OrthographicCamera) {
    this._strokeMesh.geometry = new RingGeometry(
      this.radius - 4 / camera.zoom,
      this.radius,
      50
    );
  }
}

export default Circle;
