'use client';

import React from 'react';
import * as THREE from 'three';

export default function CampusGround() {
  return (
    <group>
      {/* Main ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#D7E6E1" />
      </mesh>

      {/* Main path - horizontal */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[60, 3]} />
        <meshStandardMaterial color="#F4F7F6" />
      </mesh>

      {/* Main path - vertical */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[3, 50]} />
        <meshStandardMaterial color="#F4F7F6" />
      </mesh>

      {/* Path to top-left building */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-12, 0, -10]}>
        <planeGeometry args={[2, 10]} />
        <meshStandardMaterial color="#F4F7F6" />
      </mesh>

      {/* Path to top-right building */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[12, 0, -10]}>
        <planeGeometry args={[2, 10]} />
        <meshStandardMaterial color="#F4F7F6" />
      </mesh>

      {/* Path to bottom-right building */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[15, 0, 12]}>
        <planeGeometry args={[2, 8]} />
        <meshStandardMaterial color="#F4F7F6" />
      </mesh>

      {/* Decorative trees */}
      {[
        [-20, 5],
        [-18, -12],
        [20, 8],
        [22, -8],
        [-8, 20],
        [8, -20],
        [-25, -18],
        [25, 18],
        [-5, 15],
        [5, -15],
        [15, -18],
        [-15, 18],
      ].map((pos, i) => (
        <group key={i} position={[pos[0], 0, pos[1]]}>
          {/* Tree trunk */}
          <mesh position={[0, 1.2, 0]}>
            <cylinderGeometry args={[0.2, 0.3, 2.4, 6]} />
            <meshStandardMaterial color="#3F6661" />
          </mesh>
          {/* Tree crown */}
          <mesh position={[0, 3.2, 0]}>
            <coneGeometry args={[1.5, 3, 6]} />
            <meshStandardMaterial color="#166534" />
          </mesh>
        </group>
      ))}

      {/* Small bushes */}
      {[
        [-6, 8],
        [6, -8],
        [-10, -5],
        [10, 5],
        [0, 10],
        [0, -10],
      ].map((pos, i) => (
        <mesh key={`bush-${i}`} position={[pos[0], 0.4, pos[1]]}>
          <sphereGeometry args={[0.8, 6, 6]} />
          <meshStandardMaterial color="#15803D" />
        </mesh>
      ))}

      {/* Boundary edges - subtle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -39]}>
        <planeGeometry args={[80, 2]} />
        <meshStandardMaterial color="#6B7280" opacity={0.3} transparent />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 39]}>
        <planeGeometry args={[80, 2]} />
        <meshStandardMaterial color="#6B7280" opacity={0.3} transparent />
      </mesh>
    </group>
  );
}
