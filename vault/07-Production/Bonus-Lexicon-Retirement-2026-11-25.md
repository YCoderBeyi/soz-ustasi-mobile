# Bonus Lexicon Retirement — 2026-11-25

The app no longer ships or generates the bonus-word tier derived from
`tdd-ai/hunspell-tr` under MPL 2.0.

Removed from the active project: generated word/meaning output, source-derived
allowlist and values-denial data, MPL copy retained for that dataset, and the
generator that rebuilt the output. The runtime bonus list remains in
`src/game/bonusDictionary.ts`; level words remain in the existing level data.

This change reduces one identifiable data-license dependency. It does not
establish provenance or legal clearance for every other dependency, font,
image, audio file, or historical content decision. Those require a separate
asset-by-asset and dependency-by-dependency review.
