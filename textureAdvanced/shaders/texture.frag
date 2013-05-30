precision mediump float;

varying vec2 textureCoordinate;
uniform sampler2D textureMapper;

void main(void) {
    gl_FragColor = texture2D(textureMapper, textureCoordinate); 
}
