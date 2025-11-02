import { useState } from 'react';
import './Settings.scss';
import { useNavigate } from 'react-router-dom';
import { getBoard, getConstants, getCurrentPlayer, updateBoard, updateConstants, updateCurrentPlayer} from '../Storage/Storage';
import type { IConstants } from '../../types/types';

/**
 * Компонент страницы с настройками игры
 */
function Settings() {
    const [constants, setConstants] = useState<IConstants>(getConstants());
    const [rows, setRows] = useState<number>(constants.ROWS);
    const [cols, setCols] = useState<number>(constants.COLS);
    const [winCells, setWinCells] = useState<number>(constants.WINCELLS);
    const [bot, setBot] = useState<boolean>(constants.BOT);

    const navigate = useNavigate();

    // Максимально допустимое значение для winCells
    const maxWinCells = Math.max(rows, cols);
    const minWinCells = 3;

    // Обновление rows с валидацией winCells
    const handleRowsChange = (delta: number) => {
        setRows(prev => {
            const newValue = Math.min(Math.max(prev + delta, 3), 10);
            // Автоматически корректируем winCells, если нужно
            setWinCells(prevWin => Math.min(prevWin, Math.max(newValue, cols)));
            return newValue;
        });
    };

    // Обновление cols с валидацией winCells
    const handleColsChange = (delta: number) => {
        setCols(prev => {
            const newValue = Math.min(Math.max(prev + delta, 3), 13);
            setWinCells(prevWin => Math.min(prevWin, Math.max(rows, newValue)));
            return newValue;
        });
    };

    // Обновление winCells с учётом границ
    const handleWinCellsChange = (delta: number) => {
        setWinCells(prev => {
            const newValue = prev + delta;
            const clamped = Math.min(Math.max(newValue, minWinCells), maxWinCells);
            return clamped;
        });
    };

    // сброс игры и обновление настроек
    function updateAndStart() {
        const newConstants: IConstants = {
            ...constants,
            BOT: bot,
            COLS: cols,
            ROWS: rows,
            WINCELLS: winCells
        };

        updateConstants(newConstants);
        updateBoard(getBoard(true));
        updateCurrentPlayer(getCurrentPlayer(true));
        setConstants(newConstants);

        navigate('/');
    }

    return (
        <div className='settings'>
            <div className='settings__buttons'>
                <button className='settings__button' onClick={() => navigate('/')}>Назад</button>
                <button className='settings__button green' onClick={updateAndStart}>Сохранить и начать игру</button>
            </div>

            <div className='settings__options'>
                <div className='settings__option'>
                    <p>Количество колонок: {cols}</p>
                    <div className='settings__buttons-container'>
                        <button className='settings__button' onClick={() => handleColsChange(-1)}>-</button>
                        <button className='settings__button' onClick={() => handleColsChange(1)}>+</button>
                    </div>
                </div>

                <div className='settings__option'>
                    <p>Количество строк: {rows}</p>
                    <div className='settings__buttons-container'>
                        <button className='settings__button' onClick={() => handleRowsChange(-1)}>-</button>
                        <button className='settings__button' onClick={() => handleRowsChange(1)}>+</button>
                    </div>
                </div>

                <div className='settings__option'>
                    <p>Количество фишек для победы: {winCells}</p>
                    <div className='settings__buttons-container'>
                        <button 
                            className='settings__button' 
                            onClick={() => handleWinCellsChange(-1)}
                            disabled={winCells <= minWinCells}
                        >
                            -
                        </button>
                        <button 
                            className='settings__button' 
                            onClick={() => handleWinCellsChange(1)}
                            disabled={winCells >= maxWinCells}
                        >
                            +
                        </button>
                    </div>
                </div>

                <div className='settings__option'>
                    <p>Игра с ботом</p>
                    <button className='settings__button green' onClick={() => setBot(!bot)}>
                        {bot ? 'Да' : 'Нет'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Settings;