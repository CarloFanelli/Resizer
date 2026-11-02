# Resizer

Resizable side-by-side panels in TypeScript, with no framework and no dependencies.

Give it a list of sibling elements and it inserts a draggable handle between each pair, lets the user resize them with the mouse, **remembers the sizes in `localStorage`** and re-distributes space automatically when a panel is hidden or shown.

**[Live demo](https://carlofanelli.github.io/Resizer/)** (styled with Tailwind)

## Features

- Works with 2..n panels in a row
- Drag handles created for you; style them with any class list (CSS or Tailwind)
- Sizes persisted per `saveName` in `localStorage` and restored on reload
- Watches each panel with a `MutationObserver`: toggle a class (e.g. `hidden`) and the remaining panels share the freed space
- Written in TypeScript, compiled to plain ES modules

## Install

```bash
git clone https://github.com/CarloFanelli/Resizer
cd Resizer
npm i
npm run dev      # compiles with tsc and serves the demo
npm run build    # compiles to ./bin
```

## Usage

The compiled module lives in `./bin/Resize.js`. Every resizable element needs an `id` (it is the key used for persistence) and the parent must be `position: relative`.

```html
<div class="relative flex">
  <div class="resizableElement" id="left"></div>
  <div class="resizableElement" id="center"></div>
  <div class="resizableElement" id="right"></div>
</div>
```

```js
import Resize from './bin/Resize.js';

new Resize({
  resizableElements: [...document.querySelectorAll('.resizableElement')],
  resizerClassList: 'resizer cursor-col-resize w-1 hover:border border-blue-500', // classes for the drag handle
  saveName: 'layout-main',   // localStorage key prefix
  classToCheck: 'hidden'     // class that hides a panel; the others adapt
});
```

## Options

| Option | Type | Description |
|---|---|---|
| `resizableElements` | `HTMLElement[]` | Panels to make resizable, in DOM order |
| `resizerClassList` | `string` | Class list applied to each generated handle |
| `saveName` | `string` | Prefix for the `localStorage` entry that stores widths |
| `classToCheck` | `string` | When a panel gets this class it is excluded from the layout and space is redistributed |

## Project structure

```
src/
├── Resize.ts     # main class: sizing, persistence, mutation observer, drag logic
└── Resizer.ts    # creates the handle element between two panels
```

## Status

Small, working library extracted from a real layout need. Horizontal resizing only; vertical mode and touch support would be the natural next steps.
