import axios from "axios";

/**
 *
 * @param {string} url
 * @param {string} filterBy
 * @param {object} setHeaders
 * @returns {Promise}
 */

const corsAnywhere = "https://cors-anywhere.herokuapp.com/";
const yourUrl =
  "https://api.football-data.org/v4/competitions/2014/matches?season=2022";

export const getAll = async (
  // url = "http://localhost:3001/matches-information",
  url = "",
  filterBy = "",
  setHeaders = {}
) => {
  // const setUrl = url === "" ? `${corsAnywhere + yourUrl}` : url;
  const setUrl = url === "" ? `http://localhost:3001/matches-information` : url;

  const setFilter =
    filterBy !== null || filterBy !== undefined || filterBy !== ""
      ? filterBy
      : "";

  const resp = await axios.get(`${setUrl}${setFilter}`, {
    headers: {
      ...setHeaders,
      "Content-Type": "application/json",
      "X-Auth-Token": "fbc6d6b29640435e8eebd4518bd43d60",
      "Access-Control-Allow-Origin": "*",
    },
  });

  return resp.data || {};
};

// console.log(corsAnywhere + yourUrl);

// fetch(corsAnywhere + yourUrl, {
//   method: "GET",
//   headers: new Headers({
//     "Content-Type": "application/json",
//     "X-Auth-Token": "fbc6d6b29640435e8eebd4518bd43d60",
//     "Access-Control-Allow-Origin": "*",
//   }),
// })
//   .then((response) => response.json())
//   .then((data) => console.log(data))
//   .catch((err) => console.log(err));
