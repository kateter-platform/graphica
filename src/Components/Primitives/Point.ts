import { CircleGeometry, MeshBasicMaterial, Mesh } from "three";
import { Component, Draggable } from "../Component";
import Text from "./Text";

type PointOptions = {
  label?: boolean;
  decimals?: number;
  color?: string;
  draggable?: Draggable;
};

class Point extends Component {
  constructor(
    x = 0,
    y = 0,
    {
      color = "#FAA307",
      draggable = undefined,
      decimals = 1,
      label = false,
    }: PointOptions
  ) {
    super();
    // set position of the point instance
    this.draggable = draggable;
    // create a circle geometry
    const geometry = new CircleGeometry(5, 32);
    const material = new MeshBasicMaterial({ color: color });
    const strokeGeometry = new CircleGeometry(8, 32);
    const strokeMaterial = new MeshBasicMaterial({ color: "#080007" });
    // set mesh of the point instance
    const circleMesh = new Mesh(geometry, material);
    const strokeMesh = new Mesh(strokeGeometry, strokeMaterial);
    strokeMesh.position.set(0, 0, -0.1);
    this.geometry = circleMesh.geometry;
    this.material = circleMesh.material;
    this.add(strokeMesh);
    // set position of the mesh
    this.position.set(x, y, 1);

    if (label) {
      const text = new Text(
        `(${x.toFixed(decimals)}, ${y.toFixed(decimals)})`,
        {
          color: "black",
          fontSize: 18,
          anchorY: "middle",
          anchorX: "left",
          position: [15, 0],
        }
      );
      text.name = "label";
      this.add(text);
    }
  }

  dragUpdate() {
    (this.getObjectByName("label") as Text)?.setText(
      `(${this.position.x.toFixed(1)}, ${this.position.y.toFixed(1)})`
    );
    this.dispatchEvent({
      type: "positionChange",
      message: "Point has been moved",
      position: this.position,
    }); // Dispatch the drag event
  }

  update(camera: THREE.OrthographicCamera) {
    this.scale.set(1 / camera.zoom, 1 / camera.zoom, 1);
  }
}
export default Point;
