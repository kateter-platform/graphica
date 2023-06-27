import {
  Vector3,
  OrthographicCamera,
  Object3D,
  Mesh,
  MeshBasicMaterial,
} from "three";
import { ParametricGeometry } from "three/examples/jsm/geometries/ParametricGeometry";
import Graphica from "../Graphica";
import { Component } from "./interfaces";

type PointOptions = {
  expression?: string;
  draggable?: boolean;
};

class Plot implements Component {
  position: Vector3 = new Vector3(0, 0, 0);
  object: Object3D;
  draggable = false;

  constructor() {
    const func = function (u: number, v: number) {
      //Play with these 2 values to get the exact result you want
      //The height variable is pretty self-explanatory, the size variable acts like a scale on the x/z axis.
      const height = 300; //Limit the height
      const size = 1; //Limit the x/z size, try the value 10 for example

      u = u * height;
      v = v * 2 * Math.PI;

      const x = size * Math.sqrt(u) * Math.cos(v);
      const y = size * 2 * Math.sqrt(u) * Math.sin(v);
      const z = u;
      //Note that the y and z axes are swapped because of how they are displayed in Three.js. Alternatively you could just rotate the resulting mesh and get the same result.
      return new Vector3(x, y, z);
    };
    const geometry = new ParametricGeometry(func, 25, 25);
    const material = new MeshBasicMaterial({ color: 0x00ff00 });
    const mesh = new Mesh(geometry, material);
    this.object = mesh;
  }

  addToGraphica(graphica: Graphica): void {
    graphica.add(this);
  }
  removeFromGraphica(graphica: Graphica): void {
    graphica.remove(this);
  }
  update(camera: OrthographicCamera): void {
    return;
  }
}

export default Plot;
