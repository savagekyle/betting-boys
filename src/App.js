import './App.css';
import nhlData from './Bets/NHL/3-3-2024.json'
import GameCard from './components/GameCard';

{console.log(nhlData)}

function App() {
  return (
    <div className="app container">
      <div className='gameCardWrapper'>
      {nhlData.map((data) => (
        <GameCard id={data.id} homeTeam={data.homeTeam} awayTeam={data.awayTeam} time={data.commence_time} />
      ))}
      </div>
    </div>
  );
}

export default App;
