import hello from "./hello";
import {Universe, Cell} from "wasm-rust";
import {memory} from "wasm-rust/index_bg";

// const helloHead = document.createElement("h1");
// helloHead.append(document.createTextNode(hello()));
//
// document.body.appendChild(helloHead);
//
// wasm.greet();
//
//
// const h3 = document.createElement("h3");
// h3.appendChild(document.createTextNode(wasm.sayHello("Stranger")));
// document.body.appendChild(h3);

// Done with Pre element
/*
const pre = document.getElementById("game-of-life-canvas")! as HTMLPreElement;
const universe = Universe.new();

const renderLoop = () => {
    pre.textContent = universe.render();
    universe.next_tick();

    requestAnimationFrame(renderLoop);
}

requestAnimationFrame(renderLoop);
 */


// Done with Canvas Element

const CELL_SIZE = 5; // px
const GRID_COLOR = "#CCCCCC";
const DEAD_COLOR = "#FFFFFF";
const ALIVE_COLOR = "#000000";

const universe = Universe.new();

const canvas = document.getElementById("game-of-life-canvas") as HTMLCanvasElement;
const [width, height] =  [
    (CELL_SIZE + 1) * (universe.width() + 1),
    (CELL_SIZE + 1) * (universe.height() + 1)
]
canvas.width = width;
canvas.height = height;

const ctx = canvas.getContext('2d')!;

function drawGrid(): void {
    ctx.beginPath();
    ctx.strokeStyle = GRID_COLOR;

    for (let i = 0; i <= width; i++) {
        ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
        ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
    }

    // Horizontal lines.
    for (let j = 0; j <= height; j++) {
        ctx.moveTo(0,                           j * (CELL_SIZE + 1) + 1);
        ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1);
    }

    ctx.stroke();
}

function getIndex(row: number, col: number): number {
    return row * width + col;
}

function drawCells(): void {
    const cellsPtr = universe.cells();
    const cells = new Uint8Array(memory.buffer, cellsPtr, width * height);
    ctx.beginPath();
    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            const idx = getIndex(row, col);

            ctx.fillStyle = cells[idx] === Cell.Dead
                ? DEAD_COLOR
                : ALIVE_COLOR;

            ctx.fillRect(
                col * (CELL_SIZE + 1) + 1,
                row * (CELL_SIZE + 1) + 1,
                CELL_SIZE,
                CELL_SIZE
            );
        }
    }
    ctx.stroke();
}

function renderLoop(): void {
    universe.next_tick();
    drawGrid();
    drawCells();
    requestAnimationFrame(renderLoop);
}

drawGrid();
drawCells();
requestAnimationFrame(renderLoop);
