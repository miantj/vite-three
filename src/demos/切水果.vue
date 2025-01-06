<template>
  <div ref="container" class="demo-container">
    <div class="score">得分: {{ score }}</div>
  </div>
</template>

<script setup>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as CANNON from "cannon-es";
import { onMounted, onUnmounted, ref } from "vue";

const container = ref(null);
const score = ref(0);

let scene, camera, renderer, controls;
let world,
  timeStep = 1 / 60;
let fruits = [];
let lastMousePosition = new THREE.Vector2();
let sliceLine;
let animationFrameId;

onMounted(() => {
  init();
  animate();
});

onUnmounted(() => {
  cleanup();
});

function init() {
  // 初始化场景
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb); // 天蓝色背景

  const w = container.value.clientWidth;
  const h = container.value.clientHeight;

  // 相机设置
  camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
  camera.position.set(0, 5, 10);
  camera.lookAt(0, 0, 0);

  // 渲染器设置
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(w, h);
  renderer.shadowMap.enabled = true;

  // 添加光源
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(10, 10, 10);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // 初始化物理世界（减小重力）
  world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.82, 0),
  });

  // 切割线
  const lineGeometry = new THREE.BufferGeometry();
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
  sliceLine = new THREE.Line(lineGeometry, lineMaterial);
  scene.add(sliceLine);

  // 事件监听
  container.value.addEventListener("mousedown", onMouseDown);
  container.value.addEventListener("mousemove", onMouseMove);
  container.value.addEventListener("mouseup", onMouseUp);

  // 添加到容器
  container.value.appendChild(renderer.domElement);

  // 定时生成水果
  setInterval(createFruit, 2000);
}

function createFruit() {
  const radius = 1;
  const fruitGeometry = new THREE.SphereGeometry(radius);
  const fruitMaterial = new THREE.MeshStandardMaterial({
    color: Math.random() * 0xffffff,
  });

  const fruit = new THREE.Mesh(fruitGeometry, fruitMaterial);
  fruit.castShadow = true;
  scene.add(fruit);

  const shape = new CANNON.Sphere(radius);
  
  // 检查点1：角度和速度设置是否合适
  const angle = (Math.random() * 60 + 60) * (Math.PI / 120); // 60-120度
  const speed = 12 + Math.random() * 3; // 基础速度可能还是有点快
  
  const vx = speed * Math.cos(angle);
  const vy = speed * Math.sin(angle);
  
  // 检查点2：初始位置范围
  const xPos = (Math.random() - 0.5) * 3; // ±3 可能更合适
  
  const body = new CANNON.Body({
    mass: 1,
    shape: shape,
    position: new CANNON.Vec3(
      xPos,
      -5,
      (Math.random() - 0.5) * 4
    ),
    velocity: new CANNON.Vec3(
      vx * (xPos > 0 ? -0.7 : 0.7),
      vy,
      (Math.random() - 0.5) * 2
    ),
  });

  world.addBody(body);
  fruits.push({ mesh: fruit, body: body, isCut: false });
}

let isSlicing = false;
let slicePoints = [];

function onMouseDown(event) {
  isSlicing = true;
  slicePoints = [];
  updateMousePosition(event);
  slicePoints.push(lastMousePosition.clone());
}

function onMouseMove(event) {
  if (!isSlicing) return;

  updateMousePosition(event);
  slicePoints.push(new THREE.Vector2(lastMousePosition.x, lastMousePosition.y));

  // 限制切割线的点数量，保持性能
  if (slicePoints.length > 50) {
    slicePoints.shift();
  }

  // 更新切割线
  const positions = new Float32Array(slicePoints.length * 3);
  slicePoints.forEach((point, i) => {
    positions[i * 3] = point.x;
    positions[i * 3 + 1] = point.y;
    positions[i * 3 + 2] = 0;
  });

  sliceLine.geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );

  // 实时检查切割
  checkSlice();
}

function onMouseUp() {
  isSlicing = false;
  sliceLine.geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(0), 3)
  );
}

function updateMousePosition(event) {
  const rect = container.value.getBoundingClientRect();
  // 计算鼠标在画布中的实际位置
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  
  // 转换为标准化设备坐标（NDC）
  lastMousePosition.x = (x / rect.width) * 2 - 1;
  lastMousePosition.y = -(y / rect.height) * 2 + 1;
  
  // 创建射线
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(lastMousePosition, camera);
  
  // 计算射线与平面的交点
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const intersectPoint = new THREE.Vector3();
  raycaster.ray.intersectPlane(plane, intersectPoint);
  
  // 更新最后的鼠标位置为3D空间中的点
  lastMousePosition.x = intersectPoint.x;
  lastMousePosition.y = intersectPoint.y;
}

function checkSlice() {
  if (slicePoints.length < 2) return;

  fruits.forEach((fruit) => {
    if (fruit.isCut) return;

    // 获取水果的世界坐标
    const fruitWorldPos = fruit.mesh.position;
    
    // 简单的距离检查
    for (let i = 1; i < slicePoints.length; i++) {
      const start = slicePoints[i - 1];
      const end = slicePoints[i];

      const distance = distanceToLine(
        fruitWorldPos.x,
        fruitWorldPos.y,
        start.x,
        start.y,
        end.x,
        end.y
      );

      // 增大检测距离阈值
      if (distance < 0.5) {  // 将阈值从0.1改为0.5
        cutFruit(fruit);
        break;
      }
    }
  });
}

function cutFruit(fruit) {
  if (fruit.isCut) return;

  fruit.isCut = true;
  score.value += 10;

  // 切成两半
  const halfGeometry = new THREE.SphereGeometry(
    0.5,
    32,
    16,
    0,
    Math.PI * 2,
    0,
    Math.PI / 2
  );

  const halfMaterial = fruit.mesh.material.clone();

  const top = new THREE.Mesh(halfGeometry, halfMaterial);
  const bottom = new THREE.Mesh(halfGeometry, halfMaterial);

  top.position.copy(fruit.mesh.position);
  bottom.position.copy(fruit.mesh.position);
  bottom.rotation.x = Math.PI;

  scene.add(top);
  scene.add(bottom);

  // 移除原始水果
  scene.remove(fruit.mesh);
  world.removeBody(fruit.body);

  // 添加物理效果
  const halfShape = new CANNON.Sphere(0.25);

  const topBody = new CANNON.Body({
    mass: 1,
    shape: halfShape,
    position: fruit.body.position.clone(),
    velocity: new CANNON.Vec3(
      (Math.random() - 0.5) * 5,
      5,
      (Math.random() - 0.5) * 5
    ),
  });

  const bottomBody = new CANNON.Body({
    mass: 1,
    shape: halfShape,
    position: fruit.body.position.clone(),
    velocity: new CANNON.Vec3(
      (Math.random() - 0.5) * 5,
      5,
      (Math.random() - 0.5) * 5
    ),
  });

  world.addBody(topBody);
  world.addBody(bottomBody);

  fruits.push(
    { mesh: top, body: topBody, isCut: true },
    { mesh: bottom, body: bottomBody, isCut: true }
  );
}

function distanceToLine(x, y, x1, y1, x2, y2) {
  const A = x - x1;
  const B = y - y1;
  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  let param = -1;

  if (lenSq !== 0) {
    param = dot / lenSq;
  }

  let xx, yy;

  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  const dx = x - xx;
  const dy = y - yy;

  return Math.sqrt(dx * dx + dy * dy);
}

function animate() {
  world.step(timeStep);

  // 修改水果的清除条件
  fruits = fruits.filter((fruit) => {
    // 当水果落到更低的位置或超出上方时移除
    if (fruit.mesh.position.y < -15 || fruit.mesh.position.y > 15) {
      scene.remove(fruit.mesh);
      world.removeBody(fruit.body);
      return false;
    }

    fruit.mesh.position.copy(fruit.body.position);
    fruit.mesh.quaternion.copy(fruit.body.quaternion);
    return true;
  });

  renderer.render(scene, camera);
  animationFrameId = requestAnimationFrame(animate);
}

function cleanup() {
  if (renderer) {
    renderer.dispose();
    renderer.forceContextLoss();
  }

  // 清理所有水果
  fruits.forEach((fruit) => {
    if (fruit.mesh.geometry) fruit.mesh.geometry.dispose();
    if (fruit.mesh.material) fruit.mesh.material.dispose();
  });

  // 移除事件监听
  container.value.removeEventListener("mousedown", onMouseDown);
  container.value.removeEventListener("mousemove", onMouseMove);
  container.value.removeEventListener("mouseup", onMouseUp);

  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }

  if (container.value) {
    container.value.innerHTML = "";
  }
}
</script>

<style scoped>
.demo-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.score {
  position: absolute;
  top: 20px;
  left: 20px;
  color: white;
  font-size: 24px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}
</style>
