const gridCellComponent = {
    template: '#grid-cell',
    props: ['cell'],
    data(){
        return {
            cellWidth: 80,
            cellHeight: 80,
        }
    },
    watch: {
        cell(oldCell, newCell){
        }
    },
    computed: {
        position(){
            return {
                'transform': `translate3d(${this.cell.x * this.cellWidth}px, ${this.cell.y * this.cellHeight}px, 0)`,
            };
        },
        textSize(){
            const mod = this.cell.num.toString().length - 1; // Start at 100%
            return {
                'font-size': `${100 - (mod * 20)}%`
            };
        },
    }
}

const emptyGrid = () => [
    [
        {num: 0, key: 0, x: 0, y: 0, fresh: false },
        {num: 0, key: 1, x: 1, y: 0, fresh: false },
        {num: 0, key: 2, x: 2, y: 0, fresh: false },
        {num: 0, key: 3, x: 3, y: 0, fresh: false }, 
    ],
    [
        {num: 0, key: 4, x: 0, y: 1, fresh: false },
        {num: 0, key: 5, x: 1, y: 1, fresh: false },
        {num: 0, key: 6, x: 2, y: 1, fresh: false },
        {num: 0, key: 7, x: 3, y: 1, fresh: false }, 
    ],
    [
        {num: 0, key: 8, x: 0, y: 2, fresh: false },
        {num: 0, key: 9, x: 1, y: 2, fresh: false },
        {num: 0, key: 10, x: 2, y: 2, fresh: false },
        {num: 0, key: 11, x: 3, y: 2, fresh: false }, 
    ],
    [
        {num: 0, key: 12, x: 0, y: 3, fresh: false },
        {num: 0, key: 13, x: 1, y: 3, fresh: false },
        {num: 0, key: 14, x: 2, y: 3, fresh: false},
        {num: 0, key: 15, x: 3, y: 3, fresh: false }, 
    ]
];

const slideAndComposeArray = array => {
    const rowSort = (a, b) => a.num !== 0 ? b.num !== 0 ? 0 : 1 : -1;

    const arrayCopy = array.map(a => a);
    const newRow = arrayCopy.sort(rowSort);
    newRow.forEach((cell, indx) => {
        const cell2 = newRow[indx + 1];
        if(cell2){
            if(cell.num === cell2.num) {
                newRow[indx + 1].num = 0;
                newRow[indx].num = cell.num * 2;
            }
        }
    })
    return newRow.sort(rowSort);
}

const rowEquals = (one, two) => {
    if(one.length !== two.length) return false;
    return one.every((o, indx) => o.key === two[indx].key);
}

const rowIterator = (grid, rowFunc) => {
    grid.forEach(rowFunc);
}

const cellIterator = (grid, cellFunc) => {
    grid.forEach((row, rowIndx) => row.forEach((num, columnIndx) => cellFunc(num, rowIndx, columnIndx)));
}

const rotateGrid = (grid, cw) => {
    let newGrid = emptyGrid();
    cw = cw || false;
    cellIterator(grid, (num, rowIndx, columnIndx) => {
        if(!cw) {
            newGrid[rowIndx][columnIndx] = grid[columnIndx][rowIndx];
        }
        else {
            newGrid[columnIndx][rowIndx] = grid[rowIndx][columnIndx];   
        }
    })
    return newGrid;
}

const flipGrid = grid => {
    rowIterator(grid, (row, rowIndx) => grid[rowIndx] = row.reverse());
    return grid;
}

const app = new Vue({
    el: '#app',
    data: {
      displayGrid: [],
      grid: []
    },
    created(){
        this.newGame();
        console.table(this.grid);
        window.addEventListener('keydown', e => {
            let direction = '';
            switch(e.keyCode){
                case 37: direction = 'LEFT'; break;
                case 38: direction = 'UP'; break;
                case 39: direction = 'RIGHT'; break;
                case 40: direction = 'DOWN'; break;
                default: direction = null; break;
            }
            if(direction) this.slide(direction);
        })
    },
    methods:{
        slide(action){
            let newGrid = emptyGrid();
            cellIterator(this.grid, (num, rowIndx, columnIndx) => newGrid[rowIndx][columnIndx] = num);

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
            this.grid = newGrid;
            if(didSlide) this.addNumber();
            
            cellIterator(this.grid, (cell, rowIndx, columnIndx) => {
                const displayCell = this.displayGrid.find(dc => dc.key === cell.key);
                displayCell.x = rowIndx;
                displayCell.y = columnIndx;
                displayCell.num = cell.num;
                displayCell.fresh = cell.fresh;
            });
        },
        addNumber(){
            const options = [];
            cellIterator(this.grid, (num, rowIndx, columnIndx) => {
                if(num.num === 0) options.push(num);
                else num.fresh = false;
            });
            if(options.length > 0){
                const position = options[(Math.random() * options.length - 1) | 0];
                position.num = Math.random() > 0.1 ? 2 : 4;
                position.fresh = true;
            }
        },
        newGame(){
            this.grid = emptyGrid();
            this.displayGrid = [];
            this.addNumber();
            this.addNumber();
            cellIterator(this.grid, (cell, rowIndx, columnIndx) => {
                this.displayGrid.push(cell)
                const displayCell = this.displayGrid.find(dc => dc.key === cell.key);
                displayCell.x = rowIndx;
                displayCell.y = columnIndx;
                displayCell.num = cell.num;
                displayCell.fresh = cell.fresh;
            });
        }
    },
    components: {
        'grid-cell': gridCellComponent
    }
})