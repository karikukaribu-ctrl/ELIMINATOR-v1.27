/* ============================================================
   ELIMINATOR — Étape 2
   - panneaux + onglets
   - inbox ajoute sans effacer
   - tâches + catégories + sélection
   - progression pleine qui décroît
   - roulette fluide
   - 💣 enlève 1 Éthorion
   - ↶ undo (snapshots)
   - préférences (mode/saison/police/intensité)
   - persistance localStorage
============================================================ */

const $ = (id)=>document.getElementById(id);
const $$ = (sel, root=document)=>Array.from(root.querySelectorAll(sel));
const clamp = (n,a,b)=>Math.max(a, Math.min(b,n));
const uid = ()=>Math.random().toString(36).slice(2,10)+"_"+Date.now().toString(36);
const nowISO = ()=>new Date().toISOString();

const LS_KEY = "eliminator_step2";

/* ---------- Thèmes (5 saisons) ---------- */
const THEMES = {
  printemps:{
    clair:{ bg:"#FBF4E8", fg:"#15120F", muted:"#6A5D53", accent:"#6EBE96", barFill:"#D38A5C" },
    fonce:{ bg:"#121413", fg:"#FAF7F0", muted:"#CFC8BC", accent:"#6EBE96", barFill:"#D7B08E" }
  },
  ete:{
    clair:{ bg:"#FFF3DF", fg:"#16120F", muted:"#6C5E52", accent:"#5AAAD2", barFill:"#D38A5C" },
    fonce:{ bg:"#0E1217", fg:"#F6FBFF", muted:"#C8D2DA", accent:"#5AAAD2", barFill:"#D7B08E" }
  },
  automne:{
    clair:{ bg:"#FBF4E8", fg:"#14120F", muted:"#6A5D53", accent:"#CD783C", barFill:"#D38A5C" },
    fonce:{ bg:"#14110D", fg:"#FFF5E8", muted:"#D9C9B7", accent:"#CD783C", barFill:"#D7B08E" }
  },
  hiver:{
    clair:{ bg:"#F5F7FA", fg:"#141B22", muted:"#61707E", accent:"#78A0C8", barFill:"#78A0C8" },
    fonce:{ bg:"#0D1116", fg:"#F2FDFF", muted:"#BFD2D6", accent:"#78A0C8", barFill:"#9DB8D5" }
  },
  noirblanc:{
    clair:{ bg:"#F7F4EE", fg:"#121212", muted:"#595959", accent:"#222222", barFill:"#444444" },
    fonce:{ bg:"#0F0F10", fg:"#F7F7F7", muted:"#CFCFCF", accent:"#FFFFFF", barFill:"#BBBBBB" }
  }
};

function applyTheme(){
  const season = state.ui.season in THEMES ? state.ui.season : "automne";
  const mode = state.ui.mode === "fonce" ? "fonce" : "clair";
  const t = THEMES[season][mode];

  document.documentElement.style.setProperty("--bg", t.bg);
  document.documentElement.style.setProperty("--fg", t.fg);
  document.documentElement.style.setProperty("--muted", t.muted);

  // accent: on l’utilise surtout comme surbrillance
  const accentSoft = mode==="fonce" ? "rgba(255,255,255,.10)" : "rgba(211,138,92,.22)";
  document.documentElement.style.setProperty("--accent", t.accent);
  document.documentElement.style.setProperty("--accentSoft", accentSoft);

  // barre: on limite les noirs
  document.documentElement.style.setProperty("--barFill", t.barFill);
  document.documentElement.style.setProperty("--barEmpty", mode==="fonce" ? "rgba(255,255,255,.10)" : "rgba(0,0,0,.10)");
  document.documentElement.style.setProperty("--barEdge", "rgba(255,255,255,.82)");
  document.documentElement.style.setProperty("--line", mode==="fonce" ? "rgba(255,255,255,.12)" : "rgba(0,0,0,.10)");
  document.documentElement.style.setProperty("--panelBg", mode==="fonce" ? "rgba(22,22,22,.62)" : "rgba(255,255,255,.70)");

  // intensité (scale globale)
  document.documentElement.style.setProperty("--intensity", String(clamp(state.ui.intensity,0.85,1.12)));

  // police
  document.body.setAttribute("data-font", state.ui.font);
}

/* ---------- State ---------- */
const defaultState = {
  ui:{
    mode:"clair",
    season:"automne",
    font:"yomogi",
    intensity: 1.00
  },
  baseline:{
    totalTasks: 0
  },
  tasks:[],
  currentTaskId:null,
  undo:[],
  kiffances:[
    "Regarder un truc mignon 2 minutes.",
    "Ranger 10 objets au hasard comme un ninja du tri.",
    "Boire un verre d’eau comme si c’était une potion.",
    "Étirement de dragon : 45 secondes."
  ]
};

function deepAssign(t,s){
  for(const k in s){
    if(s[k] && typeof s[k]==="object" && !Array.isArray(s[k]) && t[k]) deepAssign(t[k], s[k]);
    else t[k]=s[k];
  }
}

function loadState(){
  try{
    const raw = localStorage.getItem(LS_KEY);
    if(!raw) return structuredClone(defaultState);
    const parsed = JSON.parse(raw);
    const merged = structuredClone(defaultState);
    deepAssign(merged, parsed);
    return merged;
  }catch(_){
    return structuredClone(defaultState);
  }
}

let state = loadState();
function saveState(){
  try{ localStorage.setItem(LS_KEY, JSON.stringify(state)); }catch(_){}
}

/* ---------- Panels ---------- */
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

/* ---------- Tabs ---------- */
function bindTabs(){
  // gauche
  $$(".panel-left .tabBtn").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      $$(".panel-left .tabBtn").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      const key = btn.dataset.lefttab;
      $$("#leftPanel .tabPage").forEach(p=>p.classList.remove("show"));
      $("left-"+key).classList.add("show");
      // rerender zone concernée
      if(key==="tasks") renderTasksPanel();
      if(key==="kiffance") renderKiffance();
      if(key==="prefs") renderPrefsUI();
      if(key==="export") renderExport();
    });
  });

  // droite
  $$(".panel-right .tabBtn").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      $$(".panel-right .tabBtn").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      const key = btn.dataset.righttab;
      $$("#rightPanel .tabPage").forEach(p=>p.classList.remove("show"));
      $("right-"+key).classList.add("show");
    });
  });
}

/* ---------- Inbox parsing ---------- */
function isAllCapsLine(line){
  const t = (line||"").trim();
  if(!t) return false;
  const hasLetters = /[A-Za-zÀ-ÖØ-öø-ÿ]/.test(t);
  if(!hasLetters) return false;
  return t === t.toUpperCase() && t.length <= 90;
}

function parseTaskLine(line){
  const raw = (line||"").trim();
  if(!raw) return null;
  const cleaned = raw.replace(/^[-*•\s]+/, "").trim();
  if(!cleaned) return null;

  let et = null;
  let title = cleaned;

  // "titre - 6" ou "titre 6"
  const m = cleaned.match(/^(.*?)(?:\s*[-–—]\s*|\s+)(\d+)\s*$/);
  if(m){
    title = m[1].trim();
    et = parseInt(m[2],10);
  }
  title = title.replace(/\s+/g," ").trim();
  if(!title) return null;

  if(et!==null) et = clamp(et, 1, 99);
  return { title, etorions: et ?? 1 };
}

function importFromInbox(text){
  const lines = String(text||"").split(/\r?\n/).map(l=>l.trim()).filter(Boolean);
  let cat = "Inbox";
  const out = [];

  for(const line of lines){
    if(isAllCapsLine(line)){ cat=line.trim(); continue; }
    const p = parseTaskLine(line);
    if(!p) continue;
    out.push({
      id: uid(),
      title: p.title,
      cat,
      etorionsTotal: p.etorions,
      etorionsLeft: p.etorions,
      done:false,
      createdAt: nowISO(),
      doneAt:null
    });
  }
  return out;
}

/* ---------- Tasks helpers ---------- */
const activeTasks = ()=>state.tasks.filter(t=>!t.done);
const doneTasks = ()=>state.tasks.filter(t=>t.done);
const getTask = (id)=>state.tasks.find(t=>t.id===id) || null;

function ensureBaseline(){
  // baseline = nombre de tâches actives au moment où on “démarre un run”
  // Ici : si baseline vide, on la crée dès qu’on a des tâches actives.
  if(state.baseline.totalTasks <= 0){
    const n = activeTasks().length;
    if(n>0) state.baseline.totalTasks = n;
  }
}

function ensureCurrentTask(){
  const act = activeTasks();
  if(act.length===0){
    state.currentTaskId = null;
    return;
  }
  const cur = getTask(state.currentTaskId);
  if(!cur || cur.done){
    // prend la première active
    state.currentTaskId = act[0].id;
  }
}

/* ---------- Progress (reste%) ---------- */
function computeRemainingPct(){
  ensureBaseline();
  const base = state.baseline.totalTasks || 0;
  const rem = activeTasks().length;

  if(base<=0){
    return 100;
  }
  // barre = “reste” => 100% au début, décroît vers 0
  const pct = clamp(Math.round((rem/base)*100), 0, 100);
  return pct;
}

function renderProgress(){
  const pct = computeRemainingPct();
  $("progressFill").style.width = `${pct}%`;
  $("progressPctIn").textContent = `${pct}%`;
  $("progressBar").setAttribute("aria-valuenow", String(pct));
}

/* ---------- Undo snapshots ---------- */
function pushUndo(label){
  state.undo.unshift({
    label,
    at: Date.now(),
    payload: structuredClone({
      tasks: state.tasks,
      baseline: state.baseline,
      currentTaskId: state.currentTaskId,
      kiffances: state.kiffances,
      ui: state.ui
    })
  });
  state.undo = state.undo.slice(0, 25);
  saveState();
}

function doUndo(){
  const snap = state.undo.shift();
  if(!snap) return toast("Rien à annuler. La réalité est implacable.");
  const p = snap.payload;
  state.tasks = p.tasks;
  state.baseline = p.baseline;
  state.currentTaskId = p.currentTaskId;
  state.kiffances = p.kiffances;
  state.ui = p.ui;
  saveState();
  applyTheme();
  renderAll();
  toast("Retour arrière : destin réécrit.");
}

/* ---------- Actions : sélectionner / dégommage ---------- */
function selectTask(id){
  const t = getTask(id);
  if(!t || t.done) return;
  state.currentTaskId = id;
  saveState();
  renderHubTask();
  renderTasksPanel();
}

function completeTask(id){
  const t = getTask(id);
  if(!t || t.done) return;
  pushUndo("complete");
  t.done = true;
  t.doneAt = nowISO();
  ensureCurrentTask();
  saveState();
  renderAll();
  toast("GLORIEUX. Une menace de moins.");
}

function degommerOne(){
  const t = getTask(state.currentTaskId);
  if(!t || t.done) return toast("Aucune tâche à dégomm… euh… à traiter.");
  pushUndo("degomme");

  t.etorionsLeft = clamp((t.etorionsLeft||1) - 1, 0, 99);

  if(t.etorionsLeft <= 0){
    t.done = true;
    t.doneAt = nowISO();
    toast("CHAOS TERRASSÉ. Mission accomplie.");
    ensureCurrentTask();
  }else{
    toast("💣 ÉTHORION dégommé. Encore un.");
  }

  saveState();
  renderAll();
}

/* ---------- Roulette fluide : pioche une tâche active ---------- */
let spinning = false;
let currentRotation = 0;

function spinRoulette(){
  if(spinning) return;

  const act = activeTasks();
  if(act.length===0) return toast("Pas de tâches. La paix… ou le vide cosmique.");

  spinning = true;
  const btn = $("roulette");
  const face = btn.querySelector(".rouletteFace");

  const turns = 3 + Math.random()*5;
  const extra = Math.random()*180;
  const target = currentRotation + turns*360 + extra;
  const duration = 1500;

  face.animate(
    [{ transform:`rotate(${currentRotation}deg)` }, { transform:`rotate(${target}deg)` }],
    { duration, easing:"cubic-bezier(.12,.78,.18,1)" }
  );

  setTimeout(()=>{
    face.style.transform = `rotate(${target}deg)`;
    currentRotation = target;
    spinning = false;

    // Tirage : pick aléatoire et sélectionne
    const pick = act[Math.floor(Math.random()*act.length)];
    selectTask(pick.id);
    toast(`Tirage : "${pick.title}"`);
  }, duration);
}

/* ---------- UI: hub task render ---------- */
function renderHubTask(){
  ensureCurrentTask();
  const t = getTask(state.currentTaskId);

  const act = activeTasks();
  const done = doneTasks();

  $("statActive").textContent = String(act.length);
  $("statDone").textContent = String(done.length);

  // fraction “tâches restantes / baseline”
  ensureBaseline();
  const base = state.baseline.totalTasks || 0;
  $("taskFraction").textContent = `${act.length}/${base || act.length || 0}`;

  if(!t){
    $("taskTitle").textContent = "Aucune tâche sélectionnée";
    $("metaCat").textContent = "—";
    $("metaEt").textContent = "—";
    return;
  }

  $("taskTitle").textContent = t.title;
  $("metaCat").textContent = t.cat || "—";
  $("metaEt").textContent = `${t.etorionsLeft}/${t.etorionsTotal}`;
}

/* ---------- Left panel: tasks list + filters ---------- */
function categories(){
  const set = new Set(state.tasks.map(t=>t.cat||"Inbox"));
  const out = Array.from(set).sort((a,b)=>a.localeCompare(b));
  out.unshift("Toutes");
  return out;
}

function renderCatFilter(){
  const sel = $("catFilter");
  const prev = sel.value || "Toutes";
  sel.innerHTML = "";
  for(const c of categories()){
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    sel.appendChild(opt);
  }
  sel.value = categories().includes(prev) ? prev : "Toutes";
}

function renderTasksPanel(){
  renderCatFilter();

  const cat = $("catFilter").value;
  const view = $("viewFilter").value;

  let list = state.tasks.slice();
  if(view==="active") list = list.filter(t=>!t.done);
  if(view==="done") list = list.filter(t=>t.done);
  if(cat && cat!=="Toutes") list = list.filter(t=>(t.cat||"Inbox")===cat);

  // tri : actives d’abord, puis récent
  list.sort((a,b)=>{
    if(a.done && !b.done) return 1;
    if(!a.done && b.done) return -1;
    return String(b.createdAt||"").localeCompare(String(a.createdAt||""));
  });

  const root = $("taskList");
  root.innerHTML = "";

  if(list.length===0){
    const div = document.createElement("div");
    div.className = "muted small";
    div.textContent = "Rien ici. Le néant a gagné (pour l’instant).";
    root.appendChild(div);
    return;
  }

  for(const t of list){
    const row = document.createElement("div");
    row.className = "cardRow";

    const left = document.createElement("div");
    left.className = "cardLeft";

    const title = document.createElement("div");
    title.className = "cardTitle";
    title.textContent = t.title;

    const sub = document.createElement("div");
    sub.className = "cardSub";
    const catTxt = t.cat || "Inbox";
    const etTxt = `${t.etorionsLeft}/${t.etorionsTotal} Éthorions`;
    sub.textContent = `${catTxt} · ${etTxt}${t.done ? " · Fini" : ""}`;

    left.appendChild(title);
    left.appendChild(sub);

    const btns = document.createElement("div");
    btns.className = "cardBtns";

    if(!t.done){
      const selBtn = document.createElement("button");
      selBtn.className = "iconBtn";
      selBtn.title = "Sélectionner";
      selBtn.textContent = (t.id===state.currentTaskId) ? "★" : "▶";
      selBtn.onclick = ()=>selectTask(t.id);
      btns.appendChild(selBtn);

      const doneBtn = document.createElement("button");
      doneBtn.className = "iconBtn";
      doneBtn.title = "Terminer";
      doneBtn.textContent = "✓";
      doneBtn.onclick = ()=>completeTask(t.id);
      btns.appendChild(doneBtn);
    }else{
      const restore = document.createElement("button");
      restore.className = "iconBtn";
      restore.title = "Restaurer (revient active)";
      restore.textContent = "↩";
      restore.onclick = ()=>{
        pushUndo("restore");
        t.done = false;
        t.doneAt = null;
        // si baseline vide, on ne la touche pas; sinon ça reste cohérent pour ce run
        ensureCurrentTask();
        saveState();
        renderAll();
        toast("Ressuscitée. Oui, c’est illégal, mais utile.");
      };
      btns.appendChild(restore);
    }

    const delBtn = document.createElement("button");
    delBtn.className = "iconBtn";
    delBtn.title = "Supprimer";
    delBtn.textContent = "×";
    delBtn.onclick = ()=>{
      pushUndo("delete");
      state.tasks = state.tasks.filter(x=>x.id!==t.id);
      if(state.currentTaskId===t.id) state.currentTaskId = null;
      // si on supprime, on recalc baseline si elle est “vide” ou incohérente
      if(activeTasks().length===0) state.baseline.totalTasks = 0;
      saveState();
      renderAll();
      toast("Évaporée. Pouf.");
    };
    btns.appendChild(delBtn);

    row.appendChild(left);
    row.appendChild(btns);

    root.appendChild(row);
  }
}

/* ---------- Kiffance ---------- */
function renderKiffance(){
  const root = $("kiffList");
  root.innerHTML = "";

  if(state.kiffances.length===0){
    const d = document.createElement("div");
    d.className = "muted small";
    d.textContent = "Aucune kiffance. C’est… tragiquement sérieux.";
    root.appendChild(d);
    return;
  }

  state.kiffances.forEach((k, idx)=>{
    const row = document.createElement("div");
    row.className = "cardRow";

    const left = document.createElement("div");
    left.className = "cardLeft";

    const title = document.createElement("div");
    title.className = "cardTitle";
    title.textContent = k;

    const sub = document.createElement("div");
    sub.className = "cardSub";
    sub.textContent = "Récompense";

    left.appendChild(title);
    left.appendChild(sub);

    const btns = document.createElement("div");
    btns.className = "cardBtns";

    const del = document.createElement("button");
    del.className = "iconBtn";
    del.title = "Supprimer";
    del.textContent = "×";
    del.onclick = ()=>{
      pushUndo("kiffdel");
      state.kiffances.splice(idx,1);
      saveState();
      renderKiffance();
      toast("Kiffance supprimée. Le destin est rude.");
    };

    btns.appendChild(del);
    row.appendChild(left);
    row.appendChild(btns);
    root.appendChild(row);
  });
}

/* ---------- Prefs UI ---------- */
function renderPrefsUI(){
  $("modeSel").value = state.ui.mode;
  $("seasonSel").value = state.ui.season;
  $("fontSel").value = state.ui.font;
  $("intensity").value = String(state.ui.intensity);
}

function bindPrefs(){
  $("modeSel").addEventListener("change", ()=>{
    state.ui.mode = $("modeSel").value;
    saveState();
    applyTheme();
  });
  $("seasonSel").addEventListener("change", ()=>{
    state.ui.season = $("seasonSel").value;
    saveState();
    applyTheme();
  });
  $("fontSel").addEventListener("change", ()=>{
    state.ui.font = $("fontSel").value;
    saveState();
    applyTheme();
  });
  $("intensity").addEventListener("input", ()=>{
    state.ui.intensity = parseFloat($("intensity").value);
    saveState();
    applyTheme();
  });
}

/* ---------- Export / Reset ---------- */
function renderExport(){
  $("exportOut").value = JSON.stringify(state, null, 2);
}

async function copyText(text){
  try{
    await navigator.clipboard.writeText(text);
    toast("JSON copié.");
  }catch(_){
    toast("Impossible de copier (clipboard).");
  }
}

/* ---------- Toast ---------- */
let toastTimer = null;
function toast(msg){
  const el = $("toast");
  el.textContent = msg;
  el.hidden = false;
  if(toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>{ el.hidden = true; }, 3200);
}

/* ---------- Pomodoro (démo) ---------- */
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
    toast("Pomodoro ajusté. Le temps obéit.");
  }
}

/* ---------- Inbox add ---------- */
function inboxAdd(){
  const text = $("inboxText").value || "";
  const parsed = importFromInbox(text);
  if(parsed.length===0) return toast("Rien à ajouter. Même pas un micro-Éthorion.");

  pushUndo("inboxAdd");
  // IMPORTANT : on ajoute sans effacer
  state.tasks.push(...parsed);

  // baseline : si c’est un nouveau run (baseline 0), on la crée
  if(state.baseline.totalTasks<=0){
    state.baseline.totalTasks = activeTasks().length;
  }
  ensureCurrentTask();

  saveState();
  renderAll();
  toast(`Ajout : ${parsed.length} tâche(s).`);
}

function inboxClear(){
  $("inboxText").value = "";
  toast("Champ effacé.");
}

/* ---------- Hub details toggle ---------- */
function toggleTaskMeta(){
  const meta = $("taskMeta");
  meta.hidden = !meta.hidden;
}

/* ---------- Filters bind ---------- */
function bindTaskFilters(){
  $("catFilter").addEventListener("change", renderTasksPanel);
  $("viewFilter").addEventListener("change", renderTasksPanel);
}

/* ---------- Render all ---------- */
function renderAll(){
  applyTheme();
  ensureCurrentTask();
  renderProgress();
  renderHubTask();
  renderTasksPanel();
  renderKiffance();
  renderExport();
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", ()=>{
  // panels
  $("btnLeft").onclick = ()=>openPanel("left");
  $("btnRight").onclick = ()=>openPanel("right");
  $("leftClose").onclick = closePanels;
  $("rightClose").onclick = closePanels;
  $("panelBack").onclick = closePanels;

  bindTabs();

  // inbox
  $("inboxAdd").onclick = inboxAdd;
  $("inboxClear").onclick = inboxClear;

  // tasks actions
  $("roulette").onclick = spinRoulette;
  $("bombBtn").onclick = degommerOne;
  $("undoBtn").onclick = doUndo;

  // hub
  $("taskInfoBtn").onclick = toggleTaskMeta;

  // pomodoro
  $("pomoEdit").onclick = editPomodoro;
  renderPomodoro();

  // prefs
  bindPrefs();
  renderPrefsUI();

  // filters
  bindTaskFilters();

  // export
  $("exportBtn").onclick = ()=>copyText(JSON.stringify(state, null, 2));
  $("wipeBtn").onclick = ()=>{
    if(!confirm("Reset total ? (tout effacer)")) return;
    localStorage.removeItem(LS_KEY);
    state = structuredClone(defaultState);
    saveState();
    renderAll();
    toast("Reset complet. Le monde repart à zéro.");
  };

  // kiffance
  $("kiffAdd").onclick = ()=>{
    const v = ($("kiffNew").value||"").trim();
    if(!v) return;
    pushUndo("kiffAdd");
    state.kiffances.unshift(v);
    $("kiffNew").value = "";
    saveState();
    renderKiffance();
    toast("Kiffance ajoutée.");
  };

  renderAll();
});
