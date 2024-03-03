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

  return (
    <div className='gameCard' key={props.id}>
      <h2>{props.awayTeam} @ {props.homeTeam}</h2>
      <p>{formattedTime}</p>
    </div>
  );
}

export default GameCard;