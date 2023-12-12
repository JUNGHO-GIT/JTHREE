import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";

// 1. 배경 설정 ----------------------------------------------------------------------------------->
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

// 2. 카메라 설정 --------------------------------------------------------------------------------->
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 10, 30);
camera.position.z = 5;

// 3. 렌더러 설정 --------------------------------------------------------------------------------->
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: false,
  precision: "highp",
  powerPreference: "high-performance",
  depth: true,
  stencil: false,
  premultipliedAlpha: true,
  preserveDrawingBuffer: true,
  failIfMajorPerformanceCaveat: false,
  // logarithmicDepthBuffer: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// 4. 컨트롤 설정 --------------------------------------------------------------------------------->
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.update();

// 5. 조명 설정 ----------------------------------------------------------------------------------->
// more nature lightning
const light = new THREE.HemisphereLight(0xffffff, 0x444444);
light.position.set(0, 200, 0);
scene.add(light);

// 6. 그림자 설정 --------------------------------------------------------------------------------->
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(100, 100, 50);
directionalLight.castShadow = true;
directionalLight.shadow.camera.top = 180;
directionalLight.shadow.camera.bottom = -100;
directionalLight.shadow.camera.left = -120;
directionalLight.shadow.camera.right = 120;
scene.add(directionalLight);

// 바닥 설정 -------------------------------------------------------------------------------------->
const floorGeometry = new THREE.BoxGeometry(15, 0.3, 15); // 가로, 두깨, 세로
const floorMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
const floorTexture = new THREE.TextureLoader().load("floor2.png");
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floorMaterial.map = floorTexture;
floor.rotation.set(0, 0, 0);
floor.position.set(0, 0.5, 0);
floor.receiveShadow = true;
scene.add(floor);

// 4. 객체 생성 ----------------------------------------------------------------------------------->
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const textureLoader = new THREE.TextureLoader();
boxGeometry.translate(0, 0.5, 0);
const boxMaterials = [
  new THREE.MeshBasicMaterial({ map: textureLoader.load("1.png"), transparent: true }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load("2.png"), transparent: true }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load("3.png"), transparent: true })
];

// 큐브 생성 및 씬에 추가 ------------------------------------------------------------------------->
let draggableObjects = [];
boxMaterials.forEach((material, index) => {
  const cube = new THREE.Mesh(boxGeometry, material);
  cube.castShadow = true;
  cube.rotation.set(0, 0, 0);
  cube.position.set((index - 1) * 2.4, 0.5, 0);
  cube.scale.set(2, 3, 2);
  scene.add(cube);

  // 큐브를 드래그 가능한 객체 배열에 추가
  draggableObjects.push(cube);
});

// 큐브 생성 함수
function createCube() {
  // 사용자 입력 가져오기
  const color = document.getElementById('cubeColor').value;
  const size = parseFloat(document.getElementById('cubeSize').value) || 1; // 기본값 1

  // 큐브 생성
  const geometry = new THREE.BoxGeometry(size, size, size);
  const material = new THREE.MeshBasicMaterial({ color: color });
  const cube = new THREE.Mesh(geometry, material);
  // 카메라 위치를 고려하여 큐브 위치 설정
  cube.position.set(0, 10, 25); // 화면 중앙에 큐브 배치
  cube.castShadow = true;
  scene.add(cube);
}


// 텍스트 로딩 및 설정 ---------------------------------------------------------------------------->
const fontLoader = new FontLoader();
fontLoader.load('https://threejsfundamentals.org/threejs/resources/threejs/fonts/helvetiker_regular.typeface.json', function (font) {
  const textGeometry = new TextGeometry('WMS', {
    font: font,
    size: 0.8,
    height: 0.2,
    curveSegments: 1,
    bevelEnabled: false
  });
  const textMaterial = new THREE.MeshBasicMaterial({ color: 0xeee });
  const textMesh = new THREE.Mesh(textGeometry, textMaterial);
  textMesh.quaternion.copy(camera.quaternion);
  textMesh.position.set(-1, 1, 4);
  textMesh.rotation.set(0, 0, 0);
  scene.add(textMesh);
});

// 텍스트 생성 함수
function createText () {
  const userInput = document.getElementById('userText').value;
  if (!userInput) {
    alert("Please enter some text");
    return;
  }

  const fontLoader = new THREE.FontLoader();
  fontLoader.load('https://threejsfundamentals.org/threejs/resources/threejs/fonts/helvetiker_regular.typeface.json', function (font) {
    const textGeometry = new THREE.TextGeometry(userInput, {
      font: font,
      size: 0.8,
      height: 0.2,
      curveSegments: 12,
      bevelEnabled: false
    });

    const textMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.set(0, 10, 25); // 위치 조정 필요
    scene.add(textMesh);
  });
}

// 큐브 드래그해서 움직일수 있도록 상호작용 추가 -------------------------------------------------->
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const offset = new THREE.Vector3();
let selectedObject = null;
let isDragging = false;

const onMouseDown = event => {
  event.preventDefault();
  isDragging = true;

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  // 드래그 가능한 객체들만 검사
  const intersects = raycaster.intersectObjects(draggableObjects);
  if (intersects.length > 0) {
    controls.enabled = false;
    selectedObject = intersects[0].object;
    const floorIntersects = raycaster.intersectObject(floor);
    if (floorIntersects.length > 0) {
      offset.copy(floorIntersects[0].point).sub(selectedObject.position);
    }
  }
};

const onMouseMove = event => {
  event.preventDefault();
  if (!isDragging) return;

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  if (selectedObject) {
    const intersects = raycaster.intersectObject(floor);
    if (intersects.length > 0) {
      selectedObject.position.copy(intersects[0].point.sub(offset));
    }
  }
};

const onMouseUp = event => {
  event.preventDefault();
  isDragging = false;
  controls.enabled = true;
  selectedObject = null;
};

document.addEventListener("mousemove", onMouseMove, false);
document.addEventListener("mousedown", onMouseDown, false);
document.addEventListener("mouseup", onMouseUp, false);

// 마지막 위치 저장 ------------------------------------------------------------------------------->
const saveLastPosition = () => {

  const cubes = scene.children.filter(obj => obj.type === "Mesh");

  const cubesPosition = cubes.map(obj => {
    return {
      position: { x: obj.position.x, y: obj.position.y, z: obj.position.z },
      rotation: { x: obj.rotation.x, y: obj.rotation.y, z: obj.rotation.z },
      scale: { x: obj.scale.x, y: obj.scale.y, z: obj.scale.z }
    };
  });

  const cameraPosition = {
    position: { x: camera.position.x, y: camera.position.y, z: camera.position.z },
    rotation: { x: camera.rotation.x, y: camera.rotation.y, z: camera.rotation.z }
  };

  const saveData = {
    cubes: cubesPosition,
    camera: cameraPosition
  };

  localStorage.setItem("lastPosition", JSON.stringify(saveData));
};

// 초기 위치 설정 -------------------------------------------------------------------------------->
const initialPosition = () => {
  const savedData = JSON.parse(localStorage.getItem("lastPosition"));
  if (savedData) {
    if (savedData.cubes) {
      const cubes = scene.children.filter(obj => obj.type === "Mesh");
      cubes.forEach((obj, index) => {
        if (savedData.cubes[index]) {
          obj.position.x = savedData.cubes[index].position.x;
          obj.position.y = savedData.cubes[index].position.y;
          obj.position.z = savedData.cubes[index].position.z;
          obj.rotation.x = savedData.cubes[index].rotation.x;
          obj.rotation.y = savedData.cubes[index].rotation.y;
          obj.rotation.z = savedData.cubes[index].rotation.z;
          obj.scale.x = savedData.cubes[index].scale.x;
          obj.scale.y = savedData.cubes[index].scale.y;
          obj.scale.z = savedData.cubes[index].scale.z;
        }
      });
    }

    if (savedData.camera) {
      camera.position.x = savedData.camera.position.x;
      camera.position.y = savedData.camera.position.y;
      camera.position.z = savedData.camera.position.z;
      camera.rotation.x = savedData.camera.rotation.x;
      camera.rotation.y = savedData.camera.rotation.y;
      camera.rotation.z = savedData.camera.rotation.z;
    }
  }
};

// 버튼 추가 -------------------------------------------------------------------------------------->
// 1) 저장 버튼
const saveButton = document.createElement("button");
saveButton.innerText = "Save Position";
saveButton.id = "savePosition";
saveButton.style.cssText = `
  position: absolute;
  left: 50%;
  bottom: 10px;
  transform: translateX(-50%);
  padding: 10px 20px;
  font-size: 16px;
  color: #fff;
  background-color: #000;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;
// 버튼 눌렀을때 효과 (애니메이션)
function clickedButtonAnimation() {
  alert("Save Complete!");
  saveButton.style.backgroundColor = "#333";
  saveButton.style.transform = "translate(-50%, -50%) scale(0.95)";
  setTimeout(() => {
    saveButton.style.backgroundColor = "#000";
    saveButton.style.transform = "translate(-50%, -50%) scale(1)";
  }, 100);
}
requestAnimationFrame(animate);

// 버튼 눌렀을때 이벤트
saveButton.addEventListener("click", () => {
  saveLastPosition();
  clickedButtonAnimation();
});

// 2) 큐브 추가 버튼
const addCubeButton = document.createElement("button");
addCubeButton.innerText = "Add Cube";
addCubeButton.style.cssText = `
  position: absolute;
  left: 50%;
  bottom: 50px;
  transform: translateX(-50%);
  padding: 10px 20px;
  font-size: 16px;
  color: #fff;
  background-color: #000;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;
addCubeButton.addEventListener("click", () => {
  createCube();
});

// 3) 글자 추가 버튼
const addTextInput = document.createElement("input");
const addTextButton = document.createElement("button");
addTextButton.innerText = "Add Text";
addTextInput.id = "addText";
// placeholder
addTextInput.placeholder = "Type your text here";
addTextInput.style.cssText = `
  position: absolute;
  left: 50%;
  bottom: 130px;
  transform: translateX(-50%);
  padding: 10px 20px;
  font-size: 16px;
  color: #000;
  background-color: #fff; // 밝은 배경 색상
  border: 1px solid #000; // 테두리 추가
  border-radius: 4px;
  outline: none;
  z-index: 1000; // z-index 추가
`;
addTextButton.style.cssText = `
  position: absolute;
  left: 50%;
  bottom: 90px;
  transform: translateX(-50%);
  padding: 10px 20px;
  font-size: 16px;
  color: #fff;
  background-color: #000;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;
addTextButton.addEventListener("click", () => {
  createText();
});
document.body.appendChild(saveButton);
document.body.appendChild(addCubeButton);
document.body.appendChild(addTextInput);
document.body.appendChild(addTextButton);

// 초기 위치 호출 -------------------------------------------------------------------------------->
initialPosition();

// 9. 렌더링 함수 --------------------------------------------------------------------------------->
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();