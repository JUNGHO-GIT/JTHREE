import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

// 0. 전역 변수 ----------------------------------------------------------------------------------->
let draggableObjects = [];
let floorCount = 0;
let cubeCount = 0;

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
  logarithmicDepthBuffer: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// 4. 컨트롤 설정 --------------------------------------------------------------------------------->
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.update();

// 5. 조명 설정 ----------------------------------------------------------------------------------->
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

// 7. 폰트 설정 ----------------------------------------------------------------------------------->
function fontLoader(numberParam, positionParam) {
  return new Promise(resolve => {
    const fontLoader = new FontLoader();
    const fontUrl = "https://threejsfundamentals.org/threejs/resources/threejs/fonts/helvetiker_regular.typeface.json";
    fontLoader.load(fontUrl, font => {
      const textGeometry = new TextGeometry(`Floor ${numberParam}`, {
        font: font,
        size: 1,
        height: 0.2,
        curveSegments: 1,
        bevelEnabled: false
      });
      const textMaterial = new THREE.MeshBasicMaterial({ color: 0xeeeeee });
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);

      // 글자의 바운딩 박스 계산
      textGeometry.computeBoundingBox();
      const textSize = textGeometry.boundingBox.getSize(new THREE.Vector3());

      // 텍스트를 floor 오브젝트의 중앙에 정렬
      textMesh.position.set(
        positionParam.x - textSize.x / 2,
        positionParam.y,
        positionParam.z - textSize.z / 2
      );
      textMesh.rotation.x = -Math.PI / 2;
      textMesh.scale.set(1, 1, 1);

      resolve(textMesh);
    });
  });
}

// 바닥 설정 -------------------------------------------------------------------------------------->
function initFloor() {
  const floorGeometry = new THREE.BoxGeometry(15, 0.3, 15); // 가로, 두깨, 세로
  const floorMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
  const floorTexture = new THREE.TextureLoader().load("/imgs/three/floor2.png");
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floorMaterial.map = floorTexture;
  floor.rotation.set(0, 0, 0);
  floor.position.set(0, 0.5, 0);
  floor.scale.set(1, 1, 1);
  floor.name = "floor";
  floor.receiveShadow = true;
  scene.add(floor);
};

// 바닥 생성 -------------------------------------------------------------------------------------->
function createFloor() {
  const floorGeometry = new THREE.BoxGeometry(15, 0.3, 15);
  const floorMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
  const floorTexture = new THREE.TextureLoader().load("/imgs/three/floor2.png");
  floorMaterial.map = floorTexture;

  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.set(0, 0, 0);
  floor.position.set(20, 0.5, 0);
  floor.scale.set(1, 1, 1);
  floor.name = `floor-${floorCount}`;
  floor.receiveShadow = true;

  const floorGroup = new THREE.Group();
  floorGroup.add(floor);

  fontLoader(floorCount + 1, floor.position).then(textMesh => {
    floorGroup.add(textMesh);
    scene.add(floorGroup);
    draggableObjects.push(floorGroup);
  });

  floorCount++;
}

// 바닥 생성 버튼 -------------------------------------------------------------------------------->
function createFloorBtn () {
  const addFloorBtn = document.createElement("button");
  addFloorBtn.innerText = "Add Floor";
  addFloorBtn.id = "addFloor";
  addFloorBtn.style.cssText = `
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
  addFloorBtn.addEventListener("click", () => {
    createFloor();
  });
  document.body.appendChild(addFloorBtn);
};

// 4. 큐브 생성 ---------------------------------------------------------------------------------->
function initCube() {
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const textureLoader = new THREE.TextureLoader();
  boxGeometry.translate(0, 0.5, 0);
  const boxMaterials = [
    new THREE.MeshBasicMaterial({
      map: textureLoader.load("/imgs/three/1.png"),
      transparent: true
    }),
    new THREE.MeshBasicMaterial({
      map: textureLoader.load("/imgs/three/2.png"),
      transparent: true
    }),
    new THREE.MeshBasicMaterial({
      map: textureLoader.load("/imgs/three/3.png"),
      transparent: true
    })
  ];
  boxMaterials.forEach((material, index) => {
    const cube = new THREE.Mesh(boxGeometry, material);
    cube.rotation.set(0, 0, 0);
    cube.position.set((index - 1) * 2.4, 0.5, 0);
    cube.scale.set(2, 3, 2);
    cube.name = `cube-${index}`;
    cube.castShadow = true;
    scene.add(cube);

    draggableObjects.push(cube);
  });
};

// 큐브 생성 -------------------------------------------------------------------------------------->
function createCube() {
  const newBoxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const newTextureLoader = new THREE.TextureLoader();
  newBoxGeometry.translate(0, 0.5, 0);
  const newMaterial = new THREE.MeshBasicMaterial({
    map: newTextureLoader.load("/imgs/three/7.png"),
    transparent: true
  });
  const newCube = new THREE.Mesh(newBoxGeometry, newMaterial);

  // floor 중앙에 생성
  newCube.position.set(0, 0.5, 0);
  newCube.rotation.set(0, 0, 0);
  newCube.scale.set(2, 3, 2);
  newCube.castShadow = true;
  newCube.name = `cube-${cubeCount}`;
  draggableObjects.push(newCube);
  scene.add(newCube);
  saveLastPosition();

  cubeCount++;
}

// 큐브 생성 버튼 -------------------------------------------------------------------------------->
function createCubeBtn () {
  const addCubeBtn = document.createElement("button");
  addCubeBtn.innerText = "Add Cube";
  addCubeBtn.id = "addCube";
  addCubeBtn.style.cssText = `
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
  addCubeBtn.addEventListener("click", () => {
    createCube();
  });
  document.body.appendChild(addCubeBtn);
};

// 드래그해서 움직일수 있도록 상호작용 추가 ------------------------------------------------------->
function dragControls() {

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const offset = new THREE.Vector3();

  const floorObjs = scene.children.find(obj => {
    return obj.name.includes("floor");
  });
  let selectedObject = null;
  let isDragging = false;

  // mouseDown
  const onMouseDown = (event) => {
    event.preventDefault();
    isDragging = true;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(draggableObjects);

    if (intersects.length > 0) {
      controls.enabled = false;
      let intersectedObject = intersects[0].object;

      // 부모가 THREE.Group인 경우, 해당 그룹을 선택 객체로 설정
      selectedObject = intersectedObject.parent instanceof THREE.Group ? intersectedObject.parent : intersectedObject;

      if (selectedObject instanceof THREE.Mesh && selectedObject.name.includes("cube-")) {
        const floorIntersects = raycaster.intersectObject(floorObjs);
        if (floorIntersects.length > 0) {
          offset.copy(floorIntersects[0].point).sub(selectedObject.position);
        }
      }
      else {
        offset.copy(intersects[0].point).sub(selectedObject.position);
      }
    }
  };
  document.addEventListener("mousedown", onMouseDown, false);

  // mouseMove
  const onMouseMove = (event) => {
    event.preventDefault();
    if (!isDragging) {
      return;
    }

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    if (selectedObject instanceof THREE.Mesh && selectedObject.name.includes("cube-")) {
      const floorIntersects = raycaster.intersectObject(floorObjs);
      if (floorIntersects.length > 0) {
        selectedObject.position.copy(floorIntersects[0].point.sub(offset));
      }
    }
    else if (selectedObject) {
      const planeIntersect = raycaster.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), new THREE.Vector3());
      if (planeIntersect) {
        selectedObject.position.copy(planeIntersect.sub(offset));
      }
    }
  };
  document.addEventListener("mousemove", onMouseMove, false);

  // mouseUp
  const onMouseUp = (event) => {
    event.preventDefault();
    isDragging = false;
    controls.enabled = true;
    selectedObject = null;
  };
  document.addEventListener("mouseup", onMouseUp, false);
};

// 마지막 위치 저장 ------------------------------------------------------------------------------->
function saveLastPosition () {

  const cubes = scene.children.filter(obj => {
    return obj.name.includes("cube-");
  });

  const cubesPosition = cubes.flatMap(obj => {
    return {
      metadata: {
        id: obj.name,
        uuid: obj.uuid
      },
      position: {
        x: obj.position.x,
        y: obj.position.y,
        z: obj.position.z
      },
      rotation: {
        x: obj.rotation.x,
        y: obj.rotation.y,
        z: obj.rotation.z
      },
      scale: {
        x: obj.scale.x,
        y: obj.scale.y,
        z: obj.scale.z
      }
    };
  });

  const cameraPosition = {
    position: {
      x: camera.position.x,
      y: camera.position.y,
      z: camera.position.z
    },
    rotation: {
      x: camera.rotation.x,
      y: camera.rotation.y,
      z: camera.rotation.z
    }
  };

  const saveData = {
    cubes: cubesPosition,
    camera: cameraPosition
  };

  localStorage.clear();
  localStorage.setItem("lastPosition", JSON.stringify(saveData));
};

// 저장 버튼 -------------------------------------------------------------------------------------->
function saveBtn () {
  const saveBtn = document.createElement("button");
  saveBtn.innerText = "Save Position";
  saveBtn.style.cssText = `
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
  function clickedBtnAnimation() {
    alert("Save Complete!");
  }
  requestAnimationFrame(animate);

  // 버튼 눌렀을때 이벤트
  saveBtn.addEventListener("click", () => {
    saveLastPosition();
    clickedBtnAnimation();
  });
  document.body.appendChild(saveBtn);
};

// 초기 위치 설정 -------------------------------------------------------------------------------->
function initialPosition () {
  const savedData = JSON.parse(localStorage.getItem("lastPosition"));
  if (savedData && savedData.cubes) {
    savedData.cubes.forEach(obj => {
      const cubes = scene.children.find(child => {
        return child.name === obj.metadata.id;
      });
      if (!cubes) {
        const newBoxGeometry = new THREE.BoxGeometry(1, 1, 1);
        const newTextureLoader = new THREE.TextureLoader();
        newBoxGeometry.translate(0, 0.5, 0);
        const newMaterial = new THREE.MeshBasicMaterial({ map: newTextureLoader.load("/imgs/three/7.png"), transparent: true });
        const newCube = new THREE.Mesh(newBoxGeometry, newMaterial);
        newCube.position.set(obj.position.x, obj.position.y, obj.position.z);
        newCube.rotation.set(obj.rotation.x, obj.rotation.y, obj.rotation.z);
        newCube.scale.set(obj.scale.x, obj.scale.y, obj.scale.z);
        newCube.castShadow = true;
        newCube.name = obj.metadata.id;
        draggableObjects.push(newCube);
        scene.add(newCube);
      }
      if (cubes) {
        cubes.position.x = obj.position.x;
        cubes.position.y = obj.position.y;
        cubes.position.z = obj.position.z;
        cubes.rotation.x = obj.rotation.x;
        cubes.rotation.y = obj.rotation.y;
        cubes.rotation.z = obj.rotation.z;
        cubes.scale.x = obj.scale.x;
        cubes.scale.y = obj.scale.y;
        cubes.scale.z = obj.scale.z;
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
};

// 0. 이벤트 리스너 ------------------------------------------------------------------------------->
document.addEventListener("DOMContentLoaded", () => {
  initFloor();
  createFloorBtn();

  initCube();
  createCubeBtn();

  dragControls();
  saveBtn();
  initialPosition();

  animate();
});

// 0. 렌더링 함수 --------------------------------------------------------------------------------->
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update();
}

