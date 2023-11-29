import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

// 0. 로더
const fontLoader = new FontLoader();

// 1. 씬
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff); // 흰색 배경 설정

// 2. 카메라
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set( 0, 10, 30 );
camera.position.z = 5;

// 3. 렌더러
const renderer = new THREE.WebGLRenderer({
  antialias: true, // 안티앨리어싱 활성화
  alpha: false, // 투명도
  precision: "highp", // 높은 정밀도 셰이더
  powerPreference: "high-performance", // 고성능 GPU 사용 선호
  depth: true, // 깊이 버퍼 사용
  stencil: false, // 스텐실 버퍼 미사용
  premultipliedAlpha: true, // 사전에 알파값이 곱해진 경우
  preserveDrawingBuffer: true // 드로잉 버퍼 보존
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 4. 기하학 형태
const geometry = new THREE.BoxGeometry(1, 1, 1);
geometry.translate(0, 0.5, 0);

// 4-1. 텍스쳐
const textureLoader = new THREE.TextureLoader();

// 텍스쳐 및 물질
const textTexture1 = textureLoader.load("1.png");
const material1 = new THREE.MeshBasicMaterial({
  map: textTexture1,
  transparent: true,
});

const textTexture2 = textureLoader.load("2.png");
const material2 = new THREE.MeshBasicMaterial({
  map: textTexture2,
  transparent: true,
});

const textTexture3 = textureLoader.load("3.png");
const material3 = new THREE.MeshBasicMaterial({
  map: textTexture3,
  transparent: true,
});

// 6-1. 큐브 1
const cube1 = new THREE.Mesh(geometry, material1);
cube1.rotation.x = 0.00;
cube1.rotation.y = 0.00;
cube1.scale.x = 2;
cube1.scale.y = 3;
cube1.scale.z = 2;
cube1.position.x = -2.4;
scene.add(cube1);

// 6-2. 큐브 2
const cube2 = new THREE.Mesh(geometry, material2);
cube2.rotation.x = 0.00;
cube2.rotation.y = 0.00;
cube2.scale.x = 2;
cube2.scale.y = 3;
cube2.scale.z = 2;
cube2.position.x = 2.4;
scene.add(cube2);

// 6-3. 큐브 3
const cube3 = new THREE.Mesh(geometry, material3);
cube3.rotation.x = 0.00;
cube3.rotation.y = 0.00;
cube3.scale.x = 2;
cube3.scale.y = 3;
cube3.scale.z = 2;
cube3.position.x = 0;
scene.add(cube3);

// 7. 이동 컨트롤
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.update();

// 9. 렌더링
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

// 텍스트 로딩 및 추가
fontLoader.load('https://threejsfundamentals.org/threejs/resources/threejs/fonts/helvetiker_regular.typeface.json', function (font) {
  const textGeometry = new TextGeometry("WMS", {
    font: font,
    size: 0.8,
    height: 0.2,
    curveSegments: 1,
    bevelEnabled: false,
  });

  const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const textMesh = new THREE.Mesh(textGeometry, textMaterial);

  // 텍스트는 카메라 방향 상관없이 고정 (정면에 보이도록)
  textMesh.quaternion.copy(camera.quaternion);

  // 텍스트 메시의 위치 조정
  textMesh.position.set(-1.0, 3.5, 0);

  scene.add(textMesh);
});

animate();
