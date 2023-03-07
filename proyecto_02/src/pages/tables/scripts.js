import { getLocalStorage, parseLocalStorage, setIcon } from "../../Utils";
import { displayMatches } from "../../tables/tableMatches";
import { displayStandings } from "../../tables/tableStandings";

import icons from "../../icons";
import { getMatches } from "../../api/getMatches";

const main = () => {
  const $searchForm = document.querySelector("#search-form");

  const $titleCompetitions = document.querySelector("#title-competitions");
  const $titleStandings = document.querySelector("#title-standings");

  const $checkboxFilter = document.querySelectorAll(
    "input[name='filter-matches']"
  );

  const $checkboxsFilters = document.querySelector("#checkbox-filters");
  const $tableMatches = document.querySelector("#table-matches");
  const $logoLaLiga = document.querySelector("#logoLaLiga");

  const { hash, href } = window.location;

  const transformedHash = hash.replace("#", " ");

  const decoded = decodeURIComponent(href.toString());
  const teamN = decoded.split("#")[1].replace(/\-+/gm, " ").trim();

  const isTeamName =
    transformedHash.includes("table-matches") ||
    transformedHash.includes("table-standings")
      ? true
      : false;

  const teamName = !isTeamName ? teamN : "";

  setIcon(
    [
      {
        icon: icons.footballIcon,
        element: $titleCompetitions,
        position: "right",
        styles: {
          "margin-top": "0.6rem",
        },
      },
      {
        icon: icons.footballIcon,
        element: $titleStandings,
        position: "right",
        styles: {
          "margin-top": "0.6rem",
        },
      },
    ],
    {
      padding: "0 0.5rem",
      fill: "orange",
    }
  );

  const setLogoLaLiga = async () => {
    const getMatchesData = getLocalStorage("matches");
    let dataMatches = {};
    let data = {};

    if (getMatchesData) {
      dataMatches = parseLocalStorage("matches");
      data = { ...dataMatches };
    } else {
      data = await getMatches();
    }

    const { competition } = data;
    const emblem = competition?.emblem;

    $logoLaLiga.innerHTML = `<a href="../../../index.html"><img class="object-cover w-1/2" src="${emblem}" alt="Logo LaLiga"></a>`;
  };

  setLogoLaLiga();

  //ALL
  $checkboxFilter[0].addEventListener("change", (e) => {
    const { value } = e.target;

    displayMatches($tableMatches, 10, "", value);
  });

  //WINNER
  $checkboxFilter[1].addEventListener("change", (e) => {
    const { value } = e.target;

    displayMatches($tableMatches, 10, "", value);
  });

  //LOSER
  $checkboxFilter[2].addEventListener("change", (e) => {
    const { value } = e.target;

    displayMatches($tableMatches, 10, "", value);
  });

  //DRAW
  $checkboxFilter[3].addEventListener("change", (e) => {
    const { value } = e.target;

    displayMatches($tableMatches, 10, "", value);
  });

  $searchForm.addEventListener("input", handleSearch);

  function handleSearch(e) {
    const { value } = e.target;

    if (value !== "") $checkboxsFilters.classList.remove("hidden");
    else $checkboxsFilters.classList.add("hidden");

    displayMatches($tableMatches, 10, value);
  }

  if (teamName === "") {
    $checkboxsFilters.classList.add("hidden");
    displayMatches($tableMatches);
  } else {
    $checkboxsFilters.classList.remove("hidden");
    const $search = document.querySelector("#search");
    $search.value = teamName;

    displayMatches($tableMatches, 10, teamName);
  }

  displayStandings(teamName);
};

document.addEventListener("DOMContentLoaded", main);
