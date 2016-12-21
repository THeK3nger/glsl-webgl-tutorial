varying vec2 vUv;
varying vec3 vNormal;

varying vec3 LightIntensity;

void main()
{
    vUv = uv;
    vNormal = normal;

    vec4 LightPosition = vec4(0.0,1.0,1.0,1.0);
    vec3 Kd = vec3(1.0,1.0,1.0);
    vec3 Ld = vec3(1.0,1.0,1.0);

    vec3 tnorm = normalize( normalMatrix * vNormal);
    vec4 eyeCoords = modelViewMatrix * vec4( position, 1.0 );
    vec3 s = normalize(vec3(LightPosition - eyeCoords));
    LightIntensity = Ld * Kd * max( dot( s, tnorm ), 0.0 );


    gl_Position = projectionMatrix * eyeCoords;
}
