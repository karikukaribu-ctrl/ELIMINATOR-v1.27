// app.js — ELIMINATOR (Étape 2 améliorée)
// Objectifs de cette étape :
// - topbar fixe vitrée
// - panneaux latéraux (au-dessus de la topbar), ouvrables/fermables + backdrop
// - panneaux redimensionnables (drag)
// - thèmes : 4 saisons + noir & blanc, clair/foncé
// - hub : barre de progression épaisse, commence pleine et décroît; % dans la barre (discret)
// - pomodoro centré + modal d’édition (travail/pause, auto, son)
// - roulette centrée + animation visible + texte "Roulette" au centre
// - bouton 💣 "Dégommer un Éthorion" + Undo ↩︎
// - Inbox: "Ajouter" n’efface PAS la liste existante (append)
// - base solide pour continuer modules suivants

const $ = (id)=>document.getElementById(id);
const $$ = (sel, root=document)=>Array.from(root.querySelectorAll(sel));
const clamp = (n,a,b)=>Math.max(a, Math.min(b,n));
const uid = ()=>Math.random().toString(36).slice(2,10)+"_"+Date.now().toString(36);

const LS_KEY = "eliminator_step2_v1";

const SEASONS = ["printemps","ete","automne","hiver","noirblanc"];
const THEMES = {
  printemps:{
    clair:{ bg:"#FBF4E8", fg:"#15120F", muted:"rgba(21,18,15,.62)", card:"rgba(255,255,255,.76)", card2:"rgba(255,255,255,.52)", line:"rgba(21,18,15,.12)",
            accent:"rgba(110,190,150,.22)", accent2:"rgba(110,190,150,.62)", barFill:"rgba(205,120,60,.86)", barEdge:"rgba(255,255,255,.80)" },
    fonce:{ bg:"#101312", fg:"#FAF7F0", muted:"rgba(250,247,240,.72)", card:"rgba(20,22,20,.62)", card2:"rgba(20,22,20,.40)", line:"rgba(250,247,240,.12)",
            accent:"rgba(110,190,150,.16)", accent2:"rgba(110,190,150,.40)", barFill:"rgba(235,170,110,.86)", barEdge:"rgba(255,255,255,.36)" }
  },
  ete:{
    clair:{ bg:"#FFF3DF", fg:"#16120F", muted:"rgba(22,18,15,.62)", card:"rgba(255,255,255,.76)", card2:"rgba(255,255,255,.52)", line:"rgba(22,18,15,.12)",
            accent:"rgba(90,170,210,.20)", accent2:"rgba(90,170,210,.58)", barFill:"rgba(205,120,60,.88)", barEdge:"rgba(255,255,255,.80)" },
    fonce:{ bg:"#0E1217", fg:"#F6FBFF", muted:"rgba(246,251,255,.72)", card:"rgba(18,24,34,.62)", card2:"rgba(18,24,34,.40)", line:"rgba(246,251,255,.12)",
            accent:"rgba(90,170,210,.14)", accent2:"rgba(90,170,210,.36)", barFill:"rgba(235,170,110,.86)", barEdge:"rgba(255,255,255,.36)" }
  },
  automne:{
    clair:{ bg:"#FBF4E8", fg:"#14120F", muted:"rgba(20,18,15,.68)", card:"rgba(255,255,255,.76)", card2:"rgba(255,255,255,.52)", line:"rgba(20,18,15,.12)",
            accent:"rgba(205,120,60,.22)", accent2:"rgba(205,120,60,.64)", barFill:"rgba(205,120,60,.90)", barEdge:"rgba(255,255,255,.80)" },
    fonce:{ bg:"#14110D", fg:"#FFF5E8", muted:"rgba(255,245,232,.70)", card:"rgba(26,20,14,.62)", card2:"rgba(26,20,14,.40)", line:"rgba(255,245,232,.12)",
            accent:"rgba(205,120,60,.16)", accent2:"rgba(205,120,60,.40)", barFill:"rgba(235,170,110,.84)", barEdge:"rgba(255,255,255,.30)" }
  },
  hiver:{
    clair:{ bg:"#F5F7FA", fg:"#141B22", muted:"rgba(20,27,34,.62)", card:"rgba(255,255,255,.76)", card2:"rgba(255,255,255,.52)", line:"rgba(20,27,34,.12)",
            accent:"rgba(120,160,200,.18)", accent2:"rgba(120,160,200,.46)", barFill:"rgba(205,120,60,.86)", barEdge:"rgba(255,255,255,.80)" },
    fonce:{ bg:"#0D1116", fg:"#F2FDFF", muted:"rgba(242,253,255,.72)", card:"rgba(16,22,28,.62)", card2:"rgba(16,22,28,.40)", line:"rgba(242,253,255,.12)",
            accent:"rgba(120,160,200,.12)", accent2:"rgba(120,160,200,.30)", barFill:"rgba(235,170,110,.84)", barEdge:"rgba(255,255,255,.30)" }
  },
  noirblanc:{
    clair:{ bg:"#F7F4EE", fg:"#121212", muted:"rgba(18,18,18,.62)", card:"rgba(255,255,255,.76)", card2:"rgba(255,255,255,.52)", line:"rgba(0,0,0,.12)",
            accent:"rgba(0,0,0,.08)", accent2:"rgba(0,0,0,.18)", barFill:"rgba(40,40,40,.86)", barEdge:"rgba(255,255,255,.80)" },
    fonce:{ bg:"#0F0F10", fg:"#F7F7F7", muted:"rgba(247,247,247,.72)", card:"rgba(22,22,22,.66)", card2:"rgba(22,22,22,.40)", line:"rgba(255,255,255,.12)",
            accent:"rgba(255,255,255,.08)", accent2:"rgba(255,255,255,.18)", barFill:"rgba(255,255,255,.26)", barEdge:"rgba(255,255,255,.26)" }
  }
};

const defaultState = {
  ui:{
    mode:"clair",
    season:"automne",
    leftW: 420,
    rightW: 560,
    contrastBoost: 1.02,
    barH: 44,
    reduceMotion: false,
    uiFont: "quicksand" // quicksand | mplus
  },
  stats:{ tasksDone:0, etorionsDone:0 },
  baseline:{ totalTasks:0 }, // baseline = nombre de tâches actives au moment “où ça commence”
  tasks:[],
  currentTaskId: null,
  undoStack: [],
  kiffances: [
    {id:uid(), text:"Regarde par la fenêtre 30 secondes comme un hibou philosophe."},
    {id:uid(), text:"Étire-toi 45 secondes. Oui, même le cou. Surtout le cou."},
    {id:uid(), text:"Bois un verre d’eau avec le sérieux d’un samouraï hydraté."},
    {id:uid(), text:"Range 5 objets. Pas 6. 5. On est des gens mesurés."},
    {id:uid(), text:"3 respirations lentes. Puis reprends ta conquête."}
  ],
  right:{
    sets: [],
    habits: [], // {id,name, boxes:[bool*7]}
    mood: [],   // simple entries; expert module ensuite
    calendar: [],
    notes: []
  },
  pomodoro:{
    workMin: 25,
    breakMin: 5,
    auto: true,
    sound: true,
    running: false,
    phase: "work",
    endsAt: null,
    paused: false,
    pausedLeftMs: null
  },
  left:{
    tab:"inbox",
    tasksMode:"active",
    catFilter:"__all__"
  },
  rightTab:"sets"
};

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
function saveState(){
  try{ localStorage.setItem(LS_KEY, JSON.stringify(state)); }catch(_){}
}
function deepAssign(t,s){
  for(const k in s){
    if(s[k] && typeof s[k]==="object" && !Array.isArray(s[k]) && t[k]) deepAssign(t[k], s[k]);
    else t[k]=s[k];
  }
}

let state = loadState();

/* ===== Utilities tasks ===== */
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

  let et = 1;
  let title = cleaned;
  const m = cleaned.match(/^(.*?)(?:\s*[-–—]\s*|\s+)(\d+)\s*$/);
  if(m){
    title = m[1].trim();
    et = clamp(parseInt(m[2],10)||1, 1, 99);
  }
  title = title.replace(/\s+/g," ").trim();
  if(!title) return null;
  return { title, etorions: et };
}
function importFromInbox(text){
  const lines = String(text||"").split(/\r?\n/).map(l=>l.trim()).filter(Boolean);
  let cat = "Inbox";
  const out = [];
  for(const line of lines){
    if(isAllCapsLine(line)){ cat = line.trim(); continue; }
    const p = parseTaskLine(line);
    if(!p) continue;
    out.push({
      id: uid(),
      title: p.title,
      cat,
      etorionsTotal: p.etorions,
      etorionsLeft: p.etorions,
      done: false,
      createdAt: Date.now()
    });
  }
  return out;
}
const activeTasks = ()=>state.tasks.filter(t=>!t.done);
const doneTasks = ()=>state.tasks.filter(t=>t.done);
const getTask = (id)=>state.tasks.find(t=>t.id===id)||null;

function ensureBaseline(){
  // baseline = nombre de tâches actives au moment où on a une “campagne”
  if(state.baseline.totalTasks === 0 && activeTasks().length>0){
    state.baseline.totalTasks = activeTasks().length;
  }
}
function ensureCurrentTask(){
  const act = activeTasks();
  if(act.length===0){ state.currentTaskId=null; return; }
  const cur = getTask(state.currentTaskId);
  if(!cur || cur.done){
    // simple : première active
    state.currentTaskId = act.slice().sort((a,b)=>a.createdAt-b.createdAt)[0].id;
  }
}
function progressPct(){
  // La barre commence pleine (100%) et décroît avec les tâches restantes
  const base = state.baseline.totalTasks || 0;
  if(base<=0) return 100;
  const remaining = activeTasks().length;
  const pct = clamp(Math.round((remaining / base) * 100), 0, 100);
  return pct;
}

/* ===== Theme ===== */
function applyTheme(){
  const season = SEASONS.includes(state.ui.season) ? state.ui.season : "automne";
  const mode = state.ui.mode === "fonce" ? "fonce" : "clair";
  const t = THEMES[season][mode];

  const root = document.documentElement.style;
  root.setProperty("--bg", t.bg);
  root.setProperty("--fg", t.fg);
  root.setProperty("--muted", t.muted);
  root.setProperty("--card", t.card);
  root.setProperty("--card2", t.card2);
  root.setProperty("--line", t.line);
  root.setProperty("--accent", t.accent);
  root.setProperty("--accent2", t.accent2);
  root.setProperty("--barFill", t.barFill);
  root.setProperty("--barEdge", t.barEdge);

  root.setProperty("--contrastBoost", String(clamp(state.ui.contrastBoost, 0.92, 1.18)));
  root.setProperty("--barH", `${clamp(state.ui.barH, 22, 64)}px`);
  root.setProperty("--leftW", `${clamp(state.ui.leftW, 320, 980)}px`);
  root.setProperty("--rightW", `${clamp(state.ui.rightW, 320, 980)}px`);

  // UI font switch
  const font = state.ui.uiFont === "mplus" ? `"M PLUS Rounded 1c", system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif`
                                          : `"Quicksand", system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif`;
  root.setProperty("--uiFont", font);

  // Subtle readability tweak in dark mode
  const subtitle = document.querySelector(".brand__subtitle");
  if(subtitle){
    subtitle.style.color = mode==="fonce" ? "rgba(255,255,255,.72)" : "rgba(20,18,15,.70)";
  }
}

/* ===== Panels ===== */
const panelBack = $("panelBack");
const leftPanel = $("leftPanel");
const rightPanel = $("rightPanel");

function openPanel(which){
  if(which==="left"){
    rightPanel.classList.remove("open");
    leftPanel.classList.add("open");
    leftPanel.setAttribute("aria-hidden","false");
    rightPanel.setAttribute("aria-hidden","true");
  }else{
    leftPanel.classList.remove("open");
    rightPanel.classList.add("open");
    rightPanel.setAttribute("aria-hidden","false");
    leftPanel.setAttribute("aria-hidden","true");
  }
  panelBack.classList.add("show");
  document.body.style.overflow = "hidden";
}
function closePanels(){
  leftPanel.classList.remove("open");
  rightPanel.classList.remove("open");
  leftPanel.setAttribute("aria-hidden","true");
  rightPanel.setAttribute("aria-hidden","true");
  panelBack.classList.remove("show");
  document.body.style.overflow = "";
}

/* ===== Resizers (drag width) ===== */
function initResizer(el, which){
  let dragging=false, sx=0, sw=0;

  const down=(clientX)=>{
    dragging=true;
    sx=clientX;
    sw = which==="left" ? state.ui.leftW : state.ui.rightW;
  };
  const move=(clientX)=>{
    if(!dragging) return;
    const dx = clientX - sx;

    if(which==="left") state.ui.leftW = clamp(sw + dx, 320, 980);
    else state.ui.rightW = clamp(sw - dx, 320, 980);

    applyTheme();
  };
  const up=()=>{
    if(!dragging) return;
    dragging=false;
    saveState();
  };

  el.addEventListener("mousedown",(e)=>{ e.preventDefault(); down(e.clientX); });
  window.addEventListener("mousemove",(e)=>move(e.clientX));
  window.addEventListener("mouseup", up);

  el.addEventListener("touchstart",(e)=>{ e.preventDefault(); down(e.touches[0].clientX); }, {passive:false});
  window.addEventListener("touchmove",(e)=>move(e.touches[0].clientX), {passive:true});
  window.addEventListener("touchend", up);
}

/* ===== Tabs ===== */
function setActiveTab(btns, whichPanePrefix, activeKey){
  btns.forEach(b=>{
    b.classList.toggle("active", b.dataset[activeKey] && b.dataset[activeKey] === b.dataset[activeKey]);
  });
}
function showTab(group, id){
  $$(group+" .tabPane").forEach(p=>p.classList.remove("show"));
  const el = $(id);
  if(el) el.classList.add("show");
}

/* ===== Renderers ===== */
function renderProgress(){
  ensureBaseline();
  const pct = progressPct(); // remaining/base * 100
  const fill = $("progressFill");
  const pctEl = $("progressPct");
  if(fill) fill.style.width = `${pct}%`;
  if(pctEl) pctEl.textContent = `${pct}%`;

  const bar = document.querySelector(".progressBar");
  if(bar) bar.setAttribute("aria-valuenow", String(100-pct));
}

function renderCurrent(){
  ensureCurrentTask();
  const t = getTask(state.currentTaskId);
  $("currentTitle").textContent = t ? t.title : "Aucune tâche sélectionnée";
}

function refreshCatFilter(){
  const sel = $("catFilter");
  if(!sel) return;
  const cats = Array.from(new Set(state.tasks.map(t=>t.cat))).sort((a,b)=>a.localeCompare(b));
  const cur = state.left.catFilter || "__all__";

  sel.innerHTML = "";
  const oAll = document.createElement("option");
  oAll.value="__all__"; oAll.textContent="Toutes";
  sel.appendChild(oAll);

  for(const c of cats){
    const o = document.createElement("option");
    o.value=c; o.textContent=c;
    sel.appendChild(o);
  }
  sel.value = cats.includes(cur) ? cur : "__all__";
  state.left.catFilter = sel.value;
}

function renderTaskList(){
  const root = $("taskList");
  if(!root) return;

  const mode = state.left.tasksMode || "active";
  const cat = state.left.catFilter || "__all__";
  let list = [];

  if(mode==="active") list = activeTasks();
  else if(mode==="done") list = doneTasks();
  else list = state.tasks.slice();

  if(cat !== "__all__") list = list.filter(t=>t.cat===cat);
  list.sort((a,b)=>a.createdAt-b.createdAt);

  root.innerHTML = "";
  if(list.length===0){
    const empty = document.createElement("div");
    empty.className="hint";
    empty.textContent = "Rien ici pour l’instant. Va dégainer des tâches dans Inbox.";
    root.appendChild(empty);
    return;
  }

  for(const t of list){
    const row = document.createElement("div");
    row.className="item";
    const left = document.createElement("div");
    const title = document.createElement("div");
    title.className="itemTitle";
    title.textContent = t.title;
    left.appendChild(title);

    const meta = document.createElement("div");
    meta.className="itemMeta";
    // Meta discret : catégorie + Éthorions (pas affiché partout dans le hub)
    meta.textContent = `${t.cat} · ${t.etorionsLeft}/${t.etorionsTotal} Éthorions`;
    left.appendChild(meta);

    const btns = document.createElement("div");
    btns.className="itemBtns";

    const selBtn = document.createElement("button");
    selBtn.className="miniBtn";
    selBtn.textContent="▶︎";
    selBtn.title="Sélectionner";
    selBtn.onclick=()=>{
      state.currentTaskId = t.id;
      saveState();
      renderCurrent();
      closePanels();
    };

    const doneBtn = document.createElement("button");
    doneBtn.className="miniBtn";
    doneBtn.textContent="✓";
    doneBtn.title="Terminer";
    doneBtn.onclick=()=>completeTask(t.id);

    const delBtn = document.createElement("button");
    delBtn.className="miniBtn";
    delBtn.textContent="🗑";
    delBtn.title="Supprimer";
    delBtn.onclick=()=>deleteTask(t.id);

    btns.append(selBtn, doneBtn, delBtn);

    row.append(left, btns);
    root.appendChild(row);
  }
}

function renderKiffances(){
  const root = $("kifList");
  if(!root) return;
  root.innerHTML = "";
  for(const k of state.kiffances){
    const row = document.createElement("div");
    row.className="item";
    const t = document.createElement("div");
    t.className="itemTitle";
    t.textContent = k.text;

    const btns = document.createElement("div");
    btns.className="itemBtns";
    const del = document.createElement("button");
    del.className="miniBtn";
    del.textContent="✕";
    del.title="Supprimer";
    del.onclick=()=>{
      state.kiffances = state.kiffances.filter(x=>x.id!==k.id);
      saveState();
      renderKiffances();
    };
    btns.appendChild(del);

    row.append(t, btns);
    root.appendChild(row);
  }
}

function renderRightSets(){
  const root = $("setList");
  if(!root) return;
  root.innerHTML = "";
  if(state.right.sets.length===0){
    const e = document.createElement("div");
    e.className="hint";
    e.textContent="Aucun set pour l’instant. Crée un set et on lui donnera une vraie vie (mode focus superposé).";
    root.appendChild(e);
    return;
  }
  for(const s of state.right.sets){
    const row = document.createElement("div");
    row.className="item";
    const t = document.createElement("div");
    t.className="itemTitle";
    t.textContent = s.name;

    const btns = document.createElement("div");
    btns.className="itemBtns";
    const del = document.createElement("button");
    del.className="miniBtn";
    del.textContent="🗑";
    del.onclick=()=>{
      state.right.sets = state.right.sets.filter(x=>x.id!==s.id);
      saveState();
      renderRightSets();
    };
    btns.appendChild(del);
    row.append(t, btns);
    root.appendChild(row);
  }
}

function renderHabits(){
  const root = $("habitList");
  if(!root) return;
  root.innerHTML = "";
  if(state.right.habits.length===0){
    const e = document.createElement("div");
    e.className="hint";
    e.textContent="Ajoute une habitude. Cases compactes, ligne par ligne. (Célébration habitudes : prochaine étape.)";
    root.appendChild(e);
    return;
  }

  for(const h of state.right.habits){
    const row = document.createElement("div");
    row.className="habitRow";

    const name = document.createElement("div");
    name.className="habitName";
    name.textContent = h.name;

    const boxes = document.createElement("div");
    boxes.className="habitBoxes";
    for(let i=0;i<7;i++){
      const b = document.createElement("div");
      b.className = "hBox" + (h.boxes[i] ? " on" : "");
      b.title = `Jour ${i+1}`;
      b.onclick=()=>{
        h.boxes[i] = !h.boxes[i];
        saveState();
        renderHabits();
      };
      boxes.appendChild(b);
    }

    const ops = document.createElement("div");
    ops.className="habitOps";
    const del = document.createElement("button");
    del.className="miniBtn";
    del.textContent="🗑";
    del.onclick=()=>{
      state.right.habits = state.right.habits.filter(x=>x.id!==h.id);
      saveState();
      renderHabits();
    };
    ops.appendChild(del);

    row.append(name, boxes, ops);
    root.appendChild(row);
  }
}

function renderCalendar(){
  const root = $("calList");
  if(!root) return;
  root.innerHTML = "";
  if(state.right.calendar.length===0){
    const e = document.createElement("div");
    e.className="hint";
    e.textContent="Ajoute une deadline. La timeline viendra ensuite (en fenêtre).";
    root.appendChild(e);
    return;
  }
  const list = state.right.calendar.slice().sort((a,b)=>(a.date||"").localeCompare(b.date||""));
  for(const it of list){
    const row = document.createElement("div");
    row.className="item";
    const t = document.createElement("div");
    t.className="itemTitle";
    t.textContent = `${it.title}`;

    const meta = document.createElement("div");
    meta.className="itemMeta";
    meta.textContent = it.date || "";

    const btns = document.createElement("div");
    btns.className="itemBtns";
    const del = document.createElement("button");
    del.className="miniBtn";
    del.textContent="🗑";
    del.onclick=()=>{
      state.right.calendar = state.right.calendar.filter(x=>x.id!==it.id);
      saveState();
      renderCalendar();
    };
    btns.appendChild(del);

    row.append(t, meta, btns);
    root.appendChild(row);
  }
}

function renderNotes(){
  const root = $("noteList");
  if(!root) return;
  root.innerHTML = "";
  if(state.right.notes.length===0){
    const e = document.createElement("div");
    e.className="hint";
    e.textContent="Ajoute une note ou un rappel. (Rappels datés / démarrage journée : prochaine étape.)";
    root.appendChild(e);
    return;
  }
  for(const n of state.right.notes){
    const row = document.createElement("div");
    row.className="item";
    const t = document.createElement("div");
    t.className="itemTitle";
    t.textContent = n.title;

    const btns = document.createElement("div");
    btns.className="itemBtns";
    const del = document.createElement("button");
    del.className="miniBtn";
    del.textContent="🗑";
    del.onclick=()=>{
      state.right.notes = state.right.notes.filter(x=>x.id!==n.id);
      saveState();
      renderNotes();
    };
    btns.appendChild(del);

    row.append(t, btns);
    root.appendChild(row);
  }
}

function renderStats(){
  $("statTasksDone").textContent = String(state.stats.tasksDone||0);
  $("statEtorionsDone").textContent = String(state.stats.etorionsDone||0);
}

function renderAll(){
  applyTheme();
  refreshCatFilter();
  renderProgress();
  renderCurrent();
  renderTaskList();
  renderKiffances();
  renderRightSets();
  renderHabits();
  renderCalendar();
  renderNotes();
  renderStats();
  renderPomodoroUI();
}

/* ===== Undo ===== */
function pushUndo(label){
  state.undoStack.unshift({
    label,
    at: Date.now(),
    snapshot: structuredClone({
      tasks: state.tasks,
      baseline: state.baseline,
      currentTaskId: state.currentTaskId,
      stats: state.stats
    })
  });
  state.undoStack = state.undoStack.slice(0,20);
}
function undo(){
  const snap = state.undoStack.shift();
  if(!snap) return;
  state.tasks = snap.snapshot.tasks;
  state.baseline = snap.snapshot.baseline;
  state.currentTaskId = snap.snapshot.currentTaskId;
  state.stats = snap.snapshot.stats;
  saveState();
  renderAll();
}

/* ===== Celebration (full page + auto-hide/click) ===== */
const CELEBRATION_LINES = [
  {minE:1, rank:"GLORIEUX", lines:[
    "Monstre administratif anéanti.",
    "La paperasse vient de perdre un duel.",
    "Tu viens de terrasser un mini-boss du quotidien."
  ]},
  {minE:4, rank:"TRIOMPHAL", lines:[
    "Le chaos est à nouveau terrassé par ta victoire triomphante.",
    "Conquérant : mission accomplie, panache inclus.",
    "Tu viens de faire fuir l’absurde à coups de compétence."
  ]},
  {minE:8, rank:"LÉGENDAIRE", lines:[
    "Glorieux conquistador : la réalité vient de se faire dompter.",
    "Cataclysme vaincu. Tu avances comme une comète bienveillante.",
    "Le monde hésite, toi tu décides. Et ça marche."
  ]}
];

const celebrateEl = $("celebrate");
const fxCanvas = $("fxCanvas");
let fxCtx = null;

function pickCelebration(etorions){
  const tier = CELEBRATION_LINES.slice().sort((a,b)=>a.minE-b.minE).filter(t=>etorions>=t.minE).pop() || CELEBRATION_LINES[0];
  const text = tier.lines[Math.floor(Math.random()*tier.lines.length)];
  return {rank:tier.rank, text};
}

function showCelebration(etorions){
  if(state.ui.reduceMotion) {
    // même sans FX, on affiche la carte
    const {rank,text} = pickCelebration(etorions);
    $("celRank").textContent = rank;
    $("celText").textContent = text;
    celebrateEl.classList.add("show");
    celebrateEl.setAttribute("aria-hidden","false");
    autoHideCelebration();
    return;
  }

  const {rank,text} = pickCelebration(etorions);
  $("celRank").textContent = rank;
  $("celText").textContent = text;

  celebrateEl.classList.add("show");
  celebrateEl.setAttribute("aria-hidden","false");
  startFX(1400, 1.0);
  autoHideCelebration();
}

let celTimer = null;
function autoHideCelebration(){
  if(celTimer) clearTimeout(celTimer);
  celTimer = setTimeout(hideCelebration, 5200);
}
function hideCelebration(){
  celebrateEl.classList.remove("show");
  celebrateEl.setAttribute("aria-hidden","true");
  stopFX();
}

celebrateEl.addEventListener("click", hideCelebration);

/* ===== FX (simple floral burst) ===== */
function setupFX(){
  if(!fxCanvas) return;
  fxCtx = fxCanvas.getContext("2d");
  resizeFX();
  window.addEventListener("resize", resizeFX);
}
function resizeFX(){
  if(!fxCanvas) return;
  const dpr = window.devicePixelRatio||1;
  fxCanvas.width = Math.floor(innerWidth*dpr);
  fxCanvas.height = Math.floor(innerHeight*dpr);
  fxCanvas.style.width = innerWidth+"px";
  fxCanvas.style.height = innerHeight+"px";
  fxCtx.setTransform(dpr,0,0,dpr,0,0);
}
let fxParts = [];
let fxRAF = null;
function startFX(durationMs=1400, intensity=1){
  if(!fxCtx) return;
  fxParts = [];
  const cx = innerWidth/2;
  const cy = innerHeight*0.38;
  const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent2").trim() || "rgba(205,120,60,.64)";
  const bursts = Math.floor(5*intensity);

  for(let b=0;b<bursts;b++){
    const bx = cx + (Math.random()-0.5)*innerWidth*0.36;
    const by = cy + (Math.random()-0.5)*innerHeight*0.20;
    const petals = 52 + Math.floor(Math.random()*26);
    for(let i=0;i<petals;i++){
      const ang = Math.PI*2*(i/petals) + (Math.random()-0.5)*0.20;
      const sp = (3.4+Math.random()*6.0)*intensity;
      fxParts.push({
        x:bx, y:by,
        vx:Math.cos(ang)*sp,
        vy:Math.sin(ang)*sp - (2.4+Math.random()*2.0),
        g:0.14+Math.random()*0.12,
        life: 70+Math.random()*38,
        s: 2.2+Math.random()*3.2,
        rot: Math.random()*Math.PI*2,
        vr:(Math.random()-0.5)*0.22,
        col: accent
      });
    }
  }

  const start = Date.now();
  const loop=()=>{
    fxCtx.clearRect(0,0,innerWidth,innerHeight);
    fxParts = fxParts.filter(p=>p.life>0);
    for(const p of fxParts){
      p.vy += p.g;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life -= 1;

      fxCtx.save();
      fxCtx.translate(p.x,p.y);
      fxCtx.rotate(p.rot);
      fxCtx.globalAlpha = 0.82;
      fxCtx.fillStyle = p.col;
      fxCtx.beginPath();
      fxCtx.ellipse(0,0,p.s*1.2,p.s*0.8, Math.PI/6, 0, Math.PI*2);
      fxCtx.fill();
      fxCtx.restore();
    }
    fxCtx.globalAlpha = 1;

    const elapsed = Date.now()-start;
    if(elapsed < durationMs || fxParts.length){
      fxRAF = requestAnimationFrame(loop);
    }else{
      stopFX();
    }
  };

  stopFX();
  fxRAF = requestAnimationFrame(loop);
}
function stopFX(){
  if(fxRAF) cancelAnimationFrame(fxRAF);
  fxRAF = null;
  if(fxCtx) fxCtx.clearRect(0,0,innerWidth,innerHeight);
}

/* ===== Sound (simple beep) ===== */
let audioCtx = null;
function beep(freq=880, ms=180, vol=0.06){
  if(!state.pomodoro.sound) return;
  try{
    if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.frequency.value = freq;
    o.type = "sine";
    g.gain.value = vol;
    o.connect(g); g.connect(audioCtx.destination);
    o.start();
    setTimeout(()=>o.stop(), ms);
  }catch(_){}
}
function chime(){
  beep(784,140,0.06);
  setTimeout(()=>beep(988,140,0.06), 170);
  setTimeout(()=>beep(1175,200,0.06), 340);
}

/* ===== Actions: complete/delete/degommer ===== */
function completeTask(id){
  const t = getTask(id);
  if(!t || t.done) return;

  pushUndo("complete");
  t.done = true;
  state.stats.tasksDone = (state.stats.tasksDone||0) + 1;
  state.stats.etorionsDone = (state.stats.etorionsDone||0) + (t.etorionsTotal||1);

  // Celebration grade = etorionsTotal
  showCelebration(t.etorionsTotal||1);

  ensureCurrentTask();
  saveState();
  renderAll();

  // Big fiesta quand tout est fini : base (on enrichira l’après-fiesta ensuite)
  if(activeTasks().length===0 && state.baseline.totalTasks>0){
    setTimeout(()=>{
      showCelebration(10);
      $("celText").textContent = "BIG FIESTA : tu as nettoyé la map. Reviens avec une nouvelle quête.";
    }, 650);
  }
}
function deleteTask(id){
  const t = getTask(id);
  if(!t) return;
  pushUndo("delete");
  state.tasks = state.tasks.filter(x=>x.id!==id);

  // recalcul baseline si plus rien ou si baseline incohérente
  if(activeTasks().length===0) state.baseline.totalTasks = 0;
  else state.baseline.totalTasks = Math.max(state.baseline.totalTasks, activeTasks().length);

  ensureCurrentTask();
  saveState();
  renderAll();
}

function degommerOneEtorion(){
  const t = getTask(state.currentTaskId);
  if(!t || t.done) return;

  pushUndo("degomme");
  t.etorionsLeft = clamp((t.etorionsLeft||1) - 1, 0, t.etorionsTotal||1);
  state.stats.etorionsDone = (state.stats.etorionsDone||0) + 1;

  if(t.etorionsLeft<=0){
    completeTask(t.id);
    return;
  }

  // petite mini célébration discrète
  showCelebration(1);

  saveState();
  renderAll();
}

/* ===== Roulette ===== */
function spinRoulette(){
  const btn = $("rouletteBtn");
  const face = $("rouletteFace");
  if(!btn || !face) return;

  if(state.ui.reduceMotion){
    // sans animation, on “tire” directement
    roulettePick();
    return;
  }

  btn.classList.add("spinning");
  const spins = 5 + Math.floor(Math.random()*4);
  const extra = Math.floor(Math.random()*360);
  const deg = spins*360 + extra;
  btn.style.setProperty("--spin", `${deg}deg`);
  // déclenche la transition via CSS
  requestAnimationFrame(()=>face.style.transform = `rotate(${deg}deg)`);

  setTimeout(()=>{
    btn.classList.remove("spinning");
    roulettePick();
  }, 1450);
}

function roulettePick(){
  // étape 2 : tire une tâche OU une kiffance (aléatoire motivant)
  const act = activeTasks();
  const roll = Math.random();
  const pickKif = (state.kiffances.length>0 && roll < 0.22); // ~22% kiffance

  if(pickKif){
    const k = state.kiffances[Math.floor(Math.random()*state.kiffances.length)];
    $("celRank").textContent = "KIFFANCE";
    $("celText").textContent = k.text;
    celebrateEl.classList.add("show");
    celebrateEl.setAttribute("aria-hidden","false");
    autoHideCelebration();
    return;
  }

  if(act.length===0){
    $("celRank").textContent = "VIDE";
    $("celText").textContent = "Aucune tâche. Va recruter des monstres dans Inbox.";
    celebrateEl.classList.add("show");
    celebrateEl.setAttribute("aria-hidden","false");
    autoHideCelebration();
    return;
  }

  const t = act[Math.floor(Math.random()*act.length)];
  state.currentTaskId = t.id;
  saveState();
  renderCurrent();

  $("celRank").textContent = "TIRAGE";
  $("celText").textContent = `Cible verrouillée : ${t.title}`;
  celebrateEl.classList.add("show");
  celebrateEl.setAttribute("aria-hidden","false");
  autoHideCelebration();
}

/* ===== Pomodoro ===== */
function msFromMin(m){ return Math.max(1, Math.floor(m))*60*1000; }
function fmtMMSS(ms){
  const s = Math.max(0, Math.floor(ms/1000));
  const mm = String(Math.floor(s/60)).padStart(2,"0");
  const ss = String(s%60).padStart(2,"0");
  return `${mm}:${ss}`;
}

function pomodoroLeftMs(){
  const p = state.pomodoro;
  if(!p.endsAt){
    return p.phase==="work" ? msFromMin(p.workMin) : msFromMin(p.breakMin);
  }
  const now = Date.now();
  return Math.max(0, p.endsAt - now);
}

function renderPomodoroUI(){
  const p = state.pomodoro;
  const left = p.paused && p.pausedLeftMs!=null ? p.pausedLeftMs : pomodoroLeftMs();
  $("pomoTime").textContent = fmtMMSS(left);
}

function pomoStart(){
  const p = state.pomodoro;
  if(p.running && !p.paused) return;

  p.running = true;
  p.paused = false;

  const left = p.pausedLeftMs!=null ? p.pausedLeftMs : (p.phase==="work" ? msFromMin(p.workMin) : msFromMin(p.breakMin));
  p.endsAt = Date.now() + left;
  p.pausedLeftMs = null;

  saveState();
  renderPomodoroUI();
}
function pomoPause(){
  const p = state.pomodoro;
  if(!p.running) return;
  if(p.paused) return;

  p.paused = true;
  p.pausedLeftMs = pomodoroLeftMs();
  p.endsAt = null;

  saveState();
  renderPomodoroUI();
}
function pomoReset(){
  const p = state.pomodoro;
  p.running = false;
  p.paused = false;
  p.phase = "work";
  p.endsAt = null;
  p.pausedLeftMs = null;
  saveState();
  renderPomodoroUI();
}

function pomoTick(){
  const p = state.pomodoro;
  if(p.running && !p.paused && p.endsAt){
    const left = pomodoroLeftMs();
    if(left<=0){
      // phase ends
      if(p.sound) chime();
      p.phase = (p.phase==="work") ? "break" : "work";
      if(p.auto){
        p.endsAt = Date.now() + (p.phase==="work" ? msFromMin(p.workMin) : msFromMin(p.breakMin));
      }else{
        p.running = false;
        p.endsAt = null;
      }
      saveState();
    }
  }
  renderPomodoroUI();
}

/* ===== Modals ===== */
function openModal(id){
  const m = $(id);
  if(!m) return;
  m.classList.add("show");
  m.setAttribute("aria-hidden","false");
}
function closeModal(id){
  const m = $(id);
  if(!m) return;
  m.classList.remove("show");
  m.setAttribute("aria-hidden","true");
}

/* ===== Mood (base UX with pick modals) ===== */
const EMOTIONS = ["Joie","Sérénité","Tristesse","Colère","Peur","Honte","Culpabilité","Dégoût","Surprise","Frustration","Anxiété"];
const CONTEXTS = ["Travail","Famille","Couple","Santé","Études","Administration","Social","Solitude","Sommeil","Argent"];
const THOUGHTS = [
  "Je vais échouer","Je suis nul·le","Ça ne finira jamais","On me juge",
  "Je dois être parfait·e","C’est trop pour moi","Je n’ai aucun contrôle","Ça va mal tourner"
];
const DISTORTIONS = [
  "Catastrophisme","Lecture de pensée","Tout ou rien","Surgénéralisation",
  "Disqualification du positif","Devoirs rigides","Personnalisation","Filtre négatif"
];

function renderMoodEntries(){
  const root = $("moodEntries");
  if(!root) return;
  root.innerHTML = "";
  if(state.right.mood.length===0){
    const e = document.createElement("div");
    e.className="hint";
    e.textContent="Crée une entrée. Ensuite on enrichit (TCC, besoins, actions, suivi).";
    root.appendChild(e);
    return;
  }
  for(const m of state.right.mood.slice().reverse()){
    const row = document.createElement("div");
    row.className="item";
    const t = document.createElement("div");
    t.className="itemTitle";
    t.textContent = `${m.emotion || "—"} · ${m.context || "—"}`;

    const meta = document.createElement("div");
    meta.className="itemMeta";
    meta.textContent = `${m.distortion || ""}`;

    const btns = document.createElement("div");
    btns.className="itemBtns";
    const del = document.createElement("button");
    del.className="miniBtn";
    del.textContent="🗑";
    del.onclick=()=>{
      state.right.mood = state.right.mood.filter(x=>x.id!==m.id);
      saveState();
      renderMoodEntries();
    };
    btns.appendChild(del);

    row.append(t, meta, btns);
    root.appendChild(row);
  }
}

let pickTarget = null;
function openPicker(title, options, onPick){
  pickTarget = onPick;
  $("pickTitle").textContent = title;
  const body = $("pickBody");
  body.innerHTML = "";
  for(const opt of options){
    const b = document.createElement("button");
    b.className="pickOpt";
    b.textContent = opt;
    b.onclick=()=>{
      if(pickTarget) pickTarget(opt);
      closeModal("pickModal");
    };
    body.appendChild(b);
  }
  openModal("pickModal");
}

/* ===== Export/Import ===== */
function doExport(){
  const box = $("exportBox");
  const payload = JSON.stringify(state, null, 2);
  box.textContent = payload;
}
function doImport(file){
  const fr = new FileReader();
  fr.onload = ()=>{
    try{
      const parsed = JSON.parse(String(fr.result||""));
      const merged = structuredClone(defaultState);
      deepAssign(merged, parsed);
      state = merged;
      saveState();
      renderAll();
      doExport();
    }catch(_){
      $("exportBox").textContent = "Import impossible : JSON invalide.";
    }
  };
  fr.readAsText(file);
}

/* ===== Bind UI ===== */
function bindUI(){
  // Topbar panel buttons
  $("openLeft").onclick = ()=>openPanel("left");
  $("openRight").onclick = ()=>openPanel("right");
  $("closeLeft").onclick = closePanels;
  $("closeRight").onclick = closePanels;
  panelBack.onclick = closePanels;

  // Quick visuals
  $("quickSeason").value = state.ui.season;
  $("quickMode").value = state.ui.mode;
  $("quickSeason").onchange = (e)=>{ state.ui.season = e.target.value; saveState(); applyTheme(); };
  $("quickMode").onchange = (e)=>{ state.ui.mode = e.target.value; saveState(); applyTheme(); };

  // Left tabs
  $$("#leftPanel .tabBtn[data-lefttab]").forEach(b=>{
    b.onclick=()=>{
      $$("#leftPanel .tabBtn").forEach(x=>x.classList.remove("active"));
      b.classList.add("active");
      const tab = b.dataset.lefttab;
      state.left.tab = tab;
      $$("#leftPanel .tabPane").forEach(p=>p.classList.remove("show"));
      $(`left-${tab}`).classList.add("show");
      saveState();
      // refresh when switching to tasks
      if(tab==="tasks"){ refreshCatFilter(); renderTaskList(); }
      if(tab==="kiffance"){ renderKiffances(); }
      if(tab==="data"){ doExport(); }
    };
  });

  // Right tabs
  $$("#rightPanel .tabBtn[data-righttab]").forEach(b=>{
    b.onclick=()=>{
      $$("#rightPanel .tabBtn").forEach(x=>x.classList.remove("active"));
      b.classList.add("active");
      const tab = b.dataset.righttab;
      state.rightTab = tab;
      $$("#rightPanel .tabPane").forEach(p=>p.classList.remove("show"));
      $(`right-${tab}`).classList.add("show");
      saveState();
      if(tab==="mood") renderMoodEntries();
    };
  });

  // Inbox add (APPEND, does NOT erase existing tasks)
  $("btnAddInbox").onclick=()=>{
    const txt = $("inboxText").value;
    const added = importFromInbox(txt);
    if(added.length===0) return;

    pushUndo("addInbox");
    state.tasks.push(...added);

    // baseline rules: if baseline is 0, set it; else keep baseline (campaign) stable
    if(state.baseline.totalTasks===0) state.baseline.totalTasks = activeTasks().length;

    ensureCurrentTask();
    saveState();
    renderAll();
  };

  $("btnClearInbox").onclick=()=>{ $("inboxText").value=""; };

  // Tasks filters
  $("listMode").value = state.left.tasksMode || "active";
  $("listMode").onchange=(e)=>{ state.left.tasksMode=e.target.value; saveState(); renderTaskList(); };
  $("catFilter").onchange=(e)=>{ state.left.catFilter=e.target.value; saveState(); renderTaskList(); };

  // Kiffance add
  $("kifAdd").onclick=()=>{
    const v = $("kifInput").value.trim();
    if(!v) return;
    state.kiffances.unshift({id:uid(), text:v});
    $("kifInput").value="";
    saveState();
    renderKiffances();
  };

  // Pref controls
  $("contrastBoost").value = String(state.ui.contrastBoost);
  $("contrastBoost").oninput=(e)=>{ state.ui.contrastBoost = parseFloat(e.target.value); applyTheme(); };
  $("contrastBoost").onchange=()=>saveState();

  $("barHeight").value = String(state.ui.barH);
  $("barHeight").oninput=(e)=>{ state.ui.barH = parseInt(e.target.value,10); applyTheme(); };
  $("barHeight").onchange=()=>saveState();

  $("reduceMotion").checked = !!state.ui.reduceMotion;
  $("reduceMotion").onchange=(e)=>{ state.ui.reduceMotion = !!e.target.checked; saveState(); };

  $("uiFont").value = state.ui.uiFont;
  $("uiFont").onchange=(e)=>{ state.ui.uiFont = e.target.value; saveState(); applyTheme(); };

  // Export/import
  $("btnExport").onclick=doExport;
  $("btnImport").onclick=()=>$("importFile").click();
  $("importFile").onchange=(e)=>{
    const f = e.target.files && e.target.files[0];
    if(f) doImport(f);
    e.target.value="";
  };

  // Right panel add items
  $("setAdd").onclick=()=>{
    const v = $("setName").value.trim();
    if(!v) return;
    state.right.sets.unshift({id:uid(), name:v});
    $("setName").value="";
    saveState();
    renderRightSets();
  };

  $("habitAdd").onclick=()=>{
    const v = $("habitName").value.trim();
    if(!v) return;
    state.right.habits.unshift({id:uid(), name:v, boxes:[false,false,false,false,false,false,false]});
    $("habitName").value="";
    saveState();
    renderHabits();
  };

  $("calAdd").onclick=()=>{
    const title = $("calTitle").value.trim();
    const date = $("calDate").value;
    if(!title) return;
    state.right.calendar.unshift({id:uid(), title, date});
    $("calTitle").value="";
    saveState();
    renderCalendar();
  };

  $("noteAdd").onclick=()=>{
    const title = $("noteTitle").value.trim();
    if(!title) return;
    state.right.notes.unshift({id:uid(), title});
    $("noteTitle").value="";
    saveState();
    renderNotes();
  };

  // Mood new entry (base)
  $("moodNew").onclick=()=>{
    const entry = {id:uid(), emotion:null, context:null, thought:null, distortion:null};
    state.right.mood.push(entry);
    saveState();
    renderMoodEntries();

    // mini flow : emotion -> context -> thought -> distortion
    openPicker("Émotion", EMOTIONS, (emo)=>{
      entry.emotion = emo;
      saveState();
      openPicker("Contexte", CONTEXTS, (ctx)=>{
        entry.context = ctx;
        saveState();
        openPicker("Pensée automatique", THOUGHTS, (th)=>{
          entry.thought = th;
          saveState();
          openPicker("Distorsion cognitive", DISTORTIONS, (d)=>{
            entry.distortion = d;
            saveState();
            renderMoodEntries();
          });
        });
      });
    });
  };

  // picker close
  $("pickClose").onclick=()=>closeModal("pickModal");
  $("pickBack").onclick=()=>closeModal("pickModal");

  // Pomodoro buttons + modal
  $("pomoStart").onclick = pomoStart;
  $("pomoPause").onclick = pomoPause;
  $("pomoReset").onclick = pomoReset;

  $("pomoEdit").onclick=()=>{
    $("pomoWorkMin").value = String(state.pomodoro.workMin);
    $("pomoBreakMin").value = String(state.pomodoro.breakMin);
    $("pomoAuto").checked = !!state.pomodoro.auto;
    $("pomoSound").checked = !!state.pomodoro.sound;
    openModal("pomoModal");
  };
  $("pomoCancel").onclick=()=>closeModal("pomoModal");
  $("pomoBack").onclick=()=>closeModal("pomoModal");

  $("pomoSave").onclick=()=>{
    state.pomodoro.workMin = clamp(parseInt($("pomoWorkMin").value,10)||25, 1, 180);
    state.pomodoro.breakMin = clamp(parseInt($("pomoBreakMin").value,10)||5, 1, 60);
    state.pomodoro.auto = !!$("pomoAuto").checked;
    state.pomodoro.sound = !!$("pomoSound").checked;
    // reset to apply cleanly
    pomoReset();
    saveState();
    closeModal("pomoModal");
  };

  // Core actions
  $("btnUndo").onclick = undo;
  $("btnBomb").onclick = degommerOneEtorion;
  $("rouletteBtn").onclick = spinRoulette;

  // Resizers
  initResizer($("leftResizer"), "left");
  initResizer($("rightResizer"), "right");

  // Keyboard convenience
  window.addEventListener("keydown",(e)=>{
    if(e.key==="Escape"){
      closePanels();
      hideCelebration();
      closeModal("pomoModal");
      closeModal("pickModal");
    }
  });
}

/* ===== Init ===== */
function init(){
  setupFX();

  // Sync UI defaults
  $("quickSeason").value = state.ui.season;
  $("quickMode").value = state.ui.mode;

  // ensure baseline / current
  ensureCurrentTask();
  ensureBaseline();

  bindUI();
  renderAll();

  // Start ticking
  setInterval(pomoTick, 250);
}

init();
