varying vec3 LightIntensity;

void main( void ) {
    gl_FragColor = vec4( LightIntensity, 1.0 );
}