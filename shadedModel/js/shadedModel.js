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

var pushBackMatrix = mat4.create();
mat4.identity(pushBackMatrix);
mat4.translate(pushBackMatrix, pushBackMatrix, [0, 0, -2]);
var modelViewMatrix = mat4.create();
var tMatrix = mat4.create();
var animationAngle = 0.0;
var angleStep = 0.01;
var canvas;
var simpleScene;
var shaderProgram;
var gl;

function doAnimationStep(){
    mat4.identity(tMatrix);
    mat4.rotate(tMatrix, tMatrix, animationAngle, [1, 1, 1]);
    mat4.multiply(modelViewMatrix, pushBackMatrix, tMatrix);
    animationAngle += angleStep;
}

function initScene(scene) {
    // 
    // use variables from model
    // 
    // vertices
    scene.setVertices(vertices);
    //
    // normals
    scene.setNormals(normals);
    //
    // indices
    scene.setIndices(indices);
    //
    // parameters for light calculations
    lightPosition = vec3.fromValues(3, 3, 3);
    attenuationCoefficients = vec3.fromValues(1.0, 0.001, 0.001);
    projectionMatrix = mat4.create();
    mat4.frustum(projectionMatrix, 
        -0.15, 0.15, -0.15, 0.15, 0.5, 5);
    shininess = 32.0;
    materialMatrix = [
        0.250000, 0.200000, 0.070000,  //a
        0.750000, 0.610000, 0.230000,  //d
        0.630000, 0.560000, 0.370000];  //s
    //
    // shader program parameters
    shaderProgram = scene.getShaderProgram();
    gl = scene.getGl();    
    gl.uniformMatrix4fv(
        shaderProgram.indexOfUniformVariable("projectionMatrix"),
        false, projectionMatrix);
    gl.uniform1f(
        shaderProgram.indexOfUniformVariable("shininess"),
        shininess);
    gl.uniformMatrix3fv(
        shaderProgram.indexOfUniformVariable("materialMatrix"),
        false, materialMatrix);
    gl.uniform3fv(
        shaderProgram.indexOfUniformVariable("lightPosition"),
        lightPosition);
    gl.uniform3fv(
        shaderProgram.indexOfUniformVariable("attenuationCoefficients"),
        attenuationCoefficients);
    // clear color
    scene.setClearColor(0.3, 0.3, 0.3);
}

function renderLoop(){
    window.requestAnimFrame(renderLoop, canvas);
    doAnimationStep();
    simpleScene.setModelViewMatrix(modelViewMatrix);
    simpleScene.draw();
}

function webGLStart() {
    canvas = document.getElementById("model-canvas");
    simpleScene = new SimpleScene(canvas,
        "../util/defaultShader3D.vert",  
        "../util/defaultShader3D.frag");
    initScene(simpleScene);
    renderLoop();
}
