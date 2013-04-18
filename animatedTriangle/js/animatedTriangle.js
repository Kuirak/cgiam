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
var scaleStep =0.9
var scaleVector =   vec3.fromValues(1.0,1.0,0);


function doAnimationStep(){
    mat4.identity(modelViewMatrix);

    var scaleVectorLength =vec3.length(scaleVector);
    //Größen min und max begrenzung
    if(scaleVectorLength > 2){
        scaleStep = 0.9;

    } else if(scaleVectorLength<0.1){
        scaleStep=1.1;
    }
    //vec skalieren
    vec3.scale(scaleVector,scaleVector,scaleStep);
    //mat um vec skalieren
    mat4.scale(modelViewMatrix,modelViewMatrix,scaleVector);
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

}

var canvas;
var simpleScene;

function renderLoop(){
    window.requestAnimFrame(renderLoop, canvas);
    doAnimationStep();
    simpleScene.setModelViewMatrix(modelViewMatrix);
    simpleScene.draw();
}

function webGLStart() {
    canvas = document.getElementById("triang-canvas");
    simpleScene = new SimpleScene(canvas);
    initScene(simpleScene);
    renderLoop();
}
