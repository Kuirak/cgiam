/*=========================================================================

Copyright (c) 2013, Peter Roesch <Peter.Roesch@hs-augsburg.de>
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

var shaderProgram;
var gl;
var time = 0.0;
var timeStep = 0.01;

function initScene(scene) {
    //
    // vertices
    var vertices = [
        -0.9,  0.45, 0,
        -0.9, -0.45, 0,
         0.9, -0.45, 0,
         0.9,  0.45, 0];
    scene.setVertices(vertices);
    //
    // texture coordinates
    var textureCoordinates = [ 0, 1, 0, 0, 1, 0, 1, 1];
    scene.setTextureCoordinates(textureCoordinates);
    //
    // indices
    var indices = [ 0, 1, 2, 2, 3, 0 ];
    scene.setIndices(indices);
    //
    // modelViewMatrix
    var modelViewMatrix = mat4.create();
    mat4.identity(modelViewMatrix);
    scene.setModelViewMatrix(modelViewMatrix);
    //
    // get shaderProgram and gl context
    shaderProgram = scene.getShaderProgram();
    gl = scene.getGl();
    //
    // initialise shader program
    var textureX = [ textureCoordinates[0], textureCoordinates[2], 
        textureCoordinates[4], textureCoordinates[6] ];
    textureX.sort();
    var textureY = [ textureCoordinates[1], textureCoordinates[3], 
        textureCoordinates[5], textureCoordinates[7] ];
    textureY.sort();
    textureMin = new Float32Array([ textureX[0], textureY[0] ]);
    textureMax = new Float32Array([ textureX[3], textureY[3] ]);
    gl.uniform2fv(shaderProgram.indexOfUniformVariable("textureMin"),
        textureMin);
    gl.uniform2fv(shaderProgram.indexOfUniformVariable("textureMax"),
        textureMax);
    //
    // texture
    scene.setTexture("textures/openGL.png");
}

function doAnimationStep(){
    if (time > 1)
        timeStep *=-1;
    else 
        if (time < 0)
            timeStep *=-1;
    time += timeStep;
}

var canvas;
var simpleScene;

function renderLoop(){
    window.requestAnimFrame(renderLoop, canvas);
    gl.uniform1f(shaderProgram.indexOfUniformVariable("time"), time);
    if (simpleScene.useTexture){
        simpleScene.draw();
        doAnimationStep();
    }
}

function webGLStart() {
    canvas = document.getElementById("swirl-canvas");
    simpleScene = new SimpleScene(canvas,
        "shaders/textureQuads.vert",
        "shaders/textureQuads.frag");
    initScene(simpleScene);
    renderLoop();
}
