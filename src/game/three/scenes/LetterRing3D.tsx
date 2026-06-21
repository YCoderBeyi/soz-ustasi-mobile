import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { getRingLetterPosition } from '../utils/geometry';
import { SCENE_CONFIG } from '../config';

type LetterRing3DProps = {
  letters: string[];
  selectedIndices: number[];
  onLetterSelect: (index: number) => void;
};

/** Scale ring and letter nodes so every pool size (3–8 letters) has comfortable breathing room. */
function getRingScale(n: number) {
  // Ring radius: base 3.5 for ≤5 letters; grow proportionally for larger pools
  const radius = n <= 5 ? 3.5 : 3.5 + (n - 5) * 0.55;
  // Letter circle: slightly smaller as density grows so nodes never visually crowd
  const circle = Math.max(0.28, 0.38 - Math.max(0, n - 5) * 0.025);
  // Font proportional to circle radius
  const font = circle * 0.78;
  return { radius, circle, font };
}

export function LetterRing3D({ letters, selectedIndices, onLetterSelect }: LetterRing3DProps) {
  const { ringPosition, ringRotationSpeed } = SCENE_CONFIG;
  const groupRef = useRef<THREE.Group>(null);

  const { radius: ringRadius, circle: circleRadius, font: fontSize } = useMemo(
    () => getRingScale(letters.length),
    [letters.length],
  );

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * ringRotationSpeed;
    }
  });

  const letterPositions = useMemo(
    () => letters.map((_, i) => getRingLetterPosition(i, letters.length, ringRadius)),
    [letters.length, ringRadius],
  );

  return (
    <group ref={groupRef} position={ringPosition}>
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
          >
            <mesh scale={isSelected ? 1.25 : 1}>
              <circleGeometry args={[circleRadius, 16]} />
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
              fontSize={fontSize}
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
