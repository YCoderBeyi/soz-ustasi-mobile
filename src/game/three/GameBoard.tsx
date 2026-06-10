import { Canvas } from '@react-three/fiber';
import { ThemeEnvironment } from './scenes/ThemeEnvironment';
import { LetterRing3D } from './scenes/LetterRing3D';
import { CrosswordGrid3D } from './scenes/CrosswordGrid3D';
import { buildCrosswordLayout } from '../crossword';
import type { LevelData } from '../../types';

type GameBoardProps = {
  level: LevelData;
  found: string[];
  selectedIndices: number[];
  revealedLetters: Record<string, number[]>;
  onLetterSelect: (index: number) => void;
};

export function GameBoard({ level, found, selectedIndices, revealedLetters, onLetterSelect }: GameBoardProps) {
  const layout = level.mainWords.length >= 2
    ? buildCrosswordLayout(level.mainWords)
    : null;

  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
      <Canvas camera={{ position: [0, 6, 10], fov: 40, near: 0.1, far: 50 }}>
        <ThemeEnvironment themeId={level.themeId} />
        <LetterRing3D
          letters={level.letters}
          selectedIndices={selectedIndices}
          onLetterSelect={onLetterSelect}
        />
        <CrosswordGrid3D
          layout={layout}
          found={found}
          revealedLetters={revealedLetters}
        />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
          <planeGeometry args={[12, 12]} />
          <meshStandardMaterial color="#0D0D1A" />
        </mesh>
      </Canvas>
    </div>
  );
}
