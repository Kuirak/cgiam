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

var SimpleScene2D = function(canvas){
    this.canvas = canvas;
    //
    // global variables
    this.useTexture = false;
    this.nrOfTriangleIndices = 0;
    this.triangleVertexPositionBuffer = 0;
    this.triangleVertexColorBuffer = 0;
    this.triangleIndexBuffer = 0;
    this.texture = 0;
    this.textureCoordinateBuffer = 0;
    //
    // create OpenGL context
    this.gl = WebGLUtils.setupWebGL(canvas);
    this.gl.viewportWidth = canvas.width;
    this.gl.viewportHeight = canvas.height;

    //
    // create shader program
    this.shaderProgram = new ShaderProgram(this.gl);
    this.shaderProgram.addShader(this.gl.FRAGMENT_SHADER,
        "../util/defaultShader2D.frag");
    this.shaderProgram.addShader(this.gl.VERTEX_SHADER,
        "../util/defaultShader2D.vert");
    this.shaderProgram.linkShaders();
    this.shaderProgram.enable();
    this.shaderProgram.modelViewMatrix =
        this.shaderProgram.indexOfUniformVariable("modelViewMatrix");
    this.shaderProgram.useTexture =
        this.shaderProgram.indexOfUniformVariable("useTexture");
    //
    // load image
    this.loadImage = function(imageFileName, callFunc){
        image = new Image();
        arg1 = this;
        image.onload = function(){
            callFunc(arg1, image); 
        };
        image.src = imageFileName;
    };
    //
    // load texture from file and add it to the WebGL state
    this.setTexture = function(imageFileName){
        fileImage = this.loadImage(imageFileName, this.setupTexture);
    };
    //
    // set up texture
    this.setupTexture = function(obj, im){
        obj.texture = obj.gl.createTexture();
        obj.texture.image = fileImage;
        obj.texture.index = 0;
        obj.gl.activeTexture(obj.gl.TEXTURE0);
        obj.gl.bindTexture(obj.gl.TEXTURE_2D, obj.texture);
        obj.gl.pixelStorei(obj.gl.UNPACK_FLIP_Y_WEBGL, true);
        obj.gl.texImage2D(obj.gl.TEXTURE_2D, 0, 
            obj.gl.RGBA, obj.gl.RGBA, obj.gl.UNSIGNED_BYTE, im);
        obj.gl.texParameteri(obj.gl.TEXTURE_2D, 
            obj.gl.TEXTURE_MAG_FILTER, obj.gl.LINEAR);
        obj.gl.texParameteri(obj.gl.TEXTURE_2D, 
            obj.gl.TEXTURE_MIN_FILTER, obj.gl.LINEAR);
        obj.gl.bindTexture(obj.gl.TEXTURE_2D, null);
        obj.setUseTexture(true);
        obj.draw();
    };
    //
    // set up vertex buffer
    this.setVertices = function(vertices){
        this.triangleVertexPositionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, 
            this.triangleVertexPositionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices),
            this.gl.STATIC_DRAW);
        this.triangleVertexPositionBuffer.itemSize = 3;
        this.triangleVertexPositionBuffer.numItems = 
            vertices.length / this.triangleVertexPositionBuffer.itemSize;
        this.shaderProgram.vertexPositionAttribute = 
            this.shaderProgram.indexOfVertexAttribute("appVertPos");
        this.gl.enableVertexAttribArray(
            this.shaderProgram.vertexPositionAttribute);
    };
    //
    // set up vertex colors
    this.setColors = function(colors){
        this.triangleVertexColorBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER,
            this.triangleVertexColorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors),
            this.gl.STATIC_DRAW);
        this.triangleVertexColorBuffer.itemSize = 3;
        this.triangleVertexColorBuffer.numItems = 
            colors.length / this.triangleVertexColorBuffer.itemSize;
        this.shaderProgram.vertexColorAttribute = 
            this.shaderProgram.indexOfVertexAttribute("appVertCol");
        this.gl.enableVertexAttribArray(
            this.shaderProgram.vertexColorAttribute);
    };
    //
    // set up texture coordinates
    this.setTextureCoordinates = function(textureCoordinates){
        this.textureCoordinateBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureCoordinateBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, 
            new Float32Array(textureCoordinates),
            this.gl.STATIC_DRAW);
        this.textureCoordinateBuffer.itemSize = 2;
        this.textureCoordinateBuffer.numItems = 
            textureCoordinates.length / this.textureCoordinateBuffer.itemSize;
        this.shaderProgram.textureCoordinateAttribute = 
            this.shaderProgram.indexOfVertexAttribute("appTexCoord");
        this.gl.enableVertexAttribArray(
            this.shaderProgram.textureCoordinateAttribute);
    };
    //
    // set up index buffer
    this.setIndices = function(indices){
        this.triangleIndexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, 
            this.triangleIndexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, 
            new Uint16Array(indices), this.gl.STATIC_DRAW);
        this.triangleIndexBuffer.itemSize = 1;
        this.triangleIndexBuffer.numItems = indices.length;
        this.nrOfTriangleIndices = indices.length;
    };
    //
    // set model view matrix
    this.setModelViewMatrix = function(matrix){
        this.gl.uniformMatrix4fv(this.shaderProgram.modelViewMatrix, 
            false, matrix);
    };
    //
    // switch on texture usage
    this.setUseTexture = function(flag){
        this.gl.uniform1i(this.shaderProgram.useTexture, flag);
        this.useTexture = flag;
    };
    //
    // draw the scene
    this.draw = function(){
        this.setUseTexture(this.useTexture);
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, 
            this.triangleVertexPositionBuffer);
        this.gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute,
            3, this.gl.FLOAT, false, 0, 0);
        if (this.useTexture){
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER,
                this.textureCoordinateBuffer);
            this.gl.vertexAttribPointer(
                this.shaderProgram.textureCoordinateAttribute,
                2, this.gl.FLOAT, false, 0, 0);
            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
            this.gl.uniform1i(
                this.shaderProgram.indexOfUniformVariable('appTexMapper'),
               this.texture.index);
        } else {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, 
                this.triangleVertexColorBuffer);
            this.gl.vertexAttribPointer(this.shaderProgram.vertexColorAttribute,
                3, this.gl.FLOAT, false, 0, 0);
        }
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER,   
            this.triangleIndexBuffer);
        this.gl.drawElements(this.gl.TRIANGLES, this.nrOfTriangleIndices,
            this.gl.UNSIGNED_SHORT, 0);
    };
};
