import "./style.css";
import * as THREE from "three/webgpu";
import {
  positionLocal,
  Fn,
  length,
  sin,
  time,
  vec3,
  pow,
  float,
  fract,
  max,
  abs,
} from "three/tsl";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  53,
  window.innerWidth / window.innerHeight,
  0.1,
  10,
);
camera.position.z = 1;

const renderer = new THREE.WebGPURenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setAnimationLoop(animate);

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const controls = new OrbitControls(camera, renderer.domElement);
//controls.target.set(1, -1, 0)
controls.enableDamping = true;

// const options = {
//   radius: 0.1,
// }

// const radius = uniform(options.radius)

const main = Fn(() => {
  const p = positionLocal.toVar();

  p.mulAssign(5);

  const radius = float(0.1);
  const intensity = 2;

  const colours = [
    vec3(1.0, 0.05, 0.3),
    vec3(0.1, 0.4, 1.0),
    vec3(0.2, 1, 0.2),
  ];

  const finalColour = vec3().toVar();

  for (let i = 0; i < 3; i++) {
    p.mulAssign(sin(i).add(0.5));

    p.assign(fract(p).sub(0.5));

    const distance = length(p);

    distance.assign(sin(distance.mul(10).sub(time)));
    distance.assign(abs(distance));

    // glow equation = pow(radius/distance), intensity)
    distance.assign(pow(radius.div(distance), intensity));

    finalColour.assign(max(finalColour, colours[i].mul(distance)));
  }

  return finalColour;
});

const material = new THREE.NodeMaterial();
material.fragmentNode = main();

const mesh = new THREE.Mesh(new THREE.PlaneGeometry(), material);
scene.add(mesh);

//scene.backgroundNode = main()

const gui = new GUI();
// gui.add(options, 'radius', 0, 1, 0.01).onChange((v) => {
//   radius.value = v
// })

function animate() {
  controls.update();

  renderer.render(scene, camera);
}
