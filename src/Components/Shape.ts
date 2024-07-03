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
  Vector2,
} from "three";
import { Line2, LineGeometry, LineMaterial } from "three-fatline";
import { toVector2 } from "../utils";
import { Collider, Component, DragListener, Draggable } from "./interfaces";
import { InputPosition } from "./types";

export type PolygonOptions = {
  color?: number;
  fill?: boolean;
  opacity?: number;
  draggable?: Draggable;
  dragListeners?: ((point: Polygon) => void)[];
  hasOutline?: boolean;
  lineWidth?: number;
  dashed?: boolean;
  transparent?: boolean;
};

export const defaultShapeOptions: PolygonOptions = {
  color: 0xfaa307,
  opacity: 0.6,
  draggable: undefined,
  dragListeners: [],
  hasOutline: true,
  lineWidth: 4,
  dashed: false,
  transparent: true,
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
  dragListeners: ((value: Polygon) => void)[];
  outlineGroup: Group;
  mesh: Mesh;
  outlineLines: Line2[];
  lineWidth: number;
  dashed: boolean;
  transparent: boolean;

  constructor(vertices: PolygonVertices, options?: PolygonOptions) {
    super();

    const {
      color,
      opacity,
      draggable,
      dragListeners,
      hasOutline,
      lineWidth,
      dashed,
      transparent,
    } = {
      ...defaultShapeOptions,
      ...options,
    };

    this.vertices = vertices;
    this.color = color ?? 0xfaa307;
    this.draggable = draggable;
    this.dragListeners = dragListeners ?? [];
    this.outlineGroup = new Group();
    this.outlineLines = [];
    this.lineWidth = lineWidth ?? 4;
    this.dashed = dashed ?? false;
    this.transparent = transparent ?? true;
    this.name = "Shape";

    const shape = new Shape(vertices.map((e) => toVector2(e)));
    const material = new MeshBasicMaterial({
      color: color,
      opacity: opacity,
      transparent: true,
    });
    const geometry = new ShapeGeometry(shape);

    this.mesh = new Mesh(geometry, material);
    this.mesh.scale.set(1, 1, 1);
    this.add(this.mesh);

    if (hasOutline) {
      this.createOutline();
      this.add(this.outlineGroup);
    }
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
  }

  setVertices(newVertices: PolygonVertices) {
    this.vertices = newVertices;

    // Update the shape geometry
    const shape = new Shape(newVertices.map((e) => toVector2(e)));
    const newGeometry = new ShapeGeometry(shape);

    // Dispose of the old geometry and update the mesh
    this.mesh.geometry.dispose();
    this.mesh.geometry = newGeometry;

    // Update the outline
    this.updateOutline();
  }

  createOutline() {
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
      const geometry = new LineGeometry();
      geometry.setPositions([
        toVector2(l[0]).x,
        toVector2(l[0]).y,
        0,
        toVector2(l[1]).x,
        toVector2(l[1]).y,
        0,
      ]);
      const material = new LineMaterial({
        color: 0x080007,
        linewidth: this.lineWidth,
        resolution: new Vector2(window.innerWidth, window.innerHeight),
        dashed: this.dashed,
        opacity: 1,
        transparent: this.transparent,
      });
      const line = new Line2(geometry, material);
      line.position.setZ(this.position.z + 0.01);
      this.outlineGroup.add(line);
      this.outlineLines.push(line);
    });
  }

  updateOutline() {
    const lines = [];
    for (let i = 0; i < this.vertices.length - 1; i++) {
      const startVertex = this.vertices[i];
      const endVertex = this.vertices[i + 1];
      lines.push([startVertex, endVertex]);
    }
    const lastVertex = this.vertices[this.vertices.length - 1];
    const firstVertex = this.vertices[0];
    lines.push([lastVertex, firstVertex]);

    lines.forEach((l, i) => {
      const line = this.outlineLines[i];
      const positions = [
        toVector2(l[0]).x,
        toVector2(l[0]).y,
        0,
        toVector2(l[1]).x,
        toVector2(l[1]).y,
        0,
      ];
      line.geometry.setPositions(positions);
      line.geometry.attributes.position.needsUpdate = true;
    });
  }
}

export default Polygon;
