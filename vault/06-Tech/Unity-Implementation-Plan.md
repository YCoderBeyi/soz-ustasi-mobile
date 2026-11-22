# Unity Implementation Plan

## Target

Turn the current Söz Ustası visual prototype into a production mobile game in Unity.

## Project Settings

- Template: 2D or Universal 2D
- Orientation: Portrait
- Reference resolution: `1080 x 2340`
- Canvas scaler: Scale With Screen Size
- Match: `0.5`

## Scene Scope

- `Boot`: save load, Firebase init, config load
- `Map`: level path and theme gates
- `Gameplay`: word grid, letter wheel, meaning card, reward flow

## First Playable Definition

- Level opens from map.
- Word grid is generated from JSON.
- Letter wheel is generated from JSON.
- Dragging letters draws the connection line.
- Releasing finger submits the word.
- Main word fills slots.
- Meaning card appears.
- Hidden word gives coin.
- Completing all main words opens reward flow.

## Unity Blueprint Location

The initial C# blueprint is in:

`unity-blueprint/Assets/_SozUstasi`

Copy this folder into a Unity project, then bind prefabs in the Inspector.
