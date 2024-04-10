import React from 'react';
import PropTypes from 'prop-types';
//import * as NHL_Logos from '../App';
import * as NHL_Logos from '../logos/AllLogos';


// Define a mapping object for team names to logo components
const teamLogos = {
    "Anaheim Ducks": NHL_Logos.ANA,
    "Arizona Coyotes": NHL_Logos.ARI,
    "Boston Bruins": NHL_Logos.BOS,
    "Buffalo Sabres": NHL_Logos.BUF,
    "Carolina Hurricanes": NHL_Logos.CAR,
    "Columbus Blue Jackets": NHL_Logos.CBJ,
    "Calgary Flames": NHL_Logos.CGY,
    "Chicago Blackhawks": NHL_Logos.CHI,
    "Colorado Avalanche": NHL_Logos.COL,
    "Dallas Stars": NHL_Logos.DAL,
    "Detroit Red Wings": NHL_Logos.DET,
    "Edmonton Oilers": NHL_Logos.EDM,
    "Florida Panthers": NHL_Logos.FLA,
    "Los Angeles Kings": NHL_Logos.LAK,
    "Minnesota Wild": NHL_Logos.MIN,
    "Montreal Canadiens": NHL_Logos.MTL,
    "New Jersey Devils": NHL_Logos.NJD,
    "Nashville Predators": NHL_Logos.NSH,
    "New York Islanders": NHL_Logos.NYI,
    "New York Rangers": NHL_Logos.NYR,
    "Ottawa Senators": NHL_Logos.OTT,
    "Philadelphia Flyers": NHL_Logos.PHI,
    "Pittsburgh Penguins": NHL_Logos.PIT,
    "Seattle Kraken": NHL_Logos.SEA,
    "San Jose Sharks": NHL_Logos.SJS,
    "St. Louis Blues": NHL_Logos.STL,
    "Tampa Bay Lightning": NHL_Logos.TBL,
    "Toronto Maple Leafs": NHL_Logos.TOR,
    "Vancouver Canucks": NHL_Logos.VAN,
    "Vegas Golden Knights": NHL_Logos.VGK,
    "Winnipeg Jets": NHL_Logos.WPG,
    "Washington Capitals": NHL_Logos.WSH
};

// Function to render the appropriate team logo component based on team name
const TeamLogo = ({ team }) => {
    // Check if the team name exists in the mapping object
    if (teamLogos.hasOwnProperty(team)) {
        // If yes, render the corresponding team logo component with the specified size
        const TeamLogoComponent = teamLogos[team];
        return <TeamLogoComponent />;
    } else {
        // If the team name is not found, render a default placeholder or handle the case accordingly
        return <div>No logo available for this team</div>;
    }
};

TeamLogo.propTypes = {
    team: PropTypes.string.isRequired
};

export default TeamLogo;
