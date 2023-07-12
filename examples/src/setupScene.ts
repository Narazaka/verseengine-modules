import * as THREE from "three";
import { Reflector } from "three/examples/jsm/objects/Reflector.js";
import { Sky } from "three/examples/jsm/objects/Sky.js";
import type { Tick } from "./Tick";

export function setupScene(domRoot: HTMLElement, ticks: Tick[]) {
  const renderer = new THREE.WebGLRenderer();
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  domRoot.appendChild(renderer.domElement);

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100,
  );
  camera.position.set(0, 1.6, 0);
  scene.add(camera);

  scene.add(new THREE.AmbientLight(0xffffff, 1));

  {
    const sky = new Sky();
    sky.scale.setScalar(450000);
    scene.add(sky);

    const sun = new THREE.Vector3();
    sun.setFromSphericalCoords(
      1,
      THREE.MathUtils.degToRad(60),
      THREE.MathUtils.degToRad(180),
    );
    sky.material.uniforms["sunPosition"].value.copy(sun);
  }
  let ground;
  {
    ground = new THREE.Mesh(
      new THREE.PlaneGeometry(50, 50, 1, 1),
      new THREE.MeshLambertMaterial({
        color: 0x5e5e5e,
      }),
    );
    ground.rotation.x = Math.PI / -2;
    scene.add(ground);
  }
  scene.add(new THREE.GridHelper(50, 50));

  {
    const mirrorGeometry = new THREE.PlaneGeometry(4, 2, 1, 1);
    const mirror = new Reflector(mirrorGeometry, {
      textureWidth: window.innerWidth * window.devicePixelRatio,
      textureHeight: window.innerHeight * window.devicePixelRatio,
      color: 0x999999,
    });
    mirror.position.y = 1;
    mirror.position.z = -5;
    mirror.camera.layers.enableAll();
    scene.add(mirror);
  }

  ticks ||= [];
  const clock = new THREE.Clock();
  const animate = () => {
    const dt = clock.getDelta();
    ticks.forEach((f) => f(dt));
    renderer.render(scene, camera);
  };
  renderer.setAnimationLoop(animate);

  return { scene, renderer, camera, ground };
}
