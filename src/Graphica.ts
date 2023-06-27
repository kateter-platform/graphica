import {
  WebGLRenderer,
  OrthographicCamera,
  MOUSE,
  Scene,
  Color,
  Mesh,
} from "three";
import { Component } from "./Components/interfaces";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

class Graphica {
  components: Component[];

  renderer: WebGLRenderer;
  camera: OrthographicCamera;
  scene: Scene;

  constructor(root: HTMLElement) {
    this.renderer = new WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight); // TODO: The size should be adaptive
    root.appendChild(this.renderer.domElement);

    this.camera = new OrthographicCamera( // TODO: Should depend on the renderer size
      window.innerWidth / -2,
      window.innerWidth / 2,
      window.innerHeight / 2,
      window.innerHeight / -2,
      0.1,
      1000
    );
    this.camera.position.z = 5;

    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.enableRotate = false;
    controls.enablePan = true;
    controls.mouseButtons = {
      LEFT: MOUSE.PAN,
      MIDDLE: MOUSE.DOLLY,
      RIGHT: MOUSE.ROTATE,
    };

    this.scene = new Scene();
    this.scene.background = new Color(0xffffff);

    this.components = [];
  }

  run() {
    requestAnimationFrame(this.run.bind(this));
    this.components.forEach((component) => component.update(this.camera));
    this.renderer.render(this.scene, this.camera);
  }

  add(component: Component) {
    component.addToGraphica(this);
    this.components.push(component);
  }

  remove(component: Component) {
    component.removeFromGraphica(this);
    this.components.splice(this.components.indexOf(component), 1);
  }

  addMesh(mesh: Mesh) {
    this.scene.add(mesh);
  }

  removeMesh(mesh: Mesh) {
    this.scene.remove(mesh);
  }
}

export default Graphica;
