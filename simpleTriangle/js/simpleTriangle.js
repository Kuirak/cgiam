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
    // modelViewMatrix
    var modelViewMatrix = mat4.create();

    mat4.rotateZ(modelViewMatrix,modelViewMatrix,0.5);
    var vector3 = vec3.create();

    vec3.set(vector3,0.7,0.2,0);
    mat4.translate(modelViewMatrix,modelViewMatrix,vector3);
    scene.setModelViewMatrix(modelViewMatrix);
}

function webGLStart() {
    var canvas = document.getElementById("triang-canvas");
    simpleScene = new SimpleScene2D(canvas);
    initScene(simpleScene);
    simpleScene.draw();
}
