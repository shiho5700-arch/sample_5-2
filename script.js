import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// シーン、カメラ、レンダラーを作成
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xfff8e1);
document.body.appendChild(renderer.domElement);

// カメラの位置を設定
camera.position.set(5, 5, 5);
camera.lookAt(0, 0, 0);

// OrbitControlsを追加​
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;


// ライトを追加
const light = new THREE.PointLight(0xffffff, 5, 50);
light.position.set(3, 3, 3);
scene.add(light);

// 座標軸を表示
const axesHelper = new THREE.AxesHelper(20);
scene.add(axesHelper);




//
// レール寸法の定義
//
const RAIL_CENTER_RADIUS = 10;   // レール中心半径
const RAIL_WIDTH = 1.5;          // レール幅（線路間隔）
const INNER_RADIUS = RAIL_CENTER_RADIUS - RAIL_WIDTH / 2;
const OUTER_RADIUS = RAIL_CENTER_RADIUS + RAIL_WIDTH / 2;

//
// レールマテリアル
//
const railMaterial = new THREE.MeshStandardMaterial({
    color: 0x777777,
    roughness: 0.4,
    metalness: 0.2,
});


// RailGroup
const RailGroup = new THREE.Group();

// 内側レール
const innerRail = new THREE.Mesh(
    new THREE.TorusGeometry(INNER_RADIUS, 0.03, 12, 128),
    railMaterial
);

innerRail.rotation.x = Math.PI / 2;

// 外側レール
const outerRail = new THREE.Mesh(
    new THREE.TorusGeometry(OUTER_RADIUS, 0.03, 12, 128),
    railMaterial
);

outerRail.rotation.x = Math.PI / 2;

// 枕木の形状
const sleeperGeometry = new THREE.BoxGeometry(
    0.18,  // 幅
    0.12,  // 高さ
    2.0   // 長さ
);

// 枕木の材質
const sleeperMaterial = new THREE.MeshStandardMaterial({
    color: 0x79502b
});

// 枕木の原型
const sleeperTemplate = new THREE.Mesh(
    sleeperGeometry,
    sleeperMaterial
);

// 枕木をまとめるGroup
const sleepersGroup = new THREE.Group();

// 30本の枕木を配置
for (let i = 0; i < 30; i++) {

    // 回転の中心となるGroup
    const pivot = new THREE.Group();

    // 枕木を複製
    const sleeper = sleeperTemplate.clone();

    // 円の中心から9.5離れた位置に置く
    sleeper.position.set(0, -0.1, RAIL_CENTER_RADIUS);

    pivot.add(sleeper);

    // 12度ずつ回転
    pivot.rotation.y = i * Math.PI * 2 / 30;

    sleepersGroup.add(pivot);
}

//scene.add(sleepersGroup);

class wheel extends THREE.Object3D { // Three.jsのObject3Dクラスを継承​
    constructor(radius, width, segments, color, x, y, z){
        super();

        this.geometry = new THREE.CylinderGeometry(
            radius,
            radius,
            width,
            segments
        );

        this.material = new THREE.MeshPhongMaterial({
            color: color
        });

        this.mesh = new THREE.Mesh(
            this.geometry,
            this.material
        );

        this.position.set(x, y, z);

        this.mesh.rotation.y = Math.PI / 2;
        this.mesh.rotation.z = Math.PI / 2;

        this.add(this.mesh);
    }

    rotateWheel(speed) {
        this.rotation.z += speed;
    }
  }


class toytrain extends THREE.Group {

    constructor(){

        super();

        this.wheels = [];

        // ボディ
        const cubeGeometry =
            new THREE.BoxGeometry(1.2,2,1.8);

        const cubeMaterial =
            new THREE.MeshPhongMaterial({
                color: 0x0000ff
            });

        const cube =
            new THREE.Mesh(
                cubeGeometry,
                cubeMaterial
            );

        cube.position.set(3.5,0.3,0);

        this.add(cube);

        // 円筒
        const cylinderGeometry =
            new THREE.CylinderGeometry(
                0.8,0.8,2,20
            );

        const cylinderMaterial =
            new THREE.MeshBasicMaterial({
                color: 0x00ff00
            });

        const cylinder =
            new THREE.Mesh(
                cylinderGeometry,
                cylinderMaterial
            );

        cylinder.rotation.z =
            Math.PI/2;

        cylinder.position.x = 2;

        this.add(cylinder);

        // 三角
        const coneGeometry =
            new THREE.ConeGeometry(
                0.3,
                0.5,
                20
            );

        const coneMaterial =
            new THREE.MeshBasicMaterial({
                color: 0x8b4513,
            });

        const cone =
            new THREE.Mesh(
                coneGeometry,
                coneMaterial
            );

        cone.rotation.x =
            Math.PI;

        cone.position.set(
            1.5,
            0.9,
            0
        );

        this.add(cone);

        // 小さい車輪
        const wheel1 =
            new wheel(
                0.3,0.1,20,
                0xffff00, 
                1.5,-0.8,0.6
            );
        const wheel1material =
            new THREE.MeshStandardMaterial({
                color: 0xffff00,
                flatShading: true
            });
        wheel1.mesh.material = wheel1material;

        const woodTexture =
            new THREE.TextureLoader().load(
                "mokume.png"
            );

        const wheel2 =
            new wheel(
                0.3,0.1,20,
                0xffff00,
                2.2,-0.8,0.6
            );

        const wheel2material =
            new THREE.MeshStandardMaterial({
                map: woodTexture
            });
        wheel2.mesh.material = wheel2material;    

        const wheel3 =
            new wheel(
                0.3,0.1,20,
                0xffff00,
                1.5,-0.8,-0.6
            );

        const wheel3material =
            new THREE.MeshStandardMaterial({
                color: 0xffff00,
                wireframe: true
            });
        wheel3.mesh.material = wheel3material;

        const wheel4 =
            new wheel(
                0.3,0.1,20,
                0xffff00,
                2.2,-0.8,-0.6
            );

        const wheel4material =
            new THREE.MeshStandardMaterial({
                map: woodTexture
            });
        wheel4.mesh.material = wheel4material;

        // 大車輪
        const wheelBig1 =
            new wheel(
                0.5,0.1,20,
                0xff0000,
                3.5,-0.8,1
            );

        const wheelBig1material =
            new THREE.MeshStandardMaterial({
                color: 0xff0000,
                wureframe: true
            });
        wheelBig1.mesh.material = wheelBig1material;

        const wheelBig2 =
            new wheel(
                0.5,0.1,20,
                0xff0000,
                3.5,-0.8,-1
            );

        this.wheels.push(
            wheel1,
            wheel2,
            wheel3,
            wheel4,
            wheelBig1,
            wheelBig2
        );

        this.add(wheel1);
        this.add(wheel2);
        this.add(wheel3);
        this.add(wheel4);
        this.add(wheelBig1);
        this.add(wheelBig2);
    }

    update(){

        this.wheels.forEach(w=>{
            this.rotation.y = Math.PI / 2;
            w.rotateWheel(0.05);
        });
    }
}

const train = new toytrain();
const orbitGroup = new THREE.Group();
//Toytrainを公転グループに入れる
orbitGroup.add(train);
//円の中心から10だけ離す
train.position.set(10, 1, 0);
train.rotation.y = Math.PI / 2;
//シーンに追加
scene.add(orbitGroup);



//
// Groupへ追加
//
RailGroup.add(innerRail);
RailGroup.add(outerRail);
RailGroup.add(sleepersGroup);

scene.add(RailGroup);

// アニメーション 
function animate() {
 requestAnimationFrame(animate);
 // グループ全体をY軸の周りに回転
 train.update();
// 列車をレール上で公転
 orbitGroup.rotation.y += 0.01;
 controls.update();
 train.update(0.1); 
 train.rotation.y = -Math.PI / 2;
 renderer.render(scene, camera);
} 
animate();