import * as THREE from "three";
import Stat from "three/examples/jsm/libs/stats.module";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const w = window.innerWidth;
const h = window.innerHeight;
const stat = new Stat();

// 创建容器（场景）
const scene = new THREE.Scene();

const axes = new THREE.AxesHelper(2, 2, 2);
// scene.add(axes);
// 汽车
const car = new THREE.Group();
// 车身
const body = new THREE.Group();

const material = new THREE.MeshNormalMaterial();
const bodyCube1 = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 0.5), material);

const bodyCube2 = new THREE.Mesh(
  new THREE.BoxGeometry(0.5, 0.5, 0.5),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);

bodyCube2.position.z = 0.5;
body.add(bodyCube1);
body.add(bodyCube2);

car.add(body);

// 轮子1
const wheelGorup = new THREE.Group();
const wheel1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.6, 0.6), material);
wheelGorup.position.set(-0.6, 0.6, 0);
wheelGorup.add(wheel1);
car.add(wheelGorup);

// 轮子2
const wheelGorup2 = new THREE.Group();
const wheel2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.6, 0.6), material);
wheelGorup2.position.set(0.6, 0.6, 0);
wheelGorup2.add(wheel2);
car.add(wheelGorup2);

// 轮子3
const wheelGorup3 = wheelGorup.clone();
wheelGorup3.position.y = -0.6;
car.add(wheelGorup3);

// 轮子4
const wheelGorup4 = wheelGorup2.clone();
wheelGorup4.position.y = -0.6;
car.add(wheelGorup4);

// 轮胎
const circle = new THREE.Group();
let n = 30;
for (let i = 0; i < n; i++) {
  let r = 0.5;
  const goometry = new THREE.BoxGeometry(0.1, 0.1, 0.2);
  const mesh = new THREE.Mesh(goometry, material);
  mesh.position.x = r * Math.cos(((Math.PI * 2) / n) * i);
  mesh.position.y = r * Math.sin(((Math.PI * 2) / n) * i);
  circle.add(mesh);
}
circle.rotation.y = -0.5 * Math.PI;
wheelGorup.add(circle);
wheelGorup2.add(circle.clone());
wheelGorup3.add(circle.clone());
wheelGorup4.add(circle.clone());

scene.add(car);
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
document.body.append(stat.dom);

const orbitControls = new OrbitControls(camera, renderer.domElement);
renderer.render(scene, camera);

const colck = new THREE.Clock();

const tick = () => {
  const time = colck.getElapsedTime();

  car.position.y = (time % 4) - 2;

  wheelGorup.rotation.x = -time * 3;
  wheelGorup2.rotation.x = -time * 3;
  wheelGorup3.rotation.x = -time * 3;
  wheelGorup4.rotation.x = -time * 3;

  renderer.render(scene, camera);
  orbitControls.update();
  stat.update();
  requestAnimationFrame(tick);
};
tick();
