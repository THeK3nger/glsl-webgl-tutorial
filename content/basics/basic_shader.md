+++
title = "A Very First Shader"
date = "2017-01-18T11:55:43+01:00"
toc = true
next = ""
prev = "/basics/environmen"
weight = 7

+++

We are now ready to write our first shader. We start with a very simple challenge: write a shader to light up our spinning stellated dodecahedron with basic single light. No materials involved. No specularity. No refraction. No fancy effect. It is a simple task but it will illustrate many important aspects of shader forging.

## What is a Shader

First questions first. To understand how to write a shader program, we need first to understant **what** is a shader program. In modern times, shaders are used to complete a huge variety of tasks, from simple lightning, to special effects, to post-processing, to small animations. But let's take a small step back and let's focus on the basics.

In its basic form, a shader is _a program computed by the GPU to decide the **color** for every element of an object surface_. You can imagine yourself drawing a cube. At some point you would like to color the cube, but how?First, you can imagine a light source to darken the faces in shadow and keep white the faces directly exposed to the light. You can imagine the cube to be red and the light to be another color creating particular tints. You can imagine that the cube surface is rugged and scratched and therefore draw the shadows in all the scratches. Or you can imagine the cube to be so clean that it reflects the images all its surrounding.

This process of taking into account the environment light, the material properties, the other objects in the scene and so on, in order to decide the color and the final aspect of the objects in your drawing is exactly what a shader program does inside your GPU.

### Vertex and Fragmen Shaders 

Modern graphic pipelines use shader for many things and in recent years many kind of shaders have been added to the developer toolkit. However, for now, we limit ourselves to basic WebGL and basic shader. The main shader programs are the **vertex** and **fragment** shaders. 

* The **Vertex Shader** is the most common 3d Shader. It manipulates the properties of the **vertices** for the 3D models in the 3D scene. Let's came back to the cube. A cube is composed by 8 vetices (in reality, 3D cubes can be composed by more overlapping vertices, but ignore this problem for now). When we render a cube, first thing is to apply the *vertex shader* to each vertex. This shader can decide the final position of the vertex, but also its properties such as normals, color and every other property we decide to attach to it.
* Between Vertex and **Fragmen Shader**, the GPU has clipped, projected on the image plane and partially rendered the 3D model. For this reason, the Fragment Shader works on the 2D representation of the original 3D object. Its duty is to decide the color of every single pixel (_fragment_) on the screen corresponding to that object. To do that, it takes the output of the Vertex Shader and some other user defined data and returns a color.

You may be wondering, "4 vertices of a square can correspond to thousands of pixels in the final image, how can the 4 outputs of the vertex shaders becomes thousands of different inputs for the fragment shader?" This is a good question. But I will not answer for now. In the meantime, just imagine that the input for each fragment of a polygon is just an _interpolation_ between the values of the vertices. We will look into that in more details later.

## A Basic Diffuse Lightning with a Single Point Light Shader

### Understanding the Problem

It is time to work. Whenever we want to develop a new shader, the first step is to try to understand what we are trying to represent and how things works in real life. In this case, we want to illuminate an object using only a single **point light**. To model this effect, we start with a very simple model. Imagine a piece of paper floating mid-air in a room with a single light. The question we have to ask ourselves to write a shader is "_how the properties of the objects affect the color of the object in a specific point?_" In our example, how the properties of the light (position and color are the only two properties here) affects the color of the piece of paper point by point? 

You can do a mental experiment (or, in this simple case, a real experiment). Pick point on the surface and mentally draw a line connecting that point with the light source. If the light source is directly above the chosen point, then the line will be perpendicular and the paper will be fully illuminated. If we start lowering the light, the angle between the line and the surface will became smaller and smaller up to the point the angle will be negative and the surface will be in shadow (the light is now on the other side).

From this simple experiment we can deduce that for this lightning, the brightness of a point on the surface is directly dependent on the angle between the normal of the surface in that point and the line connecting the point to the light source. If we call \\(n\\) the normal vector and \\(s\\) the vector representing the direction between the current point and the light source, then the light intensity is simply the _dot product_ between these two vectors:

$$L\_s n \cdot s$$

where \\(L\_s\\) represents the light color at the source. In the same way, we can define the base color of the surface with \\(K\_d\\). In the end, the light equation will be:

$$L\_s K\_d n \cdot s$$

## Implementation

Now we need to implement this function. The first step is to start from the **Vertex Shader**. As we said before, vertex shader works on **vertices**, therefore when you start working on the fragment shader you have ask yourself these questions:

1. What information I need from the scene?
2. Which properties I need to compute for the vertices?

The result is shown in the following example.

```GLSL
uniform vec4 LightPosition;
uniform vec3 Kd;
uniform vec3 Ld;

varying vec3 LightIntensity;

void main()
{
    vec3 tnorm = normalize( normalMatrix * normal);
    vec4 eyeCoords = modelViewMatrix * vec4( position, 1.0 );
    vec3 s = normalize(vec3(LightPosition - eyeCoords));
    LightIntensity = Ld * Kd * max( dot( s, tnorm ), 0.0 );

    gl_Position = projectionMatrix * eyeCoords;
}
```

### Varying and Uniform and Attributes

In the first line are already misterious. What is `varying` and what is `uniform`? As we said before, we can (and we must) pass vertices information to the vertex shader. In addition, vertex shader outputs must be used as inputs (and interpolated) in the fragment shader. But what are the inputs, and what are the outputs? The two keywords above are a way to specify exactly this.

* A **uniform** variable represents a value that is _uniform_ on the object an it is passed to the GPU from the application. In the example above, `LightPosition`, `Kd` and `Ld` are parameters that do not depend on the specific vertex, but are the same for all the object. Uniform variable can be passed to the vertex shader or to the fragment shader and are **read-only**.
* A **varying** variable, instead, represent the output of the vertex shader and, consequentially, the input for the fragment shader. Therefore, these variables are writable by the vertex shader and are **read-only for the fragment shader**. As we said before, when used to compute the color of a polygon point in the fragment shader, the value of these variables is the interpolation between the values computed in the vertex shader for the polygon.

There is also another kind of variable, **attributes**. This variable represent some **vertex attribute** and can be considered an input that depends on the specific vertex we are working on. Every graphic library automatically provide some attributes to the shader (in the example, `normal` is the name of a default attribute) so, for the moment, we will not worry about that.

### Vertex Code Analysis

Let's look at the code. We should now be able to understand it a bit more. In the first lines we define the input and the outputs. From the application, we want the `LightPosition` and the `Kd` and `Ld` parameters. `LightPosition` is a `vec4`, a type representing a vector with 4 components[^1], while `Kd` and `Ld` are vector with 3 components representing a color in the RGB space. Finally, we define our outputs, in this case only one: `LightIntensity`, the light intensity in the vertex.

Then, we just need to compute the `LightIntensity` vector.

1. First, we convert the vertex `normal` into **eye coordinates**. We do that by multiplying (and renormalizing) `normal` with the `normalMatrix` (a default uniform provided by Three.js).
2. Then, we compute the position of the current vertex in **eye coordinates** as well. This is done by multiplying the vertex `position` (a defalt attribute provided by Three.js) by the `modelViewMatrix` (a default uniform provided by Three.js).
3. Now, we compute the direction from the vertex to the light source. Basic geometry tell us that we can find this by subtracting vertex position (in eye coordinate)  from light source position (still in eye coordinate).
4. Finally, we compute the light intensity. Note the `max` function to avoid *negative intensity* (after all, there is nothing *darker* than no light at all).
5. **Don't forget your homework!** At the end of the vertex shader we always need to compute vertex position in **clip space**. WebGL wants that! So, let's do it (`projectionMatrix` is another default uniform provided by Three.js).

### Fragment Code Analysis

And the fragment shader? In this case just need to apply the LightIntensity. To do that, we set the color in the default variable `gl_FragColor`.

```GLSL
varying vec3 LightIntensity; // Note this. We get as input the output of the previous step.

void main( void ) {
    gl_FragColor = vec4( LightIntensity, 1.0 );
}
```

### Application Code Analysis

Cool. But how we pass our custom uniforms to the shaders? In Three.js we can do this:

```js
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
```

This is how we load the model in our application. The code is very similar to the previous one except that this time we are using our custom shader as material. This is done by the `THREE.ShaderMaterial` function. When we use this function we pass the `vertexShader` and the `fragmentShader` (obviously), but also an object containing all the uniforms. This object is like this

```js
let uniforms = {
    LightPosition: { value: new THREE.Vector4(1.0,1.0,1.0,1.0)}
    Kd: { value: new THREE.Vector3(1.0,1.0,1.0)},
    Ld: { value: new THREE.Vector3(1.0,0.0,0.0)}
};

```

You just need to use an object whose attributes are called exactly as the uniforms variables in you shader. Three.js will do the rest.

## The Result

If we did everything correctly, we should see something similar. A spinning white stellated dodecahedron under a fixed red light.

{{< shader 01 >}}

[^1]: Vectors with four components are called **homogeneous coordinates** and are common way to specify positions in a 3D environment. If you do not know why, take some time for reading some introduction to computer graphic.
