import * as THREE from '../node_modules/three/build/three.module.js';
import { OrbitControls } from '../script/OrbitControls.js';

const pageHeader = document.querySelector('.page-header');
const scene = new THREE.Scene();

let cameraFov    = 75;
let cameraAspect = window.innerWidth / window.innerHeight;
let cameraNear   = 0.1;
let cameraFar    = 1000;

const camera = new THREE.PerspectiveCamera(cameraFov, cameraAspect, cameraNear, cameraFar);
camera.position.z = 3;

const renderer = new THREE.WebGLRenderer(scene, camera);
renderer.setSize(window.innerWidth, window.innerHeight);

window.addEventListener('resize', () => {
    let width  = window.innerWidth;
    let height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
});

renderer.domElement.classList.add('header-background');
pageHeader.appendChild(renderer.domElement);

const orbitControls = new OrbitControls(camera, renderer.domElement);

function Plane(segments) {
    this.segments = segments;
    this.geometry = new THREE.PlaneGeometry(this.segments, this.segments, this.segments - 1, this.segments - 1);
    this.material = new THREE.MeshBasicMaterial({
        color: 0xFFFFFF,
        wireframe: true
    });

    this.createMesh = function() {
        return new THREE.Mesh(this.geometry, this.material);
    }
    this.mesh = this.createMesh();

    this.applyHeightMap = function(heightMap) {
        let positionArray = this.mesh.geometry.attributes.position.array;
        for (let i = 0, j = 0, l = positionArray.length; i < l; i += 1, j += 3) {
            if (i < heightMap.content.length) {
                positionArray[j + 2] = heightMap.content[i].z;
            }
        }
    }
}

const mainPlane = new Plane(32);
mainPlane.mesh.rotation.x = -Math.PI / 2;
scene.add(mainPlane.mesh);

const testHeightMap = {
    content: []
}
for (let x = 0; x < mainPlane.segments; x++) {
    for (let y = 0; y < mainPlane.segments; y++) {
        testHeightMap.content.push({
            x: x,
            y: y,
            z: Math.round(Math.random() * 4)
        });
    }
}

mainPlane.applyHeightMap(testHeightMap);

const update = function() {
    orbitControls.update();
}

const render = function() {
    renderer.render(scene, camera);
}

const mainLoop = function() {
    requestAnimationFrame(mainLoop);
    update();
    render();
}

mainLoop();
