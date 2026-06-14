import { Canvas } from '@react-three/fiber';
import { ThemeEnvironment } from './scenes/ThemeEnvironment';
import { LetterRing3D } from './scenes/LetterRing3D';
import { CrosswordGrid3D } from './scenes/CrosswordGrid3D';
import { WebGLFallback } from './WebGLFallback';
import { buildCrosswordLayout } from '../crossword';
import { SCENE_CONFIG } from './config';
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

  const { cameraPosition, cameraFov, cameraNear, cameraFar, floorPosition, floorSize } = SCENE_CONFIG;

  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
      <WebGLFallback>
        <Canvas camera={{ position: cameraPosition, fov: cameraFov, near: cameraNear, far: cameraFar }}>
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
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={floorPosition}>
            <planeGeometry args={[floorSize, floorSize]} />
            <meshStandardMaterial color="#0D0D1A" />
          </mesh>
        </Canvas>
      </WebGLFallback>
    </div>
  );
}
