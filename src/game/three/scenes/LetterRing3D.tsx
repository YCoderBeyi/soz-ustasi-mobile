import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { getRingLetterPosition } from '../utils/geometry';
import { createGoldMaterial } from '../utils/materials';

type LetterRing3DProps = {
  letters: string[];
  selectedIndices: number[];
  onLetterSelect: (index: number) => void;
};

export function LetterRing3D({ letters, selectedIndices, onLetterSelect }: LetterRing3DProps) {
  const ringRadius = 3.5;
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05;
    }
  });

  const letterPositions = useMemo(
    () => letters.map((_, i) => getRingLetterPosition(i, letters.length, ringRadius)),
    [letters.length, ringRadius],
  );

  return (
    <group ref={groupRef} position={[0, 2, -1]}>
      {/* Ring base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[ringRadius - 0.15, ringRadius + 0.15, 48]} />
        <meshStandardMaterial color="#8B6914" metalness={0.5} roughness={0.3} />
      </mesh>
      {letters.map((letter, i) => {
        const pos = letterPositions[i];
        const isSelected = selectedIndices.includes(i);
        return (
          <group
            key={i}
            position={[pos.x, pos.y, 0]}
            onClick={() => onLetterSelect(i)}
            onPointerEnter={() => onLetterSelect(i)}
          >
            <mesh scale={isSelected ? 1.3 : 1}>
              <circleGeometry args={[0.35, 16]} />
              <meshStandardMaterial
                color={isSelected ? '#F1C96A' : '#2A1B0A'}
                metalness={isSelected ? 0.6 : 0.2}
                roughness={isSelected ? 0.2 : 0.6}
                emissive={isSelected ? '#D9A441' : '#000000'}
                emissiveIntensity={isSelected ? 0.3 : 0}
              />
            </mesh>
            <Text
              position={[0, 0, 0.1]}
              fontSize={0.3}
              color={isSelected ? '#000000' : '#F1C96A'}
              anchorX="center"
              anchorY="middle"
            >
              {letter}
            </Text>
          </group>
        );
      })}
    </group>
  );
}
