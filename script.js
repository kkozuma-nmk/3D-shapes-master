// シーンの作成
const scene = new THREE.Scene();

// カメラの作成
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// レンダラーの作成
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('mainCanvas') });
renderer.setSize(window.innerWidth, window.innerHeight);

// 立方体のジオメトリの作成
const geometry = new THREE.BoxGeometry();

// ワイヤーフレーム用のマテリアルの作成
const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true  // ワイヤーフレームを有効にする
});

// ワイヤーフレームメッシュの作成
const cube = new THREE.Mesh(geometry, material);

// シーンに立方体を追加
scene.add(cube);

// カメラの位置を設定
camera.position.z = 5;

// 円柱のジオメトリの作成
const cylinderGeometry = new THREE.CylinderGeometry(1, 1, 2, 32);

// ワイヤーフレーム用のマテリアルの作成
const cylinderMaterial = new THREE.MeshBasicMaterial({
    color: 0x0000ff,
    wireframe: true  // ワイヤーフレームを有効にする
});

// ワイヤーフレームメッシュの作成
const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);

// 円柱をシーンに追加
scene.add(cylinder);

// 円柱の位置を調整（立方体と重ならないように）
cylinder.position.x = 3;



// 球体のジオメトリの作成
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);

// ワイヤーフレーム用のマテリアルの作成
const sphereMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    wireframe: true  // ワイヤーフレームを有効にする
});

// ワイヤーフレームメッシュの作成
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

// 球体をシーンに追加
scene.add(sphere);

// 球体の位置を調整（立方体と重ならないように）
sphere.position.x = -3;





// アニメーションループの設定
function animate() {
    requestAnimationFrame(animate);

    // 立方体を回転させる
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    // 円柱を回転させる
    cylinder.rotation.x += 0.01;
    cylinder.rotation.y += 0.01;

    // 球体を回転させる
    sphere.rotation.x += 0.01;
    sphere.rotation.y += 0.01;

    renderer.render(scene, camera);
}

// アニメーション開始
animate();

