import * as THREE from "three";

/**
 * Pure Open Space Cosmic Vortex Engine (Non-Interactable)
 * Composed strictly of big and small space dots (zero planets, zero rings).
 * Color dynamically transitions based on the active section's primary color.
 */
export function initScene(canvas) {
  if (!canvas) return { destroy() {}, setSectionColor() {} };

  const mobile = window.matchMedia("(max-width: 768px)").matches;
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 2));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x040714, 0.018);

  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.set(0, 1.2, 6.2);

  const masterGroup = new THREE.Group();
  masterGroup.position.y = -2.2;
  scene.add(masterGroup);

  // --------------------------------------------------------------------------
  // Circular Soft Glow Point Sprite Texture
  // --------------------------------------------------------------------------
  const makeGlowPointTexture = () => {
    const pCanvas = document.createElement("canvas");
    pCanvas.width = 64;
    pCanvas.height = 64;
    const ctx = pCanvas.getContext("2d");
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(255, 255, 255, 1)");
    g.addColorStop(0.3, "rgba(255, 255, 255, 0.85)");
    g.addColorStop(0.65, "rgba(255, 255, 255, 0.25)");
    g.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(pCanvas);
  };
  const pointTexture = makeGlowPointTexture();

  // --------------------------------------------------------------------------
  // Big & Small Space Vortex Particles (5,000+ Points)
  // --------------------------------------------------------------------------
  const vortexCount = mobile ? 2800 : 5400;
  const positions = new Float32Array(vortexCount * 3);
  const sizes = new Float32Array(vortexCount);
  const randoms = new Float32Array(vortexCount);

  const arms = 3;
  const radiusMax = 9.5;
  const spinFactor = 1.4;

  for (let i = 0; i < vortexCount; i++) {
    // Distance from center with logarithmic distribution
    const r = Math.pow(Math.random(), 1.6) * radiusMax;
    const branchAngle = ((i % arms) * ((2 * Math.PI) / arms));
    const spinAngle = r * spinFactor;

    // Organic 3D dispersion perpendicular to galactic disk
    const dispersion = r * 0.35 + 0.25;
    const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.45 * dispersion;
    const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.42 * (r * 0.3 + 0.15);
    const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.45 * dispersion;

    const x = Math.cos(branchAngle + spinAngle) * r + randomX;
    const y = randomY;
    const z = Math.sin(branchAngle + spinAngle) * r + randomZ;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    // Big and small dots: 70% small, 20% medium, 10% big glowing focal stars
    const rnd = Math.random();
    randoms[i] = rnd;
    if (rnd < 0.7) {
      sizes[i] = Math.random() * 0.05 + 0.035; // Small stars
    } else if (rnd < 0.92) {
      sizes[i] = Math.random() * 0.09 + 0.06; // Medium cosmic dots
    } else {
      sizes[i] = Math.random() * 0.16 + 0.12; // Big prominent space dots
    }
    if (mobile) sizes[i] *= 1.25;
  }

  const vortexGeo = new THREE.BufferGeometry();
  vortexGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  vortexGeo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
  vortexGeo.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));

  // Dynamic color uniforms that interpolate to match active section
  const uniforms = {
    uTime: { value: 0 },
    uTexture: { value: pointTexture },
    uColorCore: { value: new THREE.Color(0x00f2fe) }, // Native hero Cyan
    uColorMid: { value: new THREE.Color(0x2563eb) },
    uColorOuter: { value: new THREE.Color(0x1d4ed8) },
  };

  const vortexShaderMat = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: `
      attribute float aSize;
      attribute float aRandom;
      varying vec3 vColor;
      varying float vRandom;
      uniform float uTime;
      uniform vec3 uColorCore;
      uniform vec3 uColorMid;
      uniform vec3 uColorOuter;

      void main() {
        vRandom = aRandom;
        float dist = length(position.xz);
        
        vec3 col = uColorCore;
        if (dist < 3.2) {
          col = mix(uColorCore, uColorMid, dist / 3.2);
        } else {
          col = mix(uColorMid, uColorOuter, clamp((dist - 3.2) / 6.0, 0.0, 1.0));
        }

        // Add subtle bright twinkle to individual stars
        if (aRandom > 0.86) {
          col = mix(col, vec3(1.0, 1.0, 1.0), 0.7);
        }
        vColor = col;

        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        float twinkle = 1.0 + sin(uTime * 2.2 + aRandom * 15.0) * 0.22;
        gl_PointSize = aSize * twinkle * (240.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vRandom;
      uniform sampler2D uTexture;

      void main() {
        vec4 tex = texture2D(uTexture, gl_PointCoord);
        if (tex.a < 0.05) discard;
        gl_FragColor = vec4(vColor, tex.a * 0.95);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const vortexPoints = new THREE.Points(vortexGeo, vortexShaderMat);
  masterGroup.add(vortexPoints);

  // --------------------------------------------------------------------------
  // Volumetric Deep Space Background Starfield (Big & Small Dots)
  // --------------------------------------------------------------------------
  const deepCount = mobile ? 900 : 2200;
  const deepPos = new Float32Array(deepCount * 3);
  const deepSizes = new Float32Array(deepCount);
  const deepRandoms = new Float32Array(deepCount);

  for (let i = 0; i < deepCount; i++) {
    deepPos[i * 3] = (Math.random() - 0.5) * 110;
    deepPos[i * 3 + 1] = (Math.random() - 0.5) * 80;
    deepPos[i * 3 + 2] = (Math.random() - 0.5) * 110 - 15;

    const rnd = Math.random();
    deepRandoms[i] = rnd;
    deepSizes[i] = rnd > 0.85 ? Math.random() * 0.1 + 0.08 : Math.random() * 0.04 + 0.02;
  }

  const deepGeo = new THREE.BufferGeometry();
  deepGeo.setAttribute("position", new THREE.BufferAttribute(deepPos, 3));
  deepGeo.setAttribute("aSize", new THREE.BufferAttribute(deepSizes, 1));
  deepGeo.setAttribute("aRandom", new THREE.BufferAttribute(deepRandoms, 1));

  const deepUniforms = {
    uTime: { value: 0 },
    uTexture: { value: pointTexture },
    uColorCore: { value: new THREE.Color(0xffffff) },
    uColorMid: { value: new THREE.Color(0x93c5fd) },
    uColorOuter: { value: new THREE.Color(0x38bdf8) },
  };

  const deepShaderMat = new THREE.ShaderMaterial({
    uniforms: deepUniforms,
    vertexShader: `
      attribute float aSize;
      attribute float aRandom;
      varying vec3 vColor;
      uniform float uTime;
      uniform vec3 uColorCore;

      void main() {
        vColor = mix(vec3(0.6, 0.75, 1.0), uColorCore, aRandom);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        float twinkle = 1.0 + sin(uTime * 1.5 + aRandom * 10.0) * 0.28;
        gl_PointSize = aSize * twinkle * (200.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      uniform sampler2D uTexture;

      void main() {
        vec4 tex = texture2D(uTexture, gl_PointCoord);
        if (tex.a < 0.05) discard;
        gl_FragColor = vec4(vColor, tex.a * 0.65);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const deepField = new THREE.Points(deepGeo, deepShaderMat);
  scene.add(deepField);

  // --------------------------------------------------------------------------
  // Smooth Color Interpolation Target State
  // --------------------------------------------------------------------------
  const targetColors = {
    core: new THREE.Color(0x00f2fe),
    mid: new THREE.Color(0x2563eb),
    outer: new THREE.Color(0x1d4ed8),
  };

  /**
   * Called on scroll when entering a new section
   * @param {string} primaryHex - Section primary color
   * @param {string} secondaryHex - Complementary glow color
   */
  function setSectionColor(primaryHex, secondaryHex) {
    if (!primaryHex) return;
    targetColors.core.set(primaryHex);
    if (secondaryHex) {
      targetColors.mid.set(secondaryHex);
      targetColors.outer.set(secondaryHex).multiplyScalar(0.7);
    } else {
      targetColors.mid.set(primaryHex).offsetHSL(0.04, 0, -0.15);
      targetColors.outer.set(primaryHex).offsetHSL(0.08, 0, -0.3);
    }
  }

  // --------------------------------------------------------------------------
  // Non-Interactable Cinematic Cosmic Motion & Camera Glide
  // --------------------------------------------------------------------------
  const onResize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  };
  window.addEventListener("resize", onResize, { passive: true });
  onResize();

  let rafId = 0;
  let active = true;

  const animate = (time) => {
    if (!active) return;
    const t = time * 0.001;

    uniforms.uTime.value = t;
    deepUniforms.uTime.value = t;

    // Smooth color interpolation towards active section palette
    uniforms.uColorCore.value.lerp(targetColors.core, 0.04);
    uniforms.uColorMid.value.lerp(targetColors.mid, 0.04);
    uniforms.uColorOuter.value.lerp(targetColors.outer, 0.04);
    deepUniforms.uColorCore.value.lerp(targetColors.core, 0.03);

    // Natural cosmic rotation (strictly non-interactable, autonomous)
    masterGroup.rotation.y = t * 0.06;
    masterGroup.rotation.x = 0.48 + Math.sin(t * 0.08) * 0.04;
    masterGroup.rotation.z = Math.cos(t * 0.06) * 0.03;

    deepField.rotation.y = t * 0.01;

    // Smooth scroll interpolation
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    if (maxScroll > 100 && window.scrollY > 0) {
      const windowP = window.scrollY / maxScroll;
      if (Math.abs(windowP - targetScrollP) > 0.04) {
        targetScrollP = windowP;
      }
    }

    currentScrollP += (targetScrollP - currentScrollP) * 0.08;

    // Vortex smoothly rises from DOWN to UP as user advances through the site
    masterGroup.position.y = -2.2 + (currentScrollP * 5.6);

    // Zoomed-in cosmic depth with subtle camera tracking
    camera.position.z = 6.2 + (currentScrollP * 1.6);
    camera.position.y = 1.2 - (currentScrollP * 1.4);
    camera.position.x = Math.sin(currentScrollP * Math.PI) * 1.1;
    camera.lookAt(0, masterGroup.position.y * 0.25, 0);

    renderer.render(scene, camera);
    rafId = requestAnimationFrame(animate);
  };

  let targetScrollP = 0;
  let currentScrollP = 0;

  function setScrollProgress(p) {
    if (typeof p === "number" && !isNaN(p)) {
      targetScrollP = Math.max(0, Math.min(1, p));
    }
  }

  rafId = requestAnimationFrame(animate);

  document.addEventListener("visibilitychange", () => {
    active = document.visibilityState === "visible";
    if (active) rafId = requestAnimationFrame(animate);
    else cancelAnimationFrame(rafId);
  });

  return {
    destroy() {
      active = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      vortexGeo.dispose();
      deepGeo.dispose();
      vortexShaderMat.dispose();
      deepShaderMat.dispose();
    },
    setSectionColor,
    setScrollProgress,
  };
}