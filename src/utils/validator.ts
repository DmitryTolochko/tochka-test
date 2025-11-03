import type { GameResult, PlayerPositions, StepResult, WinnerInfo } from "../types/types";
import { getConstants } from "./storage";
import { checkDraw, checkWinner } from "./tools";

/**
 * Аналитика хода игры
 * @param steps - массив чисел, которые показывают номера столбцов, которые были выбраны по порядку в течение игры двумя игроками
 * @returns объект с подробным описанием хода игры по шагам
 */
export function validator(steps: number[]) : GameResult {
    const constants = getConstants();
    const result: GameResult = {};
    const board: number[][] = Array.from({length: constants.ROWS}, () =>
        Array.from({length: constants.COLS}, () => 0)
    );
    const playerPositions: { player_1: PlayerPositions; player_2: PlayerPositions } = {
        player_1: [],
        player_2: []
    };

    // Step 0 - игра еще не началась
    result.step_0 = {
        player_1: [],
        player_2: [],
        board_state: 'waiting'
    };

    for (let step = 1; step <= steps.length; step++) {
        const column = steps[step - 1];
        const currentPlayer = step % 2 === constants.PLAYER1 ? constants.PLAYER1 : constants.PLAYER2;
        const playerKey = `player_${currentPlayer}` as keyof typeof playerPositions;

        // Находим свободную строку в выбранном столбце
        let row = -1;
        for (let r = constants.ROWS - 1; r >= 0; r--) {
            if (board[r][column] === 0) {
                row = r;
                break;
            }
        }

        if (row === -1) continue; // Столбец заполнен, пропускаем ход

        // Размещаем фишку
        board[row][column] = currentPlayer;
        const position = [row, column];
        playerPositions[playerKey].push(position);

        // Проверяем состояние игры
        let boardState: StepResult['board_state'] = 'pending';
        let winner: WinnerInfo | undefined = undefined;

        // Проверяем победу
        const winPositions = checkWinner(board, row, column, currentPlayer);
        if (winPositions) {
            boardState = 'win';
            winner = {
                who: playerKey as 'player_1' | 'player_2',
                positions: winPositions
        };
        } else if (checkDraw(board)) {
            boardState = 'draw';
        }

        // Создаем копии позиций игроков для текущего шага
        result[`step_${step}`] = {
            player_1: [...playerPositions.player_1],
            player_2: [...playerPositions.player_2],
            board_state: boardState,
            ...(winner && { winner })
        };

        // Если игра завершена, прекращаем обработку
        if (boardState === 'win' || boardState === 'draw') {
            break;
        }
    }

    return result;
}