<template>
  <div ref="container" class="demo-container"></div>
</template>

<script setup>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";
import { onMounted, onUnmounted, ref } from 'vue';

const container = ref(null);
let scene, camera, renderer, orbitControls, gui, torus, cube, spotLightHelper, animationFrameId, clock;

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
  
  // 创建 GUI
  gui = new dat.GUI({ autoPlace: false });
  gui.domElement.style.position = 'absolute';
  gui.domElement.style.top = '0';
  gui.domElement.style.right = '0';
  
  // 创建平面
  const planeG = new THREE.PlaneGeometry(4, 4);
  const planeM = new THREE.MeshPhongMaterial({ color: 0xcccccc });
  const plane = new THREE.Mesh(planeG, planeM);
  plane.rotation.x = -0.5 * Math.PI;
  scene.add(plane);
  
  // 创建球体
  const material = new THREE.MeshPhongMaterial({ color: 0xff00ff });
  const sphereG = new THREE.SphereGeometry(0.5);
  const sphere = new THREE.Mesh(sphereG, material);
  sphere.position.y = 0.5;
  scene.add(sphere);
  
  // 创建圆环
  const torusG = new THREE.TorusGeometry(0.3, 0.1, 10, 20);
  torus = new THREE.Mesh(torusG, material);
  torus.position.set(-1, 0.8, 0);
  scene.add(torus);
  
  // 创建立方体
  const cubeG = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  cube = new THREE.Mesh(cubeG, material);
  cube.position.set(1, 0.8, 0);
  scene.add(cube);
  
  // 添加光源
  const colors = {
    dLight: 0xffffff,
  };
  
  // 环境光
  const light = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(light);
  
  // 平行光
  const dLight = new THREE.DirectionalLight(0xffffff);
  dLight.position.set(1, 1, 1);
  scene.add(dLight);
  
  // 平行光GUI控制
  const dFol = gui.addFolder("DirectionalLight");
  dFol.addColor(colors, "dLight").onChange(() => {
    dLight.color.set(colors.dLight);
  });
  dFol.add(dLight, "intensity", 0, 1, 0.01);
  dFol.add(dLight.position, "x", -5, 5);
  dFol.add(dLight.position, "y", -5, 5);
  dFol.add(dLight.position, "z", -5, 5);
  
  // 聚光灯
  const spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(1, 1, 1);
  spotLight.angle = (60 / 180) * Math.PI;
  scene.add(spotLight);
  
  // 聚光灯辅助线
  spotLightHelper = new THREE.SpotLightHelper(spotLight);
  scene.add(spotLightHelper);
  
  // 相机
  camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
  camera.position.set(0, 2, 3);
  camera.lookAt(0, 0, 0);
  
  // 渲染器
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(w, h);
  
  // 轨道控制器
  orbitControls = new OrbitControls(camera, renderer.domElement);
  
  // 添加到容器
  container.value.appendChild(renderer.domElement);
  container.value.appendChild(gui.domElement);
  
  // 初始化时钟
  clock = new THREE.Clock();
  
  // 动画
  function tick() {
    const time = clock.getElapsedTime();
    
    torus.rotation.y = time;
    torus.rotation.x = time;
    cube.rotation.y = time;
    cube.rotation.x = time;
    
    orbitControls.update();
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
  
  if (orbitControls) {
    orbitControls.dispose();
  }
  
  if (gui) {
    gui.destroy();
  }
  
  if (spotLightHelper) {
    spotLightHelper.dispose();
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