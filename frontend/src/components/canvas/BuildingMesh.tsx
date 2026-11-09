'use client';

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface BuildingMeshProps {
  position: [number, number, number];
  dimensions: [number, number, number];
  floors: number;
  name: string;
  code: string;
  color?: string;
  selected?: boolean;
  onClick?: (code: string) => void;
}

export default function BuildingMesh({
  position,
  dimensions,
  floors,
  name,
  code,
  color = '#94A3B8',
  selected = false,
  onClick,
}: BuildingMeshProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [width, height, depth] = dimensions;
  const floorHeight = height / floors;

  useFrame(() => {
    if (groupRef.current) {
      const targetScale = hovered || selected ? 1.02 : 1;
      groupRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );
    }
  });

  const buildingColor = selected ? '#122826' : hovered ? '#1A3F3B' : color;

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(code);
      }}
      onPointerEnter={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerLeave={() => {
        setHovered(false);
        document.body.style.cursor = 'default';
      }}
    >
      {/* Main building body */}
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial
          color={buildingColor}
          metalness={0.1}
          roughness={0.7}
        />
      </mesh>

      {/* Floor separators */}
      {Array.from({ length: floors - 1 }).map((_, i) => (
        <mesh
          key={`floor-${i}`}
          position={[0, (i + 1) * floorHeight, 0]}
        >
          <boxGeometry args={[width + 0.1, 0.05, depth + 0.1]} />
          <meshStandardMaterial color="#24524D" />
        </mesh>
      ))}

      {/* Roof accent */}
      <mesh position={[0, height + 0.1, 0]}>
        <boxGeometry args={[width + 0.2, 0.2, depth + 0.2]} />
        <meshStandardMaterial color="#142E2C" />
      </mesh>

      {/* Windows - front face */}
      {Array.from({ length: floors }).map((_, fi) =>
        Array.from({ length: Math.max(2, Math.floor(width / 2)) }).map((_, wi) => {
          const windowWidth = 0.6;
          const windowHeight = floorHeight * 0.5;
          const spacing = width / (Math.max(2, Math.floor(width / 2)) + 1);
          const xPos = -width / 2 + spacing * (wi + 1);
          const yPos = fi * floorHeight + floorHeight * 0.55;

          return (
            <mesh
              key={`window-f-${fi}-${wi}`}
              position={[xPos, yPos, depth / 2 + 0.01]}
            >
              <planeGeometry args={[windowWidth, windowHeight]} />
              <meshStandardMaterial
                color="#E6EEEC"
                emissive="#C9D9D5"
                emissiveIntensity={0.15}
              />
            </mesh>
          );
        })
      )}

      {/* Selection indicator glow */}
      {selected && (
        <mesh position={[0, height / 2, 0]}>
          <boxGeometry args={[width + 0.3, height + 0.3, depth + 0.3]} />
          <meshStandardMaterial
            color="#122826"
            transparent
            opacity={0.15}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Building name label */}
      <Html
        position={[0, height + 1.5, 0]}
        center
        distanceFactor={30}
        style={{ pointerEvents: 'none' }}
      >
        <div
          className={`whitespace-nowrap px-2 py-1 rounded-md text-xs font-medium
            ${selected || hovered
              ? 'bg-ink-900 text-white'
              : 'bg-white/90 text-ink-800'
            }`}
        >
          {name}
        </div>
      </Html>
    </group>
  );
}
