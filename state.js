function $(id){ return document.getElementById(id); }
function clamp(n,a,b){ return Math.max(a, Math.min(b,n)); }

/* PANNEAUX */
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

/* DEMO STATE — progression “reste à faire” */
let remainingPct = 100;

/* PROGRESSION */
function renderProgress(){
  $("progressFill").style.width = `${remainingPct}%`;
  $("progressPctIn").textContent = `${remainingPct}%`;
  $("progressBar").setAttribute("aria-valuenow", String(remainingPct));
}
function decrementProgress(step=10){
  remainingPct = clamp(remainingPct - step, 0, 100);
  renderProgress();
}
function incrementProgress(step=10){
  remainingPct = clamp(remainingPct + step, 0, 100);
  renderProgress();
}

/* ROULETTE (mouvement de roulage fluide) */
let spinning = false;
let currentRotation = 0;

function spinRoulette(){
  if(spinning) return;
  spinning = true;

  const btn = $("roulette");
  const face = btn.querySelector(".rouletteFace");

  const turns = 3 + Math.random()*5;         // 3..8 tours
  const extra = Math.random()*180;           // variation
  const target = currentRotation + turns*360 + extra;
  const duration = 1600;

  face.animate(
    [{ transform:`rotate(${currentRotation}deg)` },
     { transform:`rotate(${target}deg)` }],
    { duration, easing:"cubic-bezier(.12,.78,.18,1)" }
  );

  // On fixe l’état final
  setTimeout(()=>{
    face.style.transform = `rotate(${target}deg)`;
    currentRotation = target;
    spinning = false;

    // Démo : roulette => “avance” => reste diminue
    decrementProgress(10);
  }, duration);
}

/* DÉGOMMER 1 ÉTHORION (démo) */
function degommerOne(){
  decrementProgress(10);
}

/* UNDO */
function undoOne(){
  incrementProgress(10);
}

/* POMODORO (démo édition minutes) */
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

/* DÉTAILS TÂCHE (masqués par défaut) */
function toggleTaskMeta(){
  const meta = $("taskMeta");
  meta.hidden = !meta.hidden;
}

/* INIT */
document.addEventListener("DOMContentLoaded", ()=>{
  $("btnLeft").onclick = ()=>openPanel("left");
  $("btnRight").onclick = ()=>openPanel("right");
  $("leftClose").onclick = closePanels;
  $("rightClose").onclick = closePanels;
  $("panelBack").onclick = closePanels;

  $("roulette").onclick = spinRoulette;
  $("bombBtn").onclick = degommerOne;
  $("undoBtn").onclick = undoOne;

  $("pomoEdit").onclick = editPomodoro;
  $("taskInfoBtn").onclick = toggleTaskMeta;

  renderProgress();
  renderPomodoro();
});
