import { Grid } from "./Grid.js";
import { Tile } from "./Tile.js";

const gameBoard = document.getElementById("game-board");
const grid = new Grid(gameBoard);
grid.getRandomEmptyCell().linkTile(new Tile(gameBoard));
grid.getRandomEmptyCell().linkTile(new Tile(gameBoard));
setupInputOnce();

function setupInputOnce() {
    window.addEventListener("keydown", handleInput, {once: true});
}

async function handleInput(event){
    //console.log(event.key)
    switch (event.key) {
        case "ArrowUp":
            if (!canMoveUp()){
                setupInputOnce();
                return;
            }   
            await moveUp();
            break;
        case "ArrowDown":
            if (!canMoveDown()){
                setupInputOnce();
                return;
            }
            await moveDown(); 
            break;
        case "ArrowLeft":
            if (!canMoveLeft()){
                setupInputOnce();
                return;
            }
            await moveLeft(); 
            break;
        case "ArrowRight":
            if (!canMoveRight()){
                setupInputOnce();
                return;
            }  
            await moveRight(); 
            break;
    
        default:
            setupInputOnce();
           return;
    }
    const newTile = new Tile(gameBoard);
    grid.getRandomEmptyCell().linkTile(newTile);

    if  (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
        await newTile.waitForAnimationEnd();
        alert("Try again!")
        return
    }

    setupInputOnce();
}

async function moveUp() {
    await slideTiles(grid.cellsGroupedByColum);
}

async function moveDown(){
    await slideTiles(grid.cellsGroupedByReversedColum);
}

async function moveLeft(){
    await slideTiles(grid.cellsGroupedByleft)
}
async function moveRight(){
    await slideTiles(grid.cellsGroupedByRight)
}

async function slideTiles(groupedColls) {
    const promis = [];

    groupedColls.forEach(group => SlideTilesInGroup(group, promis));

    await Promise.all(promis);

    grid.cells.forEach(cell => {
        cell.hasTileForMerge() && cell.mergeTiles()
    });
}

function SlideTilesInGroup(group, promis){
    for (let i=1; i<group.length; i++) {
        if (group[i].isEmpty()) {
            continue;
        }

        const celliWithtile = group[i];

        let targetCell;
        let j = i - 1;
        while (j>=0 && group[j].canAccept(celliWithtile.linkedTile)) {
            targetCell = group[j];
            j--;
        }
        if (!targetCell) {
            continue;
        }

        promis.push(celliWithtile.linkedTile.waitForTransitionEnd());

        if (targetCell.isEmpty()) {
            targetCell.linkTile(celliWithtile.linkedTile);
        }else {
            targetCell.linkTileForMerge(celliWithtile.linkedTile);
        }

        celliWithtile.unlinkTile();
    }
}

function canMoveUp() {
    return canMove(grid.cellsGroupedByColum);
}
function canMoveDown() {
    return canMove(grid.cellsGroupedByReversedColum);
}
function canMoveLeft() {
    return canMove(grid.cellsGroupedByleft);
}
function canMoveRight() {
    return canMove(grid.cellsGroupedByRight);
}

function canMove(groupedCells) {
    return groupedCells.some(group => CanMoveInGroup(group))
}

function CanMoveInGroup(group) {
    return group.some((cell, index) => {
        if (index === 0) {
            return false;
        }

        if (cell.isEmpty()) {
            return false;
        }

        const targetCell = group[index - 1];
        return targetCell.canAccept(cell.linkedTile);
    })
}