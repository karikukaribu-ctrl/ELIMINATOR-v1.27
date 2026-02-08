/* ============================================================
   ELIMINATOR — Étape 2 (patch panels + UI)
   Fix majeur : on NE scale plus le body (ça casse fixed/overlays).
   - panels fiables
   - barre progression plus chaude
   - titres plus gras
   - roulette label centré + animation moins chelou
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
    clair:{ bg:"#FBF4E8", fg:"#15120F", muted:"#6A5D53", barFill:"#D38A5C", panel:"rgba(255,255,255,.70)", line:"rgba(0,0,0,.10)", empty:"rgba(255, 215, 175, .28)" },
    fonce:{ bg:"#121413", fg:"#FAF7F0", muted:"#CFC8BC", barFill:"#D7B08E", panel:"rgba(22,22,22,.62)", line:"rgba(255,255,255,.12)", empty:"rgba(255,255,255,.10)" }
  },
  ete:{
    clair:{ bg:"#FFF3DF", fg:"#16120F", muted:"#6C5E52", barFill:"#D38A5C", panel:"rgba(255,255,255,.70)", line:"rgba(0,0,0,.10)", empty:"rgba(255, 215, 175, .28)" },
    fonce:{ bg:"#0E1217", fg:"#F6FBFF", muted:"#C8D2DA", barFill:"#D7B08E", panel:"rgba(18,24,34,.62)", line:"rgba(255,255,255,.12)", empty:"rgba(255,255,255,.10)" }
  },
  automne:{
    clair:{ bg:"#FBF4E8", fg:"#14120F", muted:"#6A5D53", barFill:"#D38A5C", panel:"rgba(255,255,255,.70)", line:"rgba(0,0,0,.10)", empty:"rgba(255, 210, 165, .28)" },
    fonce:{ bg:"#14110D", fg:"#FFF5E8", muted:"#D9C9B7", barFill:"#D7B08E", panel:"rgba(26,20,14,.62)", line:"rgba(255,255,255,.12)", empty:"rgba(255,255,255,.10)" }
  },
  hiver:{
    clair:{ bg:"#F5F7FA", fg:"#141B22", muted:"#61707E", barFill:"#78A0C8", panel:"rgba(255,255,255,.74)", line:"rgba(0,0,0,.10)", empty:"rgba(210, 235, 255, .28)" },
    fonce:{ bg:"#0D1116", fg:"#F2FDFF", muted:"#BFD2D6", barFill:"#9DB8D5", panel:"rgba(16,22,28,.62)", line:"rgba(255,255,255,.12)", empty:"rgba(255,255,255,.10)" }
  },
  noirblanc:{
    clair:{ bg:"#F7F4EE", fg:"#121212", muted:"#595959", barFill:"#444444", panel:"rgba(255,255,255,.74)", line:"rgba(0,0,0,.10)", empty:"rgba(0,0,0,.10)" },
    fonce:{ bg:"#0F0F10", fg:"#F7F7F7", muted:"#CFCFCF", barFill:"#BBBBBB", panel:"rgba(22,22,22,.66)", line:"rgba(255,255,255,.12)", empty:"rgba(255,255,255,.10)" }
  }
};

const defaultState = {
  ui:{
    mode:"clair",
    season:"automne",
    font:"yomogi",
    baseSize: 16
  },
  baseline:{ totalTasks: 0 },
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
function saveState(){ try{ localStorage.setItem(LS_KEY, JSON.stringify(state)); }catch(_){} }

/* ---------- Theme ---------- */
function applyTheme(){
  const season = (state.ui.season in THEMES) ? state.ui.season : "automne";
  const mode = state.ui.mode === "fonce" ? "fonce" : "clair";
  const t = THEMES[season][mode];

  document.documentElement.style.setProperty("--bg", t.bg);
  document.documentElement.style.setProperty("--fg", t.fg);
  document.documentElement.style.setProperty("--muted", t.muted);
  document.documentElement.style.setProperty("--barFill", t.barFill);
  document.documentElement.style.setProperty("--barEmpty", t.empty);
  document.documentElement.style.setProperty("--panelBg", t.panel);
  document.documentElement.style.setProperty("--line", t.line);

  document.documentElement.style.setProperty("--baseSize", `${clamp(state.ui.baseSize, 14, 18)}px`);

  document.body.setAttribute("data-font", state.ui.font);
}

/* ---------- Panels (robustes) ---------- */
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
function initPanelResizers(){
  const left = document.getElementById("leftResizer");
  const right = document.getElementById("rightResizer");
  if(left) initResizer("leftResizer","left");
  if(right) initResizer("rightResizer","right");
}

// Appelle-le après le DOM ready
document.addEventListener("DOMContentLoaded", initPanelResizers);

let focusMode = false;
let showCounters = true;

document.getElementById("focusBtn")?.addEventListener("click", ()=>{
  focusMode = !focusMode;
  document.body.classList.toggle("focusMode", focusMode);
  document.getElementById("focusBtn").classList.toggle("active", focusMode);
});

document.getElementById("countersBtn")?.addEventListener("click", ()=>{
  showCounters = !showCounters;
  document.body.classList.toggle("hideCounters", !showCounters);
  document.getElementById("countersBtn").classList.toggle("active", showCounters);
});
/* ---------- Tabs ---------- */
function bindTabs(){
  $$(".panel-left .tabBtn").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      $$(".panel-left .tabBtn").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      const key = btn.dataset.lefttab;
      $$("#leftPanel .tabPage").forEach(p=>p.classList.remove("show"));
      $("left-"+key).classList.add("show");
      if(key==="tasks") renderTasksPanel();
      if(key==="kiffance") renderKiffance();
      if(key==="prefs") renderPrefsUI();
      if(key==="export") renderExport();
    });
  });

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
  if(state.baseline.totalTasks <= 0){
    const n = activeTasks().length;
    if(n>0) state.baseline.totalTasks = n;
  }
}
function ensureCurrentTask(){
  const act = activeTasks();
  if(act.length===0){ state.currentTaskId = null; return; }
  const cur = getTask(state.currentTaskId);
  if(!cur || cur.done) state.currentTaskId = act[0].id;
}

/* ---------- Progress = reste% ---------- */
function computeRemainingPct(){
  ensureBaseline();
  const base = state.baseline.totalTasks || 0;
  const rem = activeTasks().length;
  if(base<=0) return 100;
  return clamp(Math.round((rem/base)*100), 0, 100);
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
  if(!snap) return toast("Rien à annuler. Le passé résiste.");
  const p = snap.payload;
  state.tasks = p.tasks;
  state.baseline = p.baseline;
  state.currentTaskId = p.currentTaskId;
  state.kiffances = p.kiffances;
  state.ui = p.ui;
  saveState();
  applyTheme();
  renderAll();
  toast("Retour : timeline réécrite.");
}

/* ---------- Actions ---------- */
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
  if(!t || t.done) return toast("Aucune tâche à dég… euh… traiter.");
  pushUndo("degomme");
  t.etorionsLeft = clamp((t.etorionsLeft||1) - 1, 0, 99);
  if(t.etorionsLeft <= 0){
    t.done = true;
    t.doneAt = nowISO();
    toast("CHAOS TERRASSÉ. Mission accomplie.");
    ensureCurrentTask();
  }else{
    toast("💣 Éthorion dégommé. Encore un.");
  }
  saveState();
  renderAll();
}

/* ---------- Roulette animation plus clean ---------- */
let spinning = false;

function easeOutCubic(t){ return 1 - Math.pow(1 - t, 3); }

function spinRoulette(){
  if(spinning) return;
  spinning = true;

  const wheel = document.getElementById("rouletteWheel");
  if(!wheel){ spinning=false; return; }

  // Spin visible : 4 à 7 tours + arrêt
  const turns = 4 + Math.random()*3;
  const extraDeg = (Math.random()*360);
  const start = performance.now();
  const dur = 1400 + Math.random()*600;

  // angle actuel (si déjà tourné)
  const cur = wheel._angle || 0;
  const target = cur + turns*360 + extraDeg;

  function frame(now){
    const t = Math.min(1, (now - start)/dur);
    const k = easeOutCubic(t);
    const a = cur + (target - cur)*k;
    wheel.style.transform = `rotate(${a}deg)`;
    wheel._angle = a;

    if(t < 1) requestAnimationFrame(frame);
    else{
      spinning = false;
      // Ici tu déclenches ton tirage (tâche/kiffance)
      if(typeof onRouletteStop === "function") onRouletteStop();
    }
  }
  requestAnimationFrame(frame);
}

document.getElementById("rouletteBtn")?.addEventListener("click", spinRoulette);

/* ---------- Tasks panel ---------- */
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
    sub.textContent = `${t.cat||"Inbox"} · ${t.etorionsLeft}/${t.etorionsTotal} Éthorions${t.done ? " · Fini" : ""}`;

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
      restore.title = "Restaurer";
      restore.textContent = "↩";
      restore.onclick = ()=>{
        pushUndo("restore");
        t.done = false;
        t.doneAt = null;
        ensureCurrentTask();
        saveState();
        renderAll();
        toast("Ressuscitée. Pratique. Suspect. Efficace.");
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
    d.textContent = "Aucune kiffance. C’est tragiquement sérieux.";
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

/* ---------- Prefs ---------- */
function renderPrefsUI(){
  $("modeSel").value = state.ui.mode;
  $("seasonSel").value = state.ui.season;
  $("fontSel").value = state.ui.font;
  $("uiScale").value = String(clamp(state.ui.baseSize, 14, 18));
}
function bindPrefs(){
  $("modeSel").addEventListener("change", ()=>{
    state.ui.mode = $("modeSel").value;
    saveState(); applyTheme();
  });
  $("seasonSel").addEventListener("change", ()=>{
    state.ui.season = $("seasonSel").value;
    saveState(); applyTheme();
  });
  $("fontSel").addEventListener("change", ()=>{
    state.ui.font = $("fontSel").value;
    saveState(); applyTheme();
  });
  $("uiScale").addEventListener("input", ()=>{
    state.ui.baseSize = parseInt($("uiScale").value, 10);
    saveState(); applyTheme();
  });
}

/* ---------- Export ---------- */
function renderExport(){
  $("exportOut").value = JSON.stringify(state, null, 2);
}
async function copyText(text){
  try{ await navigator.clipboard.writeText(text); toast("JSON copié."); }
  catch(_){ toast("Impossible de copier (clipboard)."); }
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
  if(parsed.length===0) return toast("Rien à ajouter.");

  pushUndo("inboxAdd");
  state.tasks.push(...parsed);

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

/* ---------- Hub details ---------- */
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
  $("btnLeft").onclick = ()=>openPanel("left");
  $("btnRight").onclick = ()=>openPanel("right");
  $("leftClose").onclick = closePanels;
  $("rightClose").onclick = closePanels;
  $("panelBack").onclick = closePanels;

  bindTabs();

  $("inboxAdd").onclick = inboxAdd;
  $("inboxClear").onclick = inboxClear;

  $("roulette").onclick = spinRoulette;
  $("bombBtn").onclick = degommerOne;
  $("undoBtn").onclick = doUndo;

  $("taskInfoBtn").onclick = toggleTaskMeta;

  $("pomoEdit").onclick = editPomodoro;
  renderPomodoro();

  bindPrefs();
  renderPrefsUI();

  bindTaskFilters();

  $("exportBtn").onclick = ()=>copyText(JSON.stringify(state, null, 2));
  $("wipeBtn").onclick = ()=>{
    if(!confirm("Reset total ? (tout effacer)")) return;
    localStorage.removeItem(LS_KEY);
    state = structuredClone(defaultState);
    saveState();
    renderAll();
    toast("Reset complet. Le monde repart à zéro.");
  };

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
