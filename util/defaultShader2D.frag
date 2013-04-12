precision mediump float;

uniform bool useTexture;
uniform sampler2D appTexMapper;

varying vec3 vertCol;
varying vec2 texCoord;

void main(void) {
    if (useTexture)
        gl_FragColor = texture2D(appTexMapper, texCoord); 
    else
        gl_FragColor = vec4(vertCol, 1.0);
}
