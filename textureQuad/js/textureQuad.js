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

function initScene(scene) {
    //
    // vertices
    var vertices = [
        -0.5,  0.3, 0,
        -0.5, -0.3, 0,
         0.5, -0.3, 0,
         0.5,  0.3, 0];
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
    // texture
    scene.setTexture("textures/openGL.png");
}

function webGLStart() {
    var canvas = document.getElementById("quad-canvas");
    simpleScene = new SimpleScene(canvas);
    initScene(simpleScene);
    //
    // draw only if texture image is loaded
    if(simpleScene.useTexture)
        simpleScene.draw();
}
