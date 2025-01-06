<template>
  <div ref="container" class="demo-container"></div>
</template>

<script setup>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { onMounted, onUnmounted, ref } from 'vue';

const container = ref(null);
let scene, camera, renderer, controls, group, clock, animationFrameId;

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
  
  // 添加坐标轴（注释掉）
  // const axes = new THREE.AxesHelper(2, 2, 2);
  // scene.add(axes);
  
  // 创建组合
  group = new THREE.Group();
  
  // 创建红色立方体
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const cube = new THREE.Mesh(geometry, material);
  group.add(cube);
  cube.position.y = 1.5;
  
  // 创建绿色立方体
  const geometry2 = new THREE.BoxGeometry(1, 1, 1);
  const material2 = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube2 = new THREE.Mesh(geometry2, material2);
  group.add(cube2);
  
  // 创建蓝色立方体
  const geometry3 = new THREE.BoxGeometry(1, 1, 1);
  const material3 = new THREE.MeshBasicMaterial({ color: 0x0000ff });
  const cube3 = new THREE.Mesh(geometry3, material3);
  group.add(cube3);
  cube3.position.y = -1.5;
  
  scene.add(group);
  
  // 添加环境光
  const light = new THREE.AmbientLight();
  scene.add(light);
  
  // 相机
  camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
  camera.position.set(0, 0, 5);
  camera.lookAt(0, 0, 0);
  
  // 渲染器
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(w, h);
  
  // 轨道控制器
  controls = new OrbitControls(camera, renderer.domElement);
  
  // 添加到容器
  container.value.appendChild(renderer.domElement);
  
  // 初始化时钟
  clock = new THREE.Clock();
  
  // 动画
  function tick() {
    const time = clock.getElapsedTime();
    group.rotation.z = time;
    
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
  
  // 清理组内所有物体的几何体和材质
  if (group) {
    group.traverse((object) => {
      if (object.geometry) {
        object.geometry.dispose();
      }
      if (object.material) {
        object.material.dispose();
      }
    });
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