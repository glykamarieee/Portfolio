"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { type ShaderMaterial, Vector2, Vector3 } from "three";
import { useInView, useTheme } from "@/lib/hooks";
import { getLenis } from "@/lib/motion";
import { tokenColor } from "@/lib/color";
import { heroFragment, heroVertex } from "./shaders/heroField";

// Full-bleed shader canvas behind the hero. Loaded lazily (see HeroBackdrop),
// paused when offscreen or the tab is hidden, DPR capped at 2.
export default function HeroField() {
  const wrap = useRef<HTMLDivElement>(null);
  const active = useInView(wrap, "0px");
  const theme = useTheme();

  return (
    <div ref={wrap} className="hero-canvas absolute inset-0">
      <Canvas
        frameloop={active ? "always" : "never"}
        dpr={[1, 2]}
        gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
        onCreated={() => wrap.current?.setAttribute("data-ready", "")}
      >
        {/* Remount on theme change so the palette is re-read from the tokens */}
        <FieldPlane key={theme} />
      </Canvas>
    </div>
  );
}

function FieldPlane() {
  const size = useThree((state) => state.size);
  const material = useRef<ShaderMaterial>(null);
  const target = useRef(new Vector2(0.5, 0.6));

  // Initial uniforms only — animated through the material ref in useFrame
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uVelocity: { value: 0 },
      uAspect: { value: 1 },
      uPointer: { value: new Vector2(0.5, 0.6) },
      uBg: { value: new Vector3(...tokenColor("--color-bg", [0.04, 0.04, 0.043])) },
      uBloomA: { value: new Vector3(...tokenColor("--color-bloom-1", [0.36, 0.24, 0.96])) },
      uBloomB: { value: new Vector3(...tokenColor("--color-bloom-2", [0.12, 0.71, 1])) },
      uAccent: { value: new Vector3(...tokenColor("--color-accent", [0.78, 1, 0.24])) },
    }),
    [],
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      target.current.set(e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((_, delta) => {
    if (!material.current) return;
    const u = material.current.uniforms;
    u.uTime.value += delta;
    u.uAspect.value = size.width / size.height;
    (u.uPointer.value as Vector2).lerp(target.current, 1 - Math.exp(-delta * 4));
    const velocity = Math.abs(getLenis()?.velocity ?? 0);
    u.uVelocity.value += (velocity - u.uVelocity.value) * (1 - Math.exp(-delta * 3));
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={material}
        vertexShader={heroVertex}
        fragmentShader={heroFragment}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  );
}
