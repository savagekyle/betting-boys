import './App.css';
import nhlData from './Bets/NHL/2-25-2024.json'

{console.log(nhlData)}

function App() {
  return (
    <div className="app">
      <h1>Today's Games: </h1>
      {nhlData.map((data) => (
        <div key={data.id}>
            <p>Home team: <b>{data.homeTeam}</b></p>
            <p>Away Team: <b>{data.awayTeam}</b></p>
            <p>Commence time: {data.commence_time}</p>
            <p>----------------</p>
        </div>
      ))}
    </div>
  );
}

export default App;
