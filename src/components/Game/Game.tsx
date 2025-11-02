import { useEffect, useRef, useState } from 'react'
import './Game.scss'
import WinnerWindow from '../WinnerWindow/WinnerWindow';
import Cell from '../Cell/Cell';
import { useNavigate } from 'react-router-dom';
import { getBoard, getConstants, getCurrentPlayer, getIsDraw, getWinningCells, updateBoard, updateCurrentPlayer, updateIsDraw, updateWinningCells } from '../Storage/Storage';
import { checkDraw, checkWinner } from '../Tools/Tools';
import { validator } from '../Validator/Validator';
import { getBotMove } from '../Bot/Bot';

/**
 * Компонент игры
 */
function Game() {
    const constants = getConstants();

    const [board, setBoard] = useState<number[][]>(getBoard());
    const [currentPlayer, setCurrentPlayer] = useState<number>(getCurrentPlayer());
    const [winner, setWinner] = useState<number>(constants.EMPTY);
    const [isDraw, setIsDraw] = useState<boolean>(getIsDraw());
    const [isBotThinking, setIsBotThinking] = useState<boolean>(false);
    const [steps, setSteps] = useState<number[]>([]);
    const [winningCells, setWinningCells] = useState<number[][]>(getWinningCells());
    const [showWinnerWindow, setShowWinnerWindow] = useState<boolean>(false);

    const [mousePosition, setMousePosition] = useState<number>(Math.round(window.innerWidth / 180) * 90);

    const containerRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const [cellSize, setCellSize] = useState(0);

    // сделать ход
    function makeMove(column: number) {
        if (winner !== constants.EMPTY || isDraw || winningCells.length > 0) return;

        for (let row = constants.ROWS - 1; row >= 0; row--) {
            // поставить фишку в ячейку, если она пустая
            if (board[row][column] === constants.EMPTY) {
                const updatedBoard = board.map((r, i) =>
                    i === row ? [...r.slice(0, column), currentPlayer, ...r.slice(column + 1)] : r
                );
                updatedBoard[row][column] = currentPlayer;
                setBoard(updatedBoard);

                // записать ход в историю
                const newSteps = [...steps];
                newSteps.push(column);
                setSteps(newSteps);

                // запуск validator
                console.log(validator(newSteps));

                // проверить победу
                const winningCells = checkWinner(updatedBoard, row, column, currentPlayer);

                if (winningCells) {
                    // зафиксировать позиции победителя
                    setWinningCells(winningCells);
                } else if (checkDraw(updatedBoard)) {
                    // зафиксировать ничью
                    setIsDraw(true);
                } else {
                    // поменять текущего игрока
                    setCurrentPlayer(currentPlayer === constants.PLAYER1 ? constants.PLAYER2 : constants.PLAYER1);
                }
                break
            }
        }
    }

    // Перезапустить игру
    const resetGame = () => {
        setBoard(getBoard(true));
        setCurrentPlayer(getCurrentPlayer(true));
        setWinner(constants.EMPTY);
        setIsDraw(false);
        setSteps([]);
        setWinningCells([]);
        setShowWinnerWindow(false);
    };

    // Условный рендеринг точки текущего игрока
    function renderDot(value: number) {
        switch(value) {
            case constants.PLAYER1: return <div className="game__dot_red"></div>;
            case constants.PLAYER2: return <div className="game__dot_blue"></div>;
        }
    }

    // Назначение координаты курсора над полем
    const handleMouseMove = (event: MouseEvent) => {
        const result = Math.round(event.clientX);

        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            if (result > rect.left && result < rect.right) {
                setMousePosition(result);
            }
        }
    };

    // Привязка движения мышки к курсору над полем
    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    // Ход бота
    useEffect(() => {
        if (currentPlayer === constants.PLAYER2 && constants.BOT) {
            setIsBotThinking(true);
            const timer = setTimeout(() => {
                const botColumn = getBotMove(board);
                if (botColumn !== -1) {
                    makeMove(botColumn);
                }
                setIsBotThinking(false);
            }, 200);

            return () => clearTimeout(timer);
        }
    }, [currentPlayer]);

    useEffect(() => {
        updateCurrentPlayer(currentPlayer);
    }, [currentPlayer]);

    useEffect(() => {
        updateBoard(board);
    }, [board]);

    useEffect(() => {
        updateIsDraw(isDraw);
    }, [isDraw]);

    useEffect(() => {
        updateWinningCells(winningCells);
    }, [winningCells]);

    // зафиксировать победителя и показать окно окончания игры
    useEffect(() => {
        if (winningCells.length > 0 || isDraw) {
            setWinner(currentPlayer);
            const timer = setTimeout(() => {
                setShowWinnerWindow(true);
            }, 2000);

            return () => clearTimeout(timer);      
        }  
    }, [winningCells, isDraw]);

    // Рассчитываем размер ячейки на основе количества колонок и строк
    useEffect(() => {
        const calculateCellSize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            const size = constants.COLS >= constants.ROWS || constants.COLS > 6
            ? Math.floor(width / constants.COLS) * 0.5
            : Math.floor(height / constants.ROWS) * 0.5;

            if (size >= 70) {
                setCellSize(70);
            } else {
                setCellSize(size);
            }
        };

        // Вычисляем при монтировании
        calculateCellSize();

        // Слушаем изменение размера окна
        window.addEventListener('resize', calculateCellSize);

        return () => {
            window.removeEventListener('resize', calculateCellSize);
        };
    }, [constants.COLS, constants.ROWS]);

    return (
    <div className='game'>
        {showWinnerWindow ? <WinnerWindow resetGame={resetGame} isDraw={isDraw} winner={winner}/> : <></>}
        <p className='game__rules'>Для победы нужно набрать первым {constants.WINCELLS} фишек</p>
        <div className='game__buttons game__container'>
            <div className='game__current-player'>
                <p className='game__current-player-p'>Сейчас ходит</p>
                {renderDot(currentPlayer)}
            </div>

            <div className='game__buttons'>
                <button className='game__button' onClick={() => navigate('/settings')}>Настройки</button>
                <button className='game__button' onClick={resetGame}>Сбросить</button>
            </div>
        </div>
 
        <div className='game__window' style={{ 
            '--cell-size': `${cellSize}px`,
            '--game-window-size': `${cellSize * constants.ROWS * 3}px`} as React.CSSProperties}>
            {isBotThinking ? 
                <p className='game__bot-thinking'>Бот думает...</p> : 
                <div className='game__pointer' style={{left: `${mousePosition}px`}}></div>
            }
            
            <div className='game__cells' ref={containerRef}>
                {board.map((row, rowIndex) => (
                <div key={rowIndex} className="game__row" >
                {row.map((cell, colIndex) => (
                    <Cell value={cell} colIndex={colIndex} rowIndex={rowIndex} 
                        isWin={winningCells.find(e => e[0] === rowIndex && e[1] === colIndex) ? true : false}/>
                ))}
                </div>
            ))}
            </div>

            <div className='game__board'>
                {board.map((row, rowIndex) => (
                <div key={rowIndex} className="game__row">
                {row.map((_, colIndex) => (
                    <div key={colIndex} className="game__cell" onClick={() => makeMove(colIndex)}></div>
                ))}
                </div>
            ))}
            </div>
        </div>
    </div>
    )
}

export default Game
