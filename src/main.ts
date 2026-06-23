import "./style.css";
import * as THREE from "three/webgpu";
import { abs, Fn, If, positionLocal, rotateUV, time, vec2 } from "three/tsl";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  10,
);
camera.position.z = 1;

const main = Fn(() => {
  const p = positionLocal.toVar();

  If(abs(p.x).greaterThan(0.45), () => {
    // @ts-ignore
    p.z = 1;
  });
  If(abs(p.y).greaterThan(0.45), () => {
    // @ts-ignore
    p.z = 1;
  });
  return p;
});

const renderer = new THREE.WebGPURenderer({
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setAnimationLoop(animate);

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const material = new THREE.NodeMaterial();
material.fragmentNode = main();

const mesh = new THREE.Mesh(new THREE.PlaneGeometry(), material);
scene.add(mesh);

function animate() {
  controls.update();

  renderer.render(scene, camera);
}
