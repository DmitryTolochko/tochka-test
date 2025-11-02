import type { IConstants } from "../../types/types";

/**
 * Получение значения из localStorage
 * @param key - ключ обращения к localStorage
 * @param defaultValue - дефолтное значение поля
 * @returns возвращает значение из localStorage или дефолтное значение
 */
const getFromStorage = function (key: string, defaultValue: number | number[][] | IConstants | boolean | null) {
    try {
        const item = localStorage.getItem(key);
        return item !== null ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error reading ${key} from localStorage:`, error);
        return defaultValue;
    }
};

/**
 * Сохранение значения в localStorage
 * @param key - ключ обращения к localStorage
 * @param value - значение для сохранения
 */
const setToStorage = function (key: string, value: number | number[][] | IConstants | boolean | null) {
    localStorage.setItem(key, JSON.stringify(value));
};

/**
 * Получение настроек игры
 * @returns возращает настройки игры из localStorage или дефолтные настройки
 */
export const getConstants = () : IConstants => {
    const defaultConstants = {
        ROWS: 6,
        COLS: 7,
        EMPTY: 0,
        PLAYER1: 1,
        PLAYER2: 2,
        WINCELLS: 4,
        BOT: true
    };

    const storedConstants = getFromStorage('SETTINGS', defaultConstants);

    if (!getFromStorage('SETTINGS', null)) {
        setToStorage('SETTINGS', defaultConstants);
    }
    
    return storedConstants;
};

/**
 * Изменение настроек игры
 * @param newConstants - новые настройки для сохранения в localStorage
 */
export const updateConstants = (newConstants: IConstants) => {
  setToStorage('SETTINGS', newConstants);
};

/**
 * Получение поля игры в его последнем состоянии или в дефолтном состоянии
 * @param isDefault - сбрасывает состояние поля до дефолта
 * @returns возвращает поле игры
 */
export const getBoard = (isDefault: boolean = false) => {
    const constants = getConstants();
    const defaultBoard = Array.from({length: constants.ROWS}, () =>
        Array.from({length: constants.COLS}, () => 0)
    );

    if (isDefault) {
        setToStorage('BOARD', defaultBoard);
        return defaultBoard;
    }

    const storedBoard = getFromStorage('BOARD', defaultBoard);

    if (!getFromStorage('BOARD', null)) {
        setToStorage('BOARD', defaultBoard);
    }

    return storedBoard;
}

/**
 * Обновить состояние поля
 * @param newBoard - новое состояние поля
 */
export const updateBoard = (newBoard: number[][]) => {
    setToStorage('BOARD', newBoard);
}

/**
 * Получить текущего игрока или дефолтного
 * @param isDefault - сбрасывает игрока до дефолтного значения
 * @returns номер текущего игрока
 */
export const getCurrentPlayer = (isDefault: boolean = false) => {
    const constants = getConstants();
    if (isDefault) {
        setToStorage('CURRENT_PLAYER', constants.PLAYER1);
        return constants.PLAYER1;
    }

    return getFromStorage('CURRENT_PLAYER', constants.PLAYER1);
}

/**
 * Обновить текущего игрока из localStorage
 * @param value - новое состояние
 */
export const updateCurrentPlayer = (value: number) => {
    setToStorage('CURRENT_PLAYER', value);
}

/**
 * Получить ячейки выигрыша из localStorage
 * @param isDefault - сбрасывает ячейки
 * @returns ячейки выигрыша из localStorage
 */
export const getWinningCells = (isDefault: boolean = false) => {
    if (isDefault) {
        setToStorage('WIN_CELLS', []);
        return [];
    }

    return getFromStorage('WIN_CELLS', []);
}

/**
 * Обновить ячейки выигрыша из localStorage
 * @param value - новое состояние ячеек
 */
export const updateWinningCells = (value: number[][]) => {
    setToStorage('WIN_CELLS', value);
}

/**
 * Получить состояние ничьей из localStorage
 * @param isDefault - сбрасывает состояние
 * @returns состояние из localStorage
 */
export const getIsDraw = (isDefault: boolean = false) => {
    if (isDefault) {
        setToStorage('IS_DRAW', false);
        return false;
    }

    return getFromStorage('IS_DRAW', false);
}

/**
 * Обновить состояние ничьей из localStorage
 * @param value - новое состояние
 */
export const updateIsDraw = (value: boolean) => {
    setToStorage('IS_DRAW', value);
}