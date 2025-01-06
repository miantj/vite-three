import * as THREE from "three";
import Stat from "three/examples/jsm/libs/stats.module";
// 轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";


const w = window.innerWidth;
const h = window.innerHeight;
const stat = new Stat();

// 创建容器（场景）
const scene = new THREE.Scene();

const axes = new THREE.AxesHelper(5, 5, 5);
scene.add(axes);

// 创建三个球

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshBasicMaterial({
    color: 0xff0000,
  })
);
sphere.position.x = 4;
const sphere2 = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshBasicMaterial({
    color: 0x00ff00,
  })
);
const sphere3 = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshBasicMaterial({
    color: 0x0000ff,
  })
);
sphere3.position.x = -4;

scene.add(sphere, sphere2, sphere3);

// 光线
const light = new THREE.Raycaster();
scene.add(light);

// 创建鼠标向量
const mouse = new THREE.Vector2();
window.addEventListener("click", (event) => {
  console.log(event.clientX, event.clientY);

  // 设置鼠标向量x，y值
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  console.log(mouse.x, mouse.y);

  // 通过摄像机和鼠标的位置更新射线
  light.setFromCamera(mouse, camera);
  // 计算物体和射线的焦点
  const intersects = light.intersectObjects([sphere, sphere2, sphere3]);
  console.warn(intersects);
  if (intersects.length > 0) {
    if (intersects[0].object._isSelect) {
      intersects[0].object._isSelect = false;
      intersects[0].object.material.color.set(intersects[0].object._isColor);
      return;
    }
    intersects[0].object._isSelect = true;
    intersects[0].object._isColor =
      intersects[0].object.material.color.getHex();
    intersects[0].object.material.color.set(0xffff00);
  }
});

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
  requestAnimationFrame(tick);
};
tick();
