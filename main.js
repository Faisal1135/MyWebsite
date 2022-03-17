import "./style.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// const rootDomElement = document.getElementById("root");
const gui = new dat.GUI();

const world = {
  plane: {
    width: 400,
    height: 400,
    widthSegments: 50,
    heightSegments: 50,
  },
};
gui.add(world.plane, "width", 400, 500).onChange(generateMeshPlane);
gui.add(world.plane, "height", 400, 500).onChange(generateMeshPlane);
gui.add(world.plane, "widthSegments", 50, 100).onChange(generateMeshPlane);
gui.add(world.plane, "heightSegments", 50, 100).onChange(generateMeshPlane);

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

// vertice postion randomization;
const { array } = plane.geometry.attributes.position;
let randomValues = [];

for (let i = 0; i < array.length; i++) {
  if (i % 3 === 0) {
    const z = array[i + 2];
    const x = array[i];
    const y = array[i + 1];

    array[i] = x + (Math.random() - 0.5) * 3;
    array[i + 1] = y + (Math.random() - 0.5) * 3;

    array[i + 2] = z + (Math.random() - 0.5) * 3;
  }
  randomValues.push(Math.random() * Math.random() * 2);
}

plane.geometry.attributes.position.originalPostion =
  plane.geometry.attributes.position.array;
plane.geometry.attributes.position.randomValues =
  plane.geometry.attributes.position.randomValues;

// Color attributes added to the geometry
const colors = [];

for (let index = 0; index < plane.geometry.attributes.position.count; index++) {
  colors.push(0, 0.19, 0.4);
}

plane.geometry.setAttribute(
  "color",
  new THREE.BufferAttribute(new Float32Array(colors), 3)
);
scene.add(plane);

// Creating Stars

const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({
  colors: 0xffffff,
});

const startVerticies = [];

for (let index = 0; index < 10000; index++) {
  const x = (Math.random() - 0.5) * 2000;
  const y = (Math.random() - 0.5) * 2000;
  const z = (Math.random() - 0.5) * 2000;
  startVerticies.push(x, y, z);
}

starGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(startVerticies, 3)
);

const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Adding light into the scnce
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, -1, 1);
scene.add(light);
const backlight = new THREE.DirectionalLight(0xffffff, 1);
backlight.position.set(0, 0, -1);
scene.add(backlight);
new OrbitControls(pespectiveCamera, renderer.domElement);

pespectiveCamera.position.z = 50;

const rayCaster = new THREE.Raycaster();

const mouse = {
  x: undefined,
  y: undefined,
};

let frame = 0;
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, pespectiveCamera);
  rayCaster.setFromCamera(mouse, pespectiveCamera);
  frame += 0.01;

  const { array, originalPostion } = plane.geometry.attributes.position;
  for (let i = 0; i < array.length; i += 3) {
    array[i] = originalPostion[i] + Math.cos(frame + randomValues[i]) * 0.03;
    array[i + 1] =
      originalPostion[i + 1] + Math.sin(frame + randomValues[i + 1]) * 0.001;
  }
  plane.geometry.attributes.position.needsUpdate = true;

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

    stars.rotation.x += 0.0005;

    // colors.setX(0, 0);
    // colors.needsUpdate = true;

    // color.setX(intersects[0].face.a, 0);
    // color.setX(intersects[0].face.b, 0);
    // color.setX(intersects[0].face.c, 0);

    // intersects[0].object.geometry.attributes.color.needsUpadate = true;
  }

  // plane.rotation.x += 0.01;
}

document.querySelector("#viewworkbtn").addEventListener("click", (e) => {
  e.preventDefault();
  gsap.to("#containertxt", {
    opacity: 0,
  });

  gsap.to(pespectiveCamera.position, {
    z: 25,
    ease: "power3.inOut",
    duration: 2,
  });

  gsap.to(pespectiveCamera.rotation, {
    x: 1.57,
    ease: "power3.inOut",
    duration: 2,
  });
  gsap.to(pespectiveCamera.position, {
    y: 1000,
    ease: "power3.in",
    duration: 1.5,
    delay: 2,
  });
});

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
