precision mediump float;

varying vec2 textureCoordinate;
uniform sampler2D appTexMapper;
uniform float time;
uniform vec2 textureMin, textureMax;

void main(void) {
    vec2 s = (textureCoordinate - textureMin) / (textureMax - textureMin) - 0.5;
    float r = length(s);
    float rotAngle = 6.0 * 3.1415926 * time * r;
    float sinAngle = sin(rotAngle);
    float cosAngle = cos(rotAngle);
    vec2 st; 
    st.x = s.x * cosAngle - s.y * sinAngle;
    st.y = s.x * sinAngle + s.y * cosAngle;
    vec2 rotatedTextureCoordinate = 
        (st + 0.5) * (textureMax - textureMin) + textureMin;
    gl_FragColor = texture2D(appTexMapper, rotatedTextureCoordinate);
}
