import * as THREE from "three";
import Stat from "three/examples/jsm/libs/stats.module";
// 轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// 导入draco解码器
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
// 导入gween
import * as TWEEN from "three/examples/jsm/libs/tween.module.js";
import { inflate } from "three/examples/jsm/libs/fflate.module.js";

const w = window.innerWidth;
const h = window.innerHeight;
const stat = new Stat();

// 创建容器（场景）
const scene = new THREE.Scene();

const axes = new THREE.AxesHelper(5, 5, 5);
scene.add(axes);

// 创建1个球

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshBasicMaterial({
    color: 0xff0000,
  })
);
sphere.position.x = -4;
scene.add(sphere);

const tween = new TWEEN.Tween(sphere.position);
tween.to({ x: 4 }, 1000);

tween.onStart(() => {
  console.log("开始");
});
tween.onUpdate(() => {
  console.log(sphere.position.x);
});
tween.onComplete(() => {
  console.log("结束");
});
tween.onStop(() => {
  console.log("停止");
});

// 设置无限循环
// tween.repeat(Infinity);
// 设置循环往复
// tween.yoyo(true);
// 设置延迟
// tween.delay(3000);
// 设置运动函数
tween.easing(TWEEN.Easing.Quadratic.InOut);
// 设置启动补间动画
tween.start();

// 光线
const light = new THREE.Raycaster();
scene.add(light);

// 相机
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.set(0, 10, 9);
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
  tween.update();
  requestAnimationFrame(tick);
};
tick();
