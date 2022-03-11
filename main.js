import "./style.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// const rootDomElement = document.getElementById("root");
const gui = new dat.GUI();

const world = {
  plane: {
    width: 5,
    height: 5,
    widthSegments: 20,
    heightSegments: 20,
  },
};
gui.add(world.plane, "width", 0, 20).onChange(generateMeshPlane);
gui.add(world.plane, "height", 0, 20).onChange(generateMeshPlane);
gui.add(world.plane, "widthSegments", 0, 20).onChange(generateMeshPlane);
gui.add(world.plane, "heightSegments", 0, 20).onChange(generateMeshPlane);

function generateMeshPlane() {
  plane.geometry.dispose();
  plane.geometry = new THREE.PlaneGeometry(
    world.plane.width,
    world.plane.height,
    world.plane.widthSegments,
    world.plane.heightSegments
  );
  const { array } = plane.geometry.attributes.position;

  for (let i = 0; i < array.length; i += 3) {
    const z = array[i + 2];
    array[i + 2] = z + Math.random();
  }
}

const scene = new THREE.Scene();
const pespectiveCamera = new THREE.PerspectiveCamera(
  75,
  innerWidth / innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(innerWidth, innerHeight);

document.body.appendChild(renderer.domElement);

const planeGeometry = new THREE.PlaneGeometry(5, 5, 20, 20);
const planeMaterial = new THREE.MeshPhongMaterial({
  color: 0xff0000,
  side: THREE.DoubleSide,
  flatShading: true,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
// console.log(plane.geometry.attributes.position.array);
const { array } = plane.geometry.attributes.position;

for (let i = 0; i < array.length; i += 3) {
  const z = array[i + 2];
  array[i + 2] = z + Math.random();
}
scene.add(plane);
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 0, 1);
scene.add(light);
const backlight = new THREE.DirectionalLight(0xffffff, 1);
backlight.position.set(0, 0, -1);
scene.add(backlight);
new OrbitControls(pespectiveCamera, renderer.domElement);

pespectiveCamera.position.z = 5;

const rayCaster = new THREE.Raycaster();

const mouse = {
  x: undefined,
  y: undefined,
};
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, pespectiveCamera);
  rayCaster.setFromCamera(mouse, pespectiveCamera);
  const intersects = rayCaster.intersectObject(plane);
  if (intersects.length > 0) {
    const intersection = intersects[0];
    const { point } = intersection;
    const { x, y, z } = point;
    console.log(x, y, z);
  }

  // plane.rotation.x += 0.01;
}
addEventListener("mousemove", (e) => {
  mouse.x = (e.clientX / innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / innerHeight) * 2 + 1;
});
animate();

// console.log(scene);
// console.log(pespectiveCamera);
// console.log(renderer);

// BOX MATERIAL GENERATOR

// const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
// const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// const box = new THREE.Mesh(boxGeometry, boxMaterial);
// scene.add(box);
// box.rotation.x += 0.01;
// box.rotation.y += 0.01;
