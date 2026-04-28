(function () {
  'use strict';

  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  // Renderer
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 500);
  camera.position.set(0, 0, 28);

  // ---- Particles ----
  const COUNT = window.innerWidth < 768 ? 1200 : 2200;
  const positions = new Float32Array(COUNT * 3);
  const colors = new Float32Array(COUNT * 3);
  const sizes = new Float32Array(COUNT);

  const RED = new THREE.Color(0xe63946);
  const WHITE = new THREE.Color(0xffffff);
  const DIM = new THREE.Color(0x441010);

  for (let i = 0; i < COUNT; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 90;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 90;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 90;

    const r = Math.random();
    const col = r < 0.55 ? RED : r < 0.75 ? DIM : WHITE;
    colors[i * 3]     = col.r;
    colors[i * 3 + 1] = col.g;
    colors[i * 3 + 2] = col.b;

    sizes[i] = 0.5 + Math.random() * 1.0;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const mat = new THREE.PointsMaterial({
    vertexColors: true,
    sizeAttenuation: true,
    size: 0.18,
    transparent: true,
    opacity: 0.75,
  });

  const particles = new THREE.Points(geo, mat);
  scene.add(particles);

  // ---- Wireframe Grid Plane ----
  const gridGeo = new THREE.PlaneGeometry(80, 80, 28, 28);
  const gridMat = new THREE.MeshBasicMaterial({
    color: 0xe63946,
    wireframe: true,
    transparent: true,
    opacity: 0.045,
  });
  const grid = new THREE.Mesh(gridGeo, gridMat);
  grid.rotation.x = -Math.PI / 2.6;
  grid.position.y = -14;
  scene.add(grid);

  // ---- Floating Torus Rings ----
  const rings = [];
  const ringParams = [
    { r: 9,  tube: 0.018, color: 0xe63946, opacity: 0.10, speed: 0.0025, rotX: 0.8, rotY: 0.3 },
    { r: 14, tube: 0.014, color: 0xe63946, opacity: 0.06, speed: 0.0018, rotX: 0.4, rotY: 0.9 },
    { r: 18, tube: 0.010, color: 0xff6b6b, opacity: 0.04, speed: 0.0012, rotX: 1.2, rotY: 0.1 },
  ];
  ringParams.forEach(p => {
    const rGeo = new THREE.TorusGeometry(p.r, p.tube, 8, 90);
    const rMat = new THREE.MeshBasicMaterial({ color: p.color, transparent: true, opacity: p.opacity });
    const mesh = new THREE.Mesh(rGeo, rMat);
    mesh.rotation.x = p.rotX;
    mesh.rotation.y = p.rotY;
    mesh.userData.speed = p.speed;
    scene.add(mesh);
    rings.push(mesh);
  });

  // ---- Icosahedron center shape ----
  const icoGeo = new THREE.IcosahedronGeometry(3.5, 1);
  const icoMat = new THREE.MeshBasicMaterial({
    color: 0xe63946, wireframe: true,
    transparent: true, opacity: 0.07,
  });
  const ico = new THREE.Mesh(icoGeo, icoMat);
  scene.add(ico);

  // ---- Mouse tracking ----
  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;
  const onMouseMove = (e) => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 2.5;
    targetY = -(e.clientY / window.innerHeight - 0.5) * 2.5;
  };
  window.addEventListener('mousemove', onMouseMove, { passive: true });

  // ---- Resize ----
  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener('resize', onResize, { passive: true });

  // ---- Animate ----
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Smooth camera parallax
    currentX += (targetX - currentX) * 0.04;
    currentY += (targetY - currentY) * 0.04;
    camera.position.x = currentX;
    camera.position.y = currentY;
    camera.lookAt(scene.position);

    // Rotate particles slowly
    particles.rotation.y = t * 0.018;
    particles.rotation.x = t * 0.009;

    // Animate grid
    grid.rotation.z = t * 0.008;

    // Rotate rings
    rings.forEach((ring, i) => {
      ring.rotation.y += ring.userData.speed;
      ring.rotation.z += ring.userData.speed * 0.4;
    });

    // Rotate ico
    ico.rotation.y = t * 0.12;
    ico.rotation.x = t * 0.07;
    ico.position.y = Math.sin(t * 0.4) * 0.5;

    renderer.render(scene, camera);
  }

  animate();

  // Cleanup on page hide to free GPU
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) renderer.setAnimationLoop(null);
  });
})();
