import Cell from '../Cell/Cell';
import './WinnerWindow.scss'

interface IWinnerWindowProps {
    resetGame: () => void;
    winner: number,
    isDraw: boolean
}

/**
 * Компонент окна с окончанием игры
 * @property {() = void} resetGame - функция для сброса игры
 * @property {number} winner - игрок-победитель
 * @property {boolean} isDraw - игра окончилась ничьей
 * @param param0 
 */
function WinnerWindow({resetGame, winner, isDraw} : IWinnerWindowProps) {
    return (
        <div className='winner-window__wrapper'>
            <div className="winner-window">
                <h1 className="winner-window__h1">Игра окончена!</h1>
                
                {winner !== 0 && !isDraw ? 
                <>
                    <p className="winner-window__p">Победил игрок</p>
                    <Cell value={winner}/>
                </> : 
                <>
                    <p className="winner-window__p">У вас ничья!</p>
                </>}
                <button className="winner-window__button" onClick={resetGame}>Начать заново</button>
            </div>
        </div>
    )
}

export default WinnerWindow;