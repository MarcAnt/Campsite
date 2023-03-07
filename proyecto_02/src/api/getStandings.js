import axios from "axios";
import { getLocalStorage } from "../Utils";

/**
 *
 * @param {string} url
 * @param {string} filterBy
 * @param {object} setHeaders
 * @returns {Promise}
 */

const corsAnywhere = "https://cors-anywhere.herokuapp.com/";
const yourUrl =
  "https://api.football-data.org/v4/competitions/2014/standings?season=2022";

export const getStandings = async (
  url = "",
  filterBy = "",
  setHeaders = {}
) => {
  const setUrl = url === "" ? `${corsAnywhere + yourUrl}` : url;
  // const setUrl =
  //   url === ""
  //     ? `http://localhost:3001/standings-information/?_delay=2000`
  //     : url;

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

  if (!getLocalStorage("standings")) {
    localStorage.setItem("standings", JSON.stringify(resp.data));
  }

  return resp.data;
};
