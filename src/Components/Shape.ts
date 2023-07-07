import {
  Vector2,
  MeshBasicMaterial,
  Shape,
  ExtrudeGeometry,
  Mesh,
  Group,
  Object3D,
} from "three";
import Line from "./Line";
import { Component } from "./interfaces";

export type PolygonOptions = {
  color?: number;
  fill?: boolean;
};

export const defaultShapeOptions: PolygonOptions = {
  color: 0x000000,
  fill: true,
};

type PolygonVertices = [Vector2, Vector2, Vector2, ...Vector2[]];

class Polygon extends Component {
  draggable = undefined;
  vertices: PolygonVertices;
  fill: boolean;
  color: number;
  object: Object3D;

  constructor(vertices: PolygonVertices, options?: PolygonOptions) {
    super();

    const { color, fill } = { ...defaultShapeOptions, ...options };

    if (fill) {
      const shape = new Shape(vertices);
      const material = new MeshBasicMaterial({
        color: color,
      });

      const geometry = new ExtrudeGeometry(shape);
      const mesh = new Mesh(geometry, material);
      mesh.scale.set(1, 1, 1);
      this.add(mesh);
      this.object = mesh;
    } else {
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
        group.add(new Line(l[0], l[1], { color: color }));
      });
      this.add(group);
      this.object = group;
    }
    this.vertices = vertices;
    this.fill = fill ?? false;
    this.color = color ?? 0x000000;
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