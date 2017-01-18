/**
 * Tutorial 01 - Basic Environment Setup
 * 
 * This is the main Javasript file for the GLSL Tutorial.
 * 
 * In this lesson we will setup the basic environment for the following lessons.
 */

// Global variables are BAD. However, proper JS coding is not the goal for 
// this lesson. So, we will close an eye on this for simplicity sake.
let camera, scene, renderer;
let dodecahedron;

let uniforms = {
    time: { type: "f", value: 0 },
    resolution: { value: new THREE.Vector2() },
    LightPosition: { value: new THREE.Vector4(1.0,1.0,1.0,1.0)},
    Kd: { value: new THREE.Vector3(1.0,1.0,1.0)},
    Ld: { value: new THREE.Vector3(1.0,0.0,0.0)}
};

/**
 * An initialization function. 
 * 
 * This function initialize the WebGL canvas, the camera, the renderer and all
 * the basic models.
 */
function init() {
    THREE.Cache.enabled = false;

    // Add a new scene and renderer to the HTML <body> tag.
    container = document.createElement('div');
    document.body.appendChild(container);

    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Fixed Camera Setup
    camera = new THREE.PerspectiveCamera(15, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.z = 20;
    cameraTarget = new THREE.Vector3(0, 0, 0);

    // We load the example model.
    loadModel();

    // Add ambient and directional light.
    scene.add(new THREE.AmbientLight(0x111111));
    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.825);
    directionalLight.position.x = 0.5;
    directionalLight.position.y = 0.5;
    directionalLight.position.z = 0.5;
    directionalLight.position.normalize();
    scene.add(directionalLight);

    // Event Handler for the "resize window" event.
    window.addEventListener('resize', onWindowResize, false);
}

/**
 * The event handler for the Resize Window Event.
 */
function onWindowResize() {
    uniforms.resolution.value.x = window.innerWidth;
	uniforms.resolution.value.y = window.innerHeight;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

/**
 * Load an STL model for a Stellated Dodecahedron.
 */
function loadModel() {
    let loader = new THREE.STLLoader();
    loader.load('/assets/stellated.stl', function (geometry) {
        setupAttributes(geometry);

        ShaderLoader("./part01.vert", "./part01.frag", function (vtext, ftext) {
            console.log(vtext);
            console.log(ftext);
            let material = new THREE.ShaderMaterial({
                uniforms: uniforms,
                vertexShader: vtext,
                fragmentShader: ftext
            });

            // let material = new THREE.MeshPhongMaterial({ color: 0xff5533, specular: 0x111111, shininess: 200 });
            let mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(0.0, 0.0, 0.0);
            dodecahedron = mesh;
            scene.add(dodecahedron);
            console.log("Dodecahedron Loaded");
        });
    });
}

/**
 * This is the function called every frame for screen rendering.
 */
function render() {
    var timer = Date.now() * 0.0005;
    uniforms.time.value += 0.005;
    if (dodecahedron) {
        dodecahedron.rotation.x += 0.005;
        dodecahedron.rotation.y += 0.02;
    }
    camera.lookAt(cameraTarget);
    renderer.render(scene, camera);
    renderer.setClearColor(0x000000, 1);
}

/**
 * Initialize the rendering loop.
 */
function animate() {
    requestAnimationFrame(animate);
    render();
}

/**
 * SIDE EFFECTS. Auxiliary function for recomputing geometry center.
 */
function setupAttributes(geometry) {
    var vectors = [
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, 0, 1)
    ];
    var position = geometry.attributes.position;
    var centers = new Float32Array(position.count * 3);
    for (var i = 0, l = position.count; i < l; i++) {
        vectors[i % 3].toArray(centers, i * 3);
    }
    geometry.addAttribute('center', new THREE.BufferAttribute(centers, 3));
}

// INITIALIZE AND RUN
window.onload = function () {
    init();
    animate();
};
