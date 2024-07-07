import * as THREE from 'three';
// انشاء مشهد
const scene = new THREE.Scene();
// انشاء كاميرا
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
// انشاء تقدم

const renderer = new THREE.WebGLRenderer();

//نعطيه كامل العرض و كامل الارتفاع
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
renderer.setPixelRatio(devicePixelRatio)
// استدعاء البودي

document.body.appendChild( renderer.domElement );
//  اي شكل مكون من حاجتين = من هندسة (الابعاد) + المادة ( الالوان)
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// عرض الطول الارتفاع
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
// الان نربط بين المادة و الهندسة ليصبح لدينا شكل (شبكة)
scene.add( cube );
//  الان نضيف الشبكة للمشهد
camera.position.z = 5;


// انشاء انيم الدوران
function animate() {

	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

	renderer.render( scene, camera );

}