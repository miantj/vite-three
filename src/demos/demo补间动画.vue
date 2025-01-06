<template>
  <div ref="container" class="demo-container"></div>
</template>

<script setup>
import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as TWEEN from "three/examples/jsm/libs/tween.module.js";
import { onMounted, onUnmounted, ref } from 'vue';

const container = ref(null);
let scene, camera, renderer, controls, stat, sphere, tween, animationFrameId;

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
  const axes = new THREE.AxesHelper(5, 5, 5);
  scene.add(axes);
  
  // 创建球体
  sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshBasicMaterial({
      color: 0xff0000,
    })
  );
  sphere.position.x = -4;
  scene.add(sphere);
  
  // 创建补间动画
  tween = new TWEEN.Tween(sphere.position);
  tween.to({ x: 4 }, 1000);
  
  // 添加事件监听
  tween.onStart(() => {
    console.log("开始");
  });
  tween.onUpdate(() => {
    console.log(sphere.position.x);
  });
  tween.onComplete(() => {
    console.log("结束");
  });
  tween.onStop(() => {
    console.log("停止");
  });
  
  // 设置运动函数
  tween.easing(TWEEN.Easing.Quadratic.InOut);
  
  // 可选设置：
  // 设置无限循环
  // tween.repeat(Infinity);
  // 设置循环往复
  // tween.yoyo(true);
  // 设置延迟
  // tween.delay(3000);
  
  // 启动补间动画
  tween.start();
  
  // 相机
  camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
  camera.position.set(0, 10, 9);
  camera.lookAt(0, 0, 0);
  
  // 渲染器
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(w, h);
  renderer.shadowMap.enabled = true;
  
  // 轨道控制器
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
    TWEEN.update();  // 更新补间动画
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
  
  // 清理球体的几何体和材质
  if (sphere) {
    sphere.geometry.dispose();
    sphere.material.dispose();
  }
  
  // 停止补间动画
  if (tween) {
    tween.stop();
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