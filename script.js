// シーンの作成
const scene = new THREE.Scene();

// カメラの作成
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// レンダラーの作成
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('mainCanvas') });
renderer.setSize(window.innerWidth, window.innerHeight);

// OrbitControlsの作成
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// コントロールの設定
controls.enableDamping = true;  // 慣性を追加
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;  // パンを無効にする
controls.minDistance = 2;  // ズームインの最小距離
controls.maxDistance = 10;  // ズームアウトの最大距離

// ドラッグ中かどうかを示すフラグ
let isDragging = false;

// ドラッグ開始時のイベントリスナー
controls.addEventListener('start', function () {
    isDragging = true;
});

// ドラッグ終了時のイベントリスナー
controls.addEventListener('end', function () {
    isDragging = false;
});

// 立方体のジオメトリの作成
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true  // ワイヤーフレームを有効にする
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// 円柱のジオメトリの作成
const cylinderGeometry = new THREE.CylinderGeometry(1, 1, 2, 32);
const cylinderMaterial = new THREE.MeshBasicMaterial({
    color: 0x0000ff,
    wireframe: true  // ワイヤーフレームを有効にする
});
const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
cylinder.position.x = 3;  // 立方体と重ならないように位置を調整
scene.add(cylinder);

// 球体のジオメトリの作成
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const sphereMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    wireframe: true  // ワイヤーフレームを有効にする
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.x = -3;  // 立方体と重ならないように位置を調整
scene.add(sphere);

// カメラの位置を設定
camera.position.set(5, 5, 5);
controls.update();

// 選択された3点を格納する配列
let selectedPoints = [];

// 平面オブジェクトの作成
const plane = new THREE.Plane();

// レイキャスターの作成
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// マウスクリックイベントリスナー
window.addEventListener('click', onMouseClick);

function onMouseClick(event) {
    // マウス座標を正規化する (-1 to 1 の範囲に変換)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    // レイキャスターを使って、シーン内のオブジェクトとの交差をチェック
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects([cube, cylinder, sphere]);

    if (intersects.length > 0) {
        // 交差が見つかった場合、その点を選択
        const intersect = intersects[0];
        selectedPoints.push(intersect.point);

        // 3点が選択された場合、平面を計算
        if (selectedPoints.length === 3) {
            createCuttingPlane(selectedPoints);
            selectedPoints = []; // 配列をリセット
        }
    }
}

function createCuttingPlane(points) {
    // 3点から平面を生成
    const p1 = points[0];
    const p2 = points[1];
    const p3 = points[2];

    const normal = new THREE.Vector3().crossVectors(
        new THREE.Vector3().subVectors(p2, p1),
        new THREE.Vector3().subVectors(p3, p1)
    ).normalize();

    plane.setFromNormalAndCoplanarPoint(normal, p1);

    // 立体を平面で切断し、断面を表示
    cutObjectWithPlane(cube, plane);
    cutObjectWithPlane(cylinder, plane);
    cutObjectWithPlane(sphere, plane);
}

function cutObjectWithPlane(object, plane) {
    // 立体を切断する処理 (シンプルな表示方法を実装)
    const geometry = new THREE.PlaneGeometry(5, 5);
    const material = new THREE.MeshBasicMaterial({color: 0xffff00, side: THREE.DoubleSide});
    const planeMesh = new THREE.Mesh(geometry, material);

    planeMesh.lookAt(plane.normal);  // 平面の法線方向に合わせて向きを調整
    planeMesh.position.copy(plane.coplanarPoint(new THREE.Vector3()));

    scene.add(planeMesh);

    // 本格的な切断処理にはカスタムシェーダーやブーリアン処理が必要です
}

// 立体の表示・非表示を管理する関数
function showOnly(object) {
    cube.visible = false;
    cylinder.visible = false;
    sphere.visible = false;
    object.visible = true;
}

// ボタンのイベントリスナーを追加
document.getElementById('selectCube').addEventListener('click', () => {
    showOnly(cube);
});

document.getElementById('selectCylinder').addEventListener('click', () => {
    showOnly(cylinder);
});

document.getElementById('selectSphere').addEventListener('click', () => {
    showOnly(sphere);
});

// 初期状態で立方体を表示
showOnly(cube);

// アニメーションループの設定
function animate() {
    requestAnimationFrame(animate);

    if (isDragging) {
        // 回転させる（表示されている立体のみが回転）
        if (cube.visible) {
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
        }

        if (cylinder.visible) {
            cylinder.rotation.x += 0.01;
            cylinder.rotation.y += 0.01;
        }

        if (sphere.visible) {
            sphere.rotation.x += 0.01;
            sphere.rotation.y += 0.01;
        }
    }

    // コントロールの更新
    controls.update();

    renderer.render(scene, camera);
}

// アニメーション開始
animate();
