attribute vec3 aVertexPosition;
attribute vec2 aTextureCoordinate;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

varying vec2 textureCoordinate;

void main(void) {
    textureCoordinate = aTextureCoordinate;
    gl_Position = projectionMatrix * modelViewMatrix 
        * vec4(aVertexPosition, 1.0);
}
