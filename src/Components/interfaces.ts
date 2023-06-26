import * as THREE from "three";

export interface Component {
  position: THREE.Vector3;
  addToGraphica(scene: THREE.Scene): void;
  update(camera: THREE.OrthographicCamera): void;
}
