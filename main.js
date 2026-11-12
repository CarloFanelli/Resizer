import Resize from './bin/Resize.js';

const SAVE_NAME = 'resizableElements';
const STORAGE_KEY = `${SAVE_NAME}Size`;
const HIDDEN_CLASS = 'hidden';

const row = document.getElementById('panels');
const panels = [...row.querySelectorAll('.resizableElement')];

new Resize({
  resizableElements: panels,
  resizerClassList: 'resizer',
  saveName: SAVE_NAME,
  classToCheck: HIDDEN_CLASS
});

/* Everything below only drives the readouts and buttons of this page. */

// Each panel prints its own share of the row. The number is set in a
// variable-width typeface and stretched to fill the panel it measures.
function showWidth(panel) {
  const label = panel.querySelector('.panel__width');
  const share = (panel.getBoundingClientRect().width / row.getBoundingClientRect().width) * 100;
  label.textContent = `${Math.round(share)}%`;

  const style = getComputedStyle(panel);
  const room = panel.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
  label.style.fontStretch = '100%';
  const stretch = Math.min(150, Math.max(50, (room / label.offsetWidth) * 100));
  label.style.fontStretch = `${stretch}%`;
}

const widthObserver = new ResizeObserver(entries => {
  entries.forEach(entry => showWidth(entry.target));
});
panels.forEach(panel => widthObserver.observe(panel));
document.fonts.ready.then(() => panels.forEach(showWidth));

// What Resizer wrote to localStorage
const saved = document.getElementById('saved');
const savedEmpty = document.getElementById('savedEmpty');

function showSaved() {
  const raw = localStorage.getItem(STORAGE_KEY);
  saved.textContent = raw
    ? `[\n${JSON.parse(raw).map(entry => `  ${JSON.stringify(entry)}`).join(',\n')}\n]`
    : '';
  saved.hidden = !raw;
  savedEmpty.hidden = Boolean(raw);
}

showSaved();
// Resizer saves on mouseup: read the value right after it has been written.
document.addEventListener('mouseup', () => setTimeout(showSaved));

// Hiding a panel is just toggling the class passed as `classToCheck`
const toggleLast = document.getElementById('toggleLast');
const lastPanel = panels[panels.length - 1];

// Once Resizer has shared out the space, pin every visible panel to the
// width it ended up with, so the row keeps adding up to exactly 100%.
function fillRow() {
  const rowWidth = row.getBoundingClientRect().width;
  const visible = panels.filter(panel => !panel.classList.contains(HIDDEN_CLASS));
  const widths = visible.map(panel => panel.getBoundingClientRect().width);
  visible.forEach((panel, i) => { panel.style.width = `${(widths[i] / rowWidth) * 100}%`; });
}

toggleLast.addEventListener('click', () => {
  const isHidden = lastPanel.classList.toggle(HIDDEN_CLASS);
  toggleLast.textContent = isHidden ? 'Show the last panel' : 'Hide the last panel';
  requestAnimationFrame(fillRow);
});

document.getElementById('clearSaved').addEventListener('click', () => {
  localStorage.removeItem(STORAGE_KEY);
  panels.forEach(panel => { panel.style.width = ''; });
  showSaved();
});
