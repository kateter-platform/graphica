import {
  MeshBasicMaterial,
  Shape,
  Mesh,
  Group,
  Object3D,
  ShapeGeometry,
  Event,
  Box3,
  Vector3,
} from "three";
import { toVector2 } from "../utils";
import Line from "./Line";
import { Collider, Component, DragListener, Draggable } from "./interfaces";
import { InputPosition } from "./types";

export type PolygonOptions = {
  color?: number;
  fill?: boolean;
  opacity?: number;
  draggable?: Draggable;
  dragListeners?: ((point: Polygon) => void)[];
};

export const defaultShapeOptions: PolygonOptions = {
  color: 0xfaa307,
  opacity: 0.6,
  draggable: undefined,
  dragListeners: [],
};

type PolygonVertices = [
  InputPosition,
  InputPosition,
  InputPosition,
  ...InputPosition[]
];

class Polygon extends Component implements Collider, DragListener<Polygon> {
  vertices: PolygonVertices;
  color: number;
  object: Object3D;
  dragListeners: ((value: Polygon) => void)[];

  constructor(vertices: PolygonVertices, options?: PolygonOptions) {
    super();

    const { color, opacity, draggable, dragListeners } = {
      ...defaultShapeOptions,
      ...options,
    };

    const shape = new Shape(vertices.map((e) => toVector2(e)));
    const material = new MeshBasicMaterial({
      color: color,
      opacity: opacity,
      transparent: true,
    });
    const geometry = new ShapeGeometry(shape);

    const mesh = new Mesh(geometry, material);
    mesh.scale.set(1, 1, 1);
    this.geometry = mesh.geometry;
    this.material = mesh.material;
    this.position.setZ(1.5);

    const group = new Group();
    const lines = [];
    for (let i = 0; i < vertices.length - 1; i++) {
      const startVertex = vertices[i];
      const endVertex = vertices[i + 1];
      lines.push([startVertex, endVertex]);
    }
    const lastVertex = vertices[vertices.length - 1];
    const firstVertex = vertices[0];
    lines.push([lastVertex, firstVertex]);

    lines.forEach((l) => {
      group.add(new Line(l[0], l[1], { color: 0x080007, opacity: opacity }));
    });
    this.add(group);
    this.object = group;
    this.vertices = vertices;
    this.color = color ?? 0xfaa307;
    this.draggable = draggable;
    this.dragListeners = dragListeners ?? [];
  }

  addDragListener(listener: (value: Polygon) => void) {
    this.dragListeners.push(listener);
  }

  dragUpdate(): void {
    this.dragListeners.forEach((fn) => fn(this));
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

  setPosition(position: InputPosition) {
    this.position.set(
      toVector2(position).x,
      toVector2(position).y,
      this.position.z
    );
    this.children.forEach((child) => {
      if (child instanceof Object3D) {
        child.position.set(
          toVector2(position).x,
          toVector2(position).y,
          this.position.z
        );
      }
    });
  }

  /*   update(camera: OrthographicCamera) {
    this.remove(this.object);

    if (this.fill) {
      const shape = new Shape(this.vertices);
      const material = new MeshBasicMaterial({
        color: this.color,
      });

      const geometry = new ExtrudeGeometry(shape);
      const mesh = new Mesh(geometry, material);
      mesh.scale.set(1, 1, 1);
      this.add(mesh);
      this.object = mesh;
    } else {
      const group = new Group();
      const lines = [];
      for (let i = 0; i < this.vertices.length - 1; i++) {
        const startVertex = this.vertices[i];
        const endVertex = this.vertices[i + 1];
        lines.push([startVertex, endVertex]);
      }
      const lastVertex = this.vertices[this.vertices.length - 1];
      const firstVertex = this.vertices[0];
      lines.push([lastVertex, firstVertex]);

      lines.forEach((l) => {
        group.add(new Line(l[0], l[1], { color: this.color }));
      });
      this.add(group);
      this.object = group;
      console.log("rerendering");
    }
  }*/
}

export default Polygon;
