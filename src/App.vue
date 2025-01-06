<script setup>
import { ref } from "vue";
import 汽车Demo from "./demos/汽车.vue";
import 切水果Demo from "./demos/切水果.vue";
import 基础示例Demo from "./demos/demo.vue";
import 控制器示例Demo from "./demos/demo2.vue";
import 组合示例Demo from "./demos/demo3.vue";
import 光源示例Demo from "./demos/demo4.vue";
import 交互控制Demo from "./demos/demoChange.vue";
import 材质贴图Demo from "./demos/demoImg.vue";
import 点击交互Demo from "./demos/demo点击交互换颜色.vue";
import 补间动画Demo from "./demos/demo补间动画.vue";
import 太阳系Demo from "./demos/太阳系.vue";
import 小车Demo from "./demos/小车.vue";

const demoList = [
  { name: "汽车", component: 汽车Demo },
  { name: "切水果", component: 切水果Demo },
  { name: "基础示例", component: 基础示例Demo },
  { name: "控制器示例", component: 控制器示例Demo },
  { name: "组合示例", component: 组合示例Demo },
  { name: "光源示例", component: 光源示例Demo },
  { name: "交互控制", component: 交互控制Demo },
  { name: "材质贴图", component: 材质贴图Demo },
  { name: "点击交互", component: 点击交互Demo },
  { name: "补间动画", component: 补间动画Demo },
  { name: "太阳系", component: 太阳系Demo },
  { name: "小车", component: 小车Demo },
];

const currentDemo = ref(demoList[0]);
</script>

<template>
  <div class="container">
    <div class="demo-buttons">
      <button
        v-for="demo in demoList"
        :key="demo.name"
        :class="{ active: currentDemo.name === demo.name }"
        @click="currentDemo = demo"
      >
        {{ demo.name }}
      </button>
    </div>
    <component :is="currentDemo.component" />
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #1a1a1a;
}

.demo-buttons {
  padding: 1rem;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  background-color: #2a2a2a;
  border-bottom: 1px solid #3a3a3a;
}

button {
  padding: 0.6rem 1.2rem;
  border: 1px solid #4a4a4a;
  border-radius: 6px;
  background-color: transparent;
  color: #ffffff;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

button:hover {
  background-color: #3a3a3a;
  border-color: #5a5a5a;
  transform: translateY(-1px);
}

button.active {
  background: #42b883;
  color: white;
  border-color: #42b883;
  box-shadow: 0 2px 8px rgba(66, 184, 131, 0.3);
}

button.active:hover {
  background: #3aa876;
  border-color: #3aa876;
}
</style>
