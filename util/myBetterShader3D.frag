// http://www.altdevblogaday.com/2011/12/19/microfacet-brdf/

precision mediump float;

uniform float shininess;
uniform mat3  materialMatrix;
uniform vec3  lightPosition;


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


    //quadratic falloff  of light
    float attenuation = 1.0/ (d *d);

    // normalized direction form vertex to light
    l = normalize(l);

    //normalized direction form vertex to camera
    vec3 v = normalize(-position);

    //halfVector between camera and light
    // h = theoretical normal for mirror reflection
    vec3 h = normalize(v+l);



    //|l|=1 , |n|=1 ==> dot(l,n) = cos between l,n
    // cos of angle between lightDir and normal
    float lDotn = max(0.0, dot(l, n));

    //cos of angle between reflectedlightDir and  viewDir
    float nDoth = max(0.0, dot(n, h));


    float PI = 3.1415;
   // float temp = pow(1.0-clamp(dot(v,h),0,1),5);
   // vec3 fresnel = materialMatrix[2] + (vec3(1.0,1.0,1.0)-materialMatrix[2])*temp ;


    // specular Color * (cos between reflected and viewDir) ^ shininess * signldotn
    // signldotn > 0 if light above surface ( lightDir and normal point in same general direction)
    // signldotn = 0 if light parallel to surface
    // signldotn < 0 if light below surface
    // shininess defines sharpness of highlight, makes  cosinus bubbel narrower
    vec3 specular =  materialMatrix[2] * pow(nDoth, shininess) * sign(lDotn);

    // lambert diffuse = diffuse color * cos between lightDir and normal
    vec3 diffuse = materialMatrix[1] * lDotn * 1.0/PI;

    //ambient color
    //vec3 ambient = materialMatrix[0];
    vec3 diffuseAmbient = materialMatrix[1]/PI * materialMatrix[0] * PI;
    vec3 specularAmbient= materialMatrix[2]/PI * materialMatrix[0] * PI;
    vec3 ambient = diffuseAmbient +specularAmbient;


    // combine ambient with distance attenuated  diffuse and specular
    float lightPower =100.0;
    vec3 color = ambient + (diffuse + specular) * attenuation*lightPower;


    gl_FragColor = vec4(color, 1.0);
    //gl_FragColor = vec4(n, 1.0);
    //gl_FragColor = vec4(position, 1.0);
    //gl_FragColor = vec4(l, 1.0);
    //gl_FragColor = vec4(diffuse, 1.0);
    //gl_FragColor = vec4(specular, 1.0);
    //gl_FragColor = vec4(rDotv,rDotv,rDotv, 1.0);
}
