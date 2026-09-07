# Garden Skills integration

Project6 includes the upstream `ConardLi/garden-skills` repository as a read-only learning/reference submodule at `vendor/garden-skills`.

Upstream: https://github.com/ConardLi/garden-skills
Pinned commit: `aaf9a82f5efd73e87cc0998edc398e75bfc35901`
License: MIT (retain upstream LICENSE and copyright notices).

## Why a submodule

- Keeps the complete upstream repository structure intact.
- Makes the exact upstream commit visible and reproducible.
- Avoids mixing third-party source with Project6's own templates, components, notes, and customizations.
- Allows future updates without losing provenance.

## Project6 learning layer

Project6 should visualize and explain the upstream project without modifying the upstream copy in place. Our own learning notes and UI should live outside `vendor/garden-skills`, for example:

- `docs/garden/` — architecture notes and learning documents
- `templates/` — Project6-owned reusable video templates
- `assets/` — Project6-owned images, SVG, CSS, sound assets
- `knowledge/` — Project6-owned workflow and production knowledge

The first Project6 visualization should focus on `vendor/garden-skills/skills/web-video-presentation/`, including `SKILL.md`, `manifest.json`, READMEs, `references/`, `scripts/`, and `templates/`.

## Server setup

After `git pull`, initialize/update the full upstream project with:

```bash
git submodule update --init --recursive
```

For automated deployment, run the same command after each pull so the server always has the pinned Garden Skills source.
