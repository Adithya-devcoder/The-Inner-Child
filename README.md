# The Inner Child Restaurant: website

## Folder structure

```
the-inner-child/
├── index.html                  Page content (all text, links, sections)
├── css/
│   ├── base.css                Colours, fonts, resets, 3D background, grain
│   ├── components.css          Liquid glass, loading screen, cursor, menu bar, buttons, headings
│   └── sections.css            Hero, banners, story, kitchen, space, statement, visit, footer
├── js/                         (loaded in this order, see the bottom of index.html)
│   ├── core.js                 Shared settings (reduced motion, mobile size, etc.)
│   ├── text-split.js           Splits headings into letters / story into words for animation
│   ├── smooth-scroll.js        Lenis smooth scrolling
│   ├── navigation.js           Menu links + mobile menu
│   ├── cursor.js               Custom cursor
│   ├── liquid-glass.js         Liquid glass ripple animation
│   ├── scene.js                Three.js 3D coffee cup, beans, leaves, steam
│   ├── scroll-animations.js    GSAP ScrollTrigger animations + 3D cup movement per section
│   ├── framer-interactions.js  Framer Motion fade-ins, magnetic buttons, card tilt
│   └── main.js                 Start-up: loading screen + intro, connects everything
└── assets/images/              Photos + grain texture
```

## Where to change what

| I want to change…                     | Edit                                  |
| ------------------------------------- | ------------------------------------- |
| Any text, phone, email, address, link | `index.html`                          |
| Colours or fonts                      | `css/base.css` (top `:root` block)    |
| Look of a section                     | `css/sections.css` (search the section name) |
| A photo                               | Replace the file in `assets/images/` with the same name |
| The 3D cup or its position per section| `js/scene.js` (`poses`)               |
| Scroll animations                     | `js/scroll-animations.js`             |

## Running it

- Double-click `index.html` to open it in a browser (needs an internet connection for fonts and animation libraries).
- To publish, upload the whole `the-inner-child` folder to any web host (Netlify, Vercel, GitHub Pages, cPanel…).
- Keep the folder structure as it is. The files refer to each other by these paths.
