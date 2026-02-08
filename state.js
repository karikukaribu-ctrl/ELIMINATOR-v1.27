/* ================================
   ELIMINATOR — ÉTAPE 0
================================ */

function $(id) {
  return document.getElementById(id);
}

function openPanel(side) {
  $("panelBack").classList.add("show");

  if (side === "left") {
    $("leftPanel").classList.add("open");
    $("rightPanel").classList.remove("open");
  }

  if (side === "right") {
    $("rightPanel").classList.add("open");
    $("leftPanel").classList.remove("open");
  }

  document.body.style.overflow = "hidden";
}

function closePanels() {
  $("panelBack").classList.remove("show");
  $("leftPanel").classList.remove("open");
  $("rightPanel").classList.remove("open");
  document.body.style.overflow = "";
}

document.addEventListener("DOMContentLoaded", () => {
  $("btnLeft").addEventListener("click", () => openPanel("left"));
  $("btnRight").addEventListener("click", () => openPanel("right"));

  $("leftClose").addEventListener("click", closePanels);
  $("rightClose").addEventListener("click", closePanels);
  $("panelBack").addEventListener("click", closePanels);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closePanels();
  });
});
