import './App.css';
import nhlData from './Bets/NHL/3-3-2024.json'
import GameCard from './components/GameCard';
import Home from "./components/Home"

//{ console.log(nhlData) }

function App() {
  return (
    <div className="app container">
      <div className='gameCardWrapper'>
        <Home />
      </div>
    </div>
  );
}

export default App;