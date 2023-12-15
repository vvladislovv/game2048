import { Cell } from "./Cell.js";

const GRID_SIZE = 4;
const CELLS_COUNT = GRID_SIZE * GRID_SIZE;

export class Grid {
    constructor(gridElement) {
        this.cells = [];
        for (let i = 0; i < CELLS_COUNT; i++) {
            this.cells.push(
                new Cell(gridElement, i % GRID_SIZE, Math.floor(i / GRID_SIZE))
            );
        }
        this.cellsGroupedByColum = this.groupCellsByColum();
        this.cellsGroupedByReversedColum = this.cellsGroupedByColum.map(column => [...column].reverse());
        this.cellsGroupedByleft = this.groupCellsByLeft();
        this.cellsGroupedByRight = this.cellsGroupedByleft.map(left => [...left].reverse());
    }

    getRandomEmptyCell() {
        const emptyCells = this.cells.filter(Cell => Cell.isEmpty());
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        return emptyCells[randomIndex];
    }

    groupCellsByColum() {
        return this.cells.reduce((groupedCells, cell) => {
            groupedCells[cell.x] = groupedCells[cell.x] || [];
            groupedCells[cell.x][cell.y] = cell;
            return groupedCells;
        }, [])
    }
    groupCellsByLeft() {
        return this.cells.reduce((groupedCells, cell) => {
            groupedCells[cell.y] = groupedCells[cell.y] || [];
            groupedCells[cell.y][cell.x] = cell;
            return groupedCells;
        }, [])
    }
}