import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { themeLightColors } from '../utils/materials';

export function ThemeEnvironment({ themeId }: { themeId: string }) {
  const colors = useMemo(() => themeLightColors[themeId] ?? themeLightColors['eski-istanbul'], [themeId]);

  const fog = useMemo(() => new THREE.Fog(colors.fog, 10, 30), [colors.fog]);

  return (
    <>
      <fog attach="fog" args={[colors.fog, 10, 30]} />
      <ambientLight color={colors.ambient} intensity={0.6} />
      <directionalLight color={colors.key} position={[5, 10, 5]} intensity={1.0} castShadow />
      <directionalLight position={[-5, 0, -5]} intensity={0.3} />
      <hemisphereLight args={[colors.ambient, '#000000', 0.3]} />
      <Particles count={60} color={colors.key} />
    </>
  );
}

function Particles({ count, color }: { count: number; color: string }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) arr[i] = (Math.random() - 0.5) * 20;
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={color} size={0.08} transparent opacity={0.5} />
    </points>
  );
}
