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


var modelViewMatrix = mat4.create();
var translateMatrix = mat4.create();
var rotationMatrix = mat4.create();

var canvas;
var simpleScene;
var oldPosX, oldPosY, g_drawInterval, isLeftMouseDown, isRightMouseDown;

function mouseDown(mouseEvent){
    // alert('button:' + mouseEvent.button);
    if(mouseEvent.button ===2 && !isLeftMouseDown){
        isRightMouseDown=true;
    } else if(!isRightMouseDown){
        isLeftMouseDown = true;
    }

    g_drawInterval = setInterval(redraw, 1/1000);
}

function mouseUp(mouseEvent){
    if(mouseEvent.button ===2 && !isLeftMouseDown){
        isRightMouseDown=false;
    } else if(!isRightMouseDown){
        isLeftMouseDown = false;
    }
    clearInterval(g_drawInterval);
}

var rotationFactor = 0.01;
var motionFactor = 0.005;
function mouseMove(mouseEvent){
    if (isRightMouseDown){
        var deltaX = mouseEvent.clientX - oldPosX;
        var deltaY = mouseEvent.clientY - oldPosY;

        mat4.translate(translateMatrix, translateMatrix,
            [deltaX*motionFactor, -deltaY *motionFactor, 0]);



    }else if(isLeftMouseDown){
        var deltaX = mouseEvent.clientX - oldPosX;
        var deltaY = mouseEvent.clientY - oldPosY;
        var rotation;
        if(mouseEvent.clientX > canvas.width /2){
            rotation =(deltaY)*-rotationFactor;
        } else{
            rotation= (deltaY)*rotationFactor;
        }
        mat4.rotateZ(rotationMatrix,rotationMatrix,rotation);

    }
    oldPosX = mouseEvent.clientX;
    oldPosY = mouseEvent.clientY;

}

function keyDown(keyEvent){
    switch(keyEvent.keyCode){
        case 37: // links-Pfeil
            mat4.translate(modelViewMatrix, modelViewMatrix,
                [-motionFactor, 0, 0]);
            break;
        case 38: // hoch-Pfeil
            mat4.translate(modelViewMatrix, modelViewMatrix,
                [0, motionFactor, 0]);
            break;
        case 39: // rechts-Pfeil
            mat4.translate(modelViewMatrix, modelViewMatrix,
                [motionFactor, 0, 0]);
            break;
        case 40: // runter-Pfeil
            mat4.translate(modelViewMatrix, modelViewMatrix,
                [0, -motionFactor, 0]);
            break;
        case 82: // r
            mat4.identity(modelViewMatrix);
            break;
        default:
            break;
    }
    redraw();
}

function redraw(){
    mat4.multiply(modelViewMatrix,translateMatrix,rotationMatrix);
    simpleScene.setModelViewMatrix(modelViewMatrix);
    simpleScene.draw();

}

function doReset(){
    mat4.identity(modelViewMatrix);
    mat4.identity(translateMatrix);
    mat4.identity(rotationMatrix);

    redraw();
}

function initInteraction(canvas) {
    // for right mouse button interaction use it might be
    // neccessary to use document instead of canvas
    canvas.onmousedown = mouseDown;
    canvas.onmouseup = mouseUp;
    canvas.onmousemove = mouseMove;
    document.addEventListener("keydown", keyDown, false);
}


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
    mat4.identity(modelViewMatrix);
    scene.setModelViewMatrix(modelViewMatrix);
}





function webGLStart() {
    canvas = document.getElementById("initials-canvas");
    simpleScene = new SimpleScene2D(canvas);
    initScene(simpleScene);
    initInteraction(canvas);
    simpleScene.draw();

}
