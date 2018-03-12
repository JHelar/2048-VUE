const makeGameService = () => {
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
        let newGrid = getEmptyGrid();
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

    const getEmptyGrid = () => [
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

    const addNumberToGrid = grid => {
        const options = [];
        cellIterator(grid, (num, rowIndx, columnIndx) => {
            if(num.num === 0) options.push(num);
            else num.fresh = false;
        });
        if(options.length > 0){
            const position = options[(Math.random() * options.length - 1) | 0];
            position.num = Math.random() > 0.1 ? 2 : 4;
            position.fresh = true;
        }
        return grid;
    }

    return {
        flipGrid,
        rotateGrid,
        cellIterator,
        rowIterator,
        rowEquals,
        slideAndComposeArray,
        getEmptyGrid,
        addNumberToGrid
    }
}

module.exports = makeGameService();