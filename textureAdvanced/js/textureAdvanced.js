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

var gl;

function initGL(canvas) {
    gl = WebGLUtils.setupWebGL(canvas);
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
}

var shaderProgram;

function initShaders() {
    shaderProgram = new ShaderProgram(gl);
    shaderProgram.addShader(gl.FRAGMENT_SHADER, "shaders/texture.frag");
    shaderProgram.addShader(gl.VERTEX_SHADER,
        "shaders/transformTexture.vert");
    shaderProgram.linkShaders();
    shaderProgram.enable();
    shaderProgram.vertexPositionAttribute = 
        shaderProgram.indexOfVertexAttribute("aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
    shaderProgram.textureCoordinateAttribute = 
        shaderProgram.indexOfVertexAttribute("aTextureCoordinate");
    gl.enableVertexAttribArray(shaderProgram.textureCoordinateAttribute);
    shaderProgram.textureMapper = 
        shaderProgram.indexOfUniformVariable("textureMapper");
    shaderProgram.modelViewMatrix = 
        shaderProgram.indexOfUniformVariable("modelViewMatrix");
    shaderProgram.projectionMatrix = 
        shaderProgram.indexOfUniformVariable("projectionMatrix");
}

var quadVertexPositionBuffer, quadVertexColourBuffer;
var quadIndexBuffer;

function initBuffers() {
    //
    // vertex Positions
    var vertices = [
        -1, 0,   0,
         1, 0,   0,
         1, 0, -200,
        -1, 0, -200 ];
    //
    // texture coordinates
    var textureCoordinates = [ 0, 0, 1, 0, 0, 20, 1, 20];
    //
    // indices
    var indices = [ 0, 1, 2, 2, 3, 0 ];
    //
    // create buffer objects
    //
    quadVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    quadVertexPositionBuffer.itemSize = 3;
    quadVertexPositionBuffer.numItems = 4;
    //
    quadTextureCoordinateBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadTextureCoordinateBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),
        gl.STATIC_DRAW);
    quadTextureCoordinateBuffer.itemSize = 2;
    quadTextureCoordinateBuffer.numItems = 4;
    //
    // indices
    quadIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, quadIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices),
        gl.STATIC_DRAW);
    quadIndexBuffer.itemSize = 1;
    quadIndexBuffer.numItems = 6;
}

function initTexture(fileName, glTextureID, mipmaps, anisotropic){
    var localTexture = gl.createTexture();
    localTexture.index = glTextureID - gl.TEXTURE0;
    localTexture.glTextureID = glTextureID;
    localTexture.image = new Image();
    localTexture.image.onload = function()    {
        gl.activeTexture(localTexture.glTextureID);
        gl.bindTexture(gl.TEXTURE_2D, localTexture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, 
                gl.UNSIGNED_BYTE, localTexture.image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        if (mipmaps){
            // mipmaps
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                gl.LINEAR_MIPMAP_LINEAR);  
            gl.generateMipmap(gl.TEXTURE_2D); 
        } else {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }

        if (anisotropic){
            // anisotropic filtering
            var ext = gl.getExtension(
                "EXT_texture_filter_anisotropic") || gl.getExtension(
                "MOZ_EXT_texture_filter_anisotropic" ) || gl.getExtension(
                "WEBKIT_EXT_texture_filter_anisotropic");
            if (ext) {
                var max = gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
                gl.texParameterf(gl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT,
                    max);
                // alert("TEXTURE_MAX_ANISOTROPY_EXT set to " + max);
            } else { 
                alert("Anisotropic filtering not supported");
            }
        }

        gl.bindTexture(gl.TEXTURE_2D, null);
        drawScene();
    };
    localTexture.image.src = fileName; 
    return localTexture;
}

function drawWithTexture(currentTexture){

    gl.activeTexture(currentTexture.glTextureID);
    gl.bindTexture(gl.TEXTURE_2D, currentTexture);

    gl.uniform1i(shaderProgram.textureMapper, currentTexture.index);

    gl.uniformMatrix4fv(shaderProgram.modelViewMatrix, false,  modelViewMatrix);

    gl.drawElements(gl.TRIANGLES, quadIndexBuffer.numItems,
        gl.UNSIGNED_SHORT, 0);
}

var camX = -2;
var camXStep = 0.01;

function doAnimationStep(){
    if (camX > 2) 
        camXStep *= -1;
    else
        if (camX < -2)
            camXStep *= -1;
    camX += camXStep;
}

var canvas;
function renderLoop(){
    window.requestAnimFrame(renderLoop, canvas);
    doAnimationStep();
    drawScene();
}

function drawScene() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(projectionMatrix, 50, 1, 0.1, 200); 

    gl.bindBuffer(gl.ARRAY_BUFFER, quadVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
        quadVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, quadTextureCoordinateBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordinateAttribute,
        quadTextureCoordinateBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, quadIndexBuffer);

    gl.uniformMatrix4fv(shaderProgram.projectionMatrix, false,
        projectionMatrix);

    mat4.identity(modelViewMatrix);
    mat4.lookAt(modelViewMatrix, [camX, 2, 4], [0, 0.5, -8], [0, -1, 0]);

    mat4.translate(modelViewMatrix, modelViewMatrix, [-2, 0, 0]);
    drawWithTexture(myTexture);

    mat4.translate(modelViewMatrix, modelViewMatrix, [2, 0, 0]);
    drawWithTexture(myTextureMipmap);

    mat4.translate(modelViewMatrix, modelViewMatrix, [2, 0, 0]);
    drawWithTexture(myTextureMipmapAnisotropic);
}

var myTexture, myTextureMipmap, myTextureMipmapAnisotropic;
var modelViewMatrix = mat4.create();
var projectionMatrix = mat4.create();

function webGLStart() {
    canvas = document.getElementById("quad-canvas");
    initGL(canvas);
    initShaders();
    initBuffers();
    myTexture = initTexture("textures/fieldstone.jpg", 
        gl.TEXTURE0, 0, 0);
    myTextureMipmap = initTexture("textures/fieldstone.jpg", 
        gl.TEXTURE1, 1, 0);
    myTextureMipmapAnisotropic = initTexture("textures/fieldstone.jpg", 
        gl.TEXTURE2, 1, 1);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    camX = -2;
    renderLoop();
}
