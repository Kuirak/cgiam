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

var simpleScene;
var modelViewMatrix = mat4.create();
var oldPosX, oldPosY, g_drawInterval, isMouseDown;

function mouseDown(mouseEvent){
    // alert('button:' + mouseEvent.button);
    isMouseDown = true;
    g_drawInterval = setInterval(redraw, 40);
}

function mouseUp(mouseEvent){
    isMouseDown = false;
    clearInterval(g_drawInterval);
}

var motionFactor = 0.01;
function mouseMove(mouseEvent){
    if (isMouseDown){
        deltaX = mouseEvent.clientX - oldPosX;
        deltaY = mouseEvent.clientY - oldPosY;
        mat4.translate(modelViewMatrix, modelViewMatrix,
            [deltaX * motionFactor, -deltaY * motionFactor, 0]);
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
    simpleScene.setModelViewMatrix(modelViewMatrix);
    simpleScene.draw();
}

function initInteraction(canvas) {
   // for right mouse button interaction use it might be
   // neccessary to use document instead of canvas
   canvas.onmousedown = mouseDown;
   canvas.onmouseup = mouseUp;
   canvas.onmousemove = mouseMove;
   document.addEventListener("keydown", keyDown, false);
}

function doReset(){
    mat4.identity(modelViewMatrix);
    redraw();
}

function initScene(scene) {
    //
    // vertices
    var vertices = [
        0.0,  0.5,  0.0,
        -0.5, -0.5,  0.0,
        0.5, -0.5,  0.0
        ];
    scene.setVertices(vertices);
    //
    // colors
    var colors = [
        1, 0, 0,
        0, 1, 0,
        0, 0, 1
        ];
    scene.setColors(colors);
    //
    // indices
    var indices = [ 0, 1, 2 ];
    scene.setIndices(indices);
    //
    mat4.identity(modelViewMatrix);
    scene.setModelViewMatrix(modelViewMatrix);
}

function webGLStart() {
    var canvas = document.getElementById("triang-canvas");
    simpleScene = new SimpleScene(canvas);
    initScene(simpleScene);
    initInteraction(canvas);
    simpleScene.draw();
}
