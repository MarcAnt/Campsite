import {
  creaTableHeader,
  getLocalStorage,
  parseLocalStorage,
  setIcon,
} from "../../Utils";
import icons from "../../icons";
import { getMatches } from "../../api/getMatches";
import { generateStats } from "../../tables/tableStatistics";
import { generateTopFive } from "../../tables/tableTopFive";
import { displayMatches } from "../../tables/tableMatches";
import { displayStandings } from "../../tables/tableStandings";

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

    $logoLaLiga.innerHTML = `<a href="../../../index.html" class="flex justify-center items-center" ><img class="object-cover w-1/2" src="${emblem}" alt="Logo LaLiga"></a>`;
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

  /// Handle top five

  const $tableTopFiveAvg = document.querySelector("#table-top-five-avg");
  const thListTitlesAvg = ["Nombre Equipo", "Partidos", "Goles", "Promedio"];
  const theadAvg = $tableTopFiveAvg.children[1].children[0];

  const $tableTopFiveLess = document.querySelector("#table-top-five-less");
  const thListTitlesLessFive = ["Nombre Equipo", "Goles"];
  const theadFiveLess = $tableTopFiveLess.children[1].children[0];

  creaTableHeader(thListTitlesAvg, theadAvg);
  creaTableHeader(thListTitlesLessFive, theadFiveLess);

  const displayTopFiveStats = async () => {
    const tbodyTopFiveAvg = $tableTopFiveAvg.children[2];
    const tbodyTopFiveLess = $tableTopFiveLess.children[2];

    try {
      const getMatchesData = getLocalStorage("matches");
      let dataMatches = {};
      let data = {};

      if (getMatchesData) {
        dataMatches = parseLocalStorage("matches");
        data = { ...dataMatches };
      } else {
        data = await getMatches();
      }

      const { matches } = data;
      const topFive = await generateTopFive(matches);

      const { totalLessTopFive, totalAvgTopfive } = topFive;

      let tr = HTMLTableRowElement;
      let td = HTMLTableCellElement;

      totalAvgTopfive
        .sort((a, b) => a.avg - b.avg)
        .forEach((el) => {
          const team = el?.name;
          const crest = el?.crest;
          const matches = el?.matches;
          const goals = el?.goals;
          const avg = typeof el?.avg === "number" ? el?.avg.toFixed(2) : el.avg;

          tr = document.createElement("tr");
          tr.setAttribute("scope", "row");
          tr.classList.add(
            "bg-white",
            "hover:bg-orange-200",
            "border-b-2",
            "border-b-orange-400",
            "last-of-type:border-none",
            "dark:hover:bg-orange-200",
            "dark:bg-orange-100"
          );

          Array.from({ length: thListTitlesAvg.length }, (_, i) => i)
            .sort((a, b) => b - a)
            .forEach((item) => {
              td = document.createElement("td");
              td.classList.add("py-4", "text-center");

              if (item === 0) {
                td.innerHTML = `
               <div class="flex items-center justify-between px-4">
                 <div class="flex items-center w-[1.5rem]">
                   <img src="${crest}" alt="${team}" >
                 </div>
                 <p class="text-left text-[1rem]">
                   ${team}
                 </p>
               </div>`;
              }
              if (item === 1) {
                td.innerHTML = `<div>${matches}</div>`;
              }
              if (item === 2) {
                td.innerHTML = `<div>${goals}</div>`;
              }
              if (item === 3) {
                td.innerHTML = `<div>${avg}</div>`;
              }

              tr.insertAdjacentElement("afterbegin", td);
            });
          tbodyTopFiveAvg.insertAdjacentElement("afterbegin", tr);
        });

      totalLessTopFive.forEach((el) => {
        const team = el?.name;
        const crest = el?.crest;
        const goals = el?.goals_away;

        tr = document.createElement("tr");
        tr.setAttribute("scope", "row");
        tr.classList.add(
          "bg-white",
          "hover:bg-orange-200",
          "border-b-2",
          "border-b-orange-400",
          "last-of-type:border-none",
          "dark:hover:bg-orange-200",
          "dark:bg-orange-100"
        );

        Array.from({ length: thListTitlesLessFive.length }, (_, i) => i)
          .sort((a, b) => b - a)
          .forEach((item) => {
            td = document.createElement("td");
            td.classList.add("py-4", "text-center");

            if (item === 0) {
              td.innerHTML = `
               <div class="flex items-center justify-between px-4">
                 <div class="flex items-center w-[1.5rem]">
                   <img src="${crest}" alt="${team}" >
                 </div>
                 <p class="text-left text-[1rem]">
                   ${team}
                 </p>
               </div>`;
            }

            if (item === 1) {
              td.innerHTML = `<div>${goals}</div>`;
            }

            tr.insertAdjacentElement("afterbegin", td);
          });
        tbodyTopFiveLess.insertAdjacentElement("afterbegin", tr);
      });
    } catch (error) {
      console.log(error);
    }
  };

  displayTopFiveStats();

  /// Handle stats

  const $tableStats = document.querySelector("#table-stats");
  const thListTitlesStats = ["Nombre Equipo", "Partidos", "Goles", "Promedio"];
  const theadStats = $tableStats.children[1].children[0];

  creaTableHeader(thListTitlesStats, theadStats);

  const displayStats = async () => {
    const tbody = $tableStats.children[2];

    try {
      const getMatchesData = getLocalStorage("matches");
      let dataMatches = {};
      let data = {};

      if (getMatchesData) {
        dataMatches = parseLocalStorage("matches");
        data = { ...dataMatches };
      } else {
        data = await getMatches();
      }

      const { matches } = data;

      const stats = await generateStats(matches);

      let tr = HTMLTableRowElement;
      let td = HTMLTableCellElement;

      stats
        .sort((a, b) => a.avg - b.avg)
        .forEach((el) => {
          const team = el?.name;
          const crest = el?.crest;
          const matches = el?.matches;
          const goals = el?.goals;
          const avg = typeof el?.avg === "number" ? el?.avg.toFixed(2) : el.avg;

          tr = document.createElement("tr");
          tr.setAttribute("scope", "row");
          tr.classList.add(
            "bg-white",
            "hover:bg-orange-200",
            "border-b-2",
            "border-b-orange-400",
            "last-of-type:border-none",
            "dark:hover:bg-orange-200",
            "dark:bg-orange-100"
          );

          Array.from({ length: thListTitlesStats.length }, (_, i) => i)
            .sort((a, b) => b - a)
            .forEach((item) => {
              td = document.createElement("td");
              td.classList.add("py-4", "text-center");

              if (item === 0) {
                td.classList.add(
                  "flex",
                  "items-center",
                  "justify-between",
                  "sm:w-56",
                  "lg:w-full",
                  "px-3"
                );
                td.innerHTML = `
              <div class="flex items-center justify-between w-full">
                <div class="flex items-center w-[1.5rem]">
                  <img src="${crest}" alt="${team}" >
                </div>
                <p class="text-left text-[0.8rem]">
                  ${team}
                </p>
              </div>`;
              }
              if (item === 1) {
                td.classList.add("sm:w-44");
                td.innerHTML = `<div>${matches}</div>`;
              }
              if (item === 2) {
                td.innerHTML = `<div>${goals}</div>`;
              }
              if (item === 3) {
                td.innerHTML = `<div>${avg}</div>`;
              }

              tr.insertAdjacentElement("afterbegin", td);
            });
          tbody.insertAdjacentElement("afterbegin", tr);
        });
    } catch (error) {
      console.log(error);
    }
  };

  displayStats();
};

document.addEventListener("DOMContentLoaded", main);
