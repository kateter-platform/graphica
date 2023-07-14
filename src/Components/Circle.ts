import { MeshBasicMaterial, Mesh, CircleGeometry, RingGeometry } from "three";
import { Component } from "./interfaces";

export type CircleOptions = {
  color?: number;
};

export const defaultShapeOptions: CircleOptions = {
  color: 0xfaa307,
};

class Circle extends Component {
  draggable = undefined; //usikker på hva denne gjør
  //color: number;
  //object: Object3D;

  constructor(x = 0, y = 0, radius = 30, options?: CircleOptions) {
    super();

    const { color } = { ...defaultShapeOptions, ...options };

    const geometry = new CircleGeometry(radius, 32);
    const material = new MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.5,
    });
    const strokeGeometry = new RingGeometry(radius - 1, radius, 50);
    const strokeMaterial = new MeshBasicMaterial({ color: "#080007" });
    // set mesh of the point instance
    const circleMesh = new Mesh(geometry, material);
    const strokeMesh = new Mesh(strokeGeometry, strokeMaterial);
    strokeMesh.position.set(0, 0, 1);
    this.geometry = circleMesh.geometry;
    this.material = circleMesh.material;
    this.add(strokeMesh);
    // set position of the mesh
    this.position.set(x, y, 0);
  }
}

export default Circle;
