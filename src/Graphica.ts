import {
  WebGLRenderer,
  OrthographicCamera,
  MOUSE,
  Scene,
  Color,
  Object3D,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Component, ConstrainFunction } from "./Components/Component";
import { DragControls } from "./Controls/DragControls";

class Graphica {
  components: Component[];
  draggables: Component[];

  renderer: WebGLRenderer;
  camera: OrthographicCamera;
  scene: Scene;

  constructor(root: HTMLElement) {
    this.renderer = new WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight); // TODO: The size should be adaptive
    this.renderer.setPixelRatio(window.devicePixelRatio);
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
    this.draggables = [];

    const dragControls = new DragControls(
      this.draggables,
      this.camera,
      this.renderer.domElement
    );

    dragControls.addEventListener("dragstart", function (event) {
      controls.enabled = false;

      const draggedObject = event.object;
      draggedObject.is_dragged = true;
      draggedObject.userData.initialPosition = draggedObject.position.clone();
    });

    dragControls.addEventListener("drag", function (event) {
      const draggedObject = event.object;

      if (draggedObject.dragUpdate) {
        draggedObject.dragUpdate();
      }

      const draggable = draggedObject.draggable;

      if (draggable === "unrestricted") return;
      if (draggable === "horizontal")
        draggedObject.position.y = draggedObject.userData.initialPosition.y;
      if (draggable === "vertical")
        draggedObject.position.x = draggedObject.userData.initialPosition.x;
      if (typeof draggable === "function") {
        const [x, y] = (draggable as ConstrainFunction)(
          draggedObject.position.x,
          draggedObject.position.y
        );

        draggedObject.position.x = x;
        draggedObject.position.y = y;
      }
    });

    dragControls.addEventListener("dragend", function (event) {
      controls.enabled = true;

      const draggedObject = event.object;
      draggedObject.is_dragged = false;
    });
  }

  run() {
    requestAnimationFrame(this.run.bind(this));
    this.scene.traverse((child: Object3D) => {
      if (!(child instanceof Component)) {
        return;
      }
      if (child.update) {
        child.update(this.camera);
      }
    });
    this.renderer.render(this.scene, this.camera);
  }

  add(component: Component) {
    this.scene.add(component);
    // Add draggable functionality to draggable components
    if (component.draggable !== undefined) {
      this.draggables.push(component);
    }
    this.components.push(component);
  }

  remove(component: Component) {
    this.scene.remove(component);
    // Remove draggable functionality from draggable components
    if (component.draggable !== undefined) {
      this.draggables.splice(this.draggables.indexOf(component), 1);
    }
    this.components.splice(this.components.indexOf(component), 1);
  }
}

export default Graphica;
