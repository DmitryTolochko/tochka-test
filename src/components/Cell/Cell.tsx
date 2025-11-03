import { getConstants } from "../../utils/storage";
import './Cell.scss';

interface ICellProps {
    value: number, 
    colIndex?: number, 
    rowIndex?: number,
    isWin?: boolean
}

/**
 * Компонент ячейки
 * @property {number} value - значение ячейки
 * @property {number} colIndex - индекс столбца
 * @property {number} rowIndex - индекс строки
 * @property {boolean} isWin - является ли ячейка выигрышной
 * @param param0 
 */
function Cell ({value, colIndex=0, rowIndex=0, isWin=false} : ICellProps) {
    const constants = getConstants();

    const style = {
        '--drop-height': `${(rowIndex + 1) * -50}px`
    } as React.CSSProperties;

    switch(value) {
        case constants.PLAYER1: 
            return <div key={colIndex} className={isWin ? "game__cell_player-red game__cell-win" : "game__cell_player-red"} style={style}></div>;
        case constants.PLAYER2: 
            return <div key={colIndex} className={isWin ? "game__cell_player-blue game__cell-win" : "game__cell_player-blue"} style={style}></div>;
        default: 
            return <div key={colIndex} className="game__cell"></div>;
    }
};

export default Cell;