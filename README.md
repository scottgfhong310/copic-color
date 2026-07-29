# copic-color

> 版本 v1.0｜最後更新 2026-07-29

[繁體中文](README.zh-Hant.md) ｜ **English** ｜ [日本語](README.ja.md)

A read-only reference WebApp mapping **COPIC colour codes → CSS**. Unlike a plain swatch wall, it browses
the 358 colours along the **three axes of the Copic Color System** — because a Copic code *is* those axes:
`BV02` = colour family `BV` + Blending Group `0` (saturation, 0–9) + Intensity Value `2` (lightness, 000–9).
Pick a family, and the grid lays that system out as it actually is.

A second page (`sets.html`) answers the practical question: **which box should I buy?** Pick a set, keep only
its colours, and scan across the other sets — the header row tells you how many colours each one is missing
relative to your base set.

- **358 colours**, 17 colour families, 4 product lines (Sketch 358 / Classic 214 / Ciao 180 / Copic Ink 358)
- **62 assortments** — the numbered sets (12 / 24 / 36 / 72) plus the themed ones (Sea & Sky, Color Fusion,
  Doodle Kit …)
- **Nearest-colour matcher** (`nearestCOPIC`, CIEDE2000): give it any RGB and it names the closest marker.
  Restrict it to a product line and it only suggests colours that line actually ships.
- Copy hex / `rgb()` / `var(--copic-…)` / utility class; export the whole `.css`
- light / dark themes, three languages (zh-Hant / en / ja), zero backend

```bash
npm install && npm start        # → http://localhost:3000/apps/copic-color/
```

## Accuracy

Hex values are sampled from the vector fills of the official COPIC catalogue. **The catalogue itself states
that the printed colours differ from the actual marker ink** — so treat these as a screen approximation, not
an official specification. For accurate colour matching use physical COPIC swatches.

COPIC markers use alcohol-based **dye**, not pigment: the manufacturer publishes neither lightfastness ratings
nor Colour Index numbers. Those fields are empty because the data does not exist — not because it is missing.

## Data

`public/apps/copic-color/data/copic-*.js` are **build artefacts** exported from the family colour database
(`db_artcolor`), which is the System of Record. The app itself connects to no database — the data files are
version-controlled, so a fresh clone runs with nothing but `npm install`.

This app is part of the **nodeapp WebApp family**; shared conventions live in
[nodeapp-webapp-family](https://github.com/scottgfhong310/nodeapp-webapp-family).

MIT licensed. COPIC is a trademark of Too Marker Products Inc.; this project is an unofficial reference tool
and is not affiliated with or endorsed by them.
