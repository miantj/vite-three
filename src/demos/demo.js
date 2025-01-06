import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";

export default function init() {
  // 获取容器元素
  const container = document.querySelector('.demo-container');
  const w = container.clientWidth;
  const h = container.clientHeight;
  
  const stat = new Stats();
  stat.dom.style.position = 'absolute'; // 修改为绝对定位
  
  // 创建容器（场景）
  const scene = new THREE.Scene();
  
  const axes = new THREE.AxesHelper(2, 2, 2);
  scene.add(axes);
  
  let cubes = [];
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
  
  // 光线
  const light = new THREE.AmbientLight();
  scene.add(light);
  
  // 相机
  const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
  camera.position.set(0, 0, 5);
  camera.lookAt(0, 0, 0);
  
  // 渲染器
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(w, h);
  
  // 将渲染器的 canvas 添加到容器中
  container.appendChild(renderer.domElement);
  container.appendChild(stat.dom);
  
  const clock = new THREE.Clock();
  
  const tick = () => {
    const time = clock.getElapsedTime();
  
    cubes.forEach((cube, index) => {
      cube.rotation.x = time * 0.4 + index;
      cube.rotation.y = time * 0.4 + index;
    });
  
    requestAnimationFrame(tick);
    renderer.render(scene, camera);
    stat.update();
  };
  tick();

  // 添加窗口大小变化的监听
  window.addEventListener('resize', () => {
    const newWidth = container.clientWidth;
    const newHeight = container.clientHeight;
    
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize(newWidth, newHeight);
  });
}
