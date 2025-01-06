<template>
  <div ref="container" class="demo-container"></div>
</template>

<script setup>
import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { onMounted, onUnmounted, ref } from 'vue';

const container = ref(null);
let scene, camera, renderer, controls, stat, raycaster, mouse, animationFrameId;
let sphere, sphere2, sphere3;

onMounted(() => {
  init();
});

onUnmounted(() => {
  cleanup();
});

function onClick(event) {
  // 获取容器边界
  const bounds = container.value.getBoundingClientRect();
  
  // 计算鼠标在容器内的相对位置
  mouse.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
  mouse.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
  
  // 通过摄像机和鼠标的位置更新射线
  raycaster.setFromCamera(mouse, camera);
  
  // 计算物体和射线的焦点
  const intersects = raycaster.intersectObjects([sphere, sphere2, sphere3]);
  
  if (intersects.length > 0) {
    const selectedObject = intersects[0].object;
    if (selectedObject._isSelect) {
      selectedObject._isSelect = false;
      selectedObject.material.color.set(selectedObject._isColor);
    } else {
      selectedObject._isSelect = true;
      selectedObject._isColor = selectedObject.material.color.getHex();
      selectedObject.material.color.set(0xffff00);
    }
  }
}

function init() {
  scene = new THREE.Scene();
  
  const w = container.value.clientWidth;
  const h = container.value.clientHeight;
  
  // 添加坐标轴
  const axes = new THREE.AxesHelper(5, 5, 5);
  scene.add(axes);
  
  // 创建三个球
  sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshBasicMaterial({
      color: 0xff0000,
    })
  );
  sphere.position.x = 4;
  
  sphere2 = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshBasicMaterial({
      color: 0x00ff00,
    })
  );
  
  sphere3 = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshBasicMaterial({
      color: 0x0000ff,
    })
  );
  sphere3.position.x = -4;
  
  scene.add(sphere, sphere2, sphere3);
  
  // 创建射线和鼠标向量
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
  
  // 添加点击事件监听
  container.value.addEventListener('click', onClick);
  
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
  
  // 清理所有球体的几何体和材质
  [sphere, sphere2, sphere3].forEach(sphere => {
    if (sphere) {
      sphere.geometry.dispose();
      sphere.material.dispose();
    }
  });
  
  // 移除事件监听
  if (container.value) {
    container.value.removeEventListener('click', onClick);
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