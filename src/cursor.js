// import gsap from "gsap";
// Either use gsap.utils.random or the following
// function if not using gsap in project
import { random } from "./utils";

// SADLY THIS GOO WON'T WORK IN FIREFOX :(
// =======================================

const isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;

// MOUSE POSITION
// ==============

let mousepos = { x: 0, y: 0 };

const updateMousePos = (event) => {
  mousepos = {
    x: event.clientX,
    y: event.clientY
  };
};

window.addEventListener("mousemove", updateMousePos);
window.addEventListener("pointermove", updateMousePos, { passive: true });

// SIZING
// ======

let sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

window.addEventListener("resize", (event) => {
  sizes = {
    width: window.innerWidth,
    height: window.innerHeight
  };
});

// GOO CURSOR CLASS
// ================

export class GooCursor {
  DOM = {
    // Main DOM element
    el: null,
    // .cursor__inner element
    inner: null,
    // cells that get shown on mousemove
    cells: null
  };

  // Size of one cell (.cursor__inner-box)
  cellSize;
  rows;
  columns;
  settings = {
    // Time that one cells gets visible before fading out
    ttl: 0.2,
    gridSize: 15
  };

  constructor(wrapper) {
    this.DOM.el = wrapper;

    // Cells wrapper element that gets the SVG filter applied
    this.DOM.inner = this.DOM.el.querySelector(".cursor__inner");

    // Too much for firefox...
    if (!isFirefox) {
      this.DOM.inner.style.filter = "url(#gooey)";
      this.layout();
      this.initEvents();
    } else {
      console.log("change your browser to chrome");
    }
  }

  initEvents() {
    // Recalculate and create the .cursor__inner-box elements on 'resize'
    window.addEventListener("resize", () => this.layout());

    // Show/hide cells on 'mousemove' or 'pointermove' events
    const handleMove = () => {
      // Check which cell is being "hovered"
      const cell = this.getCellAtCursorPosition();

      if (cell === null || this.cachedCell === cell) return;
      // Cache it
      this.cachedCell = cell;

      cell.style.opacity = 1;
      setTimeout(() => (cell.style.opacity = 0), this.settings.ttl * 1000);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("pointermove", handleMove, { passive: true });
  }

  /**
   * Calculate and create the .cursor__inner-box elements and insert in .cursor__inner.
   * These are the elements that get shown when moving the mouse
   */
  layout() {
    // this.columns = this.settings.gridSize;
    // The number of columns is defined in a CSS variable --columns
    this.columns = getComputedStyle(this.DOM.el).getPropertyValue("--columns");
    this.cellSize = sizes.width / this.columns;
    this.rows = Math.ceil(sizes.height / this.cellSize);
    this.cellsTotal = this.rows * this.columns;

    // Insert [this.cellsTotal] cursor__inner-box elements inside the .cursor__inner element
    let innerStr = "";
    // Erase contents
    this.DOM.inner.innerHTML = "";

    const customColorsAttr = this.DOM.el.getAttribute("data-custom-colors");
    let customColorsArr;
    let customColorsTotal = 0;
    if (customColorsAttr) {
      customColorsArr = this.DOM.el
        .getAttribute("data-custom-colors")
        .split(",");
      customColorsTotal = customColorsArr ? customColorsArr.length : 0;
    }
    for (let i = 0; i < this.cellsTotal; ++i) {
      innerStr +=
        customColorsTotal === 0
          ? '<div class="cursor__inner-box"></div>'
          : `<div style="transform: scale(${random(0.5, 2)}); background:${
              customColorsArr[Math.round(random(0, customColorsTotal - 1))]
            }" class="cursor__inner-box"></div>`;
    }
    this.DOM.inner.innerHTML = innerStr;
    this.DOM.cells = this.DOM.inner.children;
  }

  getCellAtCursorPosition() {
    const columnIndex = Math.floor(mousepos.x / this.cellSize);
    const rowIndex = Math.floor(mousepos.y / this.cellSize);
    const cellIndex = rowIndex * this.columns + columnIndex;

    if (cellIndex >= this.cellsTotal || cellIndex < 0) {
      console.error("Cell index out of bounds");
      return null;
    }

    return this.DOM.cells[cellIndex];
  }
}
