import gsap from 'gsap'
import * as THREE  from "three"
import { OrbitControls } from "three/examples/jsm/Addons.js";
import * as dat from "dat.gui";
// OrbitControls وحدة تحكم تفاعلية للكاميرا.
// dat.gui: مكتبة لإنشاء واجهات تحكم تفاعلية لتغيير القيم في الوقت الفعلي
const gui = new dat.GUI()
const world = {
  plane: {
    width: 400,
    height: 400,
    widthSegments: 50,
    heightSegments: 50
  }
}
gui.add(world.plane, 'width', 1, 500).onChange(generatePlane)

gui.add(world.plane, 'height', 1, 500).onChange(generatePlane)
gui.add(world.plane, 'widthSegments', 1, 100).onChange(generatePlane)
gui.add(world.plane, 'heightSegments', 1, 100).onChange(generatePlane)

//    إعداد الواجهة الرسومية لل gui لتحكم في الطائرة
function generatePlane() {
  planeMesh.geometry.dispose()
  planeMesh.geometry = new THREE.PlaneGeometry(
    world.plane.width,
    world.plane.height,
    world.plane.widthSegments,
    world.plane.heightSegments
  )

  const { array } = planeMesh.geometry.attributes.position
  const randomValues = []
  for (let i = 0; i < array.length; i++) {
    if (i % 3 === 0) {
      const x = array[i]
      const y = array[i + 1]
      const z = array[i + 2]

      array[i] = x + (Math.random() - 0.5) * 3
      array[i + 1] = y + (Math.random() - 0.5) * 3
      array[i + 2] = z + (Math.random() - 0.5) * 3
    }

    randomValues.push(Math.random() * Math.PI * 2)
  }

  planeMesh.geometry.attributes.position.randomValues = randomValues
  planeMesh.geometry.attributes.position.originalPosition =
    planeMesh.geometry.attributes.position.array


  //   إضافة الألوان 
  const colors = []
  for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
    colors.push(0, 0.19, 0.4)
  }

  planeMesh.geometry.setAttribute(
    'color',
    new THREE.BufferAttribute(new Float32Array(colors), 3)
  )
}


//  انشاء المشهد و الكاميرا والمُعالج للرسومات ثلاثية الأبعاد  
const raycaster = new THREE.Raycaster()
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  75,
  innerWidth / innerHeight,
  0.1,
  1000
)
const renderer = new THREE.WebGLRenderer()

renderer.setSize(innerWidth, innerHeight)
renderer.setPixelRatio(devicePixelRatio)
document.body.appendChild(renderer.domElement)
// خاص بتحريك 
new OrbitControls(camera, renderer.domElement)
camera.position.z = 50
// إضافة أدوات التحكم في الكاميرا وتحديد موقعها


const planeGeometry = new THREE.PlaneGeometry(
  world.plane.width,
  world.plane.height,
  world.plane.widthSegments,
  world.plane.heightSegments
)
const planeMaterial = new THREE.MeshPhongMaterial({
  side: THREE.DoubleSide,
  flatShading: THREE.FlatShading,
  vertexColors: true
})
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
scene.add(planeMesh)
// تم انشاء الطائرة واضافتها للمشهد
generatePlane()

const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(0, -1, 1)
scene.add(light)
// تم انشاء ضوء 
const backLight = new THREE.DirectionalLight(0xffffff, 1)
backLight.position.set(0, 0, -1)
scene.add(backLight)
// تم انشاء ضوء خلفي 

const mouse = {
  x: undefined,
  y: undefined
}
// متغير لكي يتم فيه فيما بعد تخزين احداثسات الماوس
let frame = 0
function animate() {

  requestAnimationFrame(animate)
  // تعمل على تشغيل الدالة بشكل مستمر
  renderer.render(scene, camera)
  raycaster.setFromCamera(mouse, camera)
  // raycaster لتحديد تفاعلات الماوس مع الطائرة.
  frame += 0.01

  const {
    array,
    originalPosition,
    randomValues
  } = planeMesh.geometry.attributes.position
  for (let i = 0; i < array.length; i += 3) {
    // x
    array[i] = originalPosition[i] + Math.cos(frame + randomValues[i]) * 0.01

    // y
    array[i + 1] =
      originalPosition[i + 1] + Math.sin(frame + randomValues[i + 1]) * 0.001
  }

  planeMesh.geometry.attributes.position.needsUpdate = true

  const intersects = raycaster.intersectObject(planeMesh)
  if (intersects.length > 0) {
    const { color } = intersects[0].object.geometry.attributes
    // تغيير الألوان عند التفاعل مع الماوس
   
    color.setX(intersects[0].face.a, 0.1)
    color.setY(intersects[0].face.a, 0.5)
    color.setZ(intersects[0].face.a, 1)

    
    color.setX(intersects[0].face.b, 0.1)
    color.setY(intersects[0].face.b, 0.5)
    color.setZ(intersects[0].face.b, 1)

   
    color.setX(intersects[0].face.c, 0.1)
    color.setY(intersects[0].face.c, 0.5)
    color.setZ(intersects[0].face.c, 1)

    intersects[0].object.geometry.attributes.color.needsUpdate = true

    const initialColor = {
      r: 0,
      g: 0.19,
      b: 0.4
    }

    const hoverColor = {
      r: 0.1,
      g: 0.5,
      b: 1
    }

    gsap.to(hoverColor, {
      r: initialColor.r,
      g: initialColor.g,
      b: initialColor.b,
      duration: 1,
      onUpdate: () => {
        // vertice 1
        color.setX(intersects[0].face.a, hoverColor.r)
        color.setY(intersects[0].face.a, hoverColor.g)
        color.setZ(intersects[0].face.a, hoverColor.b)

        // vertice 2
        color.setX(intersects[0].face.b, hoverColor.r)
        color.setY(intersects[0].face.b, hoverColor.g)
        color.setZ(intersects[0].face.b, hoverColor.b)

        // vertice 3
        color.setX(intersects[0].face.c, hoverColor.r)
        color.setY(intersects[0].face.c, hoverColor.g)
        color.setZ(intersects[0].face.c, hoverColor.b)
        color.needsUpdate = true
      }
    })
  }
}

animate()

addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / innerWidth) * 2 - 1
  mouse.y = -(event.clientY / innerHeight) * 2 + 1
})

// ................................الخطوااات..........................................//
// 1..انشاء كاميرا
// 2..انشاء مشهد
// 3..انشاء renderer
// 4..منحه الطول و العرض
// .. bodyاستدعاء 
// 6..انشاء الطائرة
// 7..انشاء القمم واستدعاء مكتبة dat.gui  لتقديم تجربة افضل للمستحدم
// 8..استدعاء OrbitControls من اجل تحكم و تحريك الكاميرا
// 9..مراقبة احدثيات الماوس
// 10..import raycaster 
// 11..تغيير لون القمم عند اللمس
// 12..تحريك القمم 
// .....................................................................................//



// ...............................بعض التفاصيل.............................................
// 1 كيفية انشاء القمم
// كل شكل هندسي في three.Js مكون من هندسة و مادة 
// الهندسة هي الاطار السلكي وهي مكونة من قمم او يمكن انسميها شرائح او مثلثات
// اما المادة فهي عبارة عن اللون
// كل البيانات المتعلقة بالقمم نجدها في planeMesh.geometry.attributes.position
// بالضبط في الاراي .الاراي تضم 362 رقم هذه الارقام هي عبارة عن x.y.z بشكل مكرر
// ولو لحضنا الاراي لوجدناها ان كل رقمين يكون بعده رقم 0
// وهذا يعني ان القمم موجودة و لديها مكانها ولكنها لا تظهر لان z=0
// يعني ان القمم ليس لديها ارتفاع
// ايطا لكي تظهر يجب ان نضيف خاصية التضليل 


//  dat.gui  من اجل الحصول على الطول و العرض الذي يعجبنا للطائرة و القمم نستحدم مكتبة 
// نستدعي المكتبة وننشئ اوبجكت للمكتبة و ابجكت لطائرة نضيف اليها الطول و العرض الطائرة و طول و عرض القمم
// ننشئ دالة مختصة بتحديث القيم 

// التحريك او كما يطلق عليه الضوابط المدارية
// امر سهل جدااااا
// عن طريق OrbitControls 
// مع اضافة له الكاميرا التقدم (renderer) و العنصر المراد تحريكه

// hover affct
// تتبع حركة الماوس 
// mouse.x = event.clientX
// raycaster لكن بهذا الشكل لا يصلح مع  
//لانه يستحدم تطبيع الاحدثيات ولكن نحن  الذي نستخدمه ليس كذلك لان المركز عندنا هو الزواية اليسرى العليا من الشاشة و هذا هو المنتصف
// لذلك نستخدم تعديلات  
// mouse.x = (event.clientX / innerWidth) * 2 - 1



// لان استدعاء raycaster
// وظيفة raycaster هو مراقبة اذا كان الماوس يتقاطع مع طائرتنا ام لا 


