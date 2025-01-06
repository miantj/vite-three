import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const w = window.innerWidth;
const h = window.innerHeight;

// 创建容器（场景）
const scene = new THREE.Scene();

const axes = new THREE.AxesHelper(2, 2, 2);
scene.add(axes);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial();
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// 光线
const light = new THREE.AmbientLight();
scene.add(light);

// 相机
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.set(5, 5, 5);
camera.lookAt(0, 0, 0);

// 渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(w, h);

document.body.append(renderer.domElement);

const orbitControls = new OrbitControls(camera, renderer.domElement);
renderer.render(scene, camera);

const tick = () => {
  requestAnimationFrame(tick);
  renderer.render(scene, camera);
  orbitControls.update();
};
tick();