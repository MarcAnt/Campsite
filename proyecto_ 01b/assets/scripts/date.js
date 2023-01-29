document.addEventListener("DOMContentLoaded", () => {
  ((d) => {
    const $date = d.querySelector(".date");

    $date.textContent = `${new Date().getFullYear()}` || "2023";
  })(document);
});
