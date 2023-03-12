import { getAll } from "../api/getAll";
import { getMatches } from "../api/getMatches";
import icons from "../icons";
import { displayIcons, getLocalStorage, parseLocalStorage } from "../Utils";

const iconsList = [
  icons.flagGoal,
  icons.homeIcon,
  icons.trophyIcon,
  icons.visitorIcon,
  icons.infoIcon,
];

const $table = document.querySelector("#table-matches"),
  $searchMataches = document.querySelector("#search");

const thListTitles = [
  "Temporada",
  "Casa",
  "Puntuación",
  "Visitante",
  "Más Información",
];

const creaTableHeader = () => {
  let ths = ``;
  const thead = $table.children[1].children[0];

  thListTitles.forEach((th, idx) => {
    ths += `
  
      <tr>
          <th scope="col" class=" gap-3 px-6 py-3">
            <div class="flex items-center justify-center  gap-3">
                <span>${th}</span>
                <span style="fill: black">
  
                    ${displayIcons(iconsList, idx)}
  
                </span>
            </div>
          </th>
      </tr>
  
      `;
  });

  thead.insertAdjacentHTML("afterbegin", ths);
};

creaTableHeader();

const createTableCaption = async () => {
  const data = await getAll();

  const { filters, resultSet, competition } = data;

  const season = filters?.season;
  const name = competition?.name;
  const emblem = competition?.emblem;
  const played = resultSet?.played;
  const first = resultSet?.first;
  const last = resultSet?.last;

  const tableCaption = $table.children[0];
  const captionContent = `
  <div class="flex text-center items-center justify-evenly divide-x gap-5 divide-orange-200 h-[75px] max-h-[75px]" >


    <div class="flex flex-col justify-center h-full" > <img class="object-cover w-[4rem]" src="${emblem}" alt="Logo Laliga"> </div>

    <div class="flex flex-col justify-center text-left h-full">
  
      <div class="ml-3 text-left"> ${name}</div>
      <div class="ml-3 text-left"> ${`Temporada: ` + season}</div>
    </div>

    <div class="flex flex-col justify-center text-left h-full">
    
      <div class="ml-3 text-left">  ${
        `Inicio de Temporada: ` + new Date(first).toLocaleDateString("es-ES")
      }</div>
      <div class="ml-3 text-left">  ${
        `Último Jugado: ` + new Date(last).toLocaleDateString("es-ES")
      }</div>
    </div>

    <div class="flex flex-col justify-center text-left h-full">
      <div class="ml-3 text-left">Partidos Jugados: ${played}</div>
    </div>

  </div>`;

  tableCaption.insertAdjacentHTML("afterbegin", captionContent);
};

createTableCaption();

export const displayMatches = async (
  tableMatches = HTMLTableElement,
  limitResults = 10,
  filter = "",
  filterCheckbox = "ALL"
) => {
  const tbody = tableMatches.children[2];

  const toggleMoreInfo = (buttonId = "") => {
    const trMoreInfo = [...tbody.children].filter((el) => {
      return el.id.toString() === buttonId.toString();
    });

    trMoreInfo.forEach((el) => {
      el.classList.toggle("hidden");
    });

    return buttonId;
  };

  //close all more information tr
  tableMatches.addEventListener("mouseleave", () => {
    [...tbody.children].forEach((el) => {
      if (el.dataset.show === "show-more") {
        el.classList.add("hidden");
      }
    });
  });

  const $skeleton = document.querySelector("#matches-skeleton");
  const $matchesConatiner = document.querySelector("#matches-container");

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

  if (data) {
    $skeleton.classList.add("hidden");
    $matchesConatiner.classList.remove("hidden");
    $matchesConatiner.classList.add("flex");
  }

  const filtered = data?.matches
    .filter(
      (el) =>
        el.score?.fullTime?.home !== null ||
        (el.score?.fullTime?.home !== null &&
          el.score?.fullTime?.away !== null) ||
        el.score?.fullTime?.away !== null
    )
    .map((el) => {
      const score = el?.score;

      if (score.winner === "HOME_TEAM") {
        el.homeTeam = {
          ...el.homeTeam,
          winner: true,
        };

        el.score = {
          ...el.score,
          winnerName: el.homeTeam.name,
          loserName: el.awayTeam.name,
        };

        el.awayTeam = {
          ...el.awayTeam,
          winner: false,
        };
      }

      if (score.winner === "AWAY_TEAM") {
        el.awayTeam = {
          ...el.awayTeam,
          winner: true,
        };

        el.score = {
          ...el.score,
          winnerName: el.awayTeam.name,
          loserName: el.homeTeam.name,
        };

        el.homeTeam = {
          ...el.homeTeam,
          winner: false,
        };
      }

      if (score.winner === "DRAW") {
        el.awayTeam = {
          ...el.awayTeam,
          winner: "DRAW",
        };

        el.score = {
          ...el.score,
          winnerName: el.awayTeam.name,
          loserName: el.homeTeam.name,
        };

        el.homeTeam = {
          ...el.homeTeam,
          winner: "DRAW",
        };
      }

      return el;
    });

  const initialFiltered = filtered.filter((el) => {
    const homeTeam = el?.homeTeam;
    const awayTeam = el?.awayTeam;

    return (
      homeTeam.name.toLowerCase().includes(filter.toLowerCase()) ||
      awayTeam.name.toLowerCase().includes(filter.toLowerCase())
    );
  });

  const changeCheckboxFiltered = filtered.filter((el) => {
    const homeTeam = el?.homeTeam;
    const awayTeam = el?.awayTeam;
    const score = el?.score;
    const searchValue = $searchMataches.value;

    if (filterCheckbox === "LOSER") {
      if (homeTeam.winner === false || awayTeam.winner === false) {
        if (score.loserName.toLowerCase().includes(searchValue.toLowerCase())) {
          return el;
        }
      }
    }

    if (filterCheckbox === "WINNER") {
      if (homeTeam.winner === true || awayTeam.winner === true) {
        if (
          score.winnerName.toLowerCase().includes(searchValue.toLowerCase())
        ) {
          return el;
        }
      }
    }

    if (filterCheckbox === "DRAW") {
      if (score.winner === "DRAW") {
        if (
          score.winnerName.toLowerCase().includes(searchValue.toLowerCase()) ||
          score.loserName.toLowerCase().includes(searchValue.toLowerCase())
        ) {
          return el;
        }
      }
    }

    if (filterCheckbox === "ALL") {
      return (
        homeTeam.name.toLowerCase().includes(filter.toLowerCase()) ||
        awayTeam.name.toLowerCase().includes(filter.toLowerCase())
      );
    }
  });

  const replaceFilter = () => {
    return changeCheckboxFiltered.length
      ? changeCheckboxFiltered
      : initialFiltered;
  };

  const tdata = replaceFilter().length > 0 ? [...replaceFilter()] : [];
  const newLimit = filter === "" ? limitResults : tdata.length;

  let tr = HTMLTableRowElement;
  let trShowMore = HTMLTableRowElement;

  let td = HTMLTableCellElement;
  let homeTeam = String;
  let winnerHome = String;
  let homeTeamLogoUrl = String;
  let score = String;
  let season = String;
  let awayTeam = String;

  let awayTeamLogoUrl = String;

  let winnerScoreHome = String;
  let winnerAway = String;

  let winnerScoreAway = String;
  let winnerScoreHaflTimeAway = String;
  let winnerScoreHaflTimeHome = String;
  let area = String;

  const replaceTr = document.createElement("tr");
  tbody.replaceChildren(replaceTr);

  if (tdata.length <= 0) {
    tr = document.createElement("tr");
    tr.setAttribute("scope", "row");

    tr.innerHTML = `
    
    <td colspan="5" class="flex text-center px-6 py-4 w-full">
      <div class="flex items-center justify-center divide-x gap-5 divide-white w-full">
      <div class="flex flex-col ">
        <p class="animate-fadeIn font-normal">No hay resultados para la busqueda de <b>${filter}</b> </p>
      </div>
      </div>
    </td>
    
    `;

    tbody.insertAdjacentElement("afterbegin", tr);

    return;
  }

  tdata.slice(0, newLimit).forEach((item) => {
    const referees = item?.referees;
    area = item?.area;
    let refereesItems = "";

    referees.forEach((el) => {
      refereesItems += `
      <div class="ml-5">
          Referee: ${el.name} | País de Origen: ${
        el.nationality === "Spain"
          ? "España"
          : el.nationality === null
          ? "s/e"
          : el.nationality
      }
        </div>
      `;
    });

    const status = item?.status;

    season = `${new Date(item?.season?.startDate).toLocaleDateString(
      "es-ES"
    )} - ${new Date(item?.season?.endDate).toLocaleDateString("es-ES")}`;
    awayTeam = item?.awayTeam.name;
    awayTeamLogoUrl = item?.awayTeam.crest;

    homeTeam = item?.homeTeam.name;
    score = item?.score;
    winnerHome = score.winner === "HOME_TEAM" ? "font-bold" : "font-normal";

    homeTeamLogoUrl = item?.homeTeam.crest;

    winnerScoreHome =
      score?.fullTime?.home === null ? "s/r" : score?.fullTime?.home;
    winnerScoreHaflTimeHome =
      score?.halfTime?.home === null ? "s/r" : score?.halfTime?.home;

    winnerAway = score.winner === "AWAY_TEAM" ? "font-bold" : "font-normal";

    winnerScoreAway =
      score?.fullTime?.away === null ? "s/r" : score?.fullTime?.away;
    winnerScoreHaflTimeAway =
      score?.halfTime?.away === null ? "s/r" : score?.halfTime?.away;

    tr = document.createElement("tr");
    tr.setAttribute("scope", "row");
    tr.dataset.home_team = score.winner === "HOME_TEAM" ? "WINNER" : "LOSER";
    tr.dataset.away_team = score.winner === "AWAY_TEAM" ? "WINNER" : "LOSER";
    tr.dataset.name_winner =
      score.winner === "AWAY_TEAM"
        ? `${"WINNER-" + awayTeam + "-AWAY_TEAM"}`
        : score.winner === "HOME_TEAM"
        ? `${"WINNER-" + homeTeam + "-HOME_TEAM"}`
        : "s/n";
    tr.dataset.name_loser =
      score.winner === "AWAY_TEAM"
        ? `${"LOSER-" + homeTeam + "-HOME_TEAM"}`
        : score.winner === "HOME_TEAM"
        ? `${"LOSER-" + awayTeam + "-AWAY_TEAM"}`
        : "s/n";
    tr.classList.add(
      "bg-white",
      "dark:bg-orange-100",
      "hover:bg-orange-200",
      "border-b-2",
      "border-b-orange-400",
      "last-of-type:border-none",
      "dark:hover:bg-orange-200"
    );

    trShowMore = document.createElement("tr");
    trShowMore.setAttribute("scope", "row");
    trShowMore.id = item.id;
    trShowMore.dataset.show = "show-more";
    trShowMore.classList.add(
      "bg-white",
      "font-bold",
      "text-white",
      "dark:bg-orange-400",
      "hover:bg-orange-500",
      "dark:hover:bg-orange-500",
      "hidden"
    );
    trShowMore.innerHTML = `
    
    <td colspan="5" class="px-6 py-4 w-full">
      <div class="flex items-center justify-center divide-x gap-5 divide-white w-full">

        <div class="flex flex-col ">
          <p class="animate-fadeIn">Estatus del juego: ${
            status === "FINISHED" ? "Finalizado" : status
          }</p>
        </div>

        <div class="flex flex-col ">
          <div  class="ml-5 flex items-center w-full" >

            <p class="mr-2 animate-fadeIn"> 
              Lugar de Juego: ${area.name === "Spain" ? "España" : area.name} 
            </p>
             
            <div class="w-5 animate-fadeIn"> 
              <img src="${area.flag}" alt="${area.name}" > 
            </div> 
          </div>
          ${refereesItems}
        </div>

        <div class="flex flex-col justify-center" >
          ${
            score.winner === "HOME_TEAM"
              ? `
                <div class="flex gap-3 items-center justify-center">
                  <p class="ml-5 animate-fadeIn"> Equipo Ganador: ${homeTeam} </p> 
                  <div class="flex items-center w-[2rem]"> 
                    <img src="${homeTeamLogoUrl}" alt="${homeTeam}" > 
                  </div> 
                
                </div>
              `
              : ""
          }
          ${
            score.winner === "AWAY_TEAM"
              ? `
              <div class="flex gap-3 items-center justify-center">
                <p class="ml-5 animate-fadeIn"> Equipo Ganador: ${awayTeam} </p> 
                <div class="flex items-center w-[2rem]"> 
                  <img src="${awayTeamLogoUrl}" alt="${awayTeam}" > 
                </div>
              </div>
            `
              : ""
          }
          ${
            score.winner === "DRAW"
              ? `<p class="ml-5 animate-fadeIn">Empate</p>`
              : ""
          }
        </div>


      </div>

    
    </td>`;

    Array.from({ length: thListTitles.length }, (_, i) => i)
      .sort((a, b) => b - a)
      .forEach((el) => {
        td = document.createElement("td");
        td.classList.add("py-4", "text-center");

        if (el === 0) {
          td.innerHTML = `<div class=" py-4 text-center ">${season}</div>`;
        }

        if (el === 1) {
          td.innerHTML = `<div class="flex items-center ">
                        <p class="w-[70%] text-left ${winnerHome}" >${homeTeam} </p>
                        <div class="w-[30%] flex justify-end">
                          <img class="w-5" src="${homeTeamLogoUrl}" alt="${homeTeam}">
                        </div>
                      </div>`;
        }

        if (el === 2) {
          td.classList.add(
            "py-4",
            "flex",
            "text-center",
            "items-center",
            "flex-col",
            "justify-around"
          );
          td.innerHTML = `<div class="flex flex-col text-center"> <div> ${winnerScoreHome} - ${winnerScoreAway} </div>   </div>
          <div class="flex flex-col text-center"> <div>Extra Time: ${winnerScoreHaflTimeHome} - ${winnerScoreHaflTimeAway} </div>   </div>`;
        }

        if (el === 3) {
          td.innerHTML = `
                       <div class="flex items-center ">
                         <div class="w-[50%]">
                           <img class="w-5" src="${awayTeamLogoUrl}" alt="${awayTeam}">
                         </div>
                         <p class="w-[50%] text-left ${winnerAway}"> ${awayTeam} </p>
                       </div>`;
        }

        if (el === 4) {
          td.innerHTML = `<button id="${item.id}" class="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden md:font-bold md:text-sm lg:text-md  text-black group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200" >
                                  <span
                                  class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-black group-hover:bg-opacity-0"
                                >
                                  Mostrar
                                </span>
                        </button>`;
          td.onclick = function () {
            toggleMoreInfo(item.id);
          };
        }

        tr.insertAdjacentElement("afterbegin", td);
      });

    tbody.insertAdjacentElement("afterbegin", trShowMore);
    tbody.insertAdjacentElement("afterbegin", tr);
  });
};
