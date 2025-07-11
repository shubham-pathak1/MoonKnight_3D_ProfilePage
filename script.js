// Three.js setup
let scene, camera, renderer, model, mixer, clock;
let isAnimating = false;
let wireframeMode = false;
let mouseX = 0;
let mouseY = 0;
let targetRotationX = 0;
let targetRotationY = 0;
let currentRotationX = 0;
let currentRotationY = 0;
let isMouseDown = false;

// Create stars background
function createStars() {
    const starsContainer = document.querySelector('.stars');
    for (let i = 0; i < 150; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 4 + 's';
        star.style.animationDuration = (3 + Math.random() * 2) + 's';
        starsContainer.appendChild(star);
    }
}

// Initialize Three.js
function init() {
    const canvas = document.getElementById('model-viewer');
    const container = canvas.parentElement;
    
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    
    // Add subtle fog for depth
    scene.fog = new THREE.Fog(0x000000, 5, 15);
    
    // Camera setup
    camera = new THREE.PerspectiveCamera(
        75, 
        container.clientWidth / container.clientHeight, 
        0.1, 
        1000
    );
    camera.position.set(0, 2, 2.5);
    
    // Renderer setup
    renderer = new THREE.WebGLRenderer({ 
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    
    // Lighting setup - Moon Knight themed
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);
    
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    keyLight.position.set(3, 5, 3);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.1;
    keyLight.shadow.camera.far = 50;
    scene.add(keyLight);
    
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.8);
    rimLight.position.set(-5, 2, -5);
    scene.add(rimLight);
    
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.2);
    fillLight.position.set(0, 0, 5);
    scene.add(fillLight);
    
    // Mouse controls
    setupControls();
    
    // Clock for animations
    clock = new THREE.Clock();
    
    // Load the model
    loadModel();
    
    // Start render loop
    animate();
}

function setupControls() {
    const canvas = document.getElementById('model-viewer');
    
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mouseleave', onMouseUp);
    canvas.addEventListener('touchstart', onTouchStart);
    canvas.addEventListener('touchmove', onTouchMove);
    canvas.addEventListener('touchend', onTouchEnd);
    
    updateRotation();
}

function onMouseDown(event) {
    isMouseDown = true;
    mouseX = event.clientX;
    mouseY = event.clientY;
}

function onMouseMove(event) {
    if (!isMouseDown) return;
    
    const deltaX = event.clientX - mouseX;
    const deltaY = event.clientY - mouseY;
    
    targetRotationY += deltaX * 0.01;
    targetRotationX += deltaY * 0.01;
    
    mouseX = event.clientX;
    mouseY = event.clientY;
}

function onMouseUp() {
    isMouseDown = false;
}

function onTouchStart(event) {
    event.preventDefault();
    const touch = event.touches[0];
    mouseX = touch.clientX;
    mouseY = touch.clientY;
    isMouseDown = true;
}

function onTouchMove(event) {
    event.preventDefault();
    if (!isMouseDown) return;
    
    const touch = event.touches[0];
    const deltaX = touch.clientX - mouseX;
    const deltaY = touch.clientY - mouseY;
    
    targetRotationY += deltaX * 0.01;
    targetRotationX += deltaY * 0.01;
    
    mouseX = touch.clientX;
    mouseY = touch.clientY;
}

function onTouchEnd(event) {
    event.preventDefault();
    isMouseDown = false;
}

function updateRotation() {
    if (model) {
        currentRotationX += (targetRotationX - currentRotationX) * 0.1;
        currentRotationY += (targetRotationY - currentRotationY) * 0.1;
        
        model.rotation.x = currentRotationX;
        model.rotation.y = currentRotationY;
    }
    requestAnimationFrame(updateRotation);
}

function loadModel() {
    if (typeof THREE.GLTFLoader === 'undefined') {
        console.error('GLTFLoader not available, creating fallback model');
        createFallbackModel();
        hideLoading();
        return;
    }
    
    const loader = new THREE.GLTFLoader();
    
    loader.load(
        './scene.gltf',
        function (gltf) {
            model = gltf.scene;
            
            model.scale.set(1, 1, 1);
            model.position.set(0, 1.5, 0);
            
            model.traverse(function (child) {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    if (child.material) {
                        child.material.metalness = 0.3;
                        child.material.roughness = 0.7;
                        child.material.envMapIntensity = 1.0;
                    }
                }
            });
            
            scene.add(model);
            
            if (gltf.animations && gltf.animations.length > 0) {
                mixer = new THREE.AnimationMixer(model);
                gltf.animations.forEach((clip) => {
                    const action = mixer.clipAction(clip);
                    action.play();
                });
                isAnimating = true;
            }
            
            hideLoading();
            console.log('Moon Knight model loaded successfully!');
        },
        function (progress) {
            const percentComplete = (progress.loaded / progress.total) * 100;
            console.log('Loading progress:', percentComplete.toFixed(2) + '%');
        },
        function (error) {
            console.error('Error loading Moon Knight model:', error);
            createFallbackModel();
            hideLoading();
        }
    );
}

function createFallbackModel() {
    console.log('Creating fallback Moon Knight model...');
    
    const group = new THREE.Group();
    
    const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.4, 1.2, 8);
    const bodyMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xf0f0f0,
        shininess: 30
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.6;
    body.castShadow = true;
    group.add(body);
    
    const headGeometry = new THREE.SphereGeometry(0.25, 16, 16);
    const headMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xffffff,
        shininess: 50
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.5;
    head.castShadow = true;
    group.add(head);
    
    const capeGeometry = new THREE.PlaneGeometry(1.5, 1.8);
    const capeMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xe0e0e0,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
    });
    const cape = new THREE.Mesh(capeGeometry, capeMaterial);
    cape.position.set(0, 0.5, -0.5);
    cape.rotation.x = -0.1;
    group.add(cape);
    
    const crescentGeometry = new THREE.TorusGeometry(0.2, 0.03, 8, 16, Math.PI);
    const crescentMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xc0c0c0,
        shininess: 100
    });
    
    const crescent1 = new THREE.Mesh(crescentGeometry, crescentMaterial);
    crescent1.position.set(0.8, 1.2, 0);
    crescent1.rotation.z = Math.PI / 4;
    crescent1.castShadow = true;
    group.add(crescent1);
    
    const crescent2 = new THREE.Mesh(crescentGeometry, crescentMaterial);
    crescent2.position.set(-0.8, 1.2, 0);
    crescent2.rotation.z = -Math.PI / 4;
    crescent2.castShadow = true;
    group.add(crescent2);
    
    const moonSymbolGeometry = new THREE.TorusGeometry(0.1, 0.02, 8, 16, Math.PI);
    const moonSymbolMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xffffff,
        emissive: 0x222222
    });
    const moonSymbol = new THREE.Mesh(moonSymbolGeometry, moonSymbolMaterial);
    moonSymbol.position.set(0, 0.8, 0.31);
    moonSymbol.rotation.x = Math.PI / 2;
    group.add(moonSymbol);
    
    group.position.y = 2.0;
    model = group;
    scene.add(model);
}

function hideLoading() {
    const loading = document.getElementById('loading');
    loading.style.display = 'none';
}

function animate() {
    requestAnimationFrame(animate);
    
    if (mixer && isAnimating) {
        mixer.update(clock.getDelta());
    }
    
    if (model) {
        model.position.y = 1.5 + Math.sin(Date.now() * 0.001) * 0.002;
    }
    
    renderer.render(scene, camera);
}

function resetModel() {
    if (model) {
        targetRotationX = 0;
        targetRotationY = 0;
        currentRotationX = 0;
        currentRotationY = 0;
        model.rotation.set(0, 0, 0);
        model.position.set(0, 1.5, 0);
    }
    camera.position.set(0, 2, 2.5);
    console.log('Model view reset');
}

function toggleAnimation() {
    isAnimating = !isAnimating;
    console.log('Animation', isAnimating ? 'enabled' : 'disabled');
}

function toggleWireframe() {
    wireframeMode = !wireframeMode;
    if (model) {
        model.traverse(function (child) {
            if (child.isMesh && child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach(material => {
                        material.wireframe = wireframeMode;
                    });
                } else {
                    child.material.wireframe = wireframeMode;
                }
            }
        });
    }
    console.log('Wireframe mode', wireframeMode ? 'enabled' : 'disabled');
}

function onWindowResize() {
    const canvas = document.getElementById('model-viewer');
    const container = canvas.parentElement;
    
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

window.addEventListener('resize', onWindowResize);
window.addEventListener('orientationchange', onWindowResize);

window.addEventListener('load', function() {
    setTimeout(() => {
        createStars();
        init();
        console.log('Moon Knight 3D Viewer initialized');
    }, 100);
});