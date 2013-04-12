attribute vec3 appVertPos;
attribute vec3 appVertCol;
attribute vec2 appTexCoord;

uniform mat4 modelViewMatrix;
uniform bool useTexture;

varying vec3 vertCol;
varying vec2 texCoord;

void main(void) {
    if (useTexture)
        texCoord = appTexCoord;
    else 
        vertCol = appVertCol;
    gl_Position = modelViewMatrix * vec4(appVertPos, 1.0);
}
