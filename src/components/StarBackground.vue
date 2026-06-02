<template>
  <div class="stars-container">
    <canvas ref="canvasRef" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const canvasRef = ref(null)
let scene, camera, renderer, particles, animId

function init() {
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.z = 25

  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    alpha: true,
    antialias: true
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  // 粒子
  const geo = new THREE.BufferGeometry()
  const count = 1500
  const pos = new Float32Array(count * 3)
  for (let i = 0; i < count * 3; i++) {
    pos[i] = (Math.random() - 0.5) * 100
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))

  const mat = new THREE.PointsMaterial({
    color: 0x409eff,
    size: 0.4
  })

  particles = new THREE.Points(geo, mat)
  scene.add(particles)
}

function animate() {
  animId = requestAnimationFrame(animate)
  if (particles) particles.rotation.y += 0.001
  renderer.render(scene, camera)
}

function resize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

onMounted(() => {
  init()
  animate()
  window.addEventListener('resize', resize)
})

onUnmounted(() => {
  cancelAnimationFrame(animId)
  window.removeEventListener('resize', resize)
})
</script>

<style>
/* 去掉 scoped！强制全局生效！ */
.stars-container {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  background: #0a1023 !important;
  z-index: -99999 !important;
  pointer-events: none !important;
  margin: 0 !important;
  padding: 0 !important;
  overflow: hidden !important;
}
.stars-container canvas {
  display: block !important;
  width: 100% !important;
  height: 100% !important;
}
</style>