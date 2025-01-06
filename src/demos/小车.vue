<template>
  <div ref="container" class="demo-container"></div>
</template>

<script setup>
import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { onMounted, onUnmounted, ref } from 'vue';

const container = ref(null);
let scene, camera, renderer, stat, controls, car, wheels = [], animationFrameId;

onMounted(() => {
  init();
  // 添加键盘事件监听
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  cleanup();
  window.removeEventListener('keydown', handleKeyDown);
});

function handleKeyDown(event) {
  const speed = 0.1;
  const rotationSpeed = 0.1;
  
  switch(event.key) {
    case 'ArrowUp':
      car.position.x += Math.sin(car.rotation.y) * speed;
      car.position.z += Math.cos(car.rotation.y) * speed;
      rotateWheels('forward');
      break;
    case 'ArrowDown':
      car.position.x -= Math.sin(car.rotation.y) * speed;
      car.position.z -= Math.cos(car.rotation.y) * speed;
      rotateWheels('backward');
      break;
    case 'ArrowLeft':
      car.rotation.y += rotationSpeed;
      break;
    case 'ArrowRight':
      car.rotation.y -= rotationSpeed;
      break;
  }
}

function rotateWheels(direction) {
  const rotationSpeed = direction === 'forward' ? -0.2 : 0.2;
  wheels.forEach(wheel => {
    wheel.rotation.x += rotationSpeed;
  });
}

function init() {
  scene = new THREE.Scene();
  
  const w = container.value.clientWidth;
  const h = container.value.clientHeight;
  
  // 创建地面
  const groundGeometry = new THREE.PlaneGeometry(20, 20);
  const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x808080,
    side: THREE.DoubleSide
  });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);
  
  // 创建小车
  car = new THREE.Group();
  
  // 车身
  const bodyGeometry = new THREE.BoxGeometry(2, 1, 1);
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.position.y = 0.5;
  body.castShadow = true;
  car.add(body);
  
  // 车轮
  const wheelGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2);
  const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
  
  // 前轮
  const frontLeftWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
  frontLeftWheel.position.set(-0.8, 0.3, 0.6);
  frontLeftWheel.rotation.z = Math.PI / 2;
  car.add(frontLeftWheel);
  wheels.push(frontLeftWheel);
  
  const frontRightWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
  frontRightWheel.position.set(-0.8, 0.3, -0.6);
  frontRightWheel.rotation.z = Math.PI / 2;
  car.add(frontRightWheel);
  wheels.push(frontRightWheel);
  
  // 后轮
  const backLeftWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
  backLeftWheel.position.set(0.8, 0.3, 0.6);
  backLeftWheel.rotation.z = Math.PI / 2;
  car.add(backLeftWheel);
  wheels.push(backLeftWheel);
  
  const backRightWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
  backRightWheel.position.set(0.8, 0.3, -0.6);
  backRightWheel.rotation.z = Math.PI / 2;
  car.add(backRightWheel);
  wheels.push(backRightWheel);
  
  scene.add(car);
  
  // 添加灯光
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(5, 5, 5);
  directionalLight.castShadow = true;
  scene.add(directionalLight);
  
  // 相机
  camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
  camera.position.set(5, 5, 5);
  camera.lookAt(0, 0, 0);
  
  // 渲染器
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(w, h);
  renderer.shadowMap.enabled = true;
  
  // 控制器
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  
  // 性能监控
  stat = new Stats();
  stat.dom.style.position = 'absolute';
  
  // 添加到容器
  container.value.appendChild(renderer.domElement);
  container.value.appendChild(stat.dom);
  
  // 动画
  function tick() {
    controls.update();
    renderer.render(scene, camera);
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
  window.removeEventListener('keydown', handleKeyDown);
  
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