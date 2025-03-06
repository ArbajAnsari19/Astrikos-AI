import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';


// Create scene and camera
const scene = new THREE.Scene();
scene.background = new THREE.Color('#000000');

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.position.set(1000, 900, -600);

// Create renderer
const canvas = document.querySelector('#draw');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true ,  powerPreference: 'high-performance'
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.4;
renderer.outputEncoding = THREE.sRGBEncoding;

// Dashboard visibility state
const dashboardState = {
    isVisible: false,
    transitionStarted: false
  };

// Load HDRI environment map
function loadHDREnvironment() {
    return new Promise((resolve) => {
      new RGBELoader()
        .setDataType(THREE.HalfFloatType)
        .load(
            'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/neon_photostudio_1k.hdr', (texture) => {
          const pmremGenerator = new THREE.PMREMGenerator(renderer);
          pmremGenerator.compileEquirectangularShader();
          
          const envMap = pmremGenerator.fromEquirectangular(texture).texture;
          scene.environment = envMap; 
        
          
          texture.dispose();
          pmremGenerator.dispose();
          
          resolve(envMap);
        });
    });
  }

// Load textures
const textureLoader = new THREE.TextureLoader();

// Load all required textures
const colorMap = textureLoader.load('./Tiles132B_1K-JPG_Color.jpg');
const normalMap = textureLoader.load('./Tiles132B_1K-JPG_NormalDX.jpg');
const roughnessMap = textureLoader.load('./Tiles132B_1K-JPG_Roughness.jpg');
const aoMap = textureLoader.load('./Tiles132B_1K-JPG_AmbientOcclusion.jpg');
const displacementMap = textureLoader.load('./Tiles132B_1K-JPG_Displacement.jpg');

// Configure texture settings
[colorMap, normalMap, roughnessMap, aoMap, displacementMap].forEach(texture => {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(20, 20);
});

// Update ground material
const groundMaterial = new THREE.MeshStandardMaterial({ 
    map: colorMap,
    normalMap: normalMap,
    roughnessMap: roughnessMap,
    aoMap: aoMap,
    displacementMap: displacementMap,
    displacementScale: 50,
    roughness: 0.8,
    metalness: 0.2,
    color: 0x000000
});

// Add ground plane
const groundGeometry = new THREE.PlaneGeometry(10000, 10000);
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -100;
ground.receiveShadow = true;
scene.add(ground);

// Add lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.7);
directionalLight.position.set(-598, 968, 238);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 4096;
directionalLight.shadow.mapSize.height = 4096;
directionalLight.shadow.camera.near = 100;
directionalLight.shadow.camera.far = 3000;
directionalLight.shadow.camera.left = -1000;
directionalLight.shadow.camera.right = 1000;
directionalLight.shadow.camera.top = 1000;
directionalLight.shadow.camera.bottom = -1000;
directionalLight.shadow.bias = -0.0001;
scene.add(directionalLight);

// Configure controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxDistance = 5000;
controls.minDistance = 100;
controls.maxPolarAngle = Math.PI / 2;
controls.minPolarAngle = 0;


// Initialize dashboard but keep it hidden at first
window.addEventListener('DOMContentLoaded', () => {
    initDashboard();
    hideShowDashboard(false); // Start with hidden dashboard
});


// Function to show/hide dashboard with animation
function hideShowDashboard(show) {
    const leftBox = document.querySelector('.left-box');
    const rightBox = document.querySelector('.right-box');
    
    if (show) {
        // Show dashboard with animation
        leftBox.style.transition = 'transform 1.5s ease-out';
        rightBox.style.transition = 'transform 1.5s ease-out';
        leftBox.style.transform = 'translateX(0)';
        rightBox.style.transform = 'translateX(0)';
    } else {
        // Hide dashboard with animation
        leftBox.style.transition = 'transform 0.5s ease-in';
        rightBox.style.transition = 'transform 0.5s ease-in';
        leftBox.style.transform = 'translateX(-200%)'; // Move much further off-screen
        rightBox.style.transform = 'translateX(200%)'; // Move much further off-screen
    }
    
    dashboardState.isVisible = show;
}


// Load GLB Model
const loader = new GLTFLoader();
loader.load('./scene.gltf', (gltf) => {
    const model = gltf.scene;
    model.position.y = 35.6; 
    model.position.x = 21;
    model.position.z = 0;
    
    model.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material) {
                child.material.roughness = 0.8;
                child.material.metalness = 0.2;
                child.material.envMapIntensity = 1.0; // Adjust the reflection intensity
            }
        }
    });
    scene.add(model);

    // Predefined pivot points from the captured data
    const pivotPoints = [
        new THREE.Vector3(913.835776853187,761.114765196571,560.209834472143),
        new THREE.Vector3(-113.835776853187,361.114765196571,160.209834472143),
        new THREE.Vector3(21, 35.6, 0)
    ];

    // Camera positions relative to pivot points (different viewing angles)
    const cameraOffsets = [
        new THREE.Vector3(600, 400, 300),
        new THREE.Vector3(-400, 300, 400),
        new THREE.Vector3(400, 300, -400),
        new THREE.Vector3(-300, 400, -300),
        new THREE.Vector3(500, 300, -200)
    ];

    // Smooth interpolation parameters
    const transitionDuration = 8000; // 8 seconds transition
    let isTransitioning = false;
    let transitionStartTime = 0;
    let startPosition = new THREE.Vector3();
    let targetPosition = new THREE.Vector3();
    let startTarget = new THREE.Vector3();
    let endTarget = new THREE.Vector3();
    let currentPivotIndex = 0;

    // Initialize camera to look at the first pivot with its offset
    camera.position.copy(pivotPoints[0]).add(cameraOffsets[0]);
    controls.target.copy(pivotPoints[0]);
    camera.lookAt(controls.target);
    controls.update();

    // Show dashboard initially
    hideShowDashboard(true);

    // Smooth camera transition function
    function smoothRotateCameraToNextPivot() {
        if (isTransitioning) return;

        // Get next pivot point
        currentPivotIndex = (currentPivotIndex + 1) % pivotPoints.length;
        const pivot = pivotPoints[currentPivotIndex];
        const offset = cameraOffsets[currentPivotIndex];

        // Save start position and target
        startPosition.copy(camera.position);
        startTarget.copy(controls.target);
        
        // Calculate target camera position and look target
        targetPosition.copy(pivot).add(offset);
        endTarget.copy(pivot);

        // Start transition
        isTransitioning = true;
        transitionStartTime = performance.now();
        
        // Disable controls during transition
        controls.enabled = false;

        // Modified dashboard visibility logic:
        // Hide dashboard when moving from first to second pivot
        if (currentPivotIndex === 1) {
            hideShowDashboard(false);
        }
        
        // Show dashboard when moving from last to first pivot (back to start)
        if (currentPivotIndex === 0) {
            // Add a small delay before showing the dashboard again
            setTimeout(() => {
                hideShowDashboard(true);
            }, 500);
        }
    }

    // Animation update function for smooth transition
    function updateCameraTransition() {
        if (!isTransitioning) return;

        const currentTime = performance.now();
        const elapsedTime = currentTime - transitionStartTime;
        const progress = Math.min(elapsedTime / transitionDuration, 1);

        // Smooth interpolation (easing function)
        const easedProgress = 1 - Math.pow(1 - progress, 3); // Cubic easing

        // Interpolate camera position
        camera.position.lerpVectors(startPosition, targetPosition, easedProgress);
        
        // Interpolate the orbital controls target (where camera is looking)
        controls.target.lerpVectors(startTarget, endTarget, easedProgress);
        
        // Update the camera to look at the interpolated target
        camera.lookAt(controls.target);

        // End transition
        if (progress >= 1) {
            isTransitioning = false;
            controls.enabled = true; // Re-enable controls after transition
        }
        
        // Update controls to match new camera position and target
        controls.update();
    }

    // Rotate camera every 10 seconds
    setInterval(smoothRotateCameraToNextPivot, 10000);

    // Modify animation loop to include transition
    function animate() {
        requestAnimationFrame(animate);
        updateCameraTransition();
        if (!isTransitioning) {
            controls.update();
        }
        renderer.render(scene, camera);
    }

    animate();
});

// Handle window resize
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

