"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import { BufferGeometry, Color, Float32BufferAttribute, type Group, type Mesh, QuadraticBezierCurve3, Vector3 } from "three";
import { useInView, useTheme } from "@/lib/hooks";
import { tokenColor } from "@/lib/color";

type GlobeProps = {
  points: { lat: number; lng: number }[];
  /** Fractional trip index (0 … points.length - 1), written by the scroll scene. */
  progress: RefObject<number>;
};

const DOTS = 1800;
const DEG = Math.PI / 180;

function toVector({ lat, lng }: { lat: number; lng: number }, radius = 1) {
  const phi = lat * DEG;
  const theta = lng * DEG;
  return new Vector3(radius * Math.cos(phi) * Math.cos(theta), radius * Math.sin(phi), -radius * Math.cos(phi) * Math.sin(theta));
}

// Dotted globe for Field Notes: accent pins per trip, arcs between
// consecutive trips, and a camera-facing rotation that follows `progress`.
export default function Globe({ points, progress }: GlobeProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const active = useInView(wrap);
  const theme = useTheme();

  return (
    <div ref={wrap} className="globe-canvas absolute inset-0">
      <Canvas
        frameloop={active ? "always" : "never"}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 3.1], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={() => wrap.current?.setAttribute("data-ready", "")}
      >
        {/* Remount on theme change so colors are re-read from the tokens */}
        <GlobeScene key={theme} points={points} progress={progress} dotOpacity={theme === "light" ? 0.9 : 0.55} />
      </Canvas>
    </div>
  );
}

function GlobeScene({ points, progress, dotOpacity }: GlobeProps & { dotOpacity: number }) {
  const tilt = useRef<Group>(null);
  const spin = useRef<Group>(null);
  const pins = useRef<(Mesh | null)[]>([]);
  const accent = useMemo(() => new Color(...tokenColor("--color-accent-fg", [0.78, 1, 0.24])), []);
  const muted = useMemo(() => new Color(...tokenColor("--color-fg-muted", [0.54, 0.54, 0.56])), []);

  const dots = useMemo(() => {
    // Fibonacci sphere: evenly spread points
    const positions: number[] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < DOTS; i++) {
      const y = 1 - (i / (DOTS - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      positions.push(Math.cos(golden * i) * r, y, Math.sin(golden * i) * r);
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
    return geometry;
  }, []);
  useEffect(() => () => dots.dispose(), [dots]);

  const pinPositions = useMemo(() => points.map((p) => toVector(p, 1.01)), [points]);

  const arcs = useMemo(
    () =>
      pinPositions.slice(1).map((end, i) => {
        const start = pinPositions[i];
        const mid = start.clone().add(end).normalize().multiplyScalar(1 + start.distanceTo(end) * 0.35);
        return new QuadraticBezierCurve3(start, mid, end).getPoints(48);
      }),
    [pinPositions],
  );

  // Rotation that brings each pin to face the camera; Y angles unwrapped so
  // interpolation always takes the short way round.
  const angles = useMemo(() => {
    const result = points.map((p, i) => ({ x: p.lat * DEG, y: Math.atan2(-pinPositions[i].x, pinPositions[i].z) }));
    for (let i = 1; i < result.length; i++) {
      while (result[i].y - result[i - 1].y > Math.PI) result[i].y -= Math.PI * 2;
      while (result[i].y - result[i - 1].y < -Math.PI) result[i].y += Math.PI * 2;
    }
    return result;
  }, [points, pinPositions]);

  useFrame((_, delta) => {
    if (!tilt.current || !spin.current || angles.length === 0) return;
    const p = Math.min(Math.max(progress.current ?? 0, 0), angles.length - 1);
    const i = Math.floor(p);
    const f = p - i;
    const a = angles[i];
    const b = angles[Math.min(i + 1, angles.length - 1)];
    const damp = 1 - Math.exp(-delta * 5);
    tilt.current.rotation.x += (a.x + (b.x - a.x) * f - tilt.current.rotation.x) * damp;
    spin.current.rotation.y += (a.y + (b.y - a.y) * f - spin.current.rotation.y) * damp;

    const activeIndex = Math.round(p);
    pins.current.forEach((pin, k) => {
      if (!pin) return;
      const scale = k === activeIndex ? 2.2 : 1;
      pin.scale.setScalar(pin.scale.x + (scale - pin.scale.x) * damp);
    });
  });

  return (
    <group ref={tilt}>
      <group ref={spin}>
        <points geometry={dots}>
          <pointsMaterial color={muted} size={0.012} sizeAttenuation transparent opacity={dotOpacity} depthWrite={false} />
        </points>
        {pinPositions.map((position, k) => (
          <mesh key={k} position={position} ref={(el) => void (pins.current[k] = el)}>
            <sphereGeometry args={[0.018, 12, 12]} />
            <meshBasicMaterial color={accent} />
          </mesh>
        ))}
        {arcs.map((arc, k) => (
          <Line key={k} points={arc} color={accent} lineWidth={1.2} transparent opacity={0.6} />
        ))}
      </group>
    </group>
  );
}
