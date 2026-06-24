import "./style.css";
import * as THREE from "three/webgpu";
import { positionLocal } from "three/tsl";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { color } from "three/src/nodes/TSL.js";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  10,
);
camera.position.z = 1;

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
material.fragmentNode = color("crimson");
// material.fragmentNode = convertColorSpace(
//   texture(new THREE.TextureLoader().load('https://sbcode.net/img/grid.png')),
//   THREE.SRGBColorSpace,
//   THREE.LinearSRGBColorSpace
// )
//material.fragmentNode = positionLocal;

const mesh = new THREE.Mesh(new THREE.PlaneGeometry(), material);
scene.add(mesh);

renderer.debug.getShaderAsync(scene, camera, mesh).then((e) => {
  //console.log(e.vertexShader)
  console.log(e.fragmentShader);
});

function animate() {
  controls.update();

  renderer.render(scene, camera);
}
