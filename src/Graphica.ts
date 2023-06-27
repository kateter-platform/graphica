import {
  WebGLRenderer,
  OrthographicCamera,
  MOUSE,
  Scene,
  Color,
  Mesh,
  Object3D,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DragControls } from 'three/examples/jsm/controls/DragControls.js';
import { Component } from "./Components/interfaces";

class Graphica {
  components: Component[];
  draggables: Object3D[];

  renderer: WebGLRenderer;
  camera: OrthographicCamera;
  scene: Scene;

  constructor(root: HTMLElement) {
    this.renderer = new WebGLRenderer({ antialias: true, alpha: true });
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
    this.draggables = [];

    const dragControls = new DragControls( this.draggables, this.camera, this.renderer.domElement );

    dragControls.addEventListener( 'dragstart', function ( event ) {
      // Optional: You might want to disable any other controls while dragging
      // For example, if you are also using OrbitControls
      // orbitControls.enabled = false;
      controls.enabled = false;
  } );
  
  dragControls.addEventListener( 'dragend', function ( event ) {
      // You can also do something when the dragging ends. 
      // For example, reset the object's color and enable other controls.
      controls.enabled = true;
      // orbitControls.enabled = true; // Re-enable OrbitControls, if you are using them
  } );

  }

  run() {
    requestAnimationFrame(this.run.bind(this));
    this.components.forEach((component) => component.update(this.camera));
    this.renderer.render(this.scene, this.camera);
  }

  add(component: Component) {
    this.scene.add(component.object);
    // Add draggable functionality to draggable components
    if (component.draggable) {
      this.draggables.push(component.object);
    }
    this.components.push(component);
  }

  remove(component: Component) {
    this.scene.remove(component.object);
    // Remove draggable functionality from draggable components
    if (component.draggable) {
      this.draggables.splice(this.draggables.indexOf(component.object), 1);
    }
    this.components.splice(this.components.indexOf(component), 1);
  }

  addMesh(object: Object3D) {
    this.scene.add(object);
  }

  removeMesh(object: Object3D) {
    this.scene.remove(object);
  }
}

export default Graphica;
