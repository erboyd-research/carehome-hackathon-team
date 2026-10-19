# Warm theme preview

Local visual experiment requested by the user. Previous look: commit `656ca90`. No repair data, validation or storage format changes.

- Full header and logo background share `#f04e50`.
- Warm canvas: `#f1ece4`; main surfaces: `#faf6ef`; fields: `#fffaf3`; inset surfaces: `#f2ebe1`.
- Borders and secondary text use warmer neutral tones. Primary actions retain the deeper company red.
- Priority choices and other interactive colour states transition over 240ms rather than changing instantly. Hover never changes the selected priority.
- Reduced-motion settings disable transitions and animations.
- Header links stay dark to preserve contrast on coral.

Verification: production build passed and all 14 desktop/mobile browser checks passed, including contrast, keyboard use, hover/selection behaviour and the main repair journey. The layout measurement now waits for the local font before comparing panel positions, avoiding a font-loading race.

Keep or revert after visual review. This experiment is committed separately and remains local; use a normal Git revert of the experiment commit if the previous look is preferred.
