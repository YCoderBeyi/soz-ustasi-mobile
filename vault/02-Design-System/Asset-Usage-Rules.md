# Asset Usage Rules

Generated full-screen mockups are reference material, not production UI.

## Rule

If the player can read it, tap it, earn it, lose it, animate it, localize it, or change it, it must be real UI.

Do not bake these into a background image:

- Buttons
- Scores
- Coins
- Word slots
- Letter nodes
- Menus
- Modal labels
- Progress indicators
- Tutorial text
- Reward values

## Correct Use

Use generated images for:

- Mood direction
- Background illustration without functional UI
- Texture references
- Seal material references
- Ornament style references
- Lighting and color direction

## Implementation Standard

React prototype:

- Render HUD, buttons, text, word grid, letter wheel, modals, and state feedback as components.
- Use CSS tokens for colors, spacing, shadows, and states.
- Use image assets only for non-interactive scene layers.

Unity production:

- Build functional UI with Canvas prefabs.
- Use background art as separate `Image` or `SpriteRenderer` layers.
- Keep buttons, labels, word tiles, line renderers, and feedback states as live UI objects.

## Review Checklist

- [ ] No fake buttons are visible inside background art.
- [ ] No baked text duplicates live text.
- [ ] Touch targets are real controls.
- [ ] UI can scale to small and tall phones.
- [ ] All gameplay state can change without regenerating images.
