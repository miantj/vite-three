import * as THREE from "three";
import Stat from "three/examples/jsm/libs/stats.module";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const w = window.innerWidth;
const h = window.innerHeight;
const stat = new Stat();

// 创建容器（场景）
const scene = new THREE.Scene();

// const axes = new THREE.AxesHelper(2, 2, 2);
// scene.add(axes);

// 贴图
const loader = new THREE.TextureLoader();
const texture = loader.load(
  "https://images.squarespace-cdn.com/content/v1/5be5c337a9e02874136908f2/1580809645632-FJ0TMYHIB9Z9LPLCKRGC/Maple.jpg?format=2500w"
);
const texture2 = loader.load(
  "https://p5.itc.cn/images01/20220323/7ba16d4343e8420ba0828b510fe9b1fc.jpeg"
);

// plane
const planeG = new THREE.PlaneGeometry(4, 4);
const planeM = new THREE.MeshStandardMaterial({
  map: texture,
  side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(planeG, planeM);
plane.rotation.x = -1.5;
plane.receiveShadow = true;
scene.add(plane);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const m1 = new THREE.MeshStandardMaterial({
  map: texture,
});
const m2 = new THREE.MeshStandardMaterial({
  map: texture2,
});
const cube = new THREE.Mesh(geometry, [m1, m2, m1, m2, m1, m2]);
cube.position.y = 0.51;
cube.rotation.x = -1.5;
cube.castShadow = true;

scene.add(cube);

// 光线
const light = new THREE.AmbientLight(0xffffff, 0.2);

const light2 = new THREE.DirectionalLight(0xffffff);
light2.position.set(1, 1, 1);
light2.castShadow = true;
// 设置阴影的相关参数
light2.shadow.mapSize.width = 2048;
light2.shadow.mapSize.height = 2048;
// 调整阴影的范围
light2.shadow.camera.near = 0.5;
light2.shadow.camera.far = 500;

scene.add(light, light2);

// 相机
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.set(0, 1, 3);
camera.lookAt(0, 0, 0);

// 渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(w, h);
renderer.shadowMap.enabled = true;

document.body.append(renderer.domElement);
document.body.append(stat.dom);

const orbitControls = new OrbitControls(camera, renderer.domElement);
renderer.render(scene, camera);

const tick = () => {
  renderer.render(scene, camera);
  orbitControls.update();
  stat.update();
  requestAnimationFrame(tick);
};
tick();
