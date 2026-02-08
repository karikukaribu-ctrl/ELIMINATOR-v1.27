function $(id) {
  return document.getElementById(id);
}

/* PANNEAUX */
function openPanel(side) {
  $("panelBack").classList.add("show");
  document.body.style.overflow = "hidden";

  if (side === "left") {
    $("leftPanel").classList.add("open");
    $("rightPanel").classList.remove("open");
  } else {
    $("rightPanel").classList.add("open");
    $("leftPanel").classList.remove("open");
  }
}

function closePanels() {
  $("panelBack").classList.remove("show");
  $("leftPanel").classList.remove("open");
  $("rightPanel").classList.remove("open");
  document.body.style.overflow = "";
}

/* HUB DEMO STATE */
let progress = 0;
let spinning = false;

/* INIT */
document.addEventListener("DOMContentLoaded", () => {
  $("btnLeft").onclick = () => openPanel("left");
  $("btnRight").onclick = () => openPanel("right");
  $("leftClose").onclick = closePanels;
  $("rightClose").onclick = closePanels;
  $("panelBack").onclick = closePanels;

  $("roulette").onclick = spinRoulette;
});

/* ROULETTE VISUELLE */
function spinRoulette() {
  if (spinning) return;
  spinning = true;

  const wheel = document.querySelector(".wheel");
  const turns = 3 + Math.random() * 3;
  const duration = 1200;

  wheel.animate(
    [{ transform: "rotate(0deg)" }, { transform: `rotate(${turns * 360}deg)` }],
    { duration, easing: "cubic-bezier(.2,.7,.2,1)" }
  );

  setTimeout(() => {
    spinning = false;
    incrementProgress();
  }, duration);
}

/* PROGRESSION DEMO */
function incrementProgress() {
  progress = Math.min(progress + 10, 100);
  $("progressFill").style.width = progress + "%";
  $("progressPct").textContent = progress + "%";
}
