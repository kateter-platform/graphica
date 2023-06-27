import { Vector3, OrthographicCamera } from "three";
import Graphica from "../Graphica";

export interface Component {
  position: Vector3;
  addToGraphica(graphica: Graphica): void;
  removeFromGraphica(graphica: Graphica): void;
  update(camera: OrthographicCamera): void;
}
