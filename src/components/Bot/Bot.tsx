import { getConstants } from "../Storage/Storage";
import { checkWinner } from "../Tools/Tools";

/**
 * Функция-бот для игры в 4 в ряд, использующая алгоритм Minimax
 * @param board - текущее состояние игрового поля (матрица)
 * @returns номер столбца, в который бот делает ход
 */
export function getBotMove(board: number[][]): number {
  const constants = getConstants();

  const PLAYER1 = constants.PLAYER1;
  const PLAYER2 = constants.PLAYER2;
  const EMPTY = constants.EMPTY;
  const COLS = constants.COLS;
  const ROWS = constants.ROWS;
  const WINCELLS = constants.WINCELLS;

  // Глубина поиска для Minimax (можно настроить в зависимости от сложности)
  const MAX_DEPTH = 5;

  // Получение следующей доступной ячейки в столбце
  function getNextOpenCell(board: number[][], col: number): number | null {
    for (let r = ROWS - 1; r >= 0; r--) {
      if (board[r][col] === EMPTY) {
        return r;
      }
    }
    return null;
  }

  // Создание копии поля
  function copyBoard(board: number[][]): number[][] {
    return board.map(row => [...row]);
  }

  // Проверка победы на поле
  function checkAllBoardForWinner(board: number[][], player: number): boolean {
    // Проверка горизонталей
    for (let r = 0; r < ROWS; r++) {
       for (let c = 0; c < COLS; c++) {
          if (checkWinner(board, r, c, player, true)) {
            return true;
          }
       }
    }
    return false;
  }

  /**
 * Генерирует все возможные окна длины WINCELLS из поля
 */
  function getAllWindows(board: number[][]): number[][] {
    const windows: number[][] = [];

    // Горизонтали
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c <= COLS - WINCELLS; c++) {
        const window = [];
        for (let i = 0; i < WINCELLS; i++) {
          window.push(board[r][c + i]);
        }
        windows.push(window);
      }
    }

    // Вертикали
    for (let c = 0; c < COLS; c++) {
      for (let r = 0; r <= ROWS - WINCELLS; r++) {
        const window = [];
        for (let i = 0; i < WINCELLS; i++) {
          window.push(board[r + i][c]);
        }
        windows.push(window);
      }
    }

    // Диагонали 1
    for (let r = 0; r <= ROWS - WINCELLS; r++) {
      for (let c = 0; c <= COLS - WINCELLS; c++) {
        const window = [];
        for (let i = 0; i < WINCELLS; i++) {
          window.push(board[r + i][c + i]);
        }
        windows.push(window);
      }
    }

    // Диагонали 2
    for (let r = WINCELLS - 1; r < ROWS; r++) {
      for (let c = 0; c <= COLS - WINCELLS; c++) {
        const window = [];
        for (let i = 0; i < WINCELLS; i++) {
          window.push(board[r - i][c + i]);
        }
        windows.push(window);
      }
    }

    return windows;
  }

  // Оценка позиции на поле
  function evaluateWindow(window: number[], player: number): number {
    let score = 0;

    const opponent = player === PLAYER2 ? PLAYER1 : PLAYER2;
    const playerCount = window.filter(cell => cell === player).length;
    const opponentCount = window.filter(cell => cell === opponent).length;
    const emptyCount = window.filter(cell => cell === EMPTY).length;

    // Победа
    if (playerCount === WINCELLS) {
      score += 100000;
    } else if (playerCount === WINCELLS - 1 && emptyCount === 1) {
      score += 100;
    } else if (playerCount === WINCELLS - 2 && emptyCount === 2) {
      score += 10;
    }

    // Угроза проигрыша
    if (opponentCount === WINCELLS - 1 && emptyCount === 1) {
      score -= 1000;
    } else if (opponentCount === WINCELLS - 2 && emptyCount === 2) {
      score -= 20;
    }

    return score;
  }

  // Оценка всего поля
  function scorePosition(board: number[][], player: number): number {
    let score = 0;

    // Центральная колонка: более ценные ходы
    const centerCol = Math.floor(COLS / 2);
    const centerArray = board.map(row => row[centerCol]);
    const centerCount = centerArray.filter(cell => cell === player).length;
    score += centerCount * 3;

    // Все окна
    const windows = getAllWindows(board);
    for (const window of windows) {
      score += evaluateWindow(window, player);
    }

    return score;
  }

  // Получение всех допустимых ходов (где есть свободные колонки)
  function getValidColumns(board: number[][]): number[] {
    const validMoves: number[] = [];
    for (let c = 0; c < COLS; c++) {
      if (board[0][c] === EMPTY) {
        validMoves.push(c);
      }
    }
    return validMoves;
  }

  /**
   * Реализация алгоритма Minimax с альфа-бета отсечением для поиска оптимального хода
   * 
   * @param {number[][]} board - текущее состояние игрового поля
   * @param {number} depth - текущая глубина поиска в игровом дереве
   * @param {number} alpha - значение альфа для альфа-бета отсечения (начальное значение -Infinity)
   * @param {number} beta - значение бета для альфа-бета отсечения (начальное значение Infinity)
   * @param {boolean} maximizingPlayer - флаг, указывающий, является ли текущий игрок максимизирующим (true для бота, false для противника). По умолчанию true.
   * 
   * @returns {number} column - номер столбца для лучшего хода (-1 если ход не определен)
   * @returns {number} score - оценка позиции (чем выше, тем лучше для максимизирующего игрока)
   * 
   * @description
   * Алгоритм рекурсивно оценивает все возможные ходы на заданную глубину:
   * - Для максимизирующего игрока (бот) выбирает ход с максимальной оценкой
   * - Для минимизирующего игрока (противник) выбирает ход с минимальной оценкой
   * - Использует альфа-бета отсечение для оптимизации поиска
   */
  function minimax(
    board: number[][],
    depth: number,
    alpha: number = -Infinity,
    beta: number = Infinity,
    maximizingPlayer: boolean = true
  ): { column: number; score: number } {
    const validMoves = getValidColumns(board);

    // терминальные позиции
    if (checkAllBoardForWinner(board, PLAYER2)) {
      return { column: -1, score: 1000000 };
    } else if (checkAllBoardForWinner(board, PLAYER1)) {
      return { column: -1, score: -1000000 };
    } else if (validMoves.length === 0) {
      return { column: -1, score: 0 };
    } else if (depth === 0) {
      return { column: -1, score: scorePosition(board, PLAYER2) };
    }

    let value = maximizingPlayer ? -Infinity : Infinity;
    let column = validMoves[0];

    for (const col of validMoves) {
      const cell = getNextOpenCell(board, col);
      if (cell) {
        const newBoard = copyBoard(board);
        newBoard[cell][col] = maximizingPlayer ? PLAYER2 : PLAYER1;
        const newScore = minimax(newBoard, depth - 1, alpha, beta, !maximizingPlayer).score;

        if (maximizingPlayer) {
          if (newScore > value) {
            value = newScore;
            column = col;
          }
          alpha = Math.max(alpha, value);
        } else {
          if (newScore < value) {
            value = newScore;
            column = col;
          }
          beta = Math.min(beta, value);
        }
        
        if (alpha >= beta) {
          break;
        }
      }
    }

    return { column, score: value };
  }

  const validColumns = getValidColumns(board);
  
  // Сделать последний выигрышный ход или заблокировать противника
  for (const column of validColumns) {
    const cell = getNextOpenCell(board, column);
    if (cell) {
      const newBoard = copyBoard(board);
      newBoard[cell][column] = PLAYER2;
      if (checkAllBoardForWinner(newBoard, PLAYER2)) {
        return column;
      }
      newBoard[cell][column] = PLAYER1;
      if (checkAllBoardForWinner(newBoard, PLAYER1)) {
        return column;
      }
    }
  }

  // Используем Minimax для определения лучшего хода
  const { column } = minimax(board, MAX_DEPTH);
  
  // Если Minimax не дал результата, выбираем случайный допустимый ход
  if (column === -1) {
    return validColumns[Math.floor(Math.random() * validColumns.length)];
  }

  return column;
}
