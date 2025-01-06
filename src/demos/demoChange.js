import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";


const w = window.innerWidth;
const h = window.innerHeight;
const gui = new dat.GUI();

// 创建容器（场景）
const scene = new THREE.Scene();

const axes = new THREE.AxesHelper(2, 2, 2);
scene.add(axes);

const cubeControls = {
  color: 0xff0000,
};

const cubeG = new THREE.BoxGeometry(1, 1, 1);
const cubeM = new THREE.MeshBasicMaterial({ color: cubeControls.color });
const cube = new THREE.Mesh(cubeG, cubeM);
scene.add(cube);
gui.addColor(cubeControls, "color").onChange(() => {
  cubeM.color.set(cubeControls.color);
});

// 球
const sphereG = new THREE.SphereGeometry(0.6);
const sphereM = new THREE.MeshNormalMaterial();
const sphere = new THREE.Mesh(sphereG, sphereM);
scene.add(sphere);

gui.add(sphereM, "wireframe");

// 控制方块位置
const foldrel1 = gui.addFolder("方块位置");
foldrel1.add(cube.position, "x", -3, 3, 0.01);
foldrel1.add(cube.position, "y", -3, 3, 0.01);
foldrel1.add(cube.position, "z", -3, 3, 0.01);
// 光线
const light = new THREE.AmbientLight();
scene.add(light);

// 相机
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.set(5, 5, 5);
camera.lookAt(0, 0, 0);

// 控制相机位置
const foldrel = gui.addFolder("相机位置");
foldrel.add(camera.position, "x", -5, 5, 0.01).name("相机位置-x");
foldrel.add(camera.position, "y", -5, 5, 0.01).name("相机位置-y");
foldrel.add(camera.position, "z", -5, 5, 0.01).name("相机位置-z");

// 渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(w, h);

document.body.append(renderer.domElement);

const orbitControls = new OrbitControls(camera, renderer.domElement);
renderer.render(scene, camera);

const controls = {
  r: 1.5,
  speed: "1",
  stop: () => {
    controls.speed = 0;
  },
};

gui.add(controls, "r", 0.3).name("运动半径");
gui.add(controls, "speed", 0, 5).name("运动速度");
gui.add(controls, "stop");

const colck = new THREE.Clock();

const tick = () => {
  const time = colck.getElapsedTime();

  sphere.position.x = Math.sin(time * controls.speed) * controls.r;
  sphere.position.z = Math.cos(time * controls.speed) * controls.r;

  requestAnimationFrame(tick);
  renderer.render(scene, camera);
  orbitControls.update();
};
tick();
