import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

// 0. 로더
const loader = new FontLoader();

// 1. 씬
const scene = new THREE.Scene();

// 2. 카메라
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set( 0, 10, 30 );
camera.position.z = 5;

// 3. 렌더러
const renderer = new THREE.WebGLRenderer({ antialias: true });
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

// 6-1. 큐브 1
const cube1 = new THREE.Mesh(geometry, material1);
cube1.rotation.x = 0.00;
cube1.rotation.y = 0.00;
cube1.scale.x = 2;
cube1.scale.y = 3;
cube1.scale.z = 2;
cube1.position.x = -1.2;
scene.add(cube1);

// 6-2. 큐브 2
const cube2 = new THREE.Mesh(geometry, material2);
cube2.rotation.x = 0.00;
cube2.rotation.y = 0.00;
cube2.scale.x = 2;
cube2.scale.y = 3;
cube2.scale.z = 2;
cube2.position.x = 1.2;
scene.add(cube2);

// 7. 이동 컨트롤
const controls = new OrbitControls( camera, renderer.domElement );
controls.target.set( 0, 0, 0 );
controls.update();

// 9. 렌더링
function animate() {
  requestAnimationFrame( animate );
  renderer.render(scene, camera);
}

// 텍스트 로딩 및 추가
loader.load('https://threejsfundamentals.org/threejs/resources/threejs/fonts/helvetiker_regular.typeface.json', function (font) {
  const textGeometry = new TextGeometry("WMS", {
    font: font,
    size: 0.5,
    height: 0.2,
    curveSegments: 1,
    bevelEnabled: false,
  });

  const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const textMesh = new THREE.Mesh(textGeometry, textMaterial);

  // 텍스트 메시의 위치 조정
  textMesh.position.set(-1.0, 3.5, 0);

  scene.add(textMesh);
});

animate();
