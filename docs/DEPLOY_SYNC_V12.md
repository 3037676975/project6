# Project6 Deploy Sync · Chapter 1 v12

This user-authored commit intentionally triggers the existing Git/Baota deployment after the Chapter 1 v12 runtime fix.

Expected repository state after pull:

- `presentations/harness-engineering/index.html` loads `chapter1-redesign.css?v=12` and `chapter1-redesign.js?v=12`.
- `chapter1-redesign.js` no longer installs or replaces the static Harness cover at runtime.
- Step 1 uses the static `HARNESS ENGINEERING` cover from `index.html`.
- palette: warm white + graphite + aqua/teal accent; deep green is no longer the primary dark surface.
- source fix commit: `402952ca9dedb028f224f18ca795531e853bcb92`.
