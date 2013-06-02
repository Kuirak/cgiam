
uniform mat4  modelViewMatrix;
uniform mat3  normalMatrix;
uniform mat4  projectionMatrix;
uniform float shininess;
uniform mat3  materialMatrix;
uniform vec3  lightPosition;
uniform vec3  attenuationCoefficients;

attribute vec3 appVertPos;
attribute vec3 appVertNormal;

//output pro vertex
varying vec3 position;
varying vec3 normal;

void main(void)
 {

    // transform vertex to viewspace
    vec4 hposition = modelViewMatrix * vec4(appVertPos, 1);

    //transform normal to viewspace
    normal = normalize((modelViewMatrix * vec4(appVertNormal,0)).xyz);

    //Note: vertex homogenous
    position = hposition.xyz / hposition.w;


    //transform vertex from viewspace to projectionspace
    gl_Position = projectionMatrix * hposition;

}