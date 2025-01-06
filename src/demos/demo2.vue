<template>
  <div ref="container" class="demo-container"></div>
</template>

<script setup>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { onMounted, onUnmounted, ref } from 'vue';

const container = ref(null);
let scene, camera, renderer, controls, animationFrameId;

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
  
  // 添加坐标轴
  const axes = new THREE.AxesHelper(2, 2, 2);
  scene.add(axes);
  
  // 创建立方体
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial();
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  
  // 添加环境光
  const light = new THREE.AmbientLight();
  scene.add(light);
  
  // 相机
  camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
  camera.position.set(5, 5, 5);
  camera.lookAt(0, 0, 0);
  
  // 渲染器
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(w, h);
  
  // 轨道控制器
  controls = new OrbitControls(camera, renderer.domElement);
  
  // 添加到容器
  container.value.appendChild(renderer.domElement);
  
  // 动画
  function tick() {
    controls.update();
    renderer.render(scene, camera);
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