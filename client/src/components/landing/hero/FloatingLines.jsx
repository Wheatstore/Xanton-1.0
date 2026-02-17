import { useEffect, useMemo, useRef } from "react";

const vertexShader = `
precision highp float;
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// IMPORTANT: WebGL1-friendly loops need constant bounds.
// We keep look the same by looping up to a max and "breaking" logically.
const fragmentShader = `
precision highp float;

uniform float iTime;
uniform vec3  iResolution;
uniform float animationSpeed;

uniform bool enableTop;
uniform bool enableMiddle;
uniform bool enableBottom;

uniform int topLineCount;
uniform int middleLineCount;
uniform int bottomLineCount;

uniform float topLineDistance;
uniform float middleLineDistance;
uniform float bottomLineDistance;

uniform vec3 topWavePosition;
uniform vec3 middleWavePosition;
uniform vec3 bottomWavePosition;

uniform vec2 iMouse;
uniform bool interactive;
uniform float bendRadius;
uniform float bendStrength;
uniform float bendInfluence;

uniform bool parallax;
uniform float parallaxStrength;
uniform vec2 parallaxOffset;

uniform vec3 lineGradient[8];
uniform int lineGradientCount;

const vec3 BLACK = vec3(0.0);
const vec3 PINK  = vec3(233.0, 71.0, 245.0) / 255.0;
const vec3 BLUE  = vec3(47.0,  75.0, 162.0) / 255.0;

mat2 rotate(float r) { return mat2(cos(r), sin(r), -sin(r), cos(r)); }

vec3 background_color(vec2 uv) {
  vec3 col = vec3(0.0);
  float y = sin(uv.x - 0.2) * 0.3 - 0.1;
  float m = uv.y - y;
  col += mix(BLUE, BLACK, smoothstep(0.0, 1.0, abs(m)));
  col += mix(PINK, BLACK, smoothstep(0.0, 1.0, abs(m - 0.8)));
  return col * 0.5;
}

vec3 getLineColor(float t, vec3 baseColor) {
  if (lineGradientCount <= 0) return baseColor;

  vec3 gradientColor;
  if (lineGradientCount == 1) {
    gradientColor = lineGradient[0];
  } else {
    float clampedT = clamp(t, 0.0, 0.9999);
    float scaled = clampedT * float(lineGradientCount - 1);
    int idx = int(floor(scaled));
    float f = fract(scaled);
    int idx2 = min(idx + 1, lineGradientCount - 1);
    gradientColor = mix(lineGradient[idx], lineGradient[idx2], f);
  }
  return gradientColor * 0.5;
}

float wave(vec2 uv, float offset, vec2 screenUv, vec2 mouseUv, bool shouldBend) {
  float time = iTime * animationSpeed;

  float x_offset   = offset;
  float x_movement = time * 0.1;
  float amp        = sin(offset + time * 0.2) * 0.3;
  float y          = sin(uv.x + x_offset + x_movement) * amp;

  if (shouldBend) {
    vec2 d = screenUv - mouseUv;
    float influence = exp(-dot(d, d) * bendRadius);
    float bendOffset = (mouseUv.y - screenUv.y) * influence * bendStrength * bendInfluence;
    y += bendOffset;
  }

  float m = uv.y - y;
  return 0.0175 / max(abs(m) + 0.01, 1e-3) + 0.01;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 baseUv = (2.0 * fragCoord - iResolution.xy) / iResolution.y;
  baseUv.y *= -1.0;

  if (parallax) baseUv += parallaxOffset;

  vec3 col = vec3(0.0);
  vec3 b = lineGradientCount > 0 ? vec3(0.0) : background_color(baseUv);

  vec2 mouseUv = vec2(0.0);
  if (interactive) {
    mouseUv = (2.0 * iMouse - iResolution.xy) / iResolution.y;
    mouseUv.y *= -1.0;
  }

  // Keep these reasonably high if you ever increase lineCount.
  const int MAX_LINES = 32;

  if (enableBottom) {
    for (int i = 0; i < MAX_LINES; ++i) {
      if (i >= bottomLineCount) break;
      float fi = float(i);
      float t = fi / max(float(bottomLineCount - 1), 1.0);
      vec3 lineCol = getLineColor(t, b);

      float angle = bottomWavePosition.z * log(length(baseUv) + 1.0);
      vec2 ruv = baseUv * rotate(angle);
      col += lineCol * wave(
        ruv + vec2(bottomLineDistance * fi + bottomWavePosition.x, bottomWavePosition.y),
        1.5 + 0.2 * fi,
        baseUv,
        mouseUv,
        interactive
      ) * 0.2;
    }
  }

  if (enableMiddle) {
    for (int i = 0; i < MAX_LINES; ++i) {
      if (i >= middleLineCount) break;
      float fi = float(i);
      float t = fi / max(float(middleLineCount - 1), 1.0);
      vec3 lineCol = getLineColor(t, b);

      float angle = middleWavePosition.z * log(length(baseUv) + 1.0);
      vec2 ruv = baseUv * rotate(angle);
      col += lineCol * wave(
        ruv + vec2(middleLineDistance * fi + middleWavePosition.x, middleWavePosition.y),
        2.0 + 0.15 * fi,
        baseUv,
        mouseUv,
        interactive
      );
    }
  }

  if (enableTop) {
    for (int i = 0; i < MAX_LINES; ++i) {
      if (i >= topLineCount) break;
      float fi = float(i);
      float t = fi / max(float(topLineCount - 1), 1.0);
      vec3 lineCol = getLineColor(t, b);

      float angle = topWavePosition.z * log(length(baseUv) + 1.0);
      vec2 ruv = baseUv * rotate(angle);
      ruv.x *= -1.0;
      col += lineCol * wave(
        ruv + vec2(topLineDistance * fi + topWavePosition.x, topWavePosition.y),
        1.0 + 0.2 * fi,
        baseUv,
        mouseUv,
        interactive
      ) * 0.1;
    }
  }

  fragColor = vec4(col, 1.0);
}

void main() {
  vec4 color = vec4(0.0);
  mainImage(color, gl_FragCoord.xy);
  gl_FragColor = color;
}
`;

const MAX_GRADIENT_STOPS = 8;

function hexToRGB01(hex) {
  let v = hex.trim();
  if (v.startsWith("#")) v = v.slice(1);

  let r = 255, g = 255, b = 255;
  if (v.length === 3) {
    r = parseInt(v[0] + v[0], 16);
    g = parseInt(v[1] + v[1], 16);
    b = parseInt(v[2] + v[2], 16);
  } else if (v.length === 6) {
    r = parseInt(v.slice(0, 2), 16);
    g = parseInt(v.slice(2, 4), 16);
    b = parseInt(v.slice(4, 6), 16);
  }
  return [r / 255, g / 255, b / 255];
}

export default function FloatingLines({
  linesGradient,
  enabledWaves = ["top", "middle", "bottom"],
  lineCount = [6],
  lineDistance = [5],
  topWavePosition,
  middleWavePosition,
  bottomWavePosition = { x: 2.0, y: -0.7, rotate: -1 },

  animationSpeed = 1,
  interactive = true,
  bendRadius = 5.0,
  bendStrength = -0.5,
  mouseDamping = 0.05,

  parallax = true,
  parallaxStrength = 0.2,
  mixBlendMode = "screen",

  // Performance knobs (safe defaults)
  resolutionScale = 0.75, // <--- BIG WIN. 0.6–0.85 typically looks identical.
  maxDpr = 1.25,          // cap devicePixelRatio
  targetFps = 60          // set 40 or 30 if you want even less GPU use
}) {
  const containerRef = useRef(null);

  // runtime refs
  const threeRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const materialRef = useRef(null);
  const geometryRef = useRef(null);
  const meshRef = useRef(null);
  const uniformsRef = useRef(null);

  const rafRef = useRef(0);
  const runningRef = useRef(false);

  const targetMouseRef = useRef({ x: -1000, y: -1000 });
  const currentMouseRef = useRef({ x: -1000, y: -1000 });
  const targetInfluenceRef = useRef(0);
  const currentInfluenceRef = useRef(0);
  const targetParallaxRef = useRef({ x: 0, y: 0 });
  const currentParallaxRef = useRef({ x: 0, y: 0 });

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  }, []);

  const getLineCount = (waveType) => {
    if (typeof lineCount === "number") return lineCount;
    if (!enabledWaves.includes(waveType)) return 0;
    const idx = enabledWaves.indexOf(waveType);
    return lineCount[idx] ?? 6;
  };

  const getLineDistance = (waveType) => {
    if (typeof lineDistance === "number") return lineDistance;
    if (!enabledWaves.includes(waveType)) return 0.1;
    const idx = enabledWaves.indexOf(waveType);
    return lineDistance[idx] ?? 0.1;
  };

  // --- 1) Create WebGL once (lazy-load three)
  useEffect(() => {
    let destroyed = false;

    const el = containerRef.current;
    if (!el) return;

    // If user prefers reduced motion, don’t start the heavy animation.
    if (prefersReducedMotion) return;

    (async () => {
      const three = await import("three");
      if (destroyed) return;

      threeRef.current = three;

      const scene = new three.Scene();
      const camera = new three.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      camera.position.z = 1;

      const renderer = new three.WebGLRenderer({
        antialias: false,
        alpha: false,
        powerPreference: "low-power",
        stencil: false,
        depth: false
      });

      // cap DPR and then downscale resolution further via setSize
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      renderer.setPixelRatio(dpr);

      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      renderer.domElement.style.display = "block";
      el.appendChild(renderer.domElement);

      const uniforms = {
        iTime: { value: 0 },
        iResolution: { value: new three.Vector3(1, 1, 1) },
        animationSpeed: { value: animationSpeed },

        enableTop: { value: enabledWaves.includes("top") },
        enableMiddle: { value: enabledWaves.includes("middle") },
        enableBottom: { value: enabledWaves.includes("bottom") },

        topLineCount: { value: enabledWaves.includes("top") ? getLineCount("top") : 0 },
        middleLineCount: { value: enabledWaves.includes("middle") ? getLineCount("middle") : 0 },
        bottomLineCount: { value: enabledWaves.includes("bottom") ? getLineCount("bottom") : 0 },

        topLineDistance: { value: (enabledWaves.includes("top") ? getLineDistance("top") : 0.1) * 0.01 },
        middleLineDistance: { value: (enabledWaves.includes("middle") ? getLineDistance("middle") : 0.1) * 0.01 },
        bottomLineDistance: { value: (enabledWaves.includes("bottom") ? getLineDistance("bottom") : 0.1) * 0.01 },

        topWavePosition: {
          value: new three.Vector3(topWavePosition?.x ?? 10.0, topWavePosition?.y ?? 0.5, topWavePosition?.rotate ?? -0.4)
        },
        middleWavePosition: {
          value: new three.Vector3(middleWavePosition?.x ?? 5.0, middleWavePosition?.y ?? 0.0, middleWavePosition?.rotate ?? 0.2)
        },
        bottomWavePosition: {
          value: new three.Vector3(bottomWavePosition?.x ?? 2.0, bottomWavePosition?.y ?? -0.7, bottomWavePosition?.rotate ?? 0.4)
        },

        iMouse: { value: new three.Vector2(-1000, -1000) },
        interactive: { value: interactive },
        bendRadius: { value: bendRadius },
        bendStrength: { value: bendStrength },
        bendInfluence: { value: 0 },

        parallax: { value: parallax },
        parallaxStrength: { value: parallaxStrength },
        parallaxOffset: { value: new three.Vector2(0, 0) },

        lineGradient: {
          value: Array.from({ length: MAX_GRADIENT_STOPS }, () => new three.Vector3(1, 1, 1))
        },
        lineGradientCount: { value: 0 }
      };

      const material = new three.ShaderMaterial({
        uniforms,
        vertexShader,
        fragmentShader
      });

      const geometry = new three.PlaneGeometry(2, 2);
      const mesh = new three.Mesh(geometry, material);
      scene.add(mesh);

      // store refs
      sceneRef.current = scene;
      cameraRef.current = camera;
      rendererRef.current = renderer;
      uniformsRef.current = uniforms;
      materialRef.current = material;
      geometryRef.current = geometry;
      meshRef.current = mesh;

      const setSize = () => {
        const w = el.clientWidth || 1;
        const h = el.clientHeight || 1;

        // Here’s the money: render fewer pixels, scale up visually.
        const scaledW = Math.max(1, Math.floor(w * resolutionScale));
        const scaledH = Math.max(1, Math.floor(h * resolutionScale));

        renderer.setSize(scaledW, scaledH, false);
        uniforms.iResolution.value.set(renderer.domElement.width, renderer.domElement.height, 1);
      };

      setSize();

      const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(setSize) : null;
      ro?.observe(el);

      const handlePointerMove = (event) => {
        if (!rendererRef.current) return;
        const rect = renderer.domElement.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // map into the *actual* canvas pixel space (post-scale)
        const canvasW = renderer.domElement.width;
        const canvasH = renderer.domElement.height;

        const px = (x / rect.width) * canvasW;
        const py = ((rect.height - y) / rect.height) * canvasH;

        targetMouseRef.current.x = px;
        targetMouseRef.current.y = py;
        targetInfluenceRef.current = 1.0;

        if (parallax) {
          const ox = (x - rect.width / 2) / rect.width;
          const oy = -(y - rect.height / 2) / rect.height;
          targetParallaxRef.current.x = ox * parallaxStrength;
          targetParallaxRef.current.y = oy * parallaxStrength;
        }
      };

      const handlePointerLeave = () => {
        targetInfluenceRef.current = 0.0;
      };

      if (interactive) {
        renderer.domElement.addEventListener("pointermove", handlePointerMove, { passive: true });
        renderer.domElement.addEventListener("pointerleave", handlePointerLeave, { passive: true });
      }

      // Pause when offscreen or tab hidden
      const io = typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver((entries) => {
            const isVisible = entries[0]?.isIntersecting ?? true;
            if (isVisible) start();
            else stop();
          }, { threshold: 0.01 })
        : null;

      io?.observe(el);

      const onVis = () => {
        if (document.hidden) stop();
        else start();
      };
      document.addEventListener("visibilitychange", onVis);

      // Render loop with FPS cap
      let last = performance.now();
      const frameInterval = 1000 / Math.max(1, targetFps);

      const tick = (now) => {
        if (!runningRef.current) return;

        rafRef.current = requestAnimationFrame(tick);

        // fps cap
        if (now - last < frameInterval) return;
        last = now;

        const u = uniformsRef.current;
        if (!u) return;

        u.iTime.value = now * 0.001;

        if (u.interactive.value) {
          // damp mouse + influence
          currentMouseRef.current.x += (targetMouseRef.current.x - currentMouseRef.current.x) * mouseDamping;
          currentMouseRef.current.y += (targetMouseRef.current.y - currentMouseRef.current.y) * mouseDamping;
          u.iMouse.value.set(currentMouseRef.current.x, currentMouseRef.current.y);

          currentInfluenceRef.current += (targetInfluenceRef.current - currentInfluenceRef.current) * mouseDamping;
          u.bendInfluence.value = currentInfluenceRef.current;
        }

        if (u.parallax.value) {
          currentParallaxRef.current.x += (targetParallaxRef.current.x - currentParallaxRef.current.x) * mouseDamping;
          currentParallaxRef.current.y += (targetParallaxRef.current.y - currentParallaxRef.current.y) * mouseDamping;
          u.parallaxOffset.value.set(currentParallaxRef.current.x, currentParallaxRef.current.y);
        }

        renderer.render(scene, camera);
      };

      const start = () => {
        if (runningRef.current) return;
        runningRef.current = true;
        rafRef.current = requestAnimationFrame(tick);
      };

      const stop = () => {
        runningRef.current = false;
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      };

      // expose for cleanup
      const cleanup = () => {
        stop();
        ro?.disconnect();
        io?.disconnect();
        document.removeEventListener("visibilitychange", onVis);

        if (interactive && renderer?.domElement) {
          renderer.domElement.removeEventListener("pointermove", handlePointerMove);
          renderer.domElement.removeEventListener("pointerleave", handlePointerLeave);
        }

        geometry.dispose();
        material.dispose();
        renderer.dispose();

        if (renderer.domElement?.parentElement) {
          renderer.domElement.parentElement.removeChild(renderer.domElement);
        }
      };

      // attach cleanup
      rendererRef.current.__cleanup = cleanup;

      // start immediately (IO may pause it if offscreen)
      start();
    })();

    return () => {
      destroyed = true;
      const r = rendererRef.current;
      if (r?.__cleanup) r.__cleanup();
      rendererRef.current = null;
      sceneRef.current = null;
      cameraRef.current = null;
      uniformsRef.current = null;
      materialRef.current = null;
      geometryRef.current = null;
      meshRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- 2) Update uniforms when props change (no renderer rebuild)
  useEffect(() => {
    const three = threeRef.current;
    const u = uniformsRef.current;
    if (!three || !u) return;

    u.animationSpeed.value = animationSpeed;

    u.enableTop.value = enabledWaves.includes("top");
    u.enableMiddle.value = enabledWaves.includes("middle");
    u.enableBottom.value = enabledWaves.includes("bottom");

    u.topLineCount.value = u.enableTop.value ? getLineCount("top") : 0;
    u.middleLineCount.value = u.enableMiddle.value ? getLineCount("middle") : 0;
    u.bottomLineCount.value = u.enableBottom.value ? getLineCount("bottom") : 0;

    u.topLineDistance.value = (u.enableTop.value ? getLineDistance("top") : 0.1) * 0.01;
    u.middleLineDistance.value = (u.enableMiddle.value ? getLineDistance("middle") : 0.1) * 0.01;
    u.bottomLineDistance.value = (u.enableBottom.value ? getLineDistance("bottom") : 0.1) * 0.01;

    u.topWavePosition.value.set(topWavePosition?.x ?? 10.0, topWavePosition?.y ?? 0.5, topWavePosition?.rotate ?? -0.4);
    u.middleWavePosition.value.set(middleWavePosition?.x ?? 5.0, middleWavePosition?.y ?? 0.0, middleWavePosition?.rotate ?? 0.2);
    u.bottomWavePosition.value.set(bottomWavePosition?.x ?? 2.0, bottomWavePosition?.y ?? -0.7, bottomWavePosition?.rotate ?? 0.4);

    u.interactive.value = interactive;
    u.bendRadius.value = bendRadius;
    u.bendStrength.value = bendStrength;

    u.parallax.value = parallax;
    u.parallaxStrength.value = parallaxStrength;

    // gradient
    if (linesGradient && linesGradient.length > 0) {
      const stops = linesGradient.slice(0, MAX_GRADIENT_STOPS);
      u.lineGradientCount.value = stops.length;
      stops.forEach((hex, i) => {
        const [r, g, b] = hexToRGB01(hex);
        u.lineGradient.value[i].set(r, g, b);
      });
    } else {
      u.lineGradientCount.value = 0;
    }
  }, [
    linesGradient,
    enabledWaves,
    lineCount,
    lineDistance,
    topWavePosition,
    middleWavePosition,
    bottomWavePosition,
    animationSpeed,
    interactive,
    bendRadius,
    bendStrength,
    parallax,
    parallaxStrength
  ]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative overflow-hidden floating-lines-container"
      style={{ mixBlendMode }}
    />
  );
}
