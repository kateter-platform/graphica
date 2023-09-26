import {
  WebGLRenderer,
  OrthographicCamera,
  MOUSE,
  Scene,
  Color,
  Object3D,
  Clock,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer";
import {
  Component,
  ConstrainFunction,
  GuiComponent,
} from "./Components/interfaces";
import { InputPosition } from "./Components/types";
import { DragControls } from "./Controls/DragControls";

const ORBIT_CONTROL_OPTIONS = {
  LEFT: MOUSE.PAN,
  MIDDLE: MOUSE.DOLLY,
  RIGHT: MOUSE.ROTATE,
};

type GraphicaOptions = {
  root: HTMLElement;
  disableControls: boolean;
  defaultZoom: number;
  defaultPosition: InputPosition;
  minZoom: number;
  maxZoom: number;
  autoStartClock: boolean;
};

const defaultGraphicaOptions: GraphicaOptions = {
  root: document.body,
  disableControls: false,
  defaultZoom: 50,
  defaultPosition: [0, 0],
  minZoom: 1,
  maxZoom: 500,
  autoStartClock: true,
};

//Note for docs: minZoom is how far you are allowed to zoom IN. MaxZoom is how far you are allowed to zoom OUT.

class Graphica {
  components: Component[];
  draggables: Component[];

  renderer: WebGLRenderer;
  domRenderer: CSS3DRenderer;
  camera: OrthographicCamera;
  scene: Scene;
  controls: OrbitControls;

  guiRoot: HTMLElement;
  clock: Clock;

  constructor(options?: GraphicaOptions) {
    const {
      root,
      disableControls,
      defaultZoom,
      minZoom,
      maxZoom,
      autoStartClock,
    } = {
      ...defaultGraphicaOptions,
      ...options,
    };

    this.clock = new Clock(autoStartClock);
    this.renderer = new WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight); // TODO: The size should be adaptive
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearAlpha(0);

    this.guiRoot = document.createElement("div");
    this.guiRoot.className = "gui";
    root.appendChild(this.guiRoot);
    root.appendChild(this.renderer.domElement);

    this.domRenderer = new CSS3DRenderer();
    this.domRenderer.setSize(window.innerWidth, window.innerHeight);
    this.domRenderer.domElement.style.position = "absolute";
    this.domRenderer.domElement.style.top = "0px";
    this.domRenderer.domElement.style.pointerEvents = "none";
    root.appendChild(this.domRenderer.domElement);

    this.camera = new OrthographicCamera( // TODO: Should depend on the renderer size
      window.innerWidth / -2,
      window.innerWidth / 2,
      window.innerHeight / 2,
      window.innerHeight / -2,
      0.1,
      1000
    );
    // this.camera.position.setX(toVector2(defaultPosition).x);
    // this.camera.position.setY(toVector2(defaultPosition).y);
    this.camera.position.setZ(5);

    this.camera.zoom = defaultZoom;
    this.camera.updateProjectionMatrix();

    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.enableRotate = false;
    controls.enablePan = true;
    controls.mouseButtons = ORBIT_CONTROL_OPTIONS;
    controls.minZoom = minZoom;
    controls.maxZoom = maxZoom;
    this.controls = controls;
    if (disableControls) this.controls.enabled = false;
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

    const onWindowResize = () => {
      (this.camera.left = window.innerWidth / -2),
        (this.camera.right = window.innerWidth / 2),
        (this.camera.top = window.innerHeight / 2),
        (this.camera.bottom = window.innerHeight / -2),
        this.camera.updateProjectionMatrix();

      this.renderer.setSize(window.innerWidth, window.innerHeight);

      this.scene.traverse((child: Object3D) => {
        if (!(child instanceof Component)) {
          return;
        }
        if (child.onWindowResize) {
          child.onWindowResize();
        }
      });
    };

    window.addEventListener("resize", onWindowResize);
  }

  run(
    onUpdate?: (elapsedTime: number) => void,
    clockState?: { conditional: boolean }
  ) {
    clockState = clockState ?? { conditional: true };

    if (!this.clock.running && clockState.conditional) {
      this.clock.start();
    } else if (this.clock.running && !clockState.conditional) {
      this.clock.stop();
    }
    requestAnimationFrame(this.run.bind(this, onUpdate, clockState));
    this.scene.traverse((child: Object3D) => {
      if (!(child instanceof Component)) {
        return;
      }
      if (child.update) {
        child.update(this.camera);
      }
    });
    if (onUpdate) onUpdate(this.clock.getElapsedTime());
    this.domRenderer.render(this.scene, this.camera);
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

  addGui(component: GuiComponent) {
    this.guiRoot.appendChild(component.htmlElement);
  }

  removeGui(component: GuiComponent) {
    this.guiRoot.removeChild(component.htmlElement);
  }

  enableControls() {
    this.controls.enabled = true;
  }

  disableControls() {
    this.controls.enabled = false;
  }

  public getClockTime(): number {
    return this.clock.getElapsedTime();
  }
}

export default Graphica;
