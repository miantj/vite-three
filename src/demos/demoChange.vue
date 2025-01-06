<template>
  <div ref="container" class="demo-container"></div>
</template>

<script setup>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";
import { onMounted, onUnmounted, ref } from 'vue';

const container = ref(null);
let scene, camera, renderer, controls, orbitControls, gui, cube, sphere, animationFrameId, clock;

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
  
  // 添加坐标轴
  const axes = new THREE.AxesHelper(2, 2, 2);
  scene.add(axes);
  
  // 创建立方体
  const cubeControls = {
    color: 0xff0000,
  };
  
  const cubeG = new THREE.BoxGeometry(1, 1, 1);
  const cubeM = new THREE.MeshBasicMaterial({ color: cubeControls.color });
  cube = new THREE.Mesh(cubeG, cubeM);
  scene.add(cube);
  
  gui.addColor(cubeControls, "color").onChange(() => {
    cubeM.color.set(cubeControls.color);
  });
  
  // 创建球体
  const sphereG = new THREE.SphereGeometry(0.6);
  const sphereM = new THREE.MeshNormalMaterial();
  sphere = new THREE.Mesh(sphereG, sphereM);
  scene.add(sphere);
  
  gui.add(sphereM, "wireframe");
  
  // 控制方块位置
  const foldrel1 = gui.addFolder("方块位置");
  foldrel1.add(cube.position, "x", -3, 3, 0.01);
  foldrel1.add(cube.position, "y", -3, 3, 0.01);
  foldrel1.add(cube.position, "z", -3, 3, 0.01);
  
  // 添加环境光
  const light = new THREE.AmbientLight();
  scene.add(light);
  
  // 相机
  camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
  camera.position.set(5, 5, 5);
  camera.lookAt(0, 0, 0);
  
  // 控制相机位置
  const foldrel = gui.addFolder("相机位置");
  foldrel.add(camera.position, "x", -5, 5, 0.01).name("相机位置-x");
  foldrel.add(camera.position, "y", -5, 5, 0.01).name("相机位置-y");
  foldrel.add(camera.position, "z", -5, 5, 0.01).name("相机位置-z");
  
  // 运动控制
  controls = {
    r: 1.5,
    speed: "1",
    stop: () => {
      controls.speed = 0;
    },
  };
  
  gui.add(controls, "r", 0.3).name("运动半径");
  gui.add(controls, "speed", 0, 5).name("运动速度");
  gui.add(controls, "stop");
  
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
    
    sphere.position.x = Math.sin(time * controls.speed) * controls.r;
    sphere.position.z = Math.cos(time * controls.speed) * controls.r;
    
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