<template>
  <div ref="container" class="demo-container"></div>
</template>

<script setup>
import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { onMounted, onUnmounted, ref } from 'vue';

const container = ref(null);
let scene, camera, renderer, controls, stat, car;
let wheelGroup1, wheelGroup2, wheelGroup3, wheelGroup4;
let clock, animationFrameId;

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
  
  // 创建汽车组
  car = new THREE.Group();
  
  // 创建车身
  const body = new THREE.Group();
  const material = new THREE.MeshNormalMaterial();
  
  const bodyCube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 2, 0.5),
    material
  );
  
  const bodyCube2 = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.5, 0.5),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
  );
  
  bodyCube2.position.z = 0.5;
  body.add(bodyCube1, bodyCube2);
  car.add(body);
  
  // 创建轮子组1
  wheelGroup1 = new THREE.Group();
  const wheel1 = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.6, 0.6),
    material
  );
  wheelGroup1.position.set(-0.6, 0.6, 0);
  wheelGroup1.add(wheel1);
  car.add(wheelGroup1);
  
  // 创建轮子组2
  wheelGroup2 = new THREE.Group();
  const wheel2 = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.6, 0.6),
    material
  );
  wheelGroup2.position.set(0.6, 0.6, 0);
  wheelGroup2.add(wheel2);
  car.add(wheelGroup2);
  
  // 克隆轮子组3和4
  wheelGroup3 = wheelGroup1.clone();
  wheelGroup3.position.y = -0.6;
  car.add(wheelGroup3);
  
  wheelGroup4 = wheelGroup2.clone();
  wheelGroup4.position.y = -0.6;
  car.add(wheelGroup4);
  
  // 创建轮胎
  const circle = new THREE.Group();
  const n = 30;
  for (let i = 0; i < n; i++) {
    const r = 0.5;
    const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.2);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = r * Math.cos((Math.PI * 2 / n) * i);
    mesh.position.y = r * Math.sin((Math.PI * 2 / n) * i);
    circle.add(mesh);
  }
  circle.rotation.y = -0.5 * Math.PI;
  
  // 添加轮胎到每个轮子组
  wheelGroup1.add(circle.clone());
  wheelGroup2.add(circle.clone());
  wheelGroup3.add(circle.clone());
  wheelGroup4.add(circle.clone());
  
  scene.add(car);
  
  // 添加环境光
  const light = new THREE.AmbientLight();
  scene.add(light);
  
  // 相机设置
  camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
  camera.position.set(0, 0, 5);
  camera.lookAt(0, 0, 0);
  
  // 渲染器设置
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(w, h);
  
  // 控制器设置
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
    
    // 汽车上下移动
    car.position.y = (time % 4) - 2;
    
    // 轮子旋转
    const wheelRotation = -time * 3;
    wheelGroup1.rotation.x = wheelRotation;
    wheelGroup2.rotation.x = wheelRotation;
    wheelGroup3.rotation.x = wheelRotation;
    wheelGroup4.rotation.x = wheelRotation;
    
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
  
  // 清理所有网格的几何体和材质
  if (car) {
    car.traverse((object) => {
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