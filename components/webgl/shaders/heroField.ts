// Hero atmosphere: drifting fbm gradient in the bloom colors. Near the pointer
// the field is magnified (the lens) and tinted with the accent; scroll
// velocity speeds the flow.

export const heroVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

export const heroFragment = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform float uVelocity;
  uniform float uAspect;
  uniform vec2 uPointer;
  uniform vec3 uBg;
  uniform vec3 uBloomA;
  uniform vec3 uBloomB;
  uniform vec3 uAccent;
  varying vec2 vUv;

  // 2D simplex noise — Ashima Arts / Stefan Gustavson (MIT)
  vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * snoise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 p = vUv;
    p.x *= uAspect;
    vec2 m = uPointer;
    m.x *= uAspect;

    float lens = smoothstep(0.32, 0.0, distance(p, m));
    vec2 q = p + (m - p) * lens * 0.35;

    float t = uTime * 0.04 + uVelocity * 0.02;
    float warp = fbm(q * 0.9 - vec2(t * 0.7, t));
    float n = fbm(q * 1.3 + vec2(t, -t * 0.6) + warp);
    float n2 = fbm(q * 2.1 - vec2(t * 0.4, t * 0.9));

    vec3 col = uBg;
    col = mix(col, uBloomA, smoothstep(-0.25, 0.8, n) * 0.6);
    col = mix(col, uBloomB, smoothstep(0.05, 0.9, n2) * 0.35);
    col = mix(col, uAccent, lens * (0.1 + 0.1 * n));

    // Fade the lower third into the background so the hero type stays readable
    col = mix(col, uBg, smoothstep(0.6, 0.0, vUv.y) * 0.75);

    gl_FragColor = vec4(col, 1.0);
  }
`;
