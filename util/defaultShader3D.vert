uniform mat4  modelViewMatrix;
uniform mat3  normalMatrix;
uniform mat4  projectionMatrix;
uniform float shininess;
uniform mat3  materialMatrix;
uniform vec3  lightPosition;
uniform vec3  attenuationCoefficients;

attribute vec3 appVertPos;
attribute vec3 appVertNormal;

varying vec3 vertColor;

void main(void) {
    vec4 ecVertex = modelViewMatrix * vec4(appVertPos, 1);
    vec3 n = normalize(normalMatrix * appVertNormal);
    vec3 l = lightPosition - ecVertex.xyz;
    float d = length(l);
    float attenuation = 1.0 / (attenuationCoefficients[0] + 
            d * attenuationCoefficients[1] +
            d * d * attenuationCoefficients[2]);
    l = normalize(l);
    vec3 r = reflect(-l, n);
    vec3 v = normalize(-ecVertex.xyz);
    vec3 ambient = materialMatrix[0];
    float lDotn = max(0.0, dot(l, n));
    float rDotv = max(0.0, dot(r, v));
    vec3 specular = 
        materialMatrix[2] * pow(rDotv, shininess) * sign(lDotn);
    vec3 diffuse = materialMatrix[1] * lDotn;
    vertColor = ambient + (diffuse + specular) * attenuation;
    gl_Position = projectionMatrix * ecVertex;
}
