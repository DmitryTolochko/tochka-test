import { getConstants } from "./storage";

/**
 * Проверка поля на наличие победы и вывод ячеек, являющих победную комбинацию
 * @param board - матрица-поле
 * @param row - текущий номер строки
 * @param column - текущий номер столбца
 * @param player - текущий игрок
 * @param isCellFilled - заполнена ли текущая ячейка (false по умолчанию)
 * @returns возвращает массив координат победных ячеек или null, если победы еще нет
 */
export function checkWinner(board: number[][], row: number, column: number, player: number, isCellFilled: boolean = false): number[][] | null {
    const constants = getConstants();

    const directions = [
        [0, 1],   // горизонталь
        [1, 0],   // вертикаль
        [1, 1],   // диагональ 1
        [1, -1]   // диагональ 2
    ];

    for (const [dx, dy] of directions) {
        let count = 1;

        if (board[row][column] !== player && isCellFilled) {
            return null;
        }

        const cells = [[row, column]];
        
        for (let i = 1; i < constants.WINCELLS; i++) {
            const newRow = row + dx * i;
            const newCol = column + dy * i;
            if (newRow >= 0 && newRow < constants.ROWS && newCol >= 0 && newCol < constants.COLS && board[newRow][newCol] === player) {
                count++;
                cells.push([newRow, newCol]);
            } else {
                break;
            }
        }

        for (let i = 1; i < constants.WINCELLS; i++) {
            const newRow = row - dx * i;
            const newCol = column - dy * i;
            if (newRow >= 0 && newRow < constants.ROWS && newCol >= 0 && newCol < constants.COLS && board[newRow][newCol] === player) {
                count++;
                cells.push([newRow, newCol]);
            } else {
                break;
            }
        }
        
        if (count >= constants.WINCELLS) {
            return cells;
        }
    }
    return null;
}

/**
 * Проверка поля на наличие ничьей (когда поле полностью заполнено)
 * @param board - матрица-поле
 * @param constants - настройки игры
 * @returns правда или ложь
 */
export const checkDraw = (board: number[][]) : boolean => {
    // Проверка на ничью
    const constants = getConstants();
    return board[0].every(cell => cell !== constants.EMPTY);
};