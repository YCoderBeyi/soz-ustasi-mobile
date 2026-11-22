export function WheelLetterContents({ letter, selected = false }: { letter: string; selected?: boolean }) {
  return (
    <>
      <img
        className="wheelLetterBg"
        src={`/assets/gameplay/wheel-v3/${selected ? 'letter-selected' : 'letter'}.png`}
        width={384}
        height={384}
        decoding="async"
        fetchPriority="high"
        alt=""
        aria-hidden="true"
      />
      <span className="wheelLetterChar">{letter}</span>
    </>
  );
}
