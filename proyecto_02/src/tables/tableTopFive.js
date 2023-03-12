// Top 5 equipos con mayor media de
// goles a favor por partido.
// Top 5 equipos con menos goles en
// contra como visitante.

import { getAccumulated } from "../Utils";
import { generateStats } from "./tableStatistics";

export const generateTopFive = async (matches = []) => {
  let results = [];

  if (Array.isArray(matches) && matches.length) {
    const filtered = matches
      .filter((el) => el.status === "FINISHED")
      .map((match) => {
        let score = match.score;

        let findIdxAway = results.findIndex(
          (el) => el.id === match.awayTeam.id
        );

        if (findIdxAway === -1) {
          results = [
            ...results,
            {
              id: match.awayTeam.id,
              name: match.awayTeam.name,
              matches: match.season.currentMatchday,
              crest: match.awayTeam.crest,
            },
          ];
        }

        if (score.winner === "HOME_TEAM") {
          match.homeTeam = {
            ...match.homeTeam,
            goals_home: score.fullTime.home + score.halfTime.home,
            goals_away: score.fullTime.away + score.halfTime.away,
            winner: true,
          };

          match.score = {
            ...match.score,
            winnerName: match.homeTeam.name,
            loserName: match.awayTeam.name,
          };

          match.awayTeam = {
            ...match.awayTeam,
            goals_home: score.fullTime.home + score.halfTime.home,
            goals_away: score.fullTime.away + score.halfTime.away,
            winner: false,
          };
        }

        if (score.winner === "AWAY_TEAM") {
          match.awayTeam = {
            ...match.awayTeam,
            goals_home: score.fullTime.home + score.halfTime.home,
            goals_away: score.fullTime.away + score.halfTime.away,

            winner: true,
          };

          match.score = {
            ...match.score,
            winnerName: match.awayTeam.name,
            loserName: match.homeTeam.name,
          };

          match.homeTeam = {
            ...match.homeTeam,
            goals_home: score.fullTime.home + score.halfTime.home,
            goals_away: score.fullTime.away + score.halfTime.away,
            winner: false,
          };
        }

        if (score.winner === "DRAW") {
          match.awayTeam = {
            ...match.awayTeam,
            goals_home: score.fullTime.home + score.halfTime.home,
            goals_away: score.fullTime.away + score.halfTime.away,
            winner: "DRAW",
          };

          match.score = {
            ...match.score,
            winnerName: match.awayTeam.name,
            loserName: match.homeTeam.name,
          };

          match.homeTeam = {
            ...match.homeTeam,
            goals_home: score.fullTime.home + score.halfTime.home,
            goals_away: score.fullTime.away + score.halfTime.away,
            winner: "DRAW",
          };
        }

        match.score.resultsAway = {
          ...match.score.resultsAway,

          [match.homeTeam.name]: match.homeTeam.goals_home,
        };
        match.score.resultsHome = {
          ...match.score.resultsHome,

          [match.awayTeam.name]: match.awayTeam.goals_away,
        };

        return match.score;
      });

    const awayTeamList = filtered.map((match) => match.resultsAway);

    let accGoalsAway = [];

    results.forEach((el) => {
      let objTotalAway = getAccumulated(awayTeamList, el.name, "goals_away", {
        id: el.id,
        name: el.name,
        crest: el.crest,
      });
      accGoalsAway = [...accGoalsAway, objTotalAway];
    });

    const totalLessTopFive = accGoalsAway
      .sort((a, b) => a.goals_away - b.goals_away)
      .slice(0, 5);

    const totalStats = await generateStats(matches);

    const totalAvgTopfive = totalStats
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 5);

    return { totalLessTopFive, totalAvgTopfive };
  }
};
