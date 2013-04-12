/*=========================================================================

Copyright (c) 2012, Peter Roesch <Peter.Roesch@hs-augsburg.de>
All rights reserved.

This file is part of the cgiam WebGL course software.

The cgiam WebGL course software is free: you can redistribute it and/or 
modify it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

The cgiam WebGL course software is distributed in the hope that it will 
be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with the cgiam WebGL course software.  If not, see
<http://www.gnu.org/licenses/gpl.html>.
    
=========================================================================*/

function initScene(scene) {
    //
    // vertices
    var vertices = [
        -0.8, 0.5,  0.0,    //0
        -0.1, 0.5,  0.0,    //1
        -0.8, 0.3,  0.0,    //2
        -0.1, 0.3,  0.0,    //3
        -0.3, 0.3,  0.0,    //4
        -0.3, -0.3, 0.0,    //5
        -0.1, -0.3, 0.0,    //6
        -0.1, -0.4, 0.0,    //7
        -0.175, -0.525, 0.0,    //8
        -0.4, -0.4, 0.0,    //9
        -0.35, -0.6, 0.0,    //10
        -0.5, -0.4, 0.0,    //11
        -0.55, -0.6, 0.0,    //12
        -0.6, -0.3, 0.0,    //13
        -0.7, -0.5, 0.0,    //14
        -0.8, -0.3, 0.0,    //15

        0.2, 0.5, 0.0,    //16
        0.4, 0.5, 0.0,    //17
        0.2, 0.0, 0.0,    //18
        0.4, 0.0, 0.0,    //19
        0.2, -0.2, 0.0,    //20
        0.4, -0.2, 0.0,    //21
        0.2, -0.6, 0.0,    //22
        0.4, -0.6, 0.0,    //23
        0.7, -0.6, 0.0,    //24
        0.9, -0.6, 0.0,    //25
        0.55, -0.1, 0.0,    //26
        0.7, 0.5, 0.0,    //27
        0.9, 0.5, 0.0    //28

        ];
    scene.setVertices(vertices);
    //
    // colors
    var colors = [
        1, 0, 0,   //0
        1, 1, 0,   //1
        1, 1, 0,   //2
        1, 0.5, 0,   //3
        0.5, 1, 0,   //4
        1, 1, 0,   //5
        1, 0.5, 0,   //6
        1, 1, 0,   //7
        1, 1, 0,   //8
        1, 0.5, 0,   //9
        1, 1, 0,   //10
        0.5, 1, 0,   //11
        1, 0, 0,   //12
        1, 1, 0,   //13
        1, 0.5, 0,   //14
        1, 1, 0,    //15
        0.5, 1, 0,    //16
        1, 0.5, 0,    //17
        1, 1, 0.5,    //18
        1, 1, 0,    //19
        0.5, 1, 0,    //20
        1, 1, 0,    //21
        1, 1, 0.5,    //22
        0.5, 1, 0,    //23
        1, 1, 0,    //24
        0.5, 1, 0,    //25
        0.5, 1, 0,    //26
        0.5, 1, 0,    //27
        0.5, 0.5, 0    //28
        ];
    scene.setColors(colors);
    //
    // indices
    var indices = [
        0,2,1,
        2,3,1,
        4,3,5,
        3,5,6,
        5,7,6,
        5,8,7,
        9,8,5,
        9,10,8,
        9,11,10,
        11,12,10,
        11,14,12,
        13,14,11,
        15,13,14,
        16,19,17,
        16,18,19,
        18,21,19,
        18,20,21,
        20,22,23,
        20,23,21,
        19,21,26,
        21,24,26,
        24,25,26,
        19,26,27,
        27,26,28

    ];
    scene.setIndices(indices);
    //scene.setIndices([ 2, 3, 1 ]);
    //
    // modelViewMatrix

    var modelViewMatrix = mat4.create();
    //mat4.identity(modelViewMatrix);

    mat4.rotateZ(modelViewMatrix,modelViewMatrix,0.5);


    scene.setModelViewMatrix(modelViewMatrix);
}

function webGLStart() {
    var canvas = document.getElementById("initials-canvas");
    simpleScene = new SimpleScene2D(canvas);

    initScene(simpleScene);
    simpleScene.draw();

}
