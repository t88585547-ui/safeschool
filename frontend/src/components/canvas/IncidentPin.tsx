'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { IncidentSeverity } from '@/lib/types';
import { getSeverityColor3D } from '@/lib/utils';

interface IncidentPinProps {
  position: [number, number, number];
  severity: IncidentSeverity;
  title: string;
  trackingCode: string;
  isCritical?: boolean;
  selected?: boolean;
  onClick?: () => void;
}

export default function IncidentPin({
  position,
  severity,
  title,
  trackingCode,
  isCritical = false,
  selected = false,
  onClick,
}: IncidentPinProps) {
  const pinRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const color = getSeverityColor3D(severity);

  useFrame((state) => {
    if (pinRef.current) {
      // Bobbing animation
      pinRef.current.position.y =
        position[1] + 2 + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.3;
    }
    if (glowRef.current) {
      // Pulsing glow
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.3;
      glowRef.current.scale.set(scale, scale, scale);
      (glowRef.current.material as THREE.MeshStandardMaterial).opacity =
        0.3 + Math.sin(state.clock.elapsedTime * 3) * 0.15;
    }
  });

  return (
    <group position={[position[0], 0, position[2]]}>
      {/* Pin group with bobbing */}
      <group
        ref={pinRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick?.();
        }}
        onPointerEnter={() => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerLeave={() => {
          document.body.style.cursor = 'default';
        }}
      >
        {/* Pin head (sphere) */}
        <mesh castShadow>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={isCritical ? 0.8 : 0.4}
            metalness={0.3}
            roughness={0.4}
          />
        </mesh>

        {/* Glow sphere */}
        <mesh ref={glowRef}>
          <sphereGeometry args={[0.8, 16, 16]} />
          <meshStandardMaterial
            color={color}
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Pin stem */}
        <mesh position={[0, -1, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 1.5, 8]} />
          <meshStandardMaterial color={color} />
        </mesh>

        {/* Pin point */}
        <mesh position={[0, -1.9, 0]}>
          <coneGeometry args={[0.15, 0.4, 8]} />
          <meshStandardMaterial color={color} />
        </mesh>

        {/* Label */}
        {(selected || isCritical) && (
          <Html
            position={[0, 1.5, 0]}
            center
            distanceFactor={25}
            style={{ pointerEvents: 'none' }}
          >
            <div className="whitespace-nowrap px-2 py-1 rounded-lg text-xs font-medium bg-white/95 text-slate-800 shadow-lg backdrop-blur-sm border border-slate-200 max-w-[160px] truncate">
              <span className="font-mono text-[10px] text-slate-400 block">
                {trackingCode}
              </span>
              <span className="truncate block">{title}</span>
            </div>
          </Html>
        )}
      </group>

      {/* Ground shadow/indicator */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[0.6, 16]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.25}
        />
      </mesh>
    </group>
  );
}
