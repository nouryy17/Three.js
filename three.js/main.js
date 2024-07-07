import * as THREE  from "three"
import * as dat from "dat.gui";
const gui = new dat.GUI()
const world = {
  plane: {
    width: 10,
    height: 10,
    widthSegments: 10,
    heightSegments: 10
  }
}
gui.add(world.plane, 'width', 1, 20).onChange(generatePlane)

gui.add(world.plane, 'height', 1, 20).onChange(generatePlane)
gui.add(world.plane, 'widthSegments', 1, 50).onChange(generatePlane)
gui.add(world.plane, 'heightSegments', 1, 50).onChange(generatePlane)

function generatePlane() {
  plane.geometry.dispose()
  plane.geometry = new THREE.PlaneGeometry(
    world.plane.width,
    world.plane.height,
    world.plane.widthSegments,
    world.plane.heightSegments
  )

  // vertice position randomization
  const {array} = plane.geometry.attributes.position
  for (let i = 0; i < array.length; i+=3) {
    
      const x = array[i]
      const y = array[i + 1]
      const z = array[i + 2]

     array[i + 2]= z +Math.random()
    

  } }

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
// const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// عرض الطول الارتفاع
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh( geometry, material );
// الان نربط بين المادة و الهندسة ليصبح لدينا شكل (شبكة)
// scene.add( cube );
//  الان نضيف الشبكة للمشهد
camera.position.z = 5;

// اضافة الطائرة
const geometryPlane = new THREE.PlaneGeometry( 5, 5,10,10 );
const materialPlane = new THREE.MeshBasicMaterial( {color:0xff0000 ,
	side: THREE.DoubleSide ,
	flatShading: THREE.flatShading
} );
const plane = new THREE.Mesh( geometryPlane, materialPlane );
scene.add( plane );

const {array}=plane.geometry.attributes.position
for (let i = 0; i < array.length; i+= 3) {
	
	const x =  array[i]
	const y = array[i +1]
	const z = array[i+2]
	array[i+2]= z + Math.random()

}
// add ligth
const ligth =new THREE.DirectionalLight( 0x00ff00 ,1)
ligth.position(0,0,1)
scene.add(ligth)
// انشاء انيم الدوران
function animate() {

	// cube.rotation.x += 0.01;
	// cube.rotation.y += 0.01;

	renderer.render( scene, camera );

}