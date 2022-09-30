import * as THREE from 'three';
import Stats from 'stats.js';
import { GUI } from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DoubleSide } from 'three';

// Renderer
const canvas = document.querySelector('#three-canvas');
const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.x = .5;
camera.position.y = 1;
camera.position.z = 5;
scene.add(camera);

// Light
const ambientLight = new THREE.AmbientLight();
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.x = 1;
directionalLight.position.z = 2;
scene.add(directionalLight);

// Mesh
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({
    color: 'seagreen'
});
const mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh);

// Stats (FPS)
const stats = new Stats();
document.body.append(stats.domElement);

// controller
const controls = new OrbitControls( camera, renderer.domElement );

// gui
const gui = new GUI();
const testVertex = { vertex1 : 1.0, vertex2 : -1.0};
const Gparameters = { x: 0, y: 0, z: 0}

var ui = gui.add(testVertex, 'vertex1').min(-10).max(10);
ui = gui.add( Gparameters, 'x' ).min(0).max(200);
const uiFolder = gui.addFolder('A');
uiFolder.add(testVertex, 'vertex2');
uiFolder.open();

// test mesh
const vertices = new Float32Array( [
	-1.0, 1.0, 1.0,
	 1.0, -1.0,  1.0,
	 1.0,  1.0,  1.0,

	 1.0,  1.0,  1.0,
	-1.0,  1.0,  1.0,
	-1.0, -1.0,  1.0,
] );

const testGeometry = geometry.clone();
const testMaterial = new THREE.MeshStandardMaterial({
    color: 'seagreen',
    side : DoubleSide,
});
testGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
const testMesh = new THREE.Mesh(testGeometry, testMaterial);
scene.add(testMesh);

// Draw
function draw() {
    stats.update();

    // testGeometry.attributes.position.array[0] = testVertex.vertex1;
    vertices[1] = testVertex.vertex1;
    
    // console.log(testVertex);

    testGeometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
    renderer.setAnimationLoop(draw);
}

function setSize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
}

// 이벤트
window.addEventListener('resize', setSize);

draw();