# React + TypeScript + Vite

## Typography Guideline

Global UI fonts are defined in `src/styles/index.css`.

Use this Google Fonts import:

```css
@import url("https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700;800;900&family=Manrope:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap");
```

Font roles:

- Title: `Space Grotesk`
- Text: `Be Vietnam Pro`
- Sub text: `Manrope`

Implementation note:

- `body`, buttons, inputs, selects, and text controls use `Be Vietnam Pro`.
- `h1` to `h6` and `.font-title` use `Space Grotesk`.
- `p`, `small`, captions, and `.font-subtext` use `Manrope`.
- The Owlreka sidebar wordmark intentionally keeps `Agbalumo`.
