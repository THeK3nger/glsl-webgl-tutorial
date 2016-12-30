varying vec2 vUv;
varying vec3 vNormal;

uniform vec4 LightPosition;
uniform vec3 Kd;
uniform vec3 Ld;

varying vec3 LightIntensity;

void main()
{
    vUv = uv; 
    vNormal = normal;

    vec3 tnorm = normalize( normalMatrix * vNormal);
    vec4 eyeCoords = modelViewMatrix * vec4( position, 1.0 );
    vec3 s = normalize(vec3(LightPosition - eyeCoords));
    LightIntensity = Ld * Kd * max( dot( s, tnorm ), 0.0 );

    gl_Position = projectionMatrix * eyeCoords;
}
