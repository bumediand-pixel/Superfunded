'use strict';

(function () {
  if (typeof THREE === 'undefined') return;
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x080808, 0.022);

  const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 200);
  camera.position.set(0, 7, 28);
  camera.lookAt(0, 1, 0);

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  // ── Lights ──────────────────────────────────────────────────────────────────
  scene.add(new THREE.AmbientLight(0x0d0d1a, 3));

  const redPoint = new THREE.PointLight(0xe63946, 6, 50);
  redPoint.position.set(0, 6, 2);
  scene.add(redPoint);

  const bluePoint = new THREE.PointLight(0x1a237e, 3, 38);
  bluePoint.position.set(-20, 14, -14);
  scene.add(bluePoint);

  const rimLight = new THREE.DirectionalLight(0xff2244, 0.4);
  rimLight.position.set(10, 20, -5);
  scene.add(rimLight);

  // ── Star field ───────────────────────────────────────────────────────────────
  const STAR_N = 3200;
  const sPos = new Float32Array(STAR_N * 3);
  const sCol = new Float32Array(STAR_N * 3);
  for (let i = 0; i < STAR_N; i++) {
    const r  = 70 + Math.random() * 90;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    sPos[i*3]   = r * Math.sin(ph) * Math.cos(th);
    sPos[i*3+1] = r * Math.sin(ph) * Math.sin(th);
    sPos[i*3+2] = r * Math.cos(ph);
    const c = Math.random();
    sCol[i*3]   = 0.65 + c * 0.35;
    sCol[i*3+1] = 0.65 + c * 0.35;
    sCol[i*3+2] = 0.78 + c * 0.22;
  }
  const sGeo = new THREE.BufferGeometry();
  sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
  sGeo.setAttribute('color',    new THREE.BufferAttribute(sCol, 3));
  scene.add(new THREE.Points(sGeo, new THREE.PointsMaterial({
    size: 0.15, sizeAttenuation: true, vertexColors: true,
    transparent: true, opacity: 0.8,
  })));

  // ── Grid floor ───────────────────────────────────────────────────────────────
  const grid = new THREE.GridHelper(90, 45, 0x3d0000, 0x1a0000);
  grid.position.y = -5;
  grid.material.opacity = 0.3;
  grid.material.transparent = true;
  scene.add(grid);

  const glowPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(90, 90),
    new THREE.MeshBasicMaterial({ color: 0xe63946, transparent: true, opacity: 0.025 })
  );
  glowPlane.rotation.x = -Math.PI / 2;
  glowPlane.position.y = -4.97;
  scene.add(glowPlane);

  // ── Market bars (random-walk price data) ─────────────────────────────────────
  const BAR_N = 32;
  const prices = [3.0];
  for (let i = 1; i < BAR_N; i++) {
    prices.push(Math.max(0.35, prices[i-1] + (Math.random() - 0.47) * 0.65));
  }
  const maxP = Math.max(...prices);

  const bars = [];
  for (let i = 0; i < BAR_N; i++) {
    const h  = (prices[i] / maxP) * 5.2 + 0.3;
    const up = i === 0 || prices[i] >= prices[i-1];
    const mat = new THREE.MeshStandardMaterial({
      color:             up ? 0xe63946 : 0x7a0000,
      emissive:          up ? 0xe63946 : 0x7a0000,
      emissiveIntensity: 0.25,
      metalness: 0.2,
      roughness: 0.65,
      transparent: true,
      opacity: 0.82 + (h / 6) * 0.18,
    });
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.58, 1, 0.58), mat);
    mesh.position.set((i - BAR_N / 2 + 0.5) * 1.08, -5 + h / 2, 0);
    mesh.scale.y = h;
    scene.add(mesh);
    bars.push({
      mesh,
      baseH:  h,
      phase:  Math.random() * Math.PI * 2,
      speed:  0.22 + Math.random() * 0.32,
      amp:    0.08 + Math.random() * 0.38,
    });
  }

  // ── Floating wireframe shapes ─────────────────────────────────────────────────
  const edgeMat = (op) => new THREE.LineBasicMaterial({ color: 0xe63946, transparent: true, opacity: op });

  const ico = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(3.4, 0)), edgeMat(0.2)
  );
  ico.position.set(16, 5, -12);
  scene.add(ico);

  const tor = new THREE.Mesh(
    new THREE.TorusGeometry(3.2, 0.055, 8, 52),
    new THREE.MeshBasicMaterial({ color: 0xe63946, transparent: true, opacity: 0.14 })
  );
  tor.position.set(-16, 4, -9);
  tor.rotation.x = 1.1;
  scene.add(tor);

  const oct = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.OctahedronGeometry(2.8)), edgeMat(0.11)
  );
  oct.position.set(6, 13, -24);
  scene.add(oct);

  // Orbiting sphere that circles the icosahedron
  const orb = new THREE.Mesh(
    new THREE.SphereGeometry(0.35, 12, 12),
    new THREE.MeshBasicMaterial({ color: 0xe63946, transparent: true, opacity: 0.7 })
  );
  scene.add(orb);

  // ── Foreground dust ────────────────────────────────────────────────────────────
  const DUST_N = 90;
  const dPos = new Float32Array(DUST_N * 3);
  for (let i = 0; i < DUST_N; i++) {
    dPos[i*3]   = (Math.random() - 0.5) * 44;
    dPos[i*3+1] = Math.random() * 18 - 4;
    dPos[i*3+2] = (Math.random() - 0.5) * 22;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dPos, 3));
  const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({
    color: 0xe63946, size: 0.055, sizeAttenuation: true,
    transparent: true, opacity: 0.45,
  }));
  scene.add(dust);

  // ── Network connection lines ───────────────────────────────────────────────────
  const connVerts = [];
  for (let i = 0; i < 20; i++) {
    const x1 = (Math.random() - 0.5) * 36, y1 = Math.random() * 14 - 2, z1 = (Math.random() - 0.5) * 18;
    connVerts.push(x1, y1, z1,
      x1 + (Math.random() - 0.5) * 12,
      y1 + (Math.random() - 0.5) * 6,
      z1 + (Math.random() - 0.5) * 8);
  }
  const connGeo = new THREE.BufferGeometry();
  connGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(connVerts), 3));
  scene.add(new THREE.LineSegments(connGeo, new THREE.LineBasicMaterial({
    color: 0xe63946, transparent: true, opacity: 0.08,
  })));

  // ── Render loop ────────────────────────────────────────────────────────────────
  let t = 0;
  let scrollY = 0;
  window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

  (function tick() {
    requestAnimationFrame(tick);
    t += 0.016;

    bars.forEach(b => {
      const h = Math.max(0.18, b.baseH + Math.sin(t * b.speed + b.phase) * b.amp);
      b.mesh.scale.y = h;
      b.mesh.position.y = -5 + h / 2;
      b.mesh.material.emissiveIntensity = 0.1 + (h / (b.baseH + b.amp)) * 0.55;
    });

    ico.rotation.x += 0.003;  ico.rotation.y += 0.005;
    tor.rotation.z += 0.007;  tor.rotation.y += 0.002;
    oct.rotation.x += 0.004;  oct.rotation.y += 0.003;

    orb.position.set(
      ico.position.x + Math.cos(t * 0.6) * 5.5,
      ico.position.y + Math.sin(t * 0.4) * 2.5,
      ico.position.z + Math.sin(t * 0.6) * 3.5
    );

    redPoint.intensity  = 4.5 + Math.sin(t * 1.4) * 2;
    redPoint.position.x = Math.sin(t * 0.35) * 7;
    redPoint.position.z = Math.cos(t * 0.28) * 5;

    dust.rotation.y += 0.0007;

    camera.position.y = 7 - scrollY * 0.005;
    camera.position.z = 28 + scrollY * 0.003;

    renderer.render(scene, camera);
  })();
})();
