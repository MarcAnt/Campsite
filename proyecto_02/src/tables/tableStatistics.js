import { getAccumulated } from "../Utils";

// 0. Crear función que va calcular las estadísticas, recibiendo como param el array de partidos:

// 1. Crear array vacía (será array de objetos)

// 2. Iterar por todos los partidos

// 3. Condición: si el partido no está acabado, no seguir y mirar siguiente partido, si no el null
// de los goles lo romperá todo.

// 4. Buscar en la array estadísticas el objeto con el mismo id que el homeTeam del partido y guardarlo en una variable

// 5. Si el objeto buscado no existe, crearlo con estos keys: id, name, goals, matches.
// Rellenar cada key con el valor correspondiente

// 6. Si existe, actualizar los goles y los partidos

// 7. Hacer exactamente lo mismo a partir del punto 4, pero con awayTeam

// 8. Una vez fuera del loop de partidos, iterar por el array estadisticas

// 9. Añadir la key avg a cada objeto, con el valor goals/matches

// 10. Hacer console.log() para ver que todo está correcto.
export const generateStats = async (matches = []) => {
  let results = [];

  if (Array.isArray(matches) && matches.length) {
    const filtered = matches
      .filter((el) => el.status === "FINISHED")
      .map((el) => {
        const score = el?.score;

        let findIdxHome = results.findIndex(
          (match) => match.id === el.homeTeam.id
        );

        if (findIdxHome === -1) {
          results = [
            ...results,
            {
              id: el.homeTeam.id,
              name: el.homeTeam.name,
              matches: el.season.currentMatchday,
              crest: el.homeTeam.crest,
            },
          ];
        }

        el.score.results = {
          ...el.score.results,
          [el.homeTeam.name]: score.fullTime.home + score.halfTime.home,
          [el.awayTeam.name]: score.fullTime.away + score.halfTime.away,
        };

        return el.score.results;
      });

    let acc = [];

    results.forEach((el) => {
      let obj = getAccumulated(filtered, el.name, "goals", {
        id: el.id,
        name: el.name,
        matches: el.matches,
        crest: el.crest,
      });
      acc = [...acc, obj];
    });

    const stats = acc.map((el) => {
      const avg = el.goals / el.matches;
      return { ...el, avg };
    });

    return stats;
  }
};
