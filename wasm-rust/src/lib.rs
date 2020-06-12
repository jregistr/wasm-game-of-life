// #![feature(wasm_import_memory)]
// #![wasm_import_memory]

mod utils;

use wasm_bindgen::prelude::*;
use wasm_bindgen::__rt::std::process::id;
use std::fmt;
use wasm_bindgen::__rt::core::fmt::Formatter;


// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.

// #[cfg(feature = "wee_alloc")]
// #[global_allocator]
// static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
    alert("Hello, wasm-rust!");
}

#[wasm_bindgen(js_name="sayHello")]
pub fn say_hello(name: &str) -> String {
    return format!("Hello {}, I hope you're having a great day!", name)
}

#[wasm_bindgen]
#[repr(u8)]
#[derive(Copy, Clone, Debug, Eq, PartialEq)]
pub enum Cell {
    Dead = 0,
    Alive = 1
}

#[wasm_bindgen]
pub struct Universe {
    width: u32,
    height: u32,
    cells: Vec<Cell>
}

#[wasm_bindgen]
impl Universe {
    fn get_cell_index(&self, row: u32, column: u32) -> usize {
        (row * self.width + column) as usize
    }

    fn live_neighbor_count_for_cell(&self, row: u32, column: u32) -> u8 {
        let mut count = 0;
        for &delta_row in [self.height - 1, 0, 1].iter() {
            for &delta_col in [self.width - 1, 0, 1].iter() {
                if delta_row == 0 && delta_col == 0 {
                    continue;
                }

                let neighbor_row = (row + delta_row)% self.height;
                let neighbor_col = (column + delta_col) % self.width;
                let idx = self.get_cell_index(neighbor_row, neighbor_col);
                count += self.cells[idx] as u8;
            }
        }
        count
    }

    pub fn next_tick(&mut self) {
        let mut next_gen = self.cells.clone();

        for row in 0..self.height {
            for col in 0..self.width {
                let idx = self.get_cell_index(row, col);
                let cell = self.cells[idx];
                let live_neighbors_count = self.live_neighbor_count_for_cell(row, col);

                let next_cell_state = match (cell, live_neighbors_count) {
                    (Cell::Alive, x) if x < 2 => Cell::Dead,

                    (cur_alive@Cell::Alive, x) if x == 2 || x == 3 => cur_alive,

                    (Cell::Alive, x) if x > 3 => Cell::Dead,

                    (Cell::Dead, 3) => Cell::Alive,

                    (other, _) => other
                };

                next_gen[idx] = next_cell_state;
            }
        }

        self.cells = next_gen;
    }
}

impl fmt::Display for Universe {
    fn fmt(&self, f: &mut Formatter) -> fmt::Result {
        for line in self.cells.as_slice().chunks(self.width as usize) {
            for &cell in line {
                let symbol = if cell == Cell::Dead { " ◻ " } else { " ◼ " };
                write!(f, "{}", symbol)?;
            }
            write!(f, "\n")?;
        }

        Ok(())
    }
}

#[wasm_bindgen]
impl Universe {

    pub fn new() -> Universe {
        let width = 100;
        let height = 80;
        let cells: Vec<Cell> = (0..width * height).map(|i| {
            if i % 2 == 0 || i % 7 == 0 {
                Cell::Alive
            } else {
                Cell::Dead
            }
        }).collect();

        Universe {width, height, cells}
    }

    pub fn render(&self) -> String {
        self.to_string()
    }
}

#[wasm_bindgen]
impl Universe {
    pub fn width(&self) -> u32 {
        self.width
    }

    pub fn height(&self) -> u32 {
        self.height
    }

    pub fn cells(&self) -> *const Cell {
        self.cells.as_ptr()
    }
}
