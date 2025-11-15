// Product Data
// directionalLight.castShadow = true; // Comment this out
const products = {
    cars: [
        {
            id: 1,
            name: "Volkswagen Golf GTI",
            price: "$32,500",
            description: "The Volkswagen Golf GTI combines practicality with thrilling performance. With its turbocharged engine and agile handling, it delivers an exhilarating driving experience while maintaining everyday usability.",
            model: "3dmodels/volkswagen.glb",
            specs: [
                { name: "Engine", value: "2.0L Turbo I4" },
                { name: "Horsepower", value: "241 HP" },
                { name: "Torque", value: "273 lb-ft" },
                { name: "Transmission", value: "6-Speed Manual" },
                { name: "0-60 mph", value: "5.9 seconds" },
                { name: "Fuel Economy", value: "24 city / 32 highway" }
            ],
            colors: ["#c1121f", "#1d3557", "#f1faee", "#000814"]
        },
        {
            id: 2,
            name: "Range Rover Velar",
            price: "$68,900",
            description: "The Range Rover Velar redefines luxury SUV design with its stunning silhouette and sophisticated interior. Advanced terrain response systems ensure capability in all conditions.",
            model: "3dmodels/rangerover2.glb",
            specs: [
                { name: "Engine", value: "3.0L Supercharged V6" },
                { name: "Horsepower", value: "355 HP" },
                { name: "Torque", value: "365 lb-ft" },
                { name: "Transmission", value: "8-Speed Automatic" },
                { name: "0-60 mph", value: "5.8 seconds" },
                { name: "Drivetrain", value: "All-Wheel Drive" }
            ],
            colors: ["#1d3557", "#f1faee", "#000814", "#c1121f"]
        },
        {
            id: 3,
            name: "Porsche 911 Turbo",
            price: "$169,000",
            description: "The Porsche 911 Turbo represents the pinnacle of sports car engineering. With breathtaking acceleration and precision handling, it delivers an unmatched driving experience.",
            model: "3dmodels/porsche.glb",
            specs: [
                { name: "Engine", value: "3.8L Twin-Turbo Flat-6" },
                { name: "Horsepower", value: "572 HP" },
                { name: "Torque", value: "553 lb-ft" },
                { name: "Transmission", value: "8-Speed PDK" },
                { name: "0-60 mph", value: "2.7 seconds" },
                { name: "Top Speed", value: "205 mph" }
            ],
            colors: ["#000814", "#c1121f", "#1d3557", "#f1faee"]
        }
    ],
    fuels: [
        {
            id: 1,
            name: "Octane Boost Pro",
            price: "$24.99",
            description: "Our premium octane booster increases fuel octane by up to 5 points, eliminating engine knock and improving performance. Compatible with all gasoline engines.",
            model: "3dmodels/fuel.glb",
            specs: [
                { name: "Octane Increase", value: "Up to 5 points" },
                { name: "Usage", value: "1 bottle treats 20 gallons" },
                { name: "Compatibility", value: "All gasoline engines" },
                { name: "Benefits", value: "Reduces knock, increases power" },
                { name: "Formula", value: "MMT-free, safe for O2 sensors" }
            ]
        },
        {
            id: 2,
            name: "Performance Plus",
            price: "$29.99",
            description: "Advanced fuel additive designed to clean fuel injectors, reduce carbon deposits, and improve fuel economy. Provides noticeable performance gains.",
            model: "3dmodels/fuel2.glb",
            specs: [
                { name: "Cleaning Power", value: "Removes 95% of deposits" },
                { name: "Fuel Economy", value: "Improves up to 5%" },
                { name: "Horsepower Gain", value: "Up to 10 HP" },
                { name: "Usage", value: "1 bottle treats 15 gallons" },
                { name: "Compatibility", value: "Gasoline and diesel" }
            ]
        },
        {
            id: 3,
            name: "Eco Formula",
            price: "$19.99",
            description: "Environmentally friendly fuel additive that reduces emissions while maintaining performance. Helps engines run cleaner and more efficiently.",
            model: "fuel3.glb",
            specs: [
                { name: "Emission Reduction", value: "Up to 15% lower" },
                { name: "MPG Improvement", value: "Up to 8% better" },
                { name: "Biodegradable", value: "Yes" },
                { name: "Usage", value: "1 bottle treats 25 gallons" },
                { name: "Certification", value: "EPA approved" }
            ]
        }
    ]
};

// Showroom State
let currentCategory = 'cars';
let currentProductIndex = 0;
let currentProducts = products.cars;

// DOM Elements
const categoryButtons = document.querySelectorAll('.category-btn');
const productTitle = document.getElementById('product-title');
const productPrice = document.getElementById('product-price');
const productDescription = document.getElementById('product-description');
const specsContent = document.getElementById('specs-content');
const colorSelector = document.getElementById('color-selector');
const colorOptions = document.querySelectorAll('.color-option');
const currentModelSpan = document.getElementById('current-model');
const totalModelsSpan = document.getElementById('total-models');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const loadingOverlay = document.getElementById('loading-overlay');
const instructions = document.getElementById('instructions');
const desktopInstructions = document.getElementById('desktop-instructions');
const mobileInstructions = document.getElementById('mobile-instructions');

// Three.js Variables
let scene, camera, renderer, controls, currentModel;

// Initialize Three.js
function initThreeJS() {
    // Create scene
    scene = new THREE.Scene();
    
    // Create camera
    const container = document.getElementById('model-container');
    camera = new THREE.PerspectiveCamera(45, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    camera.position.set(0, 0, 5);
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance"  });
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.shadowMap.enabled = true;
    renderer.outputEncoding = THREE.sRGBEncoding; // Add this for better color
    renderer.toneMapping = THREE.ACESFilmicToneMapping; // Add this
    renderer.toneMappingExposure = 1.0; 
    container.appendChild(renderer.domElement);

    createGradientBackground();
    
        // Add lights
    const ambientLight1 = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight1);

    const ambientLight2 = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight2);

    const spotLight = new THREE.SpotLight(0xffffff, 0); // Spotlight intensity 0
    spotLight.position.set(5, 10, 7);
    scene.add(spotLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.8);
    fillLight.position.set(-5, 14, 5);
    scene.add(fillLight);

    // Add rim light for better definition
    const rimLight = new THREE.DirectionalLight(0xffffff, 1.0);
    rimLight.position.set(0, 5, -5);
    scene.add(rimLight);
    
    // Add orbit controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.enableZoom = true;
    controls.enablePan = false;
    
    // Load initial model
    loadCurrentProduct();
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = container.offsetWidth / container.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.offsetWidth, container.offsetHeight);
    });

    // Show appropriate instructions
    if ('ontouchstart' in window || navigator.maxTouchPoints) {
        mobileInstructions.style.display = 'inline';
    } else {
        desktopInstructions.style.display = 'inline';
    }
}

// Create gradient background
function createGradientBackground() {
    // Create a large sphere for the background
    const geometry = new THREE.SphereGeometry(50, 32, 32);
    
    // Create gradient material with colors that complement black and gold
    const vertexShader = `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;
    
    const fragmentShader = `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        varying vec2 vUv;
        
        void main() {
            // Create a smooth gradient from top to bottom
            float factor = smoothstep(0.0, 1.0, vUv.y);
            vec3 color = mix(bottomColor, topColor, factor);
            
            // Add subtle noise for texture
            float noise = fract(sin(dot(vUv, vec2(12.9898, 78.233))) * 43758.5453) * 0.02;
            color += noise;
            
            gl_FragColor = vec4(color, 1.0);
        }
    `;
    
    // Colors that complement black and gold:
    // Deep Purple to Dark Blue (Royal and luxurious)
    const topColor = new THREE.Color(0xffffff);    // Deep Purple
    const bottomColor = new THREE.Color(0x221d18); // Darker Purple
    
    const uniforms = {
        topColor: { value: topColor },
        bottomColor: { value: bottomColor }
    };
    
    const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        side: THREE.BackSide
    });
    
    const background = new THREE.Mesh(geometry, material);
    scene.add(background);
}


// Load current product model
function loadCurrentProduct() {
    loadingOverlay.style.display = 'flex';
    
    // Remove current model if exists
    if (currentModel) {
        scene.remove(currentModel);
    }
    
    // Reset controls
    controls.reset();
    
    const product = currentProducts[currentProductIndex];
    
    // Load the model
    const loader = new THREE.GLTFLoader();
    loader.load(
        product.model,
        (gltf) => {
            currentModel = gltf.scene;
            scene.add(currentModel);

            // ADD THIS SECTION TO FIX MATERIALS
            currentModel.traverse((child) => {
                if (child.isMesh) {
                    // Ensure materials are properly configured
                    if (child.material) {
                        child.material.needsUpdate = true;
                        // Increase material brightness if needed
                        if (child.material.emissive) {
                            child.material.emissive.multiplyScalar(1.2);
                        }
                    }
                }
            });
            
            // Set initial rotation
            currentModel.rotation.x = Math.PI * 2; // 45 degrees
            currentModel.rotation.y = (Math.PI * 2)-(Math.PI / 4);
            currentModel.rotation.z = 0;
            
            // Calculate bounding box to position model correctly
            const box = new THREE.Box3().setFromObject(currentModel);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            
            // Adjust model scale and position based on category
            let scale, yPosition;
            if (currentCategory === 'fuels') {
                scale = 1.8;
                yPosition = -1;
                zPosition = -0.8;
            } else {
                scale = 1.5;
                yPosition = -1;
            }
            
            currentModel.scale.set(scale, scale, scale);
            currentModel.position.y = yPosition;
            
            // Position camera based on model size
            const maxDim = Math.max(size.x, size.y, size.z);
            const fov = camera.fov * (Math.PI / 180);
            let cameraZ = Math.abs(maxDim / Math.sin(fov / 2)) * 0.8;
            
            // Adjust for different models
            if (currentCategory === 'fuels') {
                cameraZ *= 1;
            }
            
            camera.position.z = cameraZ;
            camera.lookAt(center);
            
            // Set controls target
            controls.target.set(center.x, center.y + yPosition, center.z);
            controls.update();
            
            loadingOverlay.style.display = 'none';
        },
        (xhr) => {
            // Loading progress
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        (error) => {
            console.error('Error loading model:', error);
            loadingOverlay.innerHTML = 'Error loading 3D model. Using placeholder.';
            // Create a placeholder cube if model fails to load
            const geometry = new THREE.BoxGeometry(2, 1, 1);
            const material = new THREE.MeshStandardMaterial({ color: 0x3498db });
            currentModel = new THREE.Mesh(geometry, material);
            scene.add(currentModel);
            loadingOverlay.style.display = 'none';
        }
    );
    
    // Update product details
    updateProductDetails();
}

// Update product details in the UI
function updateProductDetails() {
    const product = currentProducts[currentProductIndex];
    
    productTitle.textContent = product.name;
    productPrice.textContent = product.price;
    productDescription.textContent = product.description;
    
    // Update specs
    specsContent.innerHTML = '';
    product.specs.forEach(spec => {
        const specItem = document.createElement('div');
        specItem.className = 'spec-item';
        specItem.innerHTML = `
            <span class="spec-name">${spec.name}</span>
            <span class="spec-value">${spec.value}</span>
        `;
        specsContent.appendChild(specItem);
    });
    
    // Show/hide color selector based on category
    if (currentCategory === 'cars' && product.colors) {
        colorSelector.style.display = 'block';
        
        // Update color options
        const colorOptionsContainer = colorSelector.querySelector('.color-options');
        colorOptionsContainer.innerHTML = '';
        
        product.colors.forEach((color, index) => {
            const colorOption = document.createElement('div');
            colorOption.className = `color-option ${index === 0 ? 'active' : ''}`;
            colorOption.style.backgroundColor = color;
            colorOption.setAttribute('data-color', color);
            colorOption.addEventListener('click', () => {
                document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('active'));
                colorOption.classList.add('active');
                // In a real implementation, this would change the model color
            });
            colorOptionsContainer.appendChild(colorOption);
        });
    } else {
        colorSelector.style.display = 'none';
    }
    
    // Update model counter
    currentModelSpan.textContent = currentProductIndex + 1;
    totalModelsSpan.textContent = currentProducts.length;
}

// Event Listeners
categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        // Update current category
        currentCategory = button.getAttribute('data-category');
        currentProducts = products[currentCategory];
        currentProductIndex = 0;
        
        // Load the first product in the category
        loadCurrentProduct();
    });
});

prevBtn.addEventListener('click', () => {
    currentProductIndex = (currentProductIndex - 1 + currentProducts.length) % currentProducts.length;
    loadCurrentProduct();
});

nextBtn.addEventListener('click', () => {
    currentProductIndex = (currentProductIndex + 1) % currentProducts.length;
    loadCurrentProduct();
});

// Initialize Three.js when the page loads
window.addEventListener('load', initThreeJS);