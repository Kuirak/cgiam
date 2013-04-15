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

// helper class for stereo visualisation using OpenGL
// The underlying equations and their implementation are by courtesy of 
// Paul Bourke, http://local.wasp.uwa.edu.au/~pbourke/projection/stereorender/


var StereoCamera = function(){
        this.centerPosition = vec3.create([0, 0, 10]);
        this.viewingDirection = vec3.create([0, 0, -1]);
        this.upVector = vec3.create([0, 1, 0]);
        this.near = 10;
        this.far = 20;
        this.focalLength = 5.0;
        this.whRatio = 4.0 / 3.0;
        this.aperture = 40.0;
        this.eyeSeparation = this.focalLength / 10.0;
        this.frustumLeft = mat4.create();
        this.frustumRight = mat4.create();
        this.lookAtRight = mat4.create();
        this.lookAtLeft = mat4.create();

    this.update = function(){
        var betweenTheEyes = vec3.create();

        vec3.cross(this.viewingDirection, this.upVector, betweenTheEyes);
        vec3.scale(betweenTheEyes, betweenTheEyes, this.eyeSeparation * 0.5);

        var eyePositionLeft = vec3.create();
        vec3.subtract(this.centerPosition, betweenTheEyes, eyePositionLeft);
        var centerLeft = vec3.create();
        vec3.add(eyePositionLeft, this.viewingDirection, centerLeft);
        mat4.lookAt(this.lookAtLeft, eyePositionLeft, centerLeft,
            this.upVector);

        var eyePositionRight = vec3.create();
        vec3.add(this.centerPosition, betweenTheEyes, eyePositionRight);
        var centerRight = vec3.create();
        vec3.add(eyePositionRight, this.viewingDirection, centerRight);
        mat4.lookAt(this.lookAtRight, eyePositionRight, centerRight, 
            this.upVector);

        var perpDelta = 
            this.near * Math.tan(this.aperture / 180.0 * Math.PI / 2);
        var parallaxCorrection = this.near / this.focalLength;

        mat4.frustum(this.frustumLeft, 
            - this.whRatio * perpDelta + 
                this.eyeSeparation / 2.0 * parallaxCorrection,
            this.whRatio * perpDelta + 
                this.eyeSeparation / 2.0 * parallaxCorrection,
            - perpDelta, perpDelta, this.near, this.far);

        mat4.frustum(this.frustumRight, 
            - this.whRatio * perpDelta - 
                this.eyeSeparation / 2.0 * parallaxCorrection,
            this.whRatio * perpDelta - 
                this.eyeSeparation / 2.0 * parallaxCorrection,
            - perpDelta, perpDelta, this.near, this.far);

    };
};
