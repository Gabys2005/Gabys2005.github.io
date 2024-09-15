import * as THREE from "three";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { MTLLoader } from "three/addons/loaders/MTLLoader.js";

const width = 370;
const height = 345;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x8b632f);
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("canvas"), antialias: true });
renderer.setSize(width, height);

const light = new THREE.PointLight(0xffffff, 5, 0, 0);
light.position.z = 1000;
scene.add(light);

let egg;
const loader = new OBJLoader();
const mtlLoader = new MTLLoader();

// load a resource
mtlLoader.load("egg.mtl", function (material) {
	console.log(material.getAsArray()[0]);
	material.getAsArray()[0].transparent = false;
	loader.setMaterials(material);
	loader.load(
		// resource URL
		"egg.obj",
		// called when resource is loaded
		function (object) {
			egg = object;
			scene.add(object);
			renderer.setAnimationLoop(animate);
		},
		// called when loading is in progresses
		function (xhr) {
			console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
		},
		// called when loading has errors
		function (error) {
			console.log("An error happened");
		}
	);
});

camera.position.z = 2.1;
camera.position.y = 0.3;
camera.rotation.x = -0.15;

function animate() {
	egg.rotation.y -= 0.01;

	renderer.render(scene, camera);
}

window.onresize = function () {
	// camera.aspect = window.innerWidth / window.innerHeight;
	// camera.updateProjectionMatrix();
	// renderer.setSize(window.innerWidth, window.innerHeight);
};
