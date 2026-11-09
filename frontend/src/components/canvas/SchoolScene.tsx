'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import CampusGround from './CampusGround';
import BuildingMesh from './BuildingMesh';
import IncidentPin from './IncidentPin';
import { Incident } from '@/lib/types';

interface SchoolSceneProps {
  incidents?: Incident[];
  selectedBuildingCode?: string;
  selectedIncidentId?: number;
  onBuildingClick?: (code: string) => void;
  onIncidentClick?: (incident: Incident) => void;
  onGroundClick?: (point: { x: number; y: number; z: number }) => void;
  darkMode?: boolean;
}

const BUILDINGS = [
  {
    code: 'A',
    name: 'อาคารเรียน A',
    position: [-12, 0, -12] as [number, number, number],
    dimensions: [8, 6, 6] as [number, number, number],
    floors: 3,
    color: '#C9D9D5',
  },
  {
    code: 'B',
    name: 'อาคารเรียน B',
    position: [12, 0, -12] as [number, number, number],
    dimensions: [10, 8, 6] as [number, number, number],
    floors: 4,
    color: '#9BB5B0',
  },
  {
    code: 'C',
    name: 'อาคารอเนกประสงค์',
    position: [0, 0, 5] as [number, number, number],
    dimensions: [14, 5, 8] as [number, number, number],
    floors: 2,
    color: '#6B8C87',
  },
  {
    code: 'D',
    name: 'โรงยิม',
    position: [-15, 0, 12] as [number, number, number],
    dimensions: [10, 7, 10] as [number, number, number],
    floors: 2,
    color: '#8AA8A3',
  },
  {
    code: 'E',
    name: 'อาคารวิทยาศาสตร์',
    position: [15, 0, 12] as [number, number, number],
    dimensions: [8, 10, 6] as [number, number, number],
    floors: 5,
    color: '#B7CCC8',
  },
];

function SceneContent({
  incidents = [],
  selectedBuildingCode,
  selectedIncidentId,
  onBuildingClick,
  onIncidentClick,
  onGroundClick,
}: Omit<SchoolSceneProps, 'darkMode'>) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[20, 30, 10]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={100}
        shadow-camera-near={0.1}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
      />
      <directionalLight position={[-10, 15, -10]} intensity={0.3} />

      {/* Ground */}
      <CampusGround />

      {/* Buildings */}
      {BUILDINGS.map((building) => (
        <BuildingMesh
          key={building.code}
          position={building.position}
          dimensions={building.dimensions}
          floors={building.floors}
          name={building.name}
          code={building.code}
          color={building.color}
          selected={selectedBuildingCode === building.code}
          onClick={onBuildingClick}
        />
      ))}

      {/* Incident Pins */}
      {incidents.map((incident) => (
        <IncidentPin
          key={incident.id}
          position={[incident.pin_x, incident.pin_y, incident.pin_z]}
          severity={incident.severity}
          title={incident.title}
          trackingCode={incident.tracking_code}
          isCritical={incident.severity === 'CRITICAL'}
          selected={selectedIncidentId === incident.id}
          onClick={() => onIncidentClick?.(incident)}
        />
      ))}

      {/* Clickable ground for placing pins */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.001, 0]}
        visible={false}
        onClick={(e) => {
          if (onGroundClick && e.point) {
            onGroundClick({
              x: Math.round(e.point.x * 10) / 10,
              y: 0,
              z: Math.round(e.point.z * 10) / 10,
            });
          }
        }}
      >
        <planeGeometry args={[80, 80]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </>
  );
}

export default function SchoolScene({
  incidents = [],
  selectedBuildingCode,
  selectedIncidentId,
  onBuildingClick,
  onIncidentClick,
  onGroundClick,
  darkMode = false,
}: SchoolSceneProps) {
  return (
    <Canvas
      shadows
      gl={{ antialias: true, alpha: true }}
      style={{ background: darkMode ? '#0E1F1D' : '#E7F0EE' }}
    >
      <PerspectiveCamera makeDefault position={[30, 25, 30]} fov={50} />
      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        maxPolarAngle={Math.PI / 2.2}
        minDistance={10}
        maxDistance={80}
        target={[0, 0, 0]}
      />
      {darkMode && <fog attach="fog" args={['#0E1F1D', 60, 120]} />}
      {!darkMode && <fog attach="fog" args={['#E7F0EE', 80, 150]} />}
      <Suspense fallback={null}>
        <SceneContent
          incidents={incidents}
          selectedBuildingCode={selectedBuildingCode}
          selectedIncidentId={selectedIncidentId}
          onBuildingClick={onBuildingClick}
          onIncidentClick={onIncidentClick}
          onGroundClick={onGroundClick}
        />
      </Suspense>
    </Canvas>
  );
}
