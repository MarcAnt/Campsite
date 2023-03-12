import { getStandings } from "../api/getStandings";
import icons from "../icons";
import { getLocalStorage, parseLocalStorage } from "../Utils";

const $tableStandings = document.querySelector("#table-standings");

const thListTitles = [
  "Posición",
  "Nombre Equipo",
  "Partidos Ganados",
  "Partidos Empatados",
  "Derrotas",
  "Goles a Favor",
  "Goles en contra",
  "Diferencia de goles",
  "Puntos",
  "Últimos 5",
];

const creaTableHeaderStandings = () => {
  let ths = ``;
  const thead = $tableStandings.children[1].children[0];

  thListTitles.forEach((th) => {
    ths += `

      <tr>
          <th scope="col" class=" gap-3 px-6 py-3">
            <div class="flex items-center justify-center  gap-3">
                <span>${th}</span>
                
            </div>
          </th>
      </tr>

      `;
  });

  thead.insertAdjacentHTML("afterbegin", ths);
};

creaTableHeaderStandings();

const createTableCaption = async () => {
  const tableCaption = $tableStandings.children[0];

  tableCaption.insertAdjacentHTML(
    "afterbegin",
    `<div>Resultados totales de LaLiga &copy;</div>`
  );
};

createTableCaption();

export const displayStandings = async (filter = "", limitResults = 10) => {
  const tbody = $tableStandings.children[2];

  const $skeleton = document.querySelector("#standings-skeleton");
  const $standingsConatiner = document.querySelector("#standings-container");

  try {
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

    if (data) {
      $skeleton.classList.add("hidden");
      $standingsConatiner.classList.remove("hidden");
      $standingsConatiner.classList.add("flex");
    }

    const totalTable = standings[0].table.sort(
      (a, b) => b.position - a.position
    );

    let tr = HTMLTableRowElement;
    let td = HTMLTableCellElement;

    const transformLastFive = (form = "") => {
      const letters = form
        .replace(/,/g, " ")
        .replace(
          /L+/gi,
          `<span style="fill: red; width: 15px; height: 15px;">${icons.xCircle}</span>`
        )
        .replace(
          /W+/g,
          `<span style="fill: green; width: 15px; height: 15px;">${icons.checkCircle}</span>`
        )
        .replace(
          /D+/g,
          `<span style="fill: gray; width: 15px; height: 15px;">${icons.minusCircle}</span>`
        );

      return letters;
    };

    totalTable.forEach((el) => {
      const team = el?.team;
      const position = el?.position;
      const gamesWon = el?.won;
      const draws = el?.draw;
      const lost = el?.lost;
      const goalsFor = el?.goalsFor;
      const goalsAgainst = el?.goalsAgainst;
      const goalDifference = el?.goalDifference;
      const points = el?.points;
      const form = el?.form;

      const clearName = team.name.toLowerCase();
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

      if (clearName.includes(filter) && filter !== "") {
        tr.classList.add("dark:bg-orange-200");
      }

      Array.from({ length: thListTitles.length }, (_, i) => i)
        .sort((a, b) => b - a)
        .forEach((item) => {
          td = document.createElement("td");
          td.classList.add("py-4", "text-center");

          if (item === 0) {
            td.classList.add("w-5");
            td.innerHTML = `<div>${position}</div>`;
          }
          if (item === 1) {
            td.classList.add("flex", "items-center", "justify-between", "w-52");
            td.innerHTML = `
            <div class="flex items-center justify-between w-full">
              <div class="flex items-center w-[1rem]"> 
                <img src="${team.crest}" alt="${team.name}" > 
              </div> 
              <p class="text-left text-[0.7rem]">
                ${team.name}
              </p>
            
            </div>`;
          }
          if (item === 2) {
            td.innerHTML = `<div>${gamesWon}</div>`;
          }
          if (item === 3) {
            td.innerHTML = `<div>${draws}</div>`;
          }
          if (item === 4) {
            td.innerHTML = `<div>${lost}</div>`;
          }
          if (item === 5) {
            td.innerHTML = `<div>${goalsFor}</div>`;
          }
          if (item === 6) {
            td.innerHTML = `<div>${goalsAgainst}</div>`;
          }
          if (item === 7) {
            td.innerHTML = `<div>${goalDifference}</div>`;
          }
          if (item === 8) {
            td.classList.add("w-5");
            td.innerHTML = `<div>${points}</div>`;
          }
          if (item === 9) {
            td.classList.add("flex", "items-center", "justify-center", "w-52");
            td.innerHTML = `
            ${transformLastFive(form)}
  
            `;
          }

          tr.insertAdjacentElement("afterbegin", td);
        });

      tbody.insertAdjacentElement("afterbegin", tr);
    });
  } catch (error) {
    console.log(error);
  }
};
