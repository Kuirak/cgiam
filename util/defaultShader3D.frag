precision mediump float;

varying  vec3 vertColor;

void main(void) {
    gl_FragColor = vec4(vertColor, 1.0);
}
