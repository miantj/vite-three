<template>
  <div ref="container" class="demo-container"></div>
</template>

<script setup>
import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";
import { onMounted, onUnmounted, ref } from 'vue';

const container = ref(null);
let scene, camera, renderer, stat, cubes = [], animationFrameId, clock;

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
  
  // 性能监控
  stat = new Stats();
  stat.dom.style.position = 'absolute';
  
  // 添加坐标轴
  const axes = new THREE.AxesHelper(2, 2, 2);
  scene.add(axes);
  
  // 创建立方体
  const createCube = () => {
    let d = Math.random();
    const geometry = new THREE.BoxGeometry(d, d, d);
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff * d,
    });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.x = (Math.random() - 0.5) * 4;
    cube.position.y = (Math.random() - 0.5) * 4;
    cube.position.z = (Math.random() - 0.5) * 4;
    cubes.push(cube);
  };
  
  for (let i = 1; i <= 20; i++) {
    createCube();
  }
  
  cubes.forEach((cube) => {
    scene.add(cube);
  });
  
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
  
  // 添加到容器
  container.value.appendChild(renderer.domElement);
  container.value.appendChild(stat.dom);
  
  // 初始化时钟
  clock = new THREE.Clock();
  
  // 动画
  function tick() {
    const time = clock.getElapsedTime();
    
    cubes.forEach((cube, index) => {
      cube.rotation.x = time * 0.4 + index;
      cube.rotation.y = time * 0.4 + index;
    });
    
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
  
  // 清理所有立方体的几何体和材质
  cubes.forEach(cube => {
    cube.geometry.dispose();
    cube.material.dispose();
  });
  cubes = [];
  
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