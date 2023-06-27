import { Vector3, CircleGeometry, MeshBasicMaterial, Mesh, Group } from "three";
import { Component } from "./interfaces";
import Graphica from "../Graphica";
type PointProps = {
  color: string;
  position: Vector3;
  showCoordinates?: boolean;
  decimals?: number;
};
const defaultPointProps: PointProps = {
  color: "#FAA307",
  position: new Vector3(),
  showCoordinates: true,
  decimals: 1,
};
class Point implements Component {
  group: Group;
  position: Vector3;
  constructor(props: PointProps = defaultPointProps) {
    // set position of the point instance
    this.position = new Vector3(props.position.x, props.position.y, 0);
    // create a circle geometry
    const geometry = new CircleGeometry(4, 32);
    const material = new MeshBasicMaterial({ color: props.color });
    const strokeGeometry = new CircleGeometry(6, 32);
    const strokeMaterial = new MeshBasicMaterial({ color: "#080007" });
    // set mesh of the point instance
    const circleMesh = new Mesh(geometry, material);
    const strokeMesh = new Mesh(strokeGeometry, strokeMaterial);
    strokeMesh.position.set(0, 0, -0.1);
    this.group = new Group();
    this.group.add(strokeMesh);
    this.group.add(circleMesh);
    // set position of the mesh
    this.group.position.set(this.position.x, this.position.y, 0);
  }
  addToGraphica(scene: Graphica) {
    scene.addMesh(this.group);
  }
  removeFromGraphica(graphica: Graphica): void {
    graphica.removeMesh(this.group);
  }
  update(camera: THREE.OrthographicCamera) {
    this.group.scale.set(2 / camera.zoom, 2 / camera.zoom, 1);
  }
}
export default Point;
