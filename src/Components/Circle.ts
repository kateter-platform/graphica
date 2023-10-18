import {
  MeshBasicMaterial,
  Mesh,
  CircleGeometry,
  RingGeometry,
  OrthographicCamera,
  Event,
  Object3D,
  Box3,
  Vector3,
} from "three";
import { Collider, Component } from "./interfaces";

export type CircleOptions = {
  color: number;
  segments: number;
};

export const defaultShapeOptions: CircleOptions = {
  color: 0xfaa307,
  segments: 128,
};

class Circle extends Component implements Collider {
  radius: number;
  _strokeMesh: Mesh;
  segments: number;

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
    this.segments = segments;
    const strokeGeometry = new RingGeometry(radius - 1, radius, this.segments);
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

  collidesWith(other: Object3D): boolean {
    const box1 = new Box3().setFromObject(this);
    const box2 = new Box3().setFromObject(other);

    // Set Z-coordinates to 0 for both boxes
    box1.min.z = 0;
    box1.max.z = 0;
    box2.min.z = 0;
    box2.max.z = 0;

    return box1.intersectsBox(box2);
  }

  distanceTo(other: Object3D<Event>): number {
    const box1 = new Box3().setFromObject(this);
    const box2 = new Box3().setFromObject(other);

    const center1 = new Vector3();
    const center2 = new Vector3();
    box1.getCenter(center1);
    box2.getCenter(center2);
    center1.setZ(0);
    center2.setZ(0);

    return center1.distanceTo(center2);
  }

  update(camera: OrthographicCamera) {
    this._strokeMesh.geometry = new RingGeometry(
      this.radius - 4 / camera.zoom,
      this.radius,
      this.segments
    );
  }
}

export default Circle;
