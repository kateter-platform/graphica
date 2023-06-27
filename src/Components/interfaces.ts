import { Vector3, OrthographicCamera, Object3D } from "three";
import Graphica from "../Graphica";

export interface Component {
  position: Vector3;
  object: Object3D;
  draggable: boolean;
  update(camera: OrthographicCamera): void;
}
