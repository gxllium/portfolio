import * as THREE from '../node_modules/three/build/three.module.js';

const pageHeader = document.querySelector('.page-header');
const scene = new THREE.Scene();

let cameraFov    = 75;
let cameraAspect = window.innerWidth / window.innerHeight;
let cameraNear   = 0.1;
let cameraFar    = 1000;

const camera = new THREE.PerspectiveCamera(cameraFov, cameraAspect, cameraNear, cameraFar);

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
