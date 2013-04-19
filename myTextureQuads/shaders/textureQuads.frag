precision mediump float;

varying vec2 textureCoordinate;
uniform sampler2D appTexMapper;
uniform float time;
uniform vec2 textureMin, textureMax;


void main(void) {
    vec2 grid =vec2(10.0,10.0);
    vec2 textureSize = textureMax - textureMin;
    //normalize    0--> 1
    vec2 normalizedUV =(textureCoordinate -textureMin) *1.0/textureSize;
    //expand 0--> 10
    vec2 gridUV= normalizedUV *grid;

    vec2 uvCell = floor(gridUV);  // 1, 2 ,3 ,4 ,5 ,6 ,7 ,8 ,9  cells
    vec2 uvInCell =  fract(gridUV); // 0 --> 1 in cell

   //uvInCell = uvInCell*2.0*time;

   uvInCell.x =( uvInCell.x-0.5)*time;

    gridUV = uvInCell + uvCell;
    normalizedUV = gridUV / grid;


    //back to source
    vec2 finalTextureCoordinate = (normalizedUV *textureSize) +textureMin;
    gl_FragColor = texture2D(appTexMapper, finalTextureCoordinate);
}
