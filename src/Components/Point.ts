import {
  CircleGeometry,
  MeshBasicMaterial,
  Mesh,
  Event,
  Object3D,
  Box3,
  Vector3,
} from "three";
import Text from "./Text";
import { Collider, Component, DragListener, Draggable } from "./interfaces";

type PointOptions = {
  label?: boolean;
  decimals?: number;
  color?: string;
  draggable?: Draggable;
  dragListeners?: ((point: Point) => void)[];
};

const defaultPointOptions = {
  color: "#FAA307",
  draggable: undefined,
  decimals: 1,
  label: false,
  dragListeners: [],
};

class Point extends Component implements Collider, DragListener<Point> {
  dragListeners: ((point: Point) => void)[];
  constructor(x = 0, y = 0, options?: PointOptions) {
    super();
    const { color, draggable, decimals, label, dragListeners } = {
      ...defaultPointOptions,
      ...options,
    };

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
    strokeMesh.position.set(0, 0, this.position.z - 0.01);
    this.geometry = circleMesh.geometry;
    this.material = circleMesh.material;
    this.add(strokeMesh);
    // set position of the mesh
    this.position.set(x, y, this.position.z);
    this.dragListeners = dragListeners ?? [];

    if (label) {
      const text = new Text(
        `(${x.toFixed(decimals)}, ${y.toFixed(decimals)})`,
        {
          color: "black",
          fontSize: 18,
          anchorY: "middle",
          anchorX: "left",
          position: [15, 0],
          responsiveScale: false,
        }
      );
      text.name = "label";
      this.add(text);
    }
  }

  addDragListener(listener: (point: Point) => void) {
    this.dragListeners.push(listener);
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

  dragUpdate() {
    (this.getObjectByName("label") as Text)?.setText(
      `(${this.position.x.toFixed(1)}, ${this.position.y.toFixed(1)})`
    );
    this.dispatchEvent({
      type: "positionChange",
      message: "Point has been moved",
      position: this.position,
    }); // Dispatch the drag event
    this.dragListeners.forEach((fn) => fn(this));
  }

  update(camera: THREE.OrthographicCamera) {
    this.scale.set(1 / camera.zoom, 1 / camera.zoom, 1);
  }
}
export default Point;
