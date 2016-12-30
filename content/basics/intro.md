+++
date = "2016-12-30T12:07:28+01:00"
toc = true
next = "/basics/environment"
prev = ""
weight = 5
title = "Why Shaders"

+++

_Some kind of intro_

## But first, let's answer some questions!

### Why do I need to learn a shading language?

Because it is fun. Seriously. Look at some repository of shading examples like [ShaderToy][1]. Look at how many cool things can be done using **only** a shader script. I personally started to be interested in shaders when I found that many of the things I was struggling to implement efficiently "on the CPU", could be solved elegantly with a shader. Water animation? Particle emitters? Grass waving? A Mandelbrot Fractal visualizer? You solve any one of this problem in less than 20 lines of code in a shading script.

I think that mastering shaders and GPU programming are one of the most important skills that a developer interested in computer graphic can learn today!

### Why GLSL?

There is no a single shading language. Every graphical API or Game Engine has its own shading language. _Direct3D_ uses _HLSL_ (_High-Level Shading Language_), Unity uses its own language that can be compiled to a lower level language depending on the backend (DirectX or OpenGL). GLSL, instead, is the default shading langue for _OpenGL_.

I chose GLSL for a single big reason: it is used in **WebGL**. Because we will use WebGL for this tutorial series, GLSL will follow. WebGL is an awesome tool for this kind of tutorials for several reasons.

 1. You can start coding in WebGL right in your browser. No linking problems, no compilers required, you have all you need right in your browser.
 2. There are several interactive shader playgrounds on the web on which you can try something on the fly ([ShaderToy][1] is one of them, but also [PixelShaders][2] or [Shdr][3]). Because they are online, they use WebGL and, therefore, GLSL.

In any case, you can use GLSL in many places and all the concept you will learn are straightforwardly transferred to any other shading language.

### What about Vulkan? GLSL will still be used in the future?

**Vulkan is the next OpenGL evolution.** Asking yourself if GLSL will still be used when the successors of OpenGL will become mainstream, is a perfectly legitimate question. Short answer: **yes**.

Long answer. Vulkan will drop the approach used by OpenGL. OpenGL, in fact, requires each display driver to contain a full compiler for GLSL. GLSL shaders are then compiled "on the fly" by the graphic drivers. This obviously increases the complexity of the drivers and it is bug-prone. Vulkan, instead, uses the Direct3D approach: shaders programs are compiled once by the developers in an intermediate bytecode  called **SPIR-V**. At this point, graphic drivers only need to process this simpler bytecode (from the machine point of view).

In conclusion,  Vulkan will not digest directly GLSL, but you can still compile GLSL into SPIR-V bytecode and pass it to the Vulkan API (as an extra, you can compile to SPIR-V **any** shader language you like).

[1]: https://www.shadertoy.com/
[2]: http://pixelshaders.com/editor/
[3]: http://shdr.bkcore.com/