precision mediump float;

uniform float shininess;
uniform mat3  materialMatrix;
uniform vec3  lightPosition;
uniform vec3  attenuationCoefficients;

//input pro fragment (barycentric) interpolated vertices from GPU
varying vec3 position;
varying vec3 normal;

void main(void) {
    //interpolatednormal may not be  normalized
    vec3 n = normalize(normal);

    //Calcuate vec form vertex to light
    vec3 l = lightPosition - position;

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
    vec3 v = normalize(-position);

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
    vec3 color = ambient + (diffuse + specular) * attenuation;


    gl_FragColor = vec4(color, 1.0);
    //gl_FragColor = vec4(n, 1.0);
    //gl_FragColor = vec4(position, 1.0);
    //gl_FragColor = vec4(l, 1.0);
    //gl_FragColor = vec4(diffuse, 1.0);
    //gl_FragColor = vec4(specular, 1.0);
    //gl_FragColor = vec4(rDotv,rDotv,rDotv, 1.0);
}
