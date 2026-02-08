/* ============================================================
   state.js — ELIMINATOR
   - Thèmes 5 saisons + mode sombre pastel (pas noir)
   - Mantra/messages sous barre de progression (centré)
   - Kiffance 🎁 dans cette zone, couleur distincte
   - Préférences appliquées immédiatement (police + taille + saison + mode)
   - Roulette animée (rotation fluide)
   - Pomodoro mini : clic = start/pause ; crayon = modal paramètres
============================================================ */

const $ = (id)=>document.getElementById(id);
const $$ = (sel, root=document)=>Array.from(root.querySelectorAll(sel));
const clamp = (n,a,b)=>Math.max(a, Math.min(b,n));
const uid = ()=>Math.random().toString(36).slice(2,10)+"_"+Date.now().toString(36);
const nowISO = ()=>new Date().toISOString();

const LS_KEY = "eliminator_v2_hubmantra";

/* ---------- THEMES (clair + sombre pastel) ---------- */
const THEMES = {
  printemps:{
    clair:{
      bg:"#FBF4E8", fg:"#15120F", muted:"#6A5D53",
      panel:"rgba(255,255,255,.72)", line:"rgba(0,0,0,.10)",
      barEmpty:"rgba(255, 210, 185, .30)", barFill:"rgba(230,132,150,.92)", barEdge:"rgba(255,255,255,.86)",
      accent2:"rgba(230,132,150,.62)",
      mantra:"rgba(56,48,44,.72)", kiff:"rgba(230,132,150,.98)"
    },
    sombre:{
      bg:"#1B2330", fg:"#F6F2EA", muted:"#CFC8BC",
      panel:"rgba(28,35,46,.64)", line:"rgba(255,255,255,.12)",
      barEmpty:"rgba(246,242,234,.10)", barFill:"rgba(230,132,150,.60)", barEdge:"rgba(255,255,255,.18)",
      accent2:"rgba(230,132,150,.40)",
      mantra:"rgba(246,242,234,.78)", kiff:"rgba(255,190,205,.95)"
    }
  },
  ete:{
    clair:{
      bg:"#FFF3DF", fg:"#16120F", muted:"#6C5E52",
      panel:"rgba(255,255,255,.72)", line:"rgba(0,0,0,.10)",
      barEmpty:"rgba(255, 225, 160, .30)", barFill:"rgba(246,170,85,.94)", barEdge:"rgba(255,255,255,.86)",
      accent2:"rgba(246,170,85,.62)",
      mantra:"rgba(56,48,44,.72)", kiff:"rgba(246,170,85,.98)"
    },
    sombre:{
      bg:"#1A2431", fg:"#F6FBFF", muted:"#C8D2DA",
      panel:"rgba(26,38,52,.64)", line:"rgba(255,255,255,.12)",
      barEmpty:"rgba(246,251,255,.10)", barFill:"rgba(246,170,85,.58)", barEdge:"rgba(255,255,255,.18)",
      accent2:"rgba(246,170,85,.38)",
      mantra:"rgba(246,251,255,.78)", kiff:"rgba(255,210,160,.95)"
    }
  },
  automne:{
    clair:{
      bg:"#FBF4E8", fg:"#14120F", muted:"#6A5D53",
      panel:"rgba(255,255,255,.72)", line:"rgba(0,0,0,.10)",
      barEmpty:"rgba(255, 210, 165, .28)", barFill:"rgba(211,138,92,.92)", barEdge:"rgba(255,255,255,.82)",
      accent2:"rgba(205,120,60,.60)",
      mantra:"rgba(56,48,44,.72)", kiff:"rgba(205,120,60,.98)"
    },
    sombre:{
      bg:"#1A1D22", fg:"#FFF5E8", muted:"#D9C9B7",
      panel:"rgba(28,30,36,.64)", line:"rgba(255,255,255,.12)",
      barEmpty:"rgba(255,245,232,.10)", barFill:"rgba(205,120,60,.55)", barEdge:"rgba(255,255,255,.18)",
      accent2:"rgba(205,120,60,.36)",
      mantra:"rgba(255,245,232,.78)", kiff:"rgba(255,200,150,.95)"
    }
  },
  hiver:{
    clair:{
      bg:"#F5F7FA", fg:"#141B22", muted:"#61707E",
      panel:"rgba(255,255,255,.74)", line:"rgba(0,0,0,.10)",
      barEmpty:"rgba(210, 235, 255, .28)", barFill:"rgba(120,160,200,.78)", barEdge:"rgba(255,255,255,.86)",
      accent2:"rgba(120,160,200,.46)",
      mantra:"rgba(40,54,66,.72)", kiff:"rgba(120,160,200,.95)"
    },
    sombre:{
      bg:"#1A2531", fg:"#F2FDFF", muted:"#BFD2D6",
      panel:"rgba(24,36,48,.64)", line:"rgba(255,255,255,.12)",
      barEmpty:"rgba(242,253,255,.10)", barFill:"rgba(120,160,200,.52)", barEdge:"rgba(255,255,255,.18)",
      accent2:"rgba(120,160,200,.30)",
      mantra:"rgba(242,253,255,.78)", kiff:"rgba(175,220,255,.90)"
    }
  },
  noirblanc:{
    clair:{
      bg:"#F7F4EE", fg:"#121212", muted:"#595959",
      panel:"rgba(255,255,255,.74)", line:"rgba(0,0,0,.10)",
      barEmpty:"rgba(0,0,0,.10)", barFill:"rgba(60,60,60,.86)", barEdge:"rgba(255,255,255,.86)",
      accent2:"rgba(0,0,0,.18)",
      mantra:"rgba(30,30,30,.70)", kiff:"rgba(60,60,60,.92)"
    },
    sombre:{
      bg:"#1C1F24", fg:"#F7F7F7", muted:"#CFCFCF",
      panel:"rgba(34,36,40,.64)", line:"rgba(255,255,255,.12)",
      barEmpty:"rgba(255,255,255,.10)", barFill:"rgba(220,220,220,.28)", barEdge:"rgba(255,255,255,.14)",
      accent2:"rgba(255,255,255,.18)",
      mantra:"rgba(247,247,247,.78)", kiff:"rgba(247,247,247,.90)"
    }
  }
};

const SEASONS = ["printemps","ete","automne","hiver","noirblanc"];

/* ---------- STATE ---------- */
const defaultState = {
  ui:{
    mode:"clair",          // clair | sombre
    season:"automne",
    font:"zenmaru",        // zenmaru | yomogi | zenkure | kiwi
    baseSize: 16
  },
  tasks:[],
  baseline:{ totalTasks: 0 },
  currentTaskId: null,
  undo:[],
  kiffances:[
    "🎁 2 minutes : regarde un truc mignon (oui, c’est une prescription).",
    "🎁 60 secondes : étirement de dragon. Rugissement optionnel.",
    "🎁 3 minutes : range 10 objets comme un ninja du tri.",
    "🎁 5 minutes : une mini-illustration (même nulle) sur un coin de papier."
  ],
  pomodoro:{
    workMin:25,
    breakMin:5,
    auto:false,
    running:false,
    phase:"work",       // work | break
    endsAt:null,
    remainingMs:null
  }
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
  }catch(_){ return structuredClone(defaultState); }
}
let state = loadState();
function saveState(){ try{ localStorage.setItem(LS_KEY, JSON.stringify(state)); }catch(_){} }

/* ---------- APPLY THEME ---------- */
function applyTheme(){
  const season = THEMES[state.ui.season] ? state.ui.season : "automne";
  const mode = (state.ui.mode==="sombre") ? "sombre" : "clair";
  const t = THEMES[season][mode];

  document.documentElement.style.setProperty("--bg", t.bg);
  document.documentElement.style.setProperty("--fg", t.fg);
  document.documentElement.style.setProperty("--muted", t.muted);
  document.documentElement.style.setProperty("--panelBg", t.panel);
  document.documentElement.style.setProperty("--line", t.line);
  document.documentElement.style.setProperty("--barEmpty", t.barEmpty);
  document.documentElement.style.setProperty("--barFill", t.barFill);
  document.documentElement.style.setProperty("--barEdge", t.barEdge);
  document.documentElement.style.setProperty("--accent2", t.accent2);
  document.documentElement.style.setProperty("--mantra", t.mantra);
  document.documentElement.style.setProperty("--kiff", t.kiff);
  document.documentElement.style.setProperty("--baseSize", `${clamp(state.ui.baseSize, 14, 19)}px`);

  document.body.dataset.mode = state.ui.mode;
  document.body.dataset.season = season;
  document.body.dataset.font = state.ui.font;

  // topbar labels
  $("modeToggle").textContent = (state.ui.mode==="sombre") ? "Sombre" : "Clair";
  $("seasonCycle").textContent = season.charAt(0).toUpperCase() + season.slice(1);
}

/* ---------- MANTRA / MESSAGES (sous barre) ---------- */
const MANTRAS = [
  "Une quête après l’autre.",
  "Le chaos recule. Pas vite. Mais il recule.",
  "Élégance. Patience. Dégommage.",
  "Tu n’es pas en retard : tu es en narration.",
  "Un Éthorion à la fois. Ça suffit pour faire plier l’univers."
];

let mantraTimer = null;
function setMantra(text, kind="info"){
  const el = $("mantraText");
  if(!el) return;

  // couleur selon type
  if(kind==="kiff") el.style.color = "var(--kiff)";
  else el.style.color = "var(--mantra)";

  // petite transition douce
  el.style.opacity = "0";
  el.style.transform = "translateY(-3px)";
  setTimeout(()=>{
    el.textContent = text;
    el.style.opacity = "1";
    el.style.transform = "translateY(0)";
  }, 220);

  // si c’est un message “flash”, on revient au mantra normal
  if(mantraTimer) clearTimeout(mantraTimer);
  if(kind==="flash"){
    mantraTimer = setTimeout(()=>{
      const fallback = pickMantra();
      setMantra(fallback, "info");
    }, 3800);
  }
}

function pickMantra(){
  return MANTRAS[Math.floor(Math.random()*MANTRAS.length)];
}

/* ---------- PANELS ---------- */
function openPanel(which){
  $("panelBack").classList.add("show");
  document.body.style.overflow = "hidden";
  if(which==="left"){
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

function initResizer(handleId, which){
  const h = $(handleId);
  if(!h) return;
  let dragging=false, sx=0, sw=0;

  const down=(x)=>{
    dragging=true; sx=x;
    sw = (which==="left") ? parseInt(getComputedStyle(document.documentElement).getPropertyValue("--leftW")) : parseInt(getComputedStyle(document.documentElement).getPropertyValue("--rightW"));
    sw = Number.isFinite(sw) ? sw : (which==="left"?360:420);
  };
  const move=(x)=>{
    if(!dragging) return;
    const dx = x - sx;
    if(which==="left"){
      const w = clamp(sw + dx, 320, 980);
      document.documentElement.style.setProperty("--leftW", `${w}px`);
    }else{
      const w = clamp(sw - dx, 320, 980);
      document.documentElement.style.setProperty("--rightW", `${w}px`);
    }
  };
  const up=()=>{
    if(!dragging) return;
    dragging=false;
    // on persiste
    state.ui.leftW = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--leftW"));
    state.ui.rightW = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--rightW"));
    saveState();
  };

  h.addEventListener("mousedown",(e)=>{ e.preventDefault(); down(e.clientX); });
  window.addEventListener("mousemove",(e)=>move(e.clientX));
  window.addEventListener("mouseup", up);

  h.addEventListener("touchstart",(e)=>{ e.preventDefault(); down(e.touches[0].clientX); }, {passive:false});
  window.addEventListener("touchmove",(e)=>move(e.touches[0].clientX), {passive:true});
  window.addEventListener("touchend", up);
}

/* ---------- TABS ---------- */
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

/* ---------- INBOX PARSING ---------- */
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
  et = clamp(Number.isFinite(et)?et:1, 1, 99);

  return { title, etorions: et };
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

/* ---------- TASK HELPERS ---------- */
const activeTasks = ()=>state.tasks.filter(t=>!t.done);
const doneTasks = ()=>state.tasks.filter(t=>t.done);
const getTask = (id)=>state.tasks.find(t=>t.id===id) || null;

function ensureBaseline(){
  if(state.baseline.totalTasks<=0){
    const n = activeTasks().length;
    if(n>0) state.baseline.totalTasks = n;
  }
}
function ensureCurrentTask(){
  const act = activeTasks();
  if(act.length===0){ state.currentTaskId=null; return; }
  const cur = getTask(state.currentTaskId);
  if(!cur || cur.done) state.currentTaskId = act[0].id;
}

/* ---------- PROGRESS (reste%) ---------- */
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

/* ---------- UNDO ---------- */
function pushUndo(label){
  state.undo.unshift({
    label, at: Date.now(),
    payload: structuredClone({
      tasks: state.tasks,
      baseline: state.baseline,
      currentTaskId: state.currentTaskId,
      ui: state.ui,
      kiffances: state.kiffances,
      pomodoro: state.pomodoro
    })
  });
  state.undo = state.undo.slice(0, 25);
  saveState();
}
function doUndo(){
  const snap = state.undo.shift();
  if(!snap){
    setMantra("Rien à annuler. Le passé résiste.", "flash");
    return;
  }
  const p = snap.payload;
  state.tasks = p.tasks;
  state.baseline = p.baseline;
  state.currentTaskId = p.currentTaskId;
  state.ui = p.ui;
  state.kiffances = p.kiffances;
  state.pomodoro = p.pomodoro;
  saveState();
  applyTheme();
  renderAll();
  setMantra("Timeline réécrite. Le destin cligne des yeux.", "flash");
}

/* ---------- ACTIONS ---------- */
function completeTask(id){
  const t = getTask(id);
  if(!t || t.done) return;
  pushUndo("complete");
  t.done = true;
  t.doneAt = nowISO();
  ensureCurrentTask();
  saveState();
  renderAll();
  setMantra("GLORIEUX. Menace neutralisée.", "flash");
}
function degommerOne(){
  const t = getTask(state.currentTaskId);
  if(!t || t.done){
    setMantra("Aucune tâche à D.E. traitée.", "flash");
    return;
  }
  pushUndo("degomme");
  t.etorionsLeft = clamp((t.etorionsLeft||1) - 1, 0, 99);
  if(t.etorionsLeft<=0){
    t.done = true;
    t.doneAt = nowISO();
    ensureCurrentTask();
    setMantra("CHAOS TERRASSÉ. Mission accomplie.", "flash");
  }else{
    setMantra("💣 Éthorion dégommé. Encore un.", "flash");
  }
  saveState();
  renderAll();
}

/* ---------- ROULETTE (animation fluide) ---------- */
let spinning = false;
function easeOutCubic(t){ return 1 - Math.pow(1 - t, 3); }

function spinRoulette(){
  if(spinning) return;
  spinning = true;

  const wheel = $("rouletteWheel");
  if(!wheel){ spinning=false; return; }

  const turns = 4 + Math.random()*3;
  const extra = Math.random()*360;
  const start = performance.now();
  const dur = 1400 + Math.random()*600;

  const cur = wheel._angle || 0;
  const target = cur + turns*360 + extra;

  function frame(now){
    const t = Math.min(1, (now - start)/dur);
    const k = easeOutCubic(t);
    const a = cur + (target - cur)*k;
    wheel.style.transform = `rotate(${a}deg)`;
    wheel._angle = a;

    if(t < 1) requestAnimationFrame(frame);
    else{
      spinning = false;
      onRouletteStop();
    }
  }
  requestAnimationFrame(frame);
}

function onRouletteStop(){
  // tirage : si pas de tâches -> kiffance ; sinon 20% kiffance
  const hasTasks = activeTasks().length>0;
  const doKiff = (!hasTasks) || (Math.random()<0.20);

  if(doKiff){
    const k = state.kiffances[Math.floor(Math.random()*state.kiffances.length)] || "🎁 Respire. Juste… respire.";
    setMantra(`🎁 ${k.replace(/^🎁\s*/,"")}`, "kiff");
    return;
  }

  ensureCurrentTask();
  const t = getTask(state.currentTaskId);
  if(t){
    setMantra(`Tirage : ${t.title}`, "flash");
  }else{
    setMantra("Aucune tâche à D.E. traitée.", "flash");
  }
}

/* ---------- RENDER HUB ---------- */
function renderHub(){
  // meta mini
  const done = doneTasks().length;
  const act = activeTasks().length;
  const base = state.baseline.totalTasks || 0;
  $("hubMiniMeta").textContent = `(${done} finies · ${act}/${base||act||0})`;

  // titre tâche
  ensureCurrentTask();
  const t = getTask(state.currentTaskId);
  $("taskTitle").textContent = t ? t.title : "Aucune tâche sélectionnée";

  // mantra “fallback” (si rien de flash en cours)
  // (on ne force pas si un message flash vient d’être mis)
  // ici on met juste un mantra si zone vide
  if(!$("mantraText").textContent.trim()){
    setMantra(pickMantra(), "info");
  }

  // stats inbox
  $("statActive").textContent = String(act);
  $("statDone").textContent = String(done);
}

/* ---------- TASKS PANEL ---------- */
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
    div.textContent = "Rien ici. Le néant médite.";
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
      selBtn.onclick = ()=>{
        state.currentTaskId = t.id;
        saveState();
        renderAll();
        setMantra(`Sélection : ${t.title}`, "flash");
      };
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
        setMantra("Ressuscitée. Suspect. Efficace.", "flash");
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
      setMantra("Évaporée. Pouf.", "flash");
    };
    btns.appendChild(delBtn);

    row.appendChild(left);
    row.appendChild(btns);
    root.appendChild(row);
  }
}

/* ---------- KIFFANCE ---------- */
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
      setMantra("Kiffance supprimée. Le destin est rude.", "flash");
    };

    btns.appendChild(del);
    row.appendChild(left);
    row.appendChild(btns);
    root.appendChild(row);
  });
}

/* ---------- PREFS (réactif) ---------- */
function renderPrefsUI(){
  $("modeSel").value = state.ui.mode;
  $("seasonSel").value = state.ui.season;
  $("fontSel").value = state.ui.font;
  $("uiScale").value = String(clamp(state.ui.baseSize, 14, 19));
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

/* ---------- EXPORT ---------- */
function renderExport(){
  $("exportOut").value = JSON.stringify(state, null, 2);
}
async function copyText(text){
  try{ await navigator.clipboard.writeText(text); setMantra("JSON copié.", "flash"); }
  catch(_){ setMantra("Impossible de copier (clipboard).", "flash"); }
}

/* ---------- INBOX ADD ---------- */
function inboxAdd(){
  const text = $("inboxText").value || "";
  const parsed = importFromInbox(text);
  if(parsed.length===0){
    setMantra("Rien à ajouter. Le vide te regarde.", "flash");
    return;
  }

  pushUndo("inboxAdd");
  state.tasks.push(...parsed);

  if(state.baseline.totalTasks<=0){
    state.baseline.totalTasks = activeTasks().length;
  }
  ensureCurrentTask();

  saveState();
  renderAll();
  setMantra(`Ajout : ${parsed.length} tâche(s).`, "flash");
}
function inboxClear(){
  $("inboxText").value = "";
  setMantra("Champ effacé.", "flash");
}

/* ---------- TOPBAR TOGGLES (sans dropdown) ---------- */
function cycleSeason(){
  const i = SEASONS.indexOf(state.ui.season);
  const next = SEASONS[(i<0?0:i+1) % SEASONS.length];
  state.ui.season = next;
  saveState();
  applyTheme();
  setMantra(`Saison : ${next}`, "flash");
}
function toggleMode(){
  state.ui.mode = (state.ui.mode==="sombre") ? "clair" : "sombre";
  saveState();
  applyTheme();
  setMantra(`Mode : ${state.ui.mode}`, "flash");
}

/* ---------- POMODORO MINI ---------- */
let pomoTick = null;

function pomoTotalMs(){
  const mins = (state.pomodoro.phase==="work") ? state.pomodoro.workMin : state.pomodoro.breakMin;
  return clamp(mins,1,180) * 60 * 1000;
}
function fmtMMSS(ms){
  const s = Math.max(0, Math.floor(ms/1000));
  const m = String(Math.floor(s/60)).padStart(2,"0");
  const r = String(s%60).padStart(2,"0");
  return `${m}:${r}`;
}

function renderPomodoro(){
  const ms = state.pomodoro.running
    ? Math.max(0, (state.pomodoro.endsAt||Date.now()) - Date.now())
    : (state.pomodoro.remainingMs ?? pomoTotalMs());

  $("pomoMiniTime").textContent = fmtMMSS(ms);
  $("pomoMini").classList.toggle("running", !!state.pomodoro.running);
}

function pomoStart(){
  if(state.pomodoro.running) return;
  const ms = state.pomodoro.remainingMs ?? pomoTotalMs();
  state.pomodoro.endsAt = Date.now() + ms;
  state.pomodoro.running = true;
  saveState();
  renderPomodoro();

  if(pomoTick) clearInterval(pomoTick);
  pomoTick = setInterval(()=>{
    const left = Math.max(0, state.pomodoro.endsAt - Date.now());
    if(left<=0){
      clearInterval(pomoTick); pomoTick=null;
      state.pomodoro.running = false;
      state.pomodoro.remainingMs = null;

      // fin phase -> switch
      if(state.pomodoro.phase==="work"){
        state.pomodoro.phase = "break";
        setMantra("Pomodoro fini. Pause. Respire. 🫖", "flash");
      }else{
        state.pomodoro.phase = "work";
        setMantra("Pause terminée. Retour en quête.", "flash");
      }

      if(state.pomodoro.auto){
        // auto start next phase
        state.pomodoro.remainingMs = null;
        saveState();
        renderPomodoro();
        setTimeout(()=>pomoStart(), 350);
      }else{
        saveState();
        renderPomodoro();
      }
      return;
    }
    renderPomodoro();
  }, 250);
}

function pomoPause(){
  if(!state.pomodoro.running) return;
  const left = Math.max(0, state.pomodoro.endsAt - Date.now());
  state.pomodoro.running = false;
  state.pomodoro.endsAt = null;
  state.pomodoro.remainingMs = left;
  saveState();
  renderPomodoro();
  if(pomoTick){ clearInterval(pomoTick); pomoTick=null; }
}

function pomoToggle(){
  if(state.pomodoro.running) pomoPause();
  else pomoStart();
}

/* Modal pomodoro */
function openModal(){
  $("modalBack").classList.add("show");
  $("pomoModal").classList.add("show");
}
function closeModal(){
  $("modalBack").classList.remove("show");
  $("pomoModal").classList.remove("show");
}

function syncPomoModal(){
  $("pWork").value = String(state.pomodoro.workMin);
  $("pBreak").value = String(state.pomodoro.breakMin);
  $("pAuto").checked = !!state.pomodoro.auto;
}

function applyPomoModal(){
  const w = clamp(parseInt($("pWork").value,10) || 25, 5, 90);
  const b = clamp(parseInt($("pBreak").value,10) || 5, 1, 30);
  state.pomodoro.workMin = w;
  state.pomodoro.breakMin = b;
  state.pomodoro.auto = !!$("pAuto").checked;

  // reset phase timer (sans être violent)
  state.pomodoro.running = false;
  state.pomodoro.endsAt = null;
  state.pomodoro.remainingMs = null;

  saveState();
  renderPomodoro();
  applyTheme();
  closeModal();
  setMantra("Pomodoro ajusté. Le temps obéit.", "flash");
}

function resetPomo(){
  state.pomodoro.phase = "work";
  state.pomodoro.running = false;
  state.pomodoro.endsAt = null;
  state.pomodoro.remainingMs = null;
  saveState();
  renderPomodoro();
  setMantra("Pomodoro remis à zéro.", "flash");
}

/* ---------- FILTERS ---------- */
function bindTaskFilters(){
  $("catFilter").addEventListener("change", renderTasksPanel);
  $("viewFilter").addEventListener("change", renderTasksPanel);
}

/* ---------- RENDER ALL ---------- */
function renderAll(){
  applyTheme();
  ensureCurrentTask();
  renderProgress();
  renderHub();
  renderTasksPanel();
  renderKiffance();
  renderExport();
  renderPomodoro();

  // si aucune tâche, mantra “no task” sans spam
  if(activeTasks().length===0){
    setMantra("Aucune tâche à D.E. traitée.", "info");
  }
}

/* ---------- INIT ---------- */
document.addEventListener("DOMContentLoaded", ()=>{
  // panels
  $("btnLeft").onclick = ()=>openPanel("left");
  $("btnRight").onclick = ()=>openPanel("right");
  $("leftClose").onclick = closePanels;
  $("rightClose").onclick = closePanels;
  $("panelBack").onclick = closePanels;

  initResizer("leftResizer","left");
  initResizer("rightResizer","right");

  // topbar toggles
  $("modeToggle").onclick = toggleMode;
  $("seasonCycle").onclick = cycleSeason;

  // focus/counters (placeholder)
  let focus = false;
  $("focusBtn").onclick = ()=>{
    focus=!focus;
    document.body.classList.toggle("focusMode", focus);
    $("focusBtn").classList.toggle("active", focus);
  };
  let counters = true;
  $("countersBtn").onclick = ()=>{
    counters=!counters;
    document.body.classList.toggle("hideCounters", !counters);
    $("countersBtn").classList.toggle("active", counters);
  };

  // tabs
  bindTabs();

  // inbox
  $("inboxAdd").onclick = inboxAdd;
  $("inboxClear").onclick = inboxClear;

  // actions hub
  $("rouletteBtn").onclick = spinRoulette;
  $("bombBtn").onclick = degommerOne;
  $("undoBtn").onclick = doUndo;

  // kiffance add
  $("kiffAdd").onclick = ()=>{
    const v = ($("kiffNew").value||"").trim();
    if(!v) return;
    pushUndo("kiffAdd");
    state.kiffances.unshift(v.startsWith("🎁") ? v : `🎁 ${v}`);
    $("kiffNew").value = "";
    saveState();
    renderKiffance();
    setMantra("🎁 Kiffance ajoutée.", "kiff");
  };

  // prefs
  bindPrefs();
  renderPrefsUI();

  // filters
  bindTaskFilters();

  // export / wipe
  $("exportBtn").onclick = ()=>copyText(JSON.stringify(state, null, 2));
  $("wipeBtn").onclick = ()=>{
    if(!confirm("Reset total ? (tout effacer)")) return;
    localStorage.removeItem(LS_KEY);
    state = structuredClone(defaultState);
    saveState();
    renderAll();
    setMantra("Reset complet. Nouveau cycle cosmique.", "flash");
  };

  // pomodoro
  $("pomoMini").onclick = pomoToggle;
  $("pomoEdit").onclick = ()=>{
    syncPomoModal();
    openModal();
  };
  $("modalBack").onclick = closeModal;
  $("pomoModalClose").onclick = closeModal;
  $("pApply").onclick = applyPomoModal;
  $("pReset").onclick = resetPomo;

  // quick words (placeholder)
  $("openNotes").onclick = ()=>setMantra("Notes : (module suivant) — bientôt, cerveau de velours.", "flash");
  $("openTyphonse").onclick = ()=>setMantra("Typhonse : (module suivant) — la tempête arrive.", "flash");
  $("openKiffance").onclick = ()=>setMantra("🎁 Kiffance : tente la roulette pour une surprise.", "kiff");
  $("openStats").onclick = ()=>setMantra("Stats : (module suivant) — la vérité en graphiques.", "flash");

  // mantra initial + refresh périodique (pas envahissant)
  setMantra(pickMantra(), "info");
  setInterval(()=>setMantra(pickMantra(), "info"), 52000);

  renderAll();
});
```0
