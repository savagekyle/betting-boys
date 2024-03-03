import React from 'react';
import "../css/GameCard.css";

// change date into a more readable format
function formatDate(dateTimeString) {
  const dateTime = new Date(dateTimeString);
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZoneName: 'short'
  };
  return dateTime.toLocaleString('en-US', options);
}

function GameCard(props) {
  const formattedTime = formatDate(props.time);

  let awaySpread;
  let homeSpread;
  let overUnder;

props.outcomes.map(outcome => {
    if(outcome.name === props.awayTeam) {
        awaySpread = outcome.point;
    } else if (outcome.name === props.homeTeam) {
        homeSpread = outcome.point;
    } else if (outcome.name === "Over" || outcome.name === "Under") {
        overUnder = outcome.point;
    }
  })

  return (
    <div className='gameCard' key={props.id}>
      <h2>{props.awayTeam + " (" + awaySpread +")"} @ {props.homeTeam + " (" + homeSpread +")"}</h2>
      <p>{formattedTime}</p>
      <p>O/U: {overUnder}</p>
    </div>
  );
}

export default GameCard;