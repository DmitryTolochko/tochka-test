import './App.scss'
import Game from './components/Game/Game';
import Settings from './components/Settings/Settings';
import { Route, Routes} from "react-router-dom";

/**
 * Основной компонент приложения "The Best Game In The World"
 * 
 * @description
 * Этот компонент является корневым компонентом приложения, который
 * предоставляет маршрутизацию между игрой и настройками
 */
function App() {
  return (
    <div>
      <header className='header'>The Best Game In The World</header>
      <Routes>
        <Route element={<Game/>} path='/'/>
        <Route element={<Settings/>} path='/settings'/>
      </Routes>
    </div>
  )
}

export default App
