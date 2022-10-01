import {
    BoxGeometry,
    BufferGeometry,
    CapsuleGeometry,
    CircleGeometry,
    Color,
    ConeGeometry,
    Curve,
    CylinderGeometry,
    DodecahedronGeometry,
    DoubleSide,
    ExtrudeGeometry,
    Float32BufferAttribute,
    Group,
    IcosahedronGeometry,
    LatheGeometry,
    LineSegments,
    LineBasicMaterial,
    Mesh,
    MeshPhongMaterial,
    OctahedronGeometry,
    PerspectiveCamera,
    PlaneGeometry,
    PointLight,
    RingGeometry,
    Scene,
    Shape,
    ShapeGeometry,
    SphereGeometry,
    TetrahedronGeometry,
    TorusGeometry,
    TorusKnotGeometry,
    TubeGeometry,
    Vector2,
    Vector3,
    WireframeGeometry,
    WebGLRenderer
} from 'three';

import { GUI } from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const twoPi = Math.PI * 2;

function updateGroupGeometry( mesh, geometry ) {

    mesh.children[ 0 ].geometry.dispose();
    mesh.children[ 1 ].geometry.dispose();

    mesh.children[ 0 ].geometry = new WireframeGeometry( geometry );
    mesh.children[ 1 ].geometry = geometry;

    // these do not update nicely together if shared
}

const guis = {
    CylinderGeometry: function ( mesh ) {

        const data = {
            radiusTop: 5,
            radiusBottom: 5,
            height: 10,
            radialSegments: 8,
            heightSegments: 1,
            openEnded: false,
            thetaStart: 0,
            thetaLength: twoPi
        };

        function generateGeometry() {

            updateGroupGeometry( mesh,
                new CylinderGeometry(
                    data.radiusTop,
                    data.radiusBottom,
                    data.height,
                    data.radialSegments,
                    data.heightSegments,
                    data.openEnded,
                    data.thetaStart,
                    data.thetaLength
                )
            );

            return new CylinderGeometry(
                data.radiusTop,
                data.radiusBottom,
                data.height,
                data.radialSegments,
                data.heightSegments,
                data.openEnded,
                data.thetaStart,
                data.thetaLength
            );
        }

        const folder = gui.addFolder( 'THREE.CylinderGeometry' );

        folder.add( data, 'radiusTop', 0, 30 ).onChange( generateGeometry );
        folder.add( data, 'radiusBottom', 0, 30 ).onChange( generateGeometry );
        folder.add( data, 'height', 1, 50 ).onChange( generateGeometry );
        folder.add( data, 'radialSegments', 3, 64 ).step( 1 ).onChange( generateGeometry );
        folder.add( data, 'heightSegments', 1, 64 ).step( 1 ).onChange( generateGeometry );
        folder.add( data, 'openEnded' ).onChange( generateGeometry );
        folder.add( data, 'thetaStart', 0, twoPi ).onChange( generateGeometry );
        folder.add( data, 'thetaLength', 0, twoPi ).onChange( generateGeometry );


        return generateGeometry();
    }
};

function chooseFromHash( mesh ) {
    const selectedGeometry = 'CylinderGeometry';
    let res = {}

    if ( guis[ selectedGeometry ] !== undefined ) {

        res = guis[ selectedGeometry ]( mesh );

    }

    return res;
}

//

const selectedGeometry = window.location.hash.substring( 1 );

if ( guis[ selectedGeometry ] !== undefined ) {

    document.getElementById( 'newWindow' ).href += '#' + selectedGeometry;

}

const gui = new GUI();

const scene = new Scene();
scene.background = new Color( 0x444444 );

const camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 50 );
camera.position.z = 30;

const renderer = new WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

new OrbitControls( camera, renderer.domElement );

const lights = [];
lights[ 0 ] = new PointLight( 0xffffff, 1, 0 );
lights[ 1 ] = new PointLight( 0xffffff, 1, 0 );
lights[ 2 ] = new PointLight( 0xffffff, 1, 0 );

lights[ 0 ].position.set( 0, 200, 0 );
lights[ 1 ].position.set( 100, 200, 100 );
lights[ 2 ].position.set( - 100, - 200, - 100 );

scene.add( lights[ 0 ] );
scene.add( lights[ 1 ] );
scene.add( lights[ 2 ] );

const group = new Group();

const geometry = new BufferGeometry();
geometry.setAttribute( 'position', new Float32BufferAttribute( [], 3 ) );

const lineMaterial = new LineBasicMaterial( { color: 0xffffff, transparent: true, opacity: 0.5 } );
const meshMaterial = new MeshPhongMaterial( { color: 0x156289, emissive: 0x072534, side: DoubleSide, flatShading: true } );

group.add( new LineSegments( geometry, lineMaterial ) );
group.add( new Mesh( geometry, meshMaterial ) );

const cylinderGeometry = chooseFromHash( group );

scene.add( group );

function render() {

    requestAnimationFrame( render );

    group.rotation.x += 0.001;
    group.rotation.y += 0.002;

    renderer.render( scene, camera );

}

window.addEventListener( 'resize', function () {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}, false );

render();
