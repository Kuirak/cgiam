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

var ShaderProgram = function(gl){
    this.gl = gl;
    this.shaderProgramID = gl.createProgram();
    this.programReady = false;
    this.isEnabled = false;
    this.shaderList = new Array();
    //
    // check for Error and display error code
    this.checkOpenGLError = function(){
        var err = this.gl.getError();
        if (err != this.gl.NO_ERROR){
            alert("GLERROR: " + err);
        }
    };
    //
    // Disable and remove all shader programs
    this.reset = function(){
        while (this.shaderList.length > 0){
            var shaderID = this.shaderList.pop();
            this.gl.detachShader(this.shaderProgramID, shaderID);
            this.gl.deleteShader(shaderID);
        }
        this.gl.deleteProgram(this.shaderProgramID);
        this.checkOpenGLError();
        this.shaderProgramID = this.glCreateProgram();
        this.checkOpenGLError();
        this.programReady = false;
    };
    //
    // add a shader program passed as string
    this.addShaderFromString = function(shaderType, sourceString){
        var shaderHandle = this.gl.createShader(shaderType);
        this.gl.shaderSource(shaderHandle, sourceString);
        this.gl.compileShader(shaderHandle);
        var success = this.gl.getShaderParameter(shaderHandle,
            gl.COMPILE_STATUS);
        if (!success){
            alert("Shader error:\n" + this.gl.getShaderInfoLog(shaderHandle));
            return false;
        } 
        this.gl.attachShader(this.shaderProgramID, shaderHandle);
        this.checkOpenGLError();
        this.shaderList.push(shaderHandle);
        return true;
    };
    //
    // add a shader from a shader source file
    // Source: http://www.khronos.org/message_boards/viewtopic.php?t=3532
    this.addShader = function(shaderType, fileName){
        var req = new XMLHttpRequest();
        req.open("GET", fileName, false);
        req.send(null);
        if (req.status == 400){
            alert("Could not find shader source file\n" + fileName);
            alert(req.responseText);
            return false;
        }
        var sourceString = req.responseText;
        this.addShaderFromString(shaderType, sourceString);
        return true;
    };
    //
    // Link compiled shader programs.
    this.linkShaders = function(){
        this.gl.linkProgram(this.shaderProgramID);
        this.checkOpenGLError();
        success = this.gl.getProgramParameter(this.shaderProgramID,
            gl.LINK_STATUS);
        if (!success){
            alert("Shader link error " + success);
            return false;
       } else {
            this.programReady = true;
       }
       return true;
    };
    //
    // Activate shader program
    this.enable = function(){
        if (this.programReady){
            this.gl.useProgram(this.shaderProgramID);
            this.isEnabled = true;
            this.checkOpenGLError();
        } else {
            alert("Shaders not compiled/linked properly, enable() failed");
        }
    };
    //
    // De-activate shader programs
    this.disable = function(){
        this.gl.useProgram(0);
        this.isEnabled = False;
        this.checkOpenGLError();
    };
    //
    // Find the index of a uniform variable
    this.indexOfUniformVariable = function(variableName){
        if (!this.programReady){
            alert("Shaders not compiled/linked properly");
            return -1;
        } else {
            result = this.gl.getUniformLocation(this.shaderProgramID,
                    variableName);
            this.checkOpenGLError();
            return result;
        }
    };
    //
    // Find the index of an attribute variable
    this.indexOfVertexAttribute = function(attributeName){
        if (!this.programReady){
            alert("Shaders not compiled/linked properly");
            return -1;
        } else {
            result = this.gl.getAttribLocation(this.shaderProgramID,
                    attributeName);
            this.checkOpenGLError();
            return result;
        }
    };
    //
    // Set program parameter
    this.programParameter = function(id, val){
        if (!this.programReady){
            alert("Shaders not compiled/linked properly");
            return -1;
        } else {
            result = this.gl.getProgrami(this.shaderProgramID, id, val);
            this.checkOpenGLError();
            return result;
        }
    };
    //
    // Validate program
    this.validate = function(){
        this.gl.validateProgram(this.shaderProgramID);
        alert(this.gl.getProgramInfoLog(this.shaderProgramID));
    };
    //
    // check if program is enabled
    this.isEnabled = function(){
        return this.isEnabled;
    };
};
