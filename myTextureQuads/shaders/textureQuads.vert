attribute vec3 appVertPos;
attribute vec2 appTexCoord;

varying vec2 textureCoordinate;

uniform mat4 modelViewMatrix;
uniform bool useTexture;

void main(void) {
    if (useTexture)
        textureCoordinate = appTexCoord;
    gl_Position = modelViewMatrix * vec4(appVertPos, 1.0);
}
