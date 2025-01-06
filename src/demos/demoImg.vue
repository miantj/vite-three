<template>
  <div ref="container" class="demo-container"></div>
</template>

<script setup>
import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { onMounted, onUnmounted, ref } from 'vue';

const container = ref(null);
let scene, camera, renderer, stat, controls, animationFrameId;

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
  
  // 贴图加载器
  const loader = new THREE.TextureLoader();
  const texture = loader.load(
    "https://images.squarespace-cdn.com/content/v1/5be5c337a9e02874136908f2/1580809645632-FJ0TMYHIB9Z9LPLCKRGC/Maple.jpg?format=2500w"
  );
  const texture2 = loader.load(
    "https://p5.itc.cn/images01/20220323/7ba16d4343e8420ba0828b510fe9b1fc.jpeg"
  );
  
  // 创建平面
  const planeG = new THREE.PlaneGeometry(4, 4);
  const planeM = new THREE.MeshStandardMaterial({
    map: texture,
    side: THREE.DoubleSide,
  });
  const plane = new THREE.Mesh(planeG, planeM);
  plane.rotation.x = -1.5;
  plane.receiveShadow = true;
  scene.add(plane);
  
  // 创建立方体
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const m1 = new THREE.MeshStandardMaterial({
    map: texture,
  });
  const m2 = new THREE.MeshStandardMaterial({
    map: texture2,
  });
  const cube = new THREE.Mesh(geometry, [m1, m2, m1, m2, m1, m2]);
  cube.position.y = 0.51;
  cube.rotation.x = -1.5;
  cube.castShadow = true;
  scene.add(cube);
  
  // 添加光源
  const light = new THREE.AmbientLight(0xffffff, 0.2);
  
  const light2 = new THREE.DirectionalLight(0xffffff);
  light2.position.set(1, 1, 1);
  light2.castShadow = true;
  // 设置阴影的相关参数
  light2.shadow.mapSize.width = 2048;
  light2.shadow.mapSize.height = 2048;
  // 调整阴影的范围
  light2.shadow.camera.near = 0.5;
  light2.shadow.camera.far = 500;
  
  scene.add(light, light2);
  
  // 相机
  camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
  camera.position.set(0, 1, 3);
  camera.lookAt(0, 0, 0);
  
  // 渲染器
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(w, h);
  renderer.shadowMap.enabled = true;
  
  // 控制器
  controls = new OrbitControls(camera, renderer.domElement);
  
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