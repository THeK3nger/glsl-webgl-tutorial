let camera, scene, renderer;
let dodecahedron;

function init() {
    container = document.createElement('div');
    document.body.appendChild(container);

    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.z = 20;
    cameraTarget = new THREE.Vector3(0, 0, 0);

    loadModel();

    scene.add(new THREE.AmbientLight(0x111111));
    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.825);
    directionalLight.position.x = 0.5;
    directionalLight.position.y = 0.5;
    directionalLight.position.z = 0.5;
    directionalLight.position.normalize();
    scene.add(directionalLight);

    window.addEventListener('resize', onWindowResize, false);
}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function loadModel() {
    var loader = new THREE.STLLoader();
    loader.load('../assets/stellated.stl', function (geometry) {
        setupAttributes(geometry);
        //var material = new THREE.MeshLambertMaterial({ color: 0xdddddd, shading: THREE.FlatShading });
        var material = new THREE.MeshPhongMaterial({ color: 0xff5533, specular: 0x111111, shininess: 200 });
        var mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(0.0, 0.0, 0.0);
        dodecahedron = mesh;
        scene.add(dodecahedron);
        console.log("Dodecahedron Loaded");
    });
}

function render() {
    var timer = Date.now() * 0.0005;
    if (dodecahedron) {
        dodecahedron.rotation.x += 0.005;
        dodecahedron.rotation.y += 0.02;
    }
    //camera.position.x = Math.cos(timer) * 3;
    //camera.position.z = Math.sin(timer) * 3;
    camera.lookAt(cameraTarget);
    renderer.render(scene, camera);
    renderer.setClearColor(0x000000, 1);
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function setupAttributes(geometry) {
    // TODO: Bring back quads
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

init();
animate();