import * as THREE from "/node_modules/three/build/three.module.js";
import { EffectComposer } from "/node_modules/three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "/node_modules/three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "/node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js";

//global declaration
// let scene;
//  let camera;
// let renderer;
// //const fov = 60;
// //const aspect = window.innerWidth / window.innerHeight;
// //const near = 0.1;
// //const far = 1000;

const canvas = document.getElementsByTagName("canvas")[0];
// const canvas = document.getElementsByClassName(".webgl");
const scene = new THREE.Scene();

//camera
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.z = 10;
camera.position.x = 0;
// camera.position.x = 12;
// camera.position.y = -4;
scene.add(camera);

//default renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true, // kenar yumsaltma
});
renderer.autoClear = false;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
renderer.setClearColor(0x123423, 0.1);

//bloom renderer
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5,
  0.4,
  0.85
);
bloomPass.threshold = 0;
bloomPass.strength = 1; //intensity of glow
bloomPass.radius = 1;
const bloomComposer = new EffectComposer(renderer);
bloomComposer.setSize(window.innerWidth, window.innerHeight);
bloomComposer.renderToScreen = true;
bloomComposer.addPass(renderScene);
bloomComposer.addPass(bloomPass);

//sun
// const color = new THREE.Color("#FDB813");
const color = new THREE.Color("#Fff");
const geometry = new THREE.IcosahedronGeometry(1, 15);
const material = new THREE.MeshBasicMaterial({ color });
const sphere = new THREE.Mesh(geometry, material);
sphere.position.set(0, 2, 1);
sphere.layers.set(1);
scene.add(sphere);

// galaxy geometry
const starGeometry = new THREE.SphereGeometry(90, 64, 64);

// galaxy material
const starMaterial = new THREE.MeshBasicMaterial({
  map: THREE.ImageUtils.loadTexture("galaxy1.png"),
  // map: THREE.ImageUtils.loadTexture("texture/01-3.jpg"),

  side: THREE.BackSide,
  transparent: false,
});

// galaxy mesh
const starMesh = new THREE.Mesh(starGeometry, starMaterial);
starMesh.layers.set(1);
scene.add(starMesh);

//ambient light
const ambientlight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientlight);

//resize listner
window.addEventListener(
  "resize",
  () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix(); //globenin genisliyni auto etmek
    renderer.setSize(window.innerWidth, window.innerHeight);
    bloomComposer.setSize(window.innerWidth, window.innerHeight);
  },
  false
);

//animation loop
const animate = () => {
  requestAnimationFrame(animate);
  starMesh.rotation.y += 0.005;
  camera.layers.set(1);
  bloomComposer.render();
};

animate();
