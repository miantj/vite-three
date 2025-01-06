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
  
  // 添加坐标轴
  const axes = new THREE.AxesHelper(2, 2, 2);
  scene.add(axes);
  
  // 创建纹理加载器
  const textureLoader = new THREE.TextureLoader();
  
  // 加载纹理
  const colorTexture = textureLoader.load('/textures/door/color.jpg');
  const alphaTexture = textureLoader.load('/textures/door/alpha.jpg');
  const heightTexture = textureLoader.load('/textures/door/height.jpg');
  const normalTexture = textureLoader.load('/textures/door/normal.jpg');
  const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
  const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
  const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg');
  
  // 创建平面
  const geometry = new THREE.PlaneGeometry(1.5, 2);
  const material = new THREE.MeshStandardMaterial({
    map: colorTexture,
    transparent: true,
    alphaMap: alphaTexture,
    aoMap: ambientOcclusionTexture,
    displacementMap: heightTexture,
    displacementScale: 0.1,
    normalMap: normalTexture,
    metalnessMap: metalnessTexture,
    roughnessMap: roughnessTexture
  });
  
  const plane = new THREE.Mesh(geometry, material);
  scene.add(plane);
  
  // 添加灯光
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  
  const pointLight = new THREE.PointLight(0xffffff, 0.5);
  pointLight.position.set(2, 3, 4);
  scene.add(pointLight);
  
  // 相机
  camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
  camera.position.set(0, 0, 2);
  camera.lookAt(0, 0, 0);
  
  // 渲染器
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(w, h);
  
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