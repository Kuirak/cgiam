// source: https://github.com/mrdoob/three.js/wiki/Getting-Started

function threeStart() {

    var oldPosX, oldPosY,initDistCubeCamera;

    var isMouseDown =false;

    function mouseDown(e) {
       isMouseDown =true;
    }

    function mouseUp(e) {
       isMouseDown =false;
    }

    var motionFactorX = 0.5;
    var motionFactorY = 0.5;
    function mouseMove(e){
      if(isMouseDown){
          var deltaX = e.clientX - oldPosX;
          var deltaY = e.clientY - oldPosY;

           if(deltaX !== 0){
              camera.translateX(deltaX *motionFactorX );

           }
          if(deltaY !== 0){
              camera.translateY(deltaY *motionFactorY );


          }

          camera.lookAt( cube.position );

          var diffToInit = initDistCubeCamera- camera.position.distanceTo(cube.position);
          camera.translateZ(diffToInit);
      }



        oldPosX = e.clientX;
        oldPosY = e.clientY;

    }

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( 800, 600 );
    document.body.appendChild( renderer.domElement );



    var scene = new THREE.Scene();

    var camera = new THREE.PerspectiveCamera(
        35,             // Field of view
        800 / 600,      // Aspect ratio
        0.1,            // Near plane
        10000           // Far plane
    );
    camera.position.set( -15, 10, 10 );


    scene.add( camera );

    var cube = new THREE.Mesh(
    new THREE.CubeGeometry( 5, 5, 5 ),
    new THREE.MeshLambertMaterial( { color: 0xFF0000, ambient: 0xFF0000 } )
    );
    scene.add( cube );
    initDistCubeCamera =camera.position.distanceTo(cube.position);
    camera.lookAt( cube.position );
    var light = new THREE.PointLight( 0xFFFF00 );
    light.position.set( -15, 10, 10 );
    scene.add( light );
    renderer.domElement.onmousedown=mouseDown;
    renderer.domElement.onmouseup=mouseUp;
    renderer.domElement.onmousemove=mouseMove;


    function render() {
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }
    render();
}
