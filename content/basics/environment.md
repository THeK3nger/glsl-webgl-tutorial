+++
next = "/next/path"
prev = "/basics/intro"
weight = 6
title = "Environment Setup"
date = "2016-12-30T15:53:32+01:00"
toc = true

+++

Your magic training is going to start. GLSL is the name of your magic school and you will be able soon to manipulate the flow of energy to create wonderful and colorful creations. However, before we start, as a good scholar you need to be prepared. It is time now to set up a simple development environment for our lessons!

## What you need

* An updated browser.
* A very simple web server (or, if you have Python installed, the standard HTTP package is enough).

## Setup

{{% notice warning %}}
This section is still not updated with the current environment.
{{% /notice %}}

The first thing to do is to clone the code in this repository. We will use Git. You can also download the zip copy of the repository, but I encourage you to use Git because it will be easier to  keep your personal copy of the code updated.

```bash
git clone https://github.com/THeK3nger/glsl-webgl-tutorial.git
```

At this point, you can enter in the glsl-webgl-tutorial folder. Once inside, run a simple web server in this folder. For instance, you can use Python 3.

```bash
python -m http.server
```

Open your browser and go to `127.0.0.1:8000`. If everything is OK, you should see the index of the code examples. Now move to the "Lesson 0 - Environment Setup" link. You should see a spinning Stellated Dodecahedron.

{{< shader 00 >}}

## Explore the code

In this lesson, we are just setting up a small development environment. Look in the `tutorials\part00` folder.

```js
/**
 * Tutorial 01 - Basic Environment Setup
 * 
 * This is the main JavaScript file for the GLSL Tutorial.
 * 
 * In this lesson we will setup the basic environment for the following lessons.
 */

// Global variables are BAD. However, proper JS coding is not the goal for 
// this lesson. So, we will close an eye on this for simplicity sake.
let camera, scene, renderer;
let dodecahedron;

/**
 * An initialization function. 
 * 
 * This function initialize the WebGL canvas, the camera, the renderer and all
 * the basic models.
 */
function init() {
    // Add a new scene and renderer to the HTML <body> tag.
    container = document.createElement('div');
    document.body.appendChild(container);

    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Fixed Camera Setup
    camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 2000);
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
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

/**
 * Load an STL model for a Stellated Dodecahedron.
 */
function loadModel() {
    var loader = new THREE.STLLoader();
    loader.load('../assets/stellated.stl', function (geometry) {
        setupAttributes(geometry);
        var material = new THREE.MeshPhongMaterial({ color: 0xff5533, specular: 0x111111, shininess: 200 });
        var mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(0.0, 0.0, 0.0);
        dodecahedron = mesh;
        scene.add(dodecahedron);
        console.log("Dodecahedron Loaded");
    });
}

/**
 * This is the function called every frame for screen rendering.
 */
function render() {
    var timer = Date.now() * 0.0005;
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
```

This is the basic code for most of the future examples. The goal of this tutorial is not on WebGL or THREE.js, so I will not go into details on this. The script you can see above does the following:

 * Initialize an empty WebGL canvas.
 * Load an STL model.
 * Apply to it a basic material.
 * Start a simple animation.
 * For most of our lessons, we will use the same code but, instead of the default material (`MeshPhongMaterial`), we will use a custom shader. For now, just try to make this code works and try to understand why its works. If you have any problem, please, drop me an email or ask me something on Twitter.

That's all for now! Stay tuned for the next lesson in which we will start learning about GLSL.
