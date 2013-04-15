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

var SimpleScene = function(canvas, 
        vertexShaderFileName, fragmentShaderFileName){
    this.canvas = canvas;
    //
    // global variables
    this.useTexture = false;
    this.nrOfTriangleIndices = 0;
    this.ccR=0.0; this.ccG=0.0; this.ccB=0.0;
    //
    //tMatrix for anaglyph output
    this.tMatrix = mat4.create();
    //
    // keep Buffers undefined
    this.triangleVertexPositionBuffer;
    this.triangleVertexNormalBuffer;
    this.triangleVertexColorBuffer;
    this.triangleIndexBuffer;
    this.textureCoordinateBuffer;
    this.texture=0;
    //
    // create OpenGL context
    this.gl = WebGLUtils.setupWebGL(canvas);
    this.gl.viewportWidth = canvas.width;
    this.gl.viewportHeight = canvas.height;
    //
    // set shader file names - use default values if parameters
    // are not defined
    vertexShaderFileName = 
        vertexShaderFileName || "../util/defaultShader2D.vert";
    fragmentShaderFileName = 
        fragmentShaderFileName || "../util/defaultShader2D.frag";
    //
    // create shader program
    this.shaderProgram = new ShaderProgram(this.gl);
    this.shaderProgram.addShader(this.gl.VERTEX_SHADER,
        vertexShaderFileName);
    this.shaderProgram.addShader(this.gl.FRAGMENT_SHADER,
        fragmentShaderFileName);
    this.shaderProgram.linkShaders();
    this.shaderProgram.enable();
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
        this.gl.enableVertexAttribArray(
            this.shaderProgram.indexOfVertexAttribute("appVertPos"));
    };
    //
    // set up normals buffer
    this.setNormals = function(normals){
        this.triangleVertexNormalBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, 
            this.triangleVertexNormalBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(normals),
            this.gl.STATIC_DRAW);
        this.triangleVertexNormalBuffer.itemSize = 3;
        this.triangleVertexNormalBuffer.numItems = 
            normals.length / this.triangleVertexNormalBuffer.itemSize;
        this.gl.enableVertexAttribArray(
            this.shaderProgram.indexOfVertexAttribute("appVertNormal"));
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
        this.gl.enableVertexAttribArray(
            this.shaderProgram.indexOfVertexAttribute("appVertCol"));
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
        this.gl.enableVertexAttribArray(
            this.shaderProgram.indexOfVertexAttribute("appTexCoord"));
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
    // set model view matrix and normal matrix if required
    this.setModelViewMatrix = function(matrix){
        this.gl.uniformMatrix4fv(
            this.shaderProgram.indexOfUniformVariable("modelViewMatrix"),
            false, matrix);
        if (typeof this.triangleVertexNormalBuffer !== "undefined"){
            normalMatrix = mat3.create();
            mat3.normalFromMat4(normalMatrix, modelViewMatrix);
            this.gl.uniformMatrix3fv(
                this.shaderProgram.indexOfUniformVariable("normalMatrix"),
                false, normalMatrix);
        } 
    };
    //
    // switch on texture usage
    this.setUseTexture = function(flag){
        this.gl.uniform1i(
            this.shaderProgram.indexOfUniformVariable("useTexture"),
            flag);
        this.useTexture = flag;
    };
    //
    // get shader program
    this.getShaderProgram = function(){
        return this.shaderProgram;
    };
    //
    // get gl context
    this.getGl = function(){
        return this.gl;
    };
    //
    // set clear color
    this.setClearColor = function(r, g, b){
        this.ccR=r;
        this.ccG=g;
        this.ccB=b;
    };
    //
    // set light position
    this.setLightPosition = function(pos){
        this.gl.uniform3fv(
            this.shaderProgram.indexOfUniformVariable("lightPosition"), pos);
    };
    //
    // set material matrix
    this.setMaterialMatrix = function(matrix){
        this.gl.uniformMatrix3fv(
            this.shaderProgram.indexOfUniformVariable("materialMatrix"),
            false, matrix);
    };
    //
    // set shininess
    this.setShininess = function(s){
        this.gl.uniform1f(
          this.shaderProgram.indexOfUniformVariable("shininess"), s);
    };
    //
    // set attenunation coefficients
    this.setAttenuationCoefficients = function(coeff){
        this.gl.uniform3fv(
          this.shaderProgram.indexOfUniformVariable("attenuationCoefficients"), 
          coeff);
    };
    // 
    // set projection matrix
    this.setProjectionMatrix = function(matrix){
        this.gl.uniformMatrix4fv(
            this.shaderProgram.indexOfUniformVariable("projectionMatrix"),
            false, matrix);
    };
    //
    // render the triangles
    this.render = function(){
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, 
            this.triangleVertexPositionBuffer);
        this.gl.vertexAttribPointer(
            this.shaderProgram.indexOfVertexAttribute("appVertPos"),
            3, this.gl.FLOAT, false, 0, 0);
        this.setUseTexture(this.useTexture);
        if (this.useTexture){
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER,
                this.textureCoordinateBuffer);
            this.gl.vertexAttribPointer(
                this.shaderProgram.indexOfVertexAttribute("appTexCoord"),
                2, this.gl.FLOAT, false, 0, 0);
            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
            this.gl.uniform1i(
                this.shaderProgram.indexOfUniformVariable('appTexMapper'),
               this.texture.index);
        }
        //
        // use vertex colors if defined
        if (typeof this.triangleVertexColorBuffer !== "undefined"){
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, 
                this.triangleVertexColorBuffer);
            this.gl.vertexAttribPointer(
                this.shaderProgram.indexOfVertexAttribute("appVertCol"),
                3, this.gl.FLOAT, false, 0, 0);
        }
        //
        // use normals if defined
        if (typeof this.triangleVertexNormalBuffer !== "undefined"){
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, 
                this.triangleVertexNormalBuffer);
            this.gl.vertexAttribPointer(
                this.shaderProgram.indexOfVertexAttribute("appVertNormal"),
                3, this.gl.FLOAT, false, 0, 0);
        }
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER,   
            this.triangleIndexBuffer);
        this.gl.drawElements(this.gl.TRIANGLES, this.nrOfTriangleIndices,
            this.gl.UNSIGNED_SHORT, 0);
    };
    //
    // draw the scene
    this.draw = function(){
        this.gl.clearColor(this.ccR, this.ccG, this.ccB, 1);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.render();
    };
    //
    // draw the scene twice for anaglyph stereoscopic viewing
    this.drawAnaglyph = function(stereoCamera){
        this.gl.clearColor(this.ccR, this.ccG, this.ccB, 1);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.colorMask(false, true, false, false);
        this.setProjectionMatrix(stereoCamera.frustumLeft);
        mat4.multiply(tMatrix, stereoCamera.lookAtLeft, modelViewMatrix);
        this.setModelViewMatrix(tMatrix);
        this.render();
        this.gl.clear(this.gl.DEPTH_BUFFER_BIT);
        this.gl.colorMask(true, false, false, false);
        this.setProjectionMatrix(stereoCamera.frustumRight);
        mat4.multiply(tMatrix, stereoCamera.lookAtRight, modelViewMatrix);
        this.setModelViewMatrix(tMatrix);
        this.render();
        this.gl.colorMask(true, true, true, true);
    };
};
