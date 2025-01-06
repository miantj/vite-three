import * as THREE from "three";
import Stat from "three/examples/jsm/libs/stats.module";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const w = window.innerWidth;
const h = window.innerHeight;
const stat = new Stat();

// 创建容器（场景）
const scene = new THREE.Scene();

// 公共材质
const m = new THREE.MeshNormalMaterial();

// 汽车
const car = new THREE.Group();
// 前面两个轮子
const frontWheels = new THREE.Group();

// 轮子1
const wheel1 = new THREE.Group();
const wheelG = new THREE.TorusGeometry(0.5, 0.1, 10, 20);
const wheel1Mesh = new THREE.Mesh(wheelG, m);

const n = 10;
for (let i = 0; i < n; i++) {
  const g = new THREE.CylinderGeometry(0.03, 0.03, 1);
  const mesh = new THREE.Mesh(g, m);
  mesh.rotation.z = ((Math.PI * 2) / n) * i;
  wheel1.add(mesh);
}
wheel1.add(wheel1Mesh);

// 车轴
const len = 2;
const cylinderG = new THREE.CylinderGeometry(0.05, 0.05, len);
const cylinder = new THREE.Mesh(cylinderG, m);
cylinder.rotation.x = -0.5 * Math.PI;

wheel1.position.z = -len / 2;

// 轮子2
const wheel2 = wheel1.clone();
wheel2.position.z = len / 2;

frontWheels.add(wheel1, cylinder, wheel2);
frontWheels.rotation.y = 0.5 * Math.PI;
frontWheels.position.y = -1;

// 后面两个轮子
const backWheels = frontWheels.clone();
backWheels.position.y = 1;

// 车身
const body = new THREE.Group();
const cubeG = new THREE.BoxGeometry(1.6, 4, 0.5);
const cube = new THREE.Mesh(cubeG, m);

// 车顶
const roofG = new THREE.CylinderGeometry(
  1.2,
  1.2,
  1.6,
  3,
  1,
  false,
  -Math.PI / 2,
  Math.PI
);
const roof = new THREE.Mesh(roofG, m);
roof.rotation.z = Math.PI / 2;

body.add(cube, roof);

car.add(frontWheels, backWheels, body);
scene.add(car);
car.rotation.x = -0.5 * Math.PI;
car.position.y = 0.5;

// 地面
const planeG = new THREE.PlaneGeometry(10, 10);
const planeM = new THREE.MeshBasicMaterial();
const plane = new THREE.Mesh(planeG, planeM);
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI;

// 光线
const light = new THREE.AmbientLight();
scene.add(light);

// 相机
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.set(2, 5, 5);
camera.lookAt(0, 0, 0);

// 渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(w, h);

const container = document.querySelector(".demo-container");
container.appendChild(renderer.domElement);
container.appendChild(stat.dom);

const orbitControls = new OrbitControls(camera, renderer.domElement);
renderer.render(scene, camera);

const colck = new THREE.Clock();

const tick = () => {
  const time = colck.getElapsedTime();
  frontWheels.rotation.x = -time * 2;
  backWheels.rotation.x = -time * 2;
  car.position.z = (time % 4) - 2;
  renderer.render(scene, camera);
  orbitControls.update();
  stat.update();
  requestAnimationFrame(tick);
};
tick();

window.addEventListener("resize", () => {
  const container = document.querySelector(".demo-container");
  const width = container.clientWidth;
  const height = container.clientHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
});

// 初始化时设置正确的尺寸
renderer.setSize(container.clientWidth, container.clientHeight);
