const { 
    flipGrid,
    rotateGrid,
    cellIterator,
    rowIterator,
    rowEquals,
    slideAndComposeArray,
    getEmptyGrid,
    addNumberToGrid
} = require('./gameservice');
const _ = require('lodash');


const store = new Vuex.Store({
    state: {
        displayGrid: [],
        grid: []
    },
    mutations: {
        slide(state, action) {
            let newGrid = getEmptyGrid();
            cellIterator(state.grid, (num, rowIndx, columnIndx) => newGrid[rowIndx][columnIndx] = num);

            let didSlide = false;
            let calcDone = () => null;

            switch(action){
                case 'UP':
                    newGrid = flipGrid(newGrid);
                    calcDone = () => {
                        newGrid = flipGrid(newGrid);
                    }
                    break;
                case 'LEFT':
                    newGrid = rotateGrid(newGrid)
                    newGrid = flipGrid(newGrid)
                    calcDone = () => {
                        newGrid = flipGrid(newGrid)
                        newGrid = rotateGrid(newGrid, true)
                    }
                    break;
                case 'RIGHT':
                    newGrid = rotateGrid(newGrid)
                    calcDone = () => {
                        newGrid = rotateGrid(newGrid, true)
                    }
                    break;
                case 'DOWN':
                default:
                    break;
            }
            rowIterator(newGrid, (oldRow, rowIndx) => {
                let newRow = slideAndComposeArray(oldRow);
                didSlide = didSlide || !rowEquals(oldRow, newRow);
                newGrid[rowIndx] = newRow;
            })
            calcDone();
            state.grid = newGrid;
            if(didSlide) {
                addNumberToGrid(state.grid);
            }
            
            cellIterator(state.grid, (cell, rowIndx, columnIndx) => {
                const displayCell = state.displayGrid.find(dc => dc.key === cell.key);
                displayCell.x = rowIndx;
                displayCell.y = columnIndx;
                displayCell.num = cell.num;
                displayCell.fresh = cell.fresh;
            });
        },
        setState(state, theState){
            const { displayGrid, grid } = _.cloneDeep(theState);
            
            state.displayGrid = displayGrid;
            state.grid = grid;
        },
        newGame(state){
            state.grid = getEmptyGrid();
            state.displayGrid = [];
            addNumberToGrid(state.grid);
            addNumberToGrid(state.grid);
            cellIterator(state.grid, (cell, rowIndx, columnIndx) => {
                state.displayGrid.push(cell)
                const displayCell = state.displayGrid.find(dc => dc.key === cell.key);
                displayCell.x = rowIndx;
                displayCell.y = columnIndx;
                displayCell.num = cell.num;
                displayCell.fresh = cell.fresh;
            });
        },
        emptyState() {
            this.replaceState({
                displayGrid: [],
                grid: []
            });       
        }
    }
});
module.exports = store;