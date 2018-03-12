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

module.exports = {
    gridCellComponent
}