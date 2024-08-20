// シーンの作成
const scene = new THREE.Scene();

// カメラの作成
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// レンダラーの作成
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('mainCanvas') });
renderer.setSize(window.innerWidth, window.innerHeight);

// 立方体のジオメトリとマテリアルの作成
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);

// シーンに立方体を追加
scene.add(cube);

// カメラの位置を設定
camera.position.z = 5;

// アニメーションループの設定
function animate() {
    requestAnimationFrame(animate);

    // 立方体を回転させる
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
}

// アニメーション開始
animate();
