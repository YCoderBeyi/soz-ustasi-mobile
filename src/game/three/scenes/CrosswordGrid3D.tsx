import { useMemo } from 'react';
import { Text } from '@react-three/drei';
import type { CrosswordLayout } from '../../crossword';

type CrosswordGrid3DProps = {
  layout: CrosswordLayout | null;
  found: string[];
  revealedLetters: Record<string, number[]>;
};

export function CrosswordGrid3D({ layout, found, revealedLetters }: CrosswordGrid3DProps) {
  if (!layout) return null;

  const cellSize = 0.8;

  return (
    <group position={[0, -1, 0]}>
      {layout.cells.map((cell) => {
        const visibleWord = cell.words?.find((w) => found.includes(w));
        const isVisible = Boolean(visibleWord);
        const isEmpty = cell.isEmpty ?? false;

        if (isEmpty) {
          return (
            <mesh key={`${cell.row}-${cell.col}`} position={[(cell.col - 2) * cellSize, 0, (cell.row - 2) * cellSize]}>
              <boxGeometry args={[cellSize * 0.9, 0.05, cellSize * 0.9]} />
              <meshStandardMaterial color="#1a1a2e" transparent opacity={0.3} />
            </mesh>
          );
        }

        return (
          <group key={`${cell.row}-${cell.col}`} position={[(cell.col - 2) * cellSize, isVisible ? 0.15 : 0, (cell.row - 2) * cellSize]}>
            <mesh>
              <boxGeometry args={[cellSize * 0.9, isVisible ? 0.3 : 0.08, cellSize * 0.9]} />
              <meshStandardMaterial
                color={isVisible ? '#F1C96A' : '#2A1B0A'}
                metalness={isVisible ? 0.4 : 0.1}
                roughness={isVisible ? 0.3 : 0.7}
                emissive={isVisible ? '#D9A441' : '#000000'}
                emissiveIntensity={isVisible ? 0.15 : 0}
              />
            </mesh>
            {isVisible && (
              <Text
                position={[0, 0.2, 0]}
                fontSize={0.4}
                color="#000000"
                anchorX="center"
                anchorY="middle"
              >
                {cell.letter}
              </Text>
            )}
          </group>
        );
      })}
    </group>
  );
}
