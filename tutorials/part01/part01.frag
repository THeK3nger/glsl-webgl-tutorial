uniform float time;
uniform vec2 resolution;
varying vec2 vUv;
varying vec3 LightIntensity;

void main( void ) {
    gl_FragColor = vec4( LightIntensity, 1.0 );
}