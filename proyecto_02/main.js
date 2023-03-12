import { getStandings } from "./src/api/getStandings";
import { getMatches } from "./src/api/getMatches";
import { getLocalStorage, parseLocalStorage } from "./src/Utils";
import { generateTopFive } from "./src/tables/tableTopFive";

const main = () => {
  const $checkboxsFilters = document.querySelector("#checkbox-filters");
  const $logoLaLiga = document.querySelector("#logoLaLiga");
  const $teamLinks = document.querySelector("#team-links");

  const handleLinks = async () => {
    $teamLinks.childNodes.forEach((el) => {
      const $anchor = el;

      $anchor.addEventListener("click", (e) => {
        const replacedNames = $anchor.dataset.name.replace(/\-+/gm, " ");
        const $search = document.querySelector("#search");
        $search.value = replacedNames;

        if (replacedNames !== "") $checkboxsFilters.classList.remove("hidden");
        else $checkboxsFilters.classList.add("hidden");
      });
    });
  };

  let colors = [
    "#921C80",
    "#02509C",
    "#198CCD",
    "#009540",
    "#FDEA14",
    "#EF8604",
    "#E10B17",
  ];
  const randomColors = () => {
    let randomNumber = Math.ceil(Math.random() * colors.length - 1);

    return colors[randomNumber].toString();
  };

  const setLogosAndLinks = async () => {
    const getStandingsData = getLocalStorage("standings");
    let dataStandings = {};
    let data = {};

    if (getStandingsData) {
      dataStandings = parseLocalStorage("standings");
      data = { ...dataStandings };
    } else {
      data = await getStandings();
    }

    const { standings } = data;

    const totalInformationTable = await standings[0]?.table;
    let links = "";

    await totalInformationTable.forEach((element) => {
      const team = element?.team;

      const clearName = team.name
        .toString()
        .replace(/\s+/gm, "-")
        .trim()
        .toLowerCase();

      links += `
        <a  style="background-color: ${randomColors()}" class="group relative overflow-hidden shadow-inner flex items-center justify-center gap-2" href="../src/pages/tables/index.html#${clearName}"  title="${
        team.name
      }" data-name="${clearName}">
 
          <p class="text-white md:text-lg lg:text-4xl xl:text-4xl font-extrabold hidden transition-all opacity-0 group-hover:block group-hover:opacity-100" >${
            team.name
          }</p>
          
          
          <img class="object-fit max-w-20 max-h-20 transition-all ease-in-out delay-50 lg:group-hover:scale-150 lg:group-hover:translate-x-40 lg:group-hover:opacity-0 lg:group-hover:grayscale lg:group-hover:absolute" src="${
            team.crest
          }" alt="${team.name}">
          
        </a>
        `;
    });
    $teamLinks.insertAdjacentHTML("afterbegin", links);

    handleLinks();
  };

  setLogosAndLinks();

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

    // const data = await getMatches();
    const { competition } = data;
    const emblem = competition?.emblem;

    $logoLaLiga.innerHTML = `<a href="index.html"  class="flex justify-center items-center" ><img class="object-cover w-1/2" src="${emblem}" alt="Logo LaLiga"></a>`;
  };

  setLogoLaLiga();
};

document.addEventListener("DOMContentLoaded", main);
