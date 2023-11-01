import { createApp } from 'vue'
import './style.css'
import App from './App.vue'


import * as THREE from 'three';

import Stats from 'three/addons/libs/stats.module.js';

let container, stats;

let camera, scene, renderer;

let points;

init();
animate();

function addPoints(n_particles, i) {
    const geometry = new THREE.BufferGeometry();

    const positions = [];
    const colors = [];

    const color = new THREE.Color();

    const n = 100, n2 = n / 2; // n_particles spread in the cube

    const idx_r = Math.floor(i / 6);
    const idx_c = i % 6;

    for ( let i = 0; i < n_particles; i ++ ) {

        // positions

        const x = Math.random() * n - n2 + (n+10) * idx_r;
        const y = Math.random() * n - n2 + (n+10) * idx_c;
        const z = Math.random() * n - n2;

        positions.push( x, y, z );

        // colors

        const vx = ( x / n ) + 0.5;
        const vy = ( y / n ) + 0.5;
        const vz = ( z / n ) + 0.5;

        color.setRGB( vx, vy, vz, THREE.SRGBColorSpace );

        colors.push( color.r, color.g, color.b );

    }

    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
    geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

    geometry.computeBoundingSphere();

    //

    const material = new THREE.PointsMaterial( { size: 15, vertexColors: true } );

    let _points = new THREE.Points( geometry, material );
    scene.add( _points );
}

function init() {

    container = document.getElementById( 'container' );

    //

    camera = new THREE.PerspectiveCamera( 27, window.innerWidth / window.innerHeight, 5, 3500 );
    camera.position.z = 2750;

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x050505 );
    scene.fog = new THREE.Fog( 0x050505, 2000, 3500 );

    //
    let n_1m = 1 * 1000 * 1000;

    for (let i = 0; i < 10; i++) {
        addPoints(n_1m, i);
    }

    //

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    container.appendChild( renderer.domElement );

    //

    stats = new Stats();
    container.appendChild( stats.dom );
    window.scene = scene;

    //

    window.addEventListener( 'resize', onWindowResize );

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

//

function animate() {

    requestAnimationFrame( animate );

    render();
    stats.update();

}

function render() {

    // const time = Date.now() * 0.001;

    // points.rotation.x = time * 0.25;
    // points.rotation.y = time * 0.5;

    renderer.render( scene, camera );

}



// create app
createApp(App).mount('#app')
