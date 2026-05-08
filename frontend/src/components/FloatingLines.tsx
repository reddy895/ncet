import { useEffect, useRef } from 'react';
import {
  Scene, OrthographicCamera, WebGLRenderer,
  PlaneGeometry, Mesh, ShaderMaterial,
  Vector3, Vector2, Clock,
} from 'three';

const vertexShader = `precision highp float;
void main() { gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;

const fragmentShader = `precision highp float;
uniform float iTime; uniform vec3 iResolution; uniform float animationSpeed;
uniform bool enableTop; uniform bool enableMiddle; uniform bool enableBottom;
uniform int topLineCount; uniform int middleLineCount; uniform int bottomLineCount;
uniform float topLineDistance; uniform float middleLineDistance; uniform float bottomLineDistance;
uniform vec3 topWavePosition; uniform vec3 middleWavePosition; uniform vec3 bottomWavePosition;
uniform vec2 iMouse; uniform bool interactive; uniform float bendRadius;
uniform float bendStrength; uniform float bendInfluence; uniform bool parallax;
uniform float parallaxStrength; uniform vec2 parallaxOffset;
uniform vec3 lineGradient[8]; uniform int lineGradientCount;
const vec3 BLACK = vec3(0.0);
const vec3 PINK  = vec3(233.0, 71.0, 245.0) / 255.0;
const vec3 BLUE  = vec3(47.0,  75.0, 162.0) / 255.0;
mat2 rotate(float r) { return mat2(cos(r), sin(r), -sin(r), cos(r)); }
vec3 background_color(vec2 uv) {
  vec3 col = vec3(0.0);
  float y = sin(uv.x - 0.2) * 0.3 - 0.1; float m = uv.y - y;
  col += mix(BLUE, BLACK, smoothstep(0.0, 1.0, abs(m)));
  col += mix(PINK, BLACK, smoothstep(0.0, 1.0, abs(m - 0.8)));
  return col * 0.5;
}
vec3 getLineColor(float t, vec3 baseColor) {
  if (lineGradientCount <= 0) return baseColor;
  vec3 gradientColor;
  if (lineGradientCount == 1) { gradientColor = lineGradient[0]; }
  else {
    float clampedT = clamp(t, 0.0, 0.9999);
    float scaled = clampedT * float(lineGradientCount - 1);
    int idx = int(floor(scaled)); float f = fract(scaled);
    int idx2 = min(idx + 1, lineGradientCount - 1);
    gradientColor = mix(lineGradient[idx], lineGradient[idx2], f);
  }
  return gradientColor * 0.5;
}
float wave(vec2 uv, float offset, vec2 screenUv, vec2 mouseUv, bool shouldBend) {
  float time = iTime * animationSpeed;
  float amp = sin(offset + time * 0.2) * 0.3;
  float y = sin(uv.x + offset + time * 0.1) * amp;
  if (shouldBend) {
    vec2 d = screenUv - mouseUv;
    float influence = exp(-dot(d, d) * bendRadius);
    y += (mouseUv.y - screenUv.y) * influence * bendStrength * bendInfluence;
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
  if (interactive) { mouseUv = (2.0 * iMouse - iResolution.xy) / iResolution.y; mouseUv.y *= -1.0; }
  if (enableBottom) {
    for (int i = 0; i < bottomLineCount; ++i) {
      float fi = float(i); float t = fi / max(float(bottomLineCount - 1), 1.0);
      vec3 lineCol = getLineColor(t, b);
      float angle = bottomWavePosition.z * log(length(baseUv) + 1.0);
      vec2 ruv = baseUv * rotate(angle);
      col += lineCol * wave(ruv + vec2(bottomLineDistance * fi + bottomWavePosition.x, bottomWavePosition.y), 1.5 + 0.2 * fi, baseUv, mouseUv, interactive) * 0.2;
    }
  }
  if (enableMiddle) {
    for (int i = 0; i < middleLineCount; ++i) {
      float fi = float(i); float t = fi / max(float(middleLineCount - 1), 1.0);
      vec3 lineCol = getLineColor(t, b);
      float angle = middleWavePosition.z * log(length(baseUv) + 1.0);
      vec2 ruv = baseUv * rotate(angle);
      col += lineCol * wave(ruv + vec2(middleLineDistance * fi + middleWavePosition.x, middleWavePosition.y), 2.0 + 0.15 * fi, baseUv, mouseUv, interactive);
    }
  }
  if (enableTop) {
    for (int i = 0; i < topLineCount; ++i) {
      float fi = float(i); float t = fi / max(float(topLineCount - 1), 1.0);
      vec3 lineCol = getLineColor(t, b);
      float angle = topWavePosition.z * log(length(baseUv) + 1.0);
      vec2 ruv = baseUv * rotate(angle); ruv.x *= -1.0;
      col += lineCol * wave(ruv + vec2(topLineDistance * fi + topWavePosition.x, topWavePosition.y), 1.0 + 0.2 * fi, baseUv, mouseUv, interactive) * 0.1;
    }
  }
  fragColor = vec4(col, 1.0);
}
void main() { vec4 color = vec4(0.0); mainImage(color, gl_FragCoord.xy); gl_FragColor = color; }`;

const MAX_GRADIENT_STOPS = 8;

export type WavePosition = { x: number; y: number; rotate: number; };

export interface FloatingLinesProps {
  linesGradient?: string[];
  enabledWaves?: Array<'top' | 'middle' | 'bottom'>;
  lineCount?: number | number[];
  lineDistance?: number | number[];
  topWavePosition?: WavePosition;
  middleWavePosition?: WavePosition;
  bottomWavePosition?: WavePosition;
  animationSpeed?: number;
  interactive?: boolean;
  bendRadius?: number;
  bendStrength?: number;
  mouseDamping?: number;
  parallax?: boolean;
  parallaxStrength?: number;
  mixBlendMode?: React.CSSProperties['mixBlendMode'];
}

function hexToVec3(hex: string): Vector3 {
  let v = hex.trim().replace('#', '');
  if (v.length === 3) v = v[0]+v[0]+v[1]+v[1]+v[2]+v[2];
  return new Vector3(parseInt(v.slice(0,2),16)/255, parseInt(v.slice(2,4),16)/255, parseInt(v.slice(4,6),16)/255);
}

export function FloatingLines({
  linesGradient,
  enabledWaves = ['top', 'middle', 'bottom'],
  lineCount = [6], lineDistance = [5],
  topWavePosition, middleWavePosition,
  bottomWavePosition = { x: 2.0, y: -0.7, rotate: -1 },
  animationSpeed = 1, interactive = true,
  bendRadius = 5.0, bendStrength = -0.5,
  mouseDamping = 0.05, parallax = true,
  parallaxStrength = 0.2, mixBlendMode = 'screen',
}: FloatingLinesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const targetMouse   = useRef(new Vector2(-1000, -1000));
  const currentMouse  = useRef(new Vector2(-1000, -1000));
  const targetInf     = useRef(0);
  const currentInf    = useRef(0);
  const targetPar     = useRef(new Vector2(0, 0));
  const currentPar    = useRef(new Vector2(0, 0));

  const getCount = (w: 'top'|'middle'|'bottom') => {
    if (typeof lineCount === 'number') return lineCount;
    return lineCount[['top','middle','bottom'].indexOf(w)] ?? 6;
  };
  const getDist = (w: 'top'|'middle'|'bottom') => {
    if (typeof lineDistance === 'number') return lineDistance;
    return lineDistance[['top','middle','bottom'].indexOf(w)] ?? 0.1;
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const scene    = new Scene();
    const camera   = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    camera.position.z = 1;
    const renderer = new WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.domElement.style.width  = '100%';
    renderer.domElement.style.height = '100%';
    containerRef.current.appendChild(renderer.domElement);

    const tLC = enabledWaves.includes('top')    ? getCount('top')    : 0;
    const mLC = enabledWaves.includes('middle') ? getCount('middle') : 0;
    const bLC = enabledWaves.includes('bottom') ? getCount('bottom') : 0;
    const tLD = enabledWaves.includes('top')    ? getDist('top')    * 0.01 : 0.01;
    const mLD = enabledWaves.includes('middle') ? getDist('middle') * 0.01 : 0.01;
    const bLD = enabledWaves.includes('bottom') ? getDist('bottom') * 0.01 : 0.01;

    const uniforms: Record<string, { value: unknown }> = {
      iTime:              { value: 0 },
      iResolution:        { value: new Vector3(1, 1, 1) },
      animationSpeed:     { value: animationSpeed },
      enableTop:          { value: enabledWaves.includes('top') },
      enableMiddle:       { value: enabledWaves.includes('middle') },
      enableBottom:       { value: enabledWaves.includes('bottom') },
      topLineCount:       { value: tLC }, middleLineCount: { value: mLC }, bottomLineCount: { value: bLC },
      topLineDistance:    { value: tLD }, middleLineDistance: { value: mLD }, bottomLineDistance: { value: bLD },
      topWavePosition:    { value: new Vector3(topWavePosition?.x ?? 10.0, topWavePosition?.y ?? 0.5, topWavePosition?.rotate ?? -0.4) },
      middleWavePosition: { value: new Vector3(middleWavePosition?.x ?? 5.0, middleWavePosition?.y ?? 0.0, middleWavePosition?.rotate ?? 0.2) },
      bottomWavePosition: { value: new Vector3(bottomWavePosition.x, bottomWavePosition.y, bottomWavePosition.rotate) },
      iMouse:             { value: new Vector2(-1000, -1000) },
      interactive:        { value: interactive },
      bendRadius:         { value: bendRadius },
      bendStrength:       { value: bendStrength },
      bendInfluence:      { value: 0 },
      parallax:           { value: parallax },
      parallaxStrength:   { value: parallaxStrength },
      parallaxOffset:     { value: new Vector2(0, 0) },
      lineGradient:       { value: Array.from({ length: MAX_GRADIENT_STOPS }, () => new Vector3(1, 1, 1)) },
      lineGradientCount:  { value: 0 },
    };

    if (linesGradient?.length) {
      const stops = linesGradient.slice(0, MAX_GRADIENT_STOPS);
      (uniforms.lineGradientCount as { value: number }).value = stops.length;
      stops.forEach((hex, i) => {
        const c = hexToVec3(hex);
        (uniforms.lineGradient.value as Vector3[])[i].set(c.x, c.y, c.z);
      });
    }

    const material = new ShaderMaterial({ uniforms, vertexShader, fragmentShader, transparent: true });
    const mesh = new Mesh(new PlaneGeometry(2, 2), material);
    scene.add(mesh);

    const clock = new Clock();
    const setSize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth || 1;
      const h = containerRef.current.clientHeight || 1;
      renderer.setSize(w, h, false);
      (uniforms.iResolution.value as Vector3).set(renderer.domElement.width, renderer.domElement.height, 1);
    };
    setSize();
    window.addEventListener('resize', setSize);

    const onMove = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const dpr  = renderer.getPixelRatio();
      targetMouse.current.set((e.clientX - rect.left) * dpr, (rect.height - (e.clientY - rect.top)) * dpr);
      targetInf.current = 1;
      if (parallax) {
        targetPar.current.set(
          ((e.clientX - rect.left) / rect.width  - 0.5) *  parallaxStrength,
          ((e.clientY - rect.top)  / rect.height - 0.5) * -parallaxStrength,
        );
      }
    };
    const onLeave = () => { targetInf.current = 0; };
    if (interactive) {
      renderer.domElement.addEventListener('pointermove', onMove);
      renderer.domElement.addEventListener('pointerleave', onLeave);
    }

    let raf = 0;
    const loop = () => {
      (uniforms.iTime.value as number);
      uniforms.iTime.value = clock.getElapsedTime();
      if (interactive) {
        currentMouse.current.lerp(targetMouse.current, mouseDamping);
        (uniforms.iMouse.value as Vector2).copy(currentMouse.current);
        currentInf.current += (targetInf.current - currentInf.current) * mouseDamping;
        uniforms.bendInfluence.value = currentInf.current;
      }
      if (parallax) {
        currentPar.current.lerp(targetPar.current, mouseDamping);
        (uniforms.parallaxOffset.value as Vector2).copy(currentPar.current);
      }
      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', setSize);
      if (interactive) {
        renderer.domElement.removeEventListener('pointermove', onMove);
        renderer.domElement.removeEventListener('pointerleave', onLeave);
      }
      material.dispose(); mesh.geometry.dispose(); renderer.dispose();
      renderer.domElement.parentElement?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden" style={{ mixBlendMode }} />
  );
}

export default FloatingLines;
