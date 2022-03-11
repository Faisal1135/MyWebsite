import "./style.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// const rootDomElement = document.getElementById("root");
const gui = new dat.GUI();

const world = {
  plane: {
    width: 19,
    height: 19,
    widthSegments: 17,
    heightSegments: 17,
  },
};
gui.add(world.plane, "width", 10, 30).onChange(generateMeshPlane);
gui.add(world.plane, "height", 10, 30).onChange(generateMeshPlane);
gui.add(world.plane, "widthSegments", 0, 50).onChange(generateMeshPlane);
gui.add(world.plane, "heightSegments", 0, 50).onChange(generateMeshPlane);

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
renderer.setPixelRatio(devicePixelRatio);

document.body.appendChild(renderer.domElement);

const planeGeometry = new THREE.PlaneGeometry(
  world.plane.width,
  world.plane.height,
  world.plane.widthSegments,
  world.plane.heightSegments
);
const planeMaterial = new THREE.MeshPhongMaterial({
  // color: 0xff0000,
  side: THREE.DoubleSide,
  flatShading: true,
  vertexColors: true,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
console.log(plane.geometry.attributes);
const { array } = plane.geometry.attributes.position;

for (let i = 0; i < array.length; i += 3) {
  const z = array[i + 2];
  array[i + 2] = z + Math.random();
}

const colors = [];

for (let index = 0; index < plane.geometry.attributes.position.count; index++) {
  colors.push(0, 0.19, 0.4);
}

plane.geometry.setAttribute(
  "color",
  new THREE.BufferAttribute(new Float32Array(colors), 3)
);
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
    const { color } = intersects[0].object.geometry.attributes;

    // Vertex 1
    color.setX(intersects[0].face.a, 0.1);
    color.setY(intersects[0].face.a, 0.5);
    color.setZ(intersects[0].face.a, 1);

    // Vertex 2
    color.setX(intersects[0].face.b, 0.1);
    color.setY(intersects[0].face.b, 0.5);
    color.setZ(intersects[0].face.b, 1);

    // Vertex 3
    color.setX(intersects[0].face.c, 0.1);
    color.setY(intersects[0].face.c, 0.5);
    color.setZ(intersects[0].face.c, 1);
    intersects[0].object.geometry.attributes.color.needsUpdate = true;

    const initalColor = {
      r: 0,
      g: 0.19,
      b: 0.4,
    };
    const hoverColor = {
      r: 0.1,
      g: 0.5,
      b: 1,
    };

    gsap.to(hoverColor, {
      r: initalColor.r,
      g: initalColor.g,
      b: initalColor.b,
      duration: 1,
      onUpdate: () => {
        color.setX(intersects[0].face.a, hoverColor.r);
        color.setY(intersects[0].face.a, hoverColor.g);
        color.setZ(intersects[0].face.a, hoverColor.b);

        // Vertex 2
        color.setX(intersects[0].face.b, hoverColor.r);
        color.setY(intersects[0].face.b, hoverColor.g);
        color.setZ(intersects[0].face.b, hoverColor.b);

        // Vertex 3
        color.setX(intersects[0].face.c, hoverColor.r);
        color.setY(intersects[0].face.c, hoverColor.g);
        color.setZ(intersects[0].face.c, hoverColor.b);
        intersects[0].object.geometry.attributes.color.needsUpdate = true;
      },
    });

    // colors.setX(0, 0);
    // colors.needsUpdate = true;

    // color.setX(intersects[0].face.a, 0);
    // color.setX(intersects[0].face.b, 0);
    // color.setX(intersects[0].face.c, 0);

    // intersects[0].object.geometry.attributes.color.needsUpadate = true;
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
