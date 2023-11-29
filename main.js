import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";

// 1. 씬
const scene = new THREE.Scene();

// 2. 카메라
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set( 0, 10, 30 );
camera.position.z = 5;

// 3. 렌더러
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 4. 기하학 형태
const geometry = new THREE.BoxGeometry(1, 1, 1);
geometry.translate(0, 0.5, 0);

// 5. 물체
const materialOne = new THREE.MeshBasicMaterial({
  color: 0xffff00,
});
const materialTwo = new THREE.MeshBasicMaterial({
  color: 0x0000ff,
});

// 6. 큐브
const cube1 = new THREE.Mesh(geometry, materialOne);
const cube2 = new THREE.Mesh(geometry, materialTwo);

// 큐브 회전값 초기화
cube1.rotation.x = 0.00;
cube1.rotation.y = 0.00;
cube2.rotation.x = 0.00;
cube2.rotation.y = 0.00;

// 큐브 크기 조정
cube1.scale.x = 2;
cube1.scale.y = 3;
cube1.scale.z = 2;

cube2.scale.x = 2;
cube2.scale.y = 3;
cube2.scale.z = 2;

// 큐브 위치 조정
cube1.position.x = -1.2;
cube2.position.x = 1.2;

scene.add(cube1);
scene.add(cube2);

// 7. 이동 컨트롤
const controls = new OrbitControls( camera, renderer.domElement );
controls.target.set( 0, 0, 0 );
controls.update();

// 8. 빛
const loader = new GLTFLoader();

// 9. 렌더링
function animate() {
  requestAnimationFrame( animate );
  renderer.render(scene, camera);
}
// 10. 텍스트 텍스처 추가
const textureLoader = new THREE.TextureLoader();

const textTexture1 = textureLoader.load("dk.jpg");
const textMaterial1 = new THREE.MeshBasicMaterial({
  map: textTexture1,
  transparent: true,
});

const textTexture2 = textureLoader.load("ak.jpg");
const textMaterial2 = new THREE.MeshBasicMaterial({
  map: textTexture2,
  transparent: true,
});

// 기존 큐브 중 하나에 텍스트 재질 적용
cube1.material = textMaterial1;
cube2.material = textMaterial2;

animate();