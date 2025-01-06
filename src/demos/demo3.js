import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const w = window.innerWidth;
const h = window.innerHeight;

// 创建容器（场景）
const scene = new THREE.Scene();

const axes = new THREE.AxesHelper(2, 2, 2);
// scene.add(axes);
// 组合
const group = new THREE.Group();

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const cube = new THREE.Mesh(geometry, material);
group.add(cube);
cube.position.y = 1.5;

const geometry2 = new THREE.BoxGeometry(1, 1, 1);
const material2 = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube2 = new THREE.Mesh(geometry2, material2);
group.add(cube2);

const geometry3 = new THREE.BoxGeometry(1, 1, 1);
const material3 = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const cube3 = new THREE.Mesh(geometry3, material3);
group.add(cube3);
cube3.position.y = -1.5;
scene.add(group);
// 光线
const light = new THREE.AmbientLight();
scene.add(light);

// 相机
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.set(0, 0, 5);
camera.lookAt(0, 0, 0);

// 渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(w, h);

document.body.append(renderer.domElement);

const orbitControls = new OrbitControls(camera, renderer.domElement);
renderer.render(scene, camera);

const colck = new THREE.Clock();

const tick = () => {
  const time = colck.getElapsedTime();
  requestAnimationFrame(tick);
  renderer.render(scene, camera);
  group.rotation.z = time;
  orbitControls.update();
};
tick();
