import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// 1. 씬
const scene = new THREE.Scene();

// 2. 카메라
const camera = new THREE.PerspectiveCamera();
camera.position.set( 0, 10, 30 );
camera.position.z = 5;

// 3. 렌더러
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// 4. 기하학 형태
const geometry = new THREE.BoxGeometry( 1, 1, 1 );

// 5. 물체
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

// 6. 큐브
const cube = new THREE.Mesh( geometry, material );

scene.add( cube );

function animate() {
  requestAnimationFrame( animate );

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render( scene, camera );
}
animate();

// 7. 이동 컨트롤
const controls = new OrbitControls( camera, renderer.domElement );

// 8. 빛
const loader = new GLTFLoader();

loader.load(
  "models/scene.gltf",
  function ( gltf ) {
    scene.add( gltf.scene );
  },
  undefined,
  function ( error ) {
    console.error( error );
  }
);

// 9. 윈도우 리사이즈
window.addEventListener( "resize", onWindowResize, false );

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
}


