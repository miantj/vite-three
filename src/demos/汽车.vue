<template>
  <div ref="container" class="demo-container"></div>
</template>

<script setup>
import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { onMounted, onUnmounted, ref } from 'vue';

const container = ref(null);
let scene, camera, renderer, stat, controls, car, frontWheels, backWheels, animationFrameId, clock;

onMounted(() => {
  init();
});

onUnmounted(() => {
  cleanup();
});

function init() {
  scene = new THREE.Scene();
  
  const w = container.value.clientWidth;
  const h = container.value.clientHeight;
  
  // 公共材质
  const m = new THREE.MeshNormalMaterial();
  
  // 汽车
  car = new THREE.Group();
  
  // 前面两个轮子
  frontWheels = new THREE.Group();
  
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
  backWheels = frontWheels.clone();
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
  camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
  camera.position.set(2, 5, 5);
  camera.lookAt(0, 0, 0);
  
  // 渲染器
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(w, h);
  
  // 控制器
  controls = new OrbitControls(camera, renderer.domElement);
  
  // 性能监控
  stat = new Stats();
  stat.dom.style.position = 'absolute';
  
  // 添加到容器
  container.value.appendChild(renderer.domElement);
  container.value.appendChild(stat.dom);
  
  // 初始化时钟
  clock = new THREE.Clock();
  
  // 动画
  function tick() {
    const time = clock.getElapsedTime();
    frontWheels.rotation.x = -time * 2;
    backWheels.rotation.x = -time * 2;
    car.position.z = (time % 4) - 2;
    
    renderer.render(scene, camera);
    controls.update();
    stat.update();
    animationFrameId = requestAnimationFrame(tick);
  }
  tick();

  // 窗口大小变化处理
  window.addEventListener('resize', handleResize);
}

function handleResize() {
  if (!container.value || !camera || !renderer) return;
  
  const width = container.value.clientWidth;
  const height = container.value.clientHeight;
  
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  
  renderer.setSize(width, height);
}

function cleanup() {
  if (renderer) {
    renderer.dispose();
    renderer.forceContextLoss();
  }
  
  if (controls) {
    controls.dispose();
  }
  
  window.removeEventListener('resize', handleResize);
  
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  
  if (container.value) {
    container.value.innerHTML = '';
  }
}
</script>

<style scoped>
.demo-container {
  width: 100%;
  height: 100%;
  position: relative;
}
</style> 