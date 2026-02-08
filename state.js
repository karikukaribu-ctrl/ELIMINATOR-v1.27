function $(id){ return document.getElementById(id); }

/* ========== PANNEAUX ========== */
function openPanel(which){
  $("panelBack").classList.add("show");
  document.body.style.overflow = "hidden";

  if(which === "left"){
    $("leftPanel").classList.add("open");
    $("rightPanel").classList.remove("open");
  }else{
    $("rightPanel").classList.add("open");
    $("leftPanel").classList.remove("open");
  }
}

function closePanels(){
  $("panelBack").classList.remove("show");
  $("leftPanel").classList.remove("open");
  $("rightPanel").classList.remove("open");
  document.body.style.overflow = "";
}

/* ========== DEMO STATE (Étape 1) ==========
   Progression = “reste à faire” en %
   → commence à 100 et décroît.
*/
let remainingPct = 100;
let spinning = false;

function clamp(n,a,b){ return Math.max(a, Math.min(b,n)); }

function renderProgress(){
  // width = reste
  $("progressFill").style.width = `${remainingPct}%`;
  $("progressPctIn").textContent = `${remainingPct}%`;
  $("progressBar").setAttribute("aria-valuenow", String(remainingPct));

  // lisibilité du texte selon remplissage (si très bas -> texte plus sombre/clair)
  const text = $("progressPctIn");
  if(remainingPct < 18){
    text.style.color = "rgba(0,0,0,.78)";
  }else{
    text.style.color = "rgba(0,0,0,.72)";
  }
}

function decrementProgress(step=10){
  remainingPct = clamp(remainingPct - step, 0, 100);
  renderProgress();
}

function incrementProgress(step=10){
  remainingPct = clamp(remainingPct + step, 0, 100);
  renderProgress();
}

/* ========== ROULETTE (animation plus fluide) ========== */
function spinRoulette(){
  if(spinning) return;
  spinning = true;

  const el = $("roulette");
  const turns = 3 + Math.random() * 4;         // 3..7 tours
  const deg = turns * 360 + Math.random()*40;  // petite variation
  const duration = 1400;

  el.animate(
    [
      { transform: "rotate(0deg)" },
      { transform: `rotate(${deg}deg)` }
    ],
    { duration, easing: "cubic-bezier(.12,.78,.18,1)" }
  );

  setTimeout(()=>{
    spinning = false;
    // Démo: roulette = “avancer” => donc reste diminue
    decrementProgress(10);
  }, duration);
}

/* ========== “DÉGOMMER” (démo) ========== */
function degommerOne(){
  decrementProgress(10);
}

/* ========== UNDO (retour arrière) ========== */
function undoOne(){
  incrementProgress(10);
}

/* ========== POMODORO (démo: juste edit minutes) ========== */
let pomoMinutes = 25;

function renderPomodoro(){
  $("pomoTime").textContent = `${String(pomoMinutes).padStart(2,"0")}:00`;
}

function editPomodoro(){
  const v = prompt("Durée pomodoro (minutes) :", String(pomoMinutes));
  if(v === null) return;
  const n = parseInt(v,10);
  if(Number.isFinite(n) && n >= 5 && n <= 90){
    pomoMinutes = n;
    renderPomodoro();
  }
}

/* ========== INIT ========== */
document.addEventListener("DOMContentLoaded", ()=>{
  // panels
  $("btnLeft").onclick = ()=>openPanel("left");
  $("btnRight").onclick = ()=>openPanel("right");
  $("leftClose").onclick = closePanels;
  $("rightClose").onclick = closePanels;
  $("panelBack").onclick = closePanels;

  // actions
  $("roulette").onclick = spinRoulette;
  $("bombBtn").onclick = degommerOne;
  $("undoBtn").onclick = undoOne;

  // pomo
  $("pomoEdit").onclick = editPomodoro;

  // initial render
  renderProgress();
  renderPomodoro();
});
