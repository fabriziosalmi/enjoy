# 🎨 Generative Art Gallery

> *"Ogni opera è unica. Ogni seed irripetibile. Ogni karma immortale."*

## About This Gallery

This gallery contains procedurally generated artwork created by the **enjoy** game engine. Each piece is unique, generated from the mathematical seed of the game state at that moment in time.

## Art Types

| Type | Description | Frequency |
|------|-------------|-----------|
| 🌸 **Mandala** | Sacred geometry from karma flow | Every 4h cycle |
| ⭐ **Constellation** | Star maps from player positions | Every 4h cycle |
| 🌊 **Wave** | Harmonic patterns from time | Every 4h cycle |
| 🌳 **Tree** | Growth visualization from community | Every 4h cycle |
| 🌀 **Spiral** | Infinite recursion from level progress | Every 4h cycle |

## How It Works

1. The workflow reads `state.json`
2. A unique seed is generated from: `karma × 7 + players × 13 + level × 17 + timestamp`
3. The art type is determined by the hour
4. Mathematical algorithms generate SVG artwork
5. The piece is committed to the gallery forever

## Gallery Statistics

- **Generation Rate:** 6 artworks per day
- **Seed Range:** 0-9999
- **Color Palette:** Derived from state values
- **Animation:** CSS-based, runs in browser

---

*The art grows with the game. Each contribution influences future creations.*

*View the generated works in `art/generated/`*
