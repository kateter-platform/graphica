import { MeshBasicMaterial, Shape, Mesh, Object3D, ShapeGeometry } from "three";
import { toVector2 } from "../utils";
import Line from "./Line";
import { Component } from "./interfaces";
import { InputPosition } from "./types";

export type PolygonOptions = {
  color?: number;
  fill?: boolean;
  opacity?: number;
  lineOpacity?: number;
  transparent?: boolean;
  hasOutline?: boolean;
};

export const defaultShapeOptions: PolygonOptions = {
  color: 0xfaa307,
  opacity: 0.6,
  lineOpacity: 1,
  transparent: false,
  hasOutline: true,
};

export type PolygonVertices = [
  InputPosition,
  InputPosition,
  InputPosition,
  ...InputPosition[]
];

class Polygon extends Component {
  draggable = undefined;
  vertices: PolygonVertices;
  color: number;
  opacity: number;
  object: Object3D;

  constructor(vertices: PolygonVertices, options?: PolygonOptions) {
    super();

    const { color, opacity, lineOpacity, transparent, hasOutline } = {
      ...defaultShapeOptions,
      ...options,
    };

    const shape = new Shape(vertices.map((vertex) => toVector2(vertex)));
    const material = new MeshBasicMaterial({
      color: color,
      opacity: opacity,
      transparent: transparent,
    });
    const geometry = new ShapeGeometry(shape);

    const mesh = new Mesh(geometry, material);
    mesh.scale.set(1, 1, 1);
    mesh.position.set(mesh.position.x, mesh.position.y, 1);
    if (hasOutline) {
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
        this.add(
          new Line(l[0], l[1], {
            color: 0x080007,
            opacity: lineOpacity,
            transparent: transparent,
          })
        );
      });
    }

    this.add(mesh);
    this.object = mesh;
    this.geometry = geometry;
    this.vertices = vertices;
    this.color = color ?? 0xfaa307;
    this.opacity = opacity ?? 0.6;
  }

  setPosition(position: InputPosition) {
    this.object.position.set(
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
