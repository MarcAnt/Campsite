export const toNormalizeText = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

export const displayIcons = (iconslist = [], index = 0) => {
  if (iconslist.length <= 0) return undefined;
  if (typeof index === "string") return undefined;

  return iconslist[index] ? iconslist[index] : "";
};

export const setIcon = (
  iconsList = [
    {
      icon: new String() || SVGElement || Element,
      element: new Element(),
      position: "left",
      styles: CSSStyleDeclaration || new String(),
    },
  ] || [],

  customStyles = CSSStyleDeclaration || new String(),
  customClass = "",
  customPosition = {}
) => {
  const position = {
    ...customPosition,
    left: "afterbegin",
    right: "beforeend",
  };
  let setCustomStyles = ``;
  Object.entries(customStyles).forEach(([key, value]) => {
    setCustomStyles += `${key}: ${value}; `;
  });

  let styles = "";
  iconsList.forEach((el) => {
    if (typeof el.styles === "object") {
      Object.entries(el.styles).forEach(([key, value]) => {
        styles += `${key}: ${value}; `;
      });
    }

    el.element.insertAdjacentHTML(
      position[el.position],
      `<span style="${setCustomStyles} ${
        el.styles ? styles : ""
      }" class="${customClass}">${el.icon}<span>`
    );
  });
};

export const getAccumulated = (
  arr = [],
  key = "",
  nameKey = "",
  otherProps = {}
) => {
  const total = arr
    .filter((el) => el[key])
    .map((el) => el[key])
    .reduce((a, b) => {
      return a + b;
    }, 0);

  return { ...otherProps, [nameKey]: total };
};

export const creaTableHeader = (thList = [], thead = HTMLTableElement) => {
  let ths = ``;

  thList.forEach((th) => {
    ths += `
      <tr>
          <th scope="col" class=" gap-3 px-6 py-3">
            <div class="flex items-center justify-center gap-3">
                <span>${th}</span>
            </div>
          </th>
      </tr>
      `;
  });

  thead.insertAdjacentHTML("afterbegin", ths);
};

export const getLocalStorage = (name = "") => {
  return localStorage.getItem(name) ? true : false;
};

export const parseLocalStorage = (name = "") => {
  return JSON.parse(localStorage.getItem(name));
};
