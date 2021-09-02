import * as THREE from '../node_modules/three/build/three.module.js';
import { OrbitControls } from '../script/OrbitControls.js';

const pageHeader = document.querySelector('.page-header');

const scene = new THREE.Scene();
scene.fog   = new THREE.FogExp2(0xFF0000, 0.01);

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
    this.material = new THREE.MeshLambertMaterial({
        color: 0xFFFFFF,
        wireframe: false
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

const simplexSeed = Date.now();
const openSimplex = openSimplexNoise(simplexSeed);

const testHeightMap = {
    content: []
}
for (let x = 0; x < mainPlane.segments; x++) {
    for (let y = 0; y < mainPlane.segments; y++) {
        testHeightMap.content.push({
            x: x,
            y: y,
            z: openSimplex.noise2D(x * 0.1, y * 0.1) * 4
        });
    }
}

mainPlane.applyHeightMap(testHeightMap);

const skyBoxGeometry = new THREE.BoxGeometry(256, 256, 256);
const skyBoxMaterial = new THREE.MeshBasicMaterial({
    color: 0x0000A3,
    wireframe: false,
    side: THREE.BackSide,
    fog: false
});
const skyBoxMesh = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);

scene.add(skyBoxMesh);

const pointLight = new THREE.PointLight(0xFFFFFF, 1, 32);
pointLight.position.set(0, 16, 0);

scene.add(pointLight);

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
