import { Vector3, CircleGeometry, MeshBasicMaterial, Mesh, Object3D } from "three";
import Graphica from "../Graphica";
import { Component } from "./interfaces";


type PointOptions = {
  color?: string;
  showCoordinates?: boolean;
  decimals?: number;
  draggable?: boolean;
};

class Point implements Component {
  position: Vector3;
  object: Object3D;
  draggable: boolean;

  constructor(x: number = 0, y: number = 0, {color, showCoordinates, decimals, draggable = true}: PointOptions) {
    // set position of the point instance
    this.draggable = draggable;
    this.position = new Vector3(x, y, 0);
    // create a circle geometry
    const geometry = new CircleGeometry(4, 32);
    const material = new MeshBasicMaterial({ color: color });
    const strokeGeometry = new CircleGeometry(6, 32);
    const strokeMaterial = new MeshBasicMaterial({ color: "#080007" });
    // set mesh of the point instance
    const circleMesh = new Mesh(geometry, material);
    const strokeMesh = new Mesh(strokeGeometry, strokeMaterial);
    strokeMesh.position.set(0, 0, -0.1);
    this.object = circleMesh;
    this.object.add(strokeMesh);
    // set position of the mesh
    this.object.position.set(this.position.x, this.position.y, 0);
  }

  update(camera: THREE.OrthographicCamera) {
    this.object.scale.set(2 / camera.zoom, 2 / camera.zoom, 1);
  }
}
export default Point;
