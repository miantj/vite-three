import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

const w = window.innerWidth;
const h = window.innerHeight;
const gui = new dat.GUI();

// 创建容器（场景）
const scene = new THREE.Scene();

// const axes = new THREE.AxesHelper(2, 2, 2);
// scene.add(axes);

const planeG = new THREE.PlaneGeometry(4, 4);
const planeM = new THREE.MeshPhongMaterial({ color: 0xcccccc });
const plane = new THREE.Mesh(planeG, planeM);
plane.rotation.x = -0.5 * Math.PI;
scene.add(plane);

const material = new THREE.MeshPhongMaterial({ color: 0xff00ff });
const sphereG = new THREE.SphereGeometry(0.5);
const speed = new THREE.Mesh(sphereG, material);
speed.position.y = 0.5;
scene.add(speed);

const torusG = new THREE.TorusGeometry(0.3, 0.1, 10, 20);
const torus = new THREE.Mesh(torusG, material);
torus.position.set(-1, 0.8, 0);
scene.add(torus);

const cubeG = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const cube = new THREE.Mesh(cubeG, material);
cube.position.set(1, 0.8, 0);
scene.add(cube);

// 光线
// 环境光
const colors = {
  dLight: 0xffffff,
};
const light = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(light);

// DirectionalLight
const dLight = new THREE.DirectionalLight(0xffffff);
dLight.position.set(1, 1, 1);
scene.add(dLight);
const dFol = gui.addFolder("DirectionalLight");
dFol.addColor(colors, "dLight").onChange(() => {
  dLight.color.set(colors.dLight);
});
dFol.add(dLight, "intensity", 0, 1, 0.01);
dFol.add(dLight.position, "x", -5, 5);
dFol.add(dLight.position, "y", -5, 5);
dFol.add(dLight.position, "z", -5, 5);

// 查看光源
// const dLightHeplper = new THREE.DirectionalLightHelper(dLight);
// scene.add(dLightHeplper);


// SpotLight
const spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(1, 1, 1);
spotLight.angle = (60 / 180) * Math.PI;
scene.add(spotLight);

// 查看光源
const spotLightHeplper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHeplper);
// 相机
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.set(0, 2, 3);
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
  torus.rotation.y = time;
  torus.rotation.x = time;
  cube.rotation.y = time;
  cube.rotation.x = time;

  renderer.render(scene, camera);
  orbitControls.update();
  requestAnimationFrame(tick);
};
tick();
