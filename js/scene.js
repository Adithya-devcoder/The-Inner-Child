/* The Inner Child Restaurant — Three.js 3D coffee cup scene */
(function () {
  'use strict';
  const TIC = window.TIC;
  const { reduce, fine, isMobile, hasGsap } = TIC;
  const gsap = window.gsap, ScrollTrigger = window.ScrollTrigger;

  /* ================= THREE.JS SCENE ================= */
  async function initScene() {
    const THREE = await import('three');
    const { RoomEnvironment } = await import('three/addons/environments/RoomEnvironment.js');
    const canvas = document.getElementById('webgl');
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
    renderer.setSize(innerWidth, innerHeight, false);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;

    const camera = new THREE.PerspectiveCamera(32, innerWidth / innerHeight, 0.1, 100);
    camera.position.set(0, 0.3, isMobile() ? 11 : 10);

    const key = new THREE.DirectionalLight(0xfff0dc, 2.4); key.position.set(4, 6, 5); scene.add(key);
    const rim = new THREE.DirectionalLight(0xffd2a8, 1.2); rim.position.set(-5, 2, -4); scene.add(rim);
    scene.add(new THREE.HemisphereLight(0xfff6ea, 0x6b4a33, 0.55));

    /* --- Latte art texture --- */
    function latteTexture() {
      const S = 512, c = document.createElement('canvas'); c.width = c.height = S;
      const g = c.getContext('2d');
      const grd = g.createRadialGradient(S / 2, S / 2, S * .05, S / 2, S / 2, S / 2);
      grd.addColorStop(0, '#bf8a5a'); grd.addColorStop(.6, '#9c6336'); grd.addColorStop(.88, '#6f3f1f'); grd.addColorStop(1, '#4a2813');
      g.fillStyle = grd; g.fillRect(0, 0, S, S);
      for (let i = 0; i < 260; i++) { g.fillStyle = `rgba(60,30,12,${Math.random() * .18})`; g.beginPath(); g.arc(Math.random() * S, Math.random() * S, Math.random() * 2.2, 0, 7); g.fill(); }
      const o = document.createElement('canvas'); o.width = o.height = S; const q = o.getContext('2d');
      q.fillStyle = '#f8f0e4';
      const n = 9;
      for (let i = 0; i < n; i++) {
        const t = i / (n - 1);
        const y = S * .30 + t * S * .42, w = S * (.12 + t * .19), h = S * (.045 + t * .035);
        q.globalCompositeOperation = 'source-over';
        q.beginPath(); q.ellipse(S / 2, y, w, h, 0, 0, Math.PI * 2); q.fill();
        q.globalCompositeOperation = 'destination-out';
        q.beginPath(); q.ellipse(S / 2, y - h * .62, w * .9, h * .8, 0, 0, Math.PI * 2); q.fill();
      }
      q.globalCompositeOperation = 'source-over';
      q.beginPath(); q.arc(S / 2, S * .235, S * .045, 0, Math.PI * 2); q.fill();
      q.globalCompositeOperation = 'destination-out';
      q.lineWidth = 6; q.lineCap = 'round'; q.beginPath(); q.moveTo(S / 2, S * .2); q.lineTo(S / 2, S * .8); q.stroke();
      g.filter = 'blur(1.4px)'; g.drawImage(o, 0, 0); g.filter = 'none';
      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      return tex;
    }

    /* --- Cup --- */
    const cup = new THREE.Group(); scene.add(cup);
    const model = new THREE.Group(); model.position.y = -0.55; cup.add(model);
    const glaze = new THREE.MeshPhysicalMaterial({ color: 0xc4673a, roughness: .32, clearcoat: 1, clearcoatRoughness: .12, side: THREE.DoubleSide });
    const ceramic = new THREE.MeshPhysicalMaterial({ color: 0xf3ede3, roughness: .3, clearcoat: 1, clearcoatRoughness: .15, side: THREE.DoubleSide });
    const v2 = a => a.map(([x, y]) => new THREE.Vector2(x, y));
    const outer = v2([[0, 0], [.5, 0], [.57, .03], [.63, .12], [.8, .45], [.95, .85], [1.0, 1.1], [1.025, 1.135], [1.0, 1.16]]);
    const inner = v2([[1.0, 1.16], [.955, 1.12], [.905, .86], [.75, .47], [.58, .17], [.3, .11], [0, .1]]);
    model.add(new THREE.Mesh(new THREE.LatheGeometry(outer, 128), glaze));
    model.add(new THREE.Mesh(new THREE.LatheGeometry(inner, 128), ceramic));
    const coffee = new THREE.Mesh(new THREE.CircleGeometry(.93, 96),
      new THREE.MeshPhysicalMaterial({ map: latteTexture(), roughness: .42, clearcoat: .7, clearcoatRoughness: .2 }));
    coffee.rotation.x = -Math.PI / 2; coffee.position.y = 1.0; model.add(coffee);
    const handleCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(.9, .88, 0), new THREE.Vector3(1.28, .93, 0), new THREE.Vector3(1.46, .66, 0),
      new THREE.Vector3(1.28, .38, 0), new THREE.Vector3(.68, .31, 0)]);
    model.add(new THREE.Mesh(new THREE.TubeGeometry(handleCurve, 64, .075, 20, false), glaze));
    const saucer = v2([[0, -.06], [.62, -.06], [.68, -.03], [1.25, .04], [1.55, .16], [1.62, .2], [1.6, .23], [1.5, .2], [1.22, .08], [.66, .02], [0, .02]]);
    model.add(new THREE.Mesh(new THREE.LatheGeometry(saucer, 128), ceramic));

    /* --- Coffee beans (instanced) --- */
    const beanGeo = new THREE.SphereGeometry(1, 28, 18);
    const p = beanGeo.attributes.position;
    for (let i = 0; i < p.count; i++) {
      let x = p.getX(i) * .62, y = p.getY(i) * .45, z = p.getZ(i) * .86;
      if (y > 0) { y *= .55; y -= .11 * Math.exp(-Math.pow(x / .07, 2)); }
      p.setXYZ(i, x, y, z);
    }
    beanGeo.computeVertexNormals();
    const BEANS = isMobile() ? 18 : 32;
    const beans = new THREE.InstancedMesh(beanGeo, new THREE.MeshPhysicalMaterial({ color: 0x4b2a16, roughness: .42, clearcoat: .6, clearcoatRoughness: .3 }), BEANS);
    scene.add(beans);
    const beanData = Array.from({ length: BEANS }, () => ({
      a: Math.random() * Math.PI * 2, r: 1.9 + Math.random() * 1.6, y: (Math.random() - .5) * 2.6,
      sp: (.12 + Math.random() * .22) * (Math.random() < .5 ? -1 : 1), s: .1 + Math.random() * .07,
      rx: Math.random() * 6, ry: Math.random() * 6, rs: .3 + Math.random() * .8
    }));

    /* --- Leaves (instanced) --- */
    const ls = new THREE.Shape(); ls.moveTo(0, -1); ls.bezierCurveTo(.62, -.5, .55, .55, 0, 1); ls.bezierCurveTo(-.55, .55, -.62, -.5, 0, -1);
    const leafGeo = new THREE.ShapeGeometry(ls, 16);
    const lp = leafGeo.attributes.position;
    for (let i = 0; i < lp.count; i++) { const x = lp.getX(i), y = lp.getY(i); lp.setZ(i, .35 * x * x - .12 * y * y); }
    leafGeo.computeVertexNormals();
    const LEAVES = isMobile() ? 8 : 16;
    const leaves = new THREE.InstancedMesh(leafGeo, new THREE.MeshStandardMaterial({ color: 0x6f8159, roughness: .55, side: THREE.DoubleSide }), LEAVES);
    scene.add(leaves);
    const leafData = Array.from({ length: LEAVES }, () => ({
      x: (Math.random() - .5) * 14, y: (Math.random() - .5) * 9, z: -3 - Math.random() * 3,
      s: .22 + Math.random() * .2, sp: .15 + Math.random() * .2, ph: Math.random() * 6, rz: Math.random() * 6
    }));

    /* --- Iridescent glass bubbles --- */
    const bubMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0, metalness: 0, transparent: true, opacity: .28,
      clearcoat: 1, iridescence: 1, iridescenceIOR: 1.3, envMapIntensity: 1.6, depthWrite: false });
    const bubbles = Array.from({ length: isMobile() ? 4 : 7 }, () => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 32), bubMat);
      m.userData = { x: (Math.random() - .5) * 11, y: (Math.random() - .5) * 7, z: -1.5 - Math.random() * 2, s: .18 + Math.random() * .4, ph: Math.random() * 6 };
      scene.add(m); return m;
    });

    /* --- Steam --- */
    const sc = document.createElement('canvas'); sc.width = sc.height = 128;
    const sg = sc.getContext('2d'); const rg = sg.createRadialGradient(64, 64, 0, 64, 64, 64);
    rg.addColorStop(0, 'rgba(255,255,255,1)'); rg.addColorStop(1, 'rgba(255,255,255,0)'); sg.fillStyle = rg; sg.fillRect(0, 0, 128, 128);
    const steamTex = new THREE.CanvasTexture(sc);
    const steam = Array.from({ length: 26 }, (_, i) => {
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: steamTex, transparent: true, depthWrite: false, opacity: 0, color: 0xfffaf2 }));
      s.userData = { life: i / 26, ph: Math.random() * 6, dx: (Math.random() - .5) * .4 };
      scene.add(s); return s;
    });

    /* --- Pose system (driven by GSAP ScrollTrigger) --- */
    const poses = {
      hero:      () => isMobile() ? { x: 0, y: -1.55, rx: .45, ry: -.6, rz: .06, s: .62, spread: .7 } : { x: 2.45, y: -.2, rx: .4, ry: -.6, rz: .08, s: 1.05, spread: 1 },
      story:     () => isMobile() ? { x: 0, y: -3.4, rx: 1.0, ry: .7, rz: 0, s: .55, spread: .6 } : { x: -2.7, y: -.15, rx: 1.0, ry: .7, rz: -.06, s: .95, spread: 1.25 },
      kitchen:   () => ({ x: 0, y: 4.8, rx: .4, ry: 2.4, rz: 0, s: .55, spread: 1.6 }),
      statement: () => isMobile() ? { x: 0, y: -.05, rx: .55, ry: 6.0, rz: 0, s: .72, spread: 1.1 } : { x: 0, y: -.1, rx: .55, ry: 6.0, rz: 0, s: 1.25, spread: 1.7 },
      visit:     () => ({ x: isMobile() ? 0 : 2.6, y: 4.2, rx: .3, ry: 7.4, rz: 0, s: .6, spread: 2 })
    };
    const pose = { ...poses.hero() };
    const cur = { ...pose };
    const intro = { s: 0 };
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    addEventListener('pointermove', e => { mouse.tx = (e.clientX / innerWidth - .5) * 2; mouse.ty = (e.clientY / innerHeight - .5) * 2; });

    const m4 = new THREE.Matrix4(), q4 = new THREE.Quaternion(), e3 = new THREE.Euler(), v3 = new THREE.Vector3(), s3 = new THREE.Vector3(), tmp = new THREE.Vector3();
    let visible = true;

    function render(time) {
      for (const k in cur) cur[k] += (pose[k] - cur[k]) * .075;
      mouse.x += (mouse.tx - mouse.x) * .05; mouse.y += (mouse.ty - mouse.y) * .05;
      const t = time;
      if (!visible) return;
      cup.position.set(cur.x + mouse.x * .12, cur.y + Math.sin(t * 1.1) * .07, 0);
      cup.rotation.set(cur.rx + mouse.y * .12, cur.ry + (reduce ? 0 : t * .14) + mouse.x * .25, cur.rz);
      cup.scale.setScalar(Math.max(.0001, cur.s * intro.s));

      beanData.forEach((b, i) => {
        b.a += b.sp * .01 * (reduce ? 0 : 1);
        const r = b.r * cur.spread * Math.max(.2, cur.s);
        v3.set(cur.x + Math.cos(b.a) * r, cur.y + b.y * cur.s + Math.sin(t * .8 + i) * .12, Math.sin(b.a) * r * .55);
        e3.set(b.rx + t * b.rs, b.ry + t * b.rs * .7, 0); q4.setFromEuler(e3);
        s3.setScalar(b.s * intro.s);
        beans.setMatrixAt(i, m4.compose(v3, q4, s3));
      });
      beans.instanceMatrix.needsUpdate = true;

      leafData.forEach((l, i) => {
        const y = ((l.y - t * l.sp * .5 + 4.5) % 9 + 9) % 9 - 4.5;
        v3.set(l.x + Math.sin(t * .6 + l.ph) * .6 + mouse.x * .3, y, l.z);
        e3.set(Math.sin(t * .7 + l.ph) * .8, Math.cos(t * .5 + l.ph) * .9, l.rz + t * .2); q4.setFromEuler(e3);
        s3.setScalar(l.s * intro.s);
        leaves.setMatrixAt(i, m4.compose(v3, q4, s3));
      });
      leaves.instanceMatrix.needsUpdate = true;

      bubbles.forEach(b => {
        const d = b.userData;
        b.position.set(d.x + Math.sin(t * .4 + d.ph) * .4 - mouse.x * .2, d.y + Math.sin(t * .6 + d.ph) * .35, d.z);
        b.scale.setScalar(d.s * intro.s);
      });

      cup.updateMatrixWorld();
      const emit = cup.localToWorld(tmp.set(0, .5, 0));
      const steamOn = intro.s * Math.max(0, 1 - Math.abs(cur.rx - .45) * .9);
      steam.forEach(s => {
        const d = s.userData;
        d.life += reduce ? 0 : .0045; if (d.life > 1) { d.life = 0; d.dx = (Math.random() - .5) * .4; }
        const L = d.life;
        s.position.set(emit.x + Math.sin(t * 1.6 + d.ph + L * 4) * .18 * L + d.dx * L, emit.y + L * 1.9 * cur.s, emit.z);
        s.scale.setScalar((.35 + L * .9) * cur.s);
        s.material.opacity = Math.sin(L * Math.PI) * .32 * steamOn;
      });

      renderer.render(scene, camera);
    }

    function resize() {
      camera.aspect = innerWidth / innerHeight;
      camera.position.z = isMobile() ? 11 : 10;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight, false);
    }
    addEventListener('resize', resize);

    return { pose, poses, intro, render, setVisible: v => { visible = v; } };
  }
  TIC.initScene = initScene;
})();
