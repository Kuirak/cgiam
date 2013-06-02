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

    //transform vertex to viewspace
    vec4 ecVertex = modelViewMatrix * vec4(appVertPos, 1);

     // y no use modelViewmatrix?
     //transform normal to viewspace
    vec3 n = normalize(normalMatrix * appVertNormal);

    //Calcuate vec form vertex to light
    vec3 l = lightPosition - ecVertex.xyz;

    //distance between vertex and light
    float d = length(l);


    //strange attenuation
    // y no use 1/(d*d)
    float attenuation = 1.0 / (attenuationCoefficients[0] + 
            d * attenuationCoefficients[1] +
            d * d * attenuationCoefficients[2]);

    // normalized direction form vertex to light
    l = normalize(l);

    //calculate reflection direction
    vec3 r = reflect(-l, n);

    //normalized direction form vertex to camera
    vec3 v = normalize(-ecVertex.xyz);

    //ambient color
    vec3 ambient = materialMatrix[0];


    //|l|=1 , |n|=1 ==> dot(l,n) = cos between l,n
    // cos of angle between lightDir and normal
    float lDotn = max(0.0, dot(l, n));

    //cos of angle between reflectedlightDir and  viewDir
    float rDotv = max(0.0, dot(r, v));

    // specular Color * (cos between reflected and viewDir) ^ shininess * signldotn
    // signldotn > 0 if light above surface ( lightDir and normal point in same general direction)
    // signldotn = 0 if light parallel to surface
    // signldotn < 0 if light below surface
    // shininess defines sharpness of highlight
    vec3 specular =  materialMatrix[2] * pow(rDotv, shininess) * sign(lDotn);

    // lambert diffuse = diffuse color * cos between lightDir and normal
    vec3 diffuse = materialMatrix[1] * lDotn;

    // combine ambient with distance attenuated  diffuse and specular
    vertColor = ambient + (diffuse + specular) * attenuation;

    //transform vertex from viewspace to projectionspace
    gl_Position = projectionMatrix * ecVertex;
}
