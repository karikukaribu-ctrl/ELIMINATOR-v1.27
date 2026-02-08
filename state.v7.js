/* ===== state.v7.js ===== */
const $ = (id)=>document.getElementById(id);
const $$ = (sel, root=document)=>Array.from(root.querySelectorAll(sel));
const clamp = (n,a,b)=>Math.max(a, Math.min(b,n));
const uid = ()=>Math.random().toString(36).slice(2,10)+"_"+Date.now().toString(36);
const nowISO = ()=>new Date().toISOString();

const LS_KEY = "eliminator_v7";
const SEASONS = ["printemps","ete","automne","hiver","noirblanc"];

const seasonLabel = (s)=>{
  const map = { printemps:"Printemps", ete:"Été", automne:"Automne", hiver:"Hiver", noirblanc:"Noir & blanc" };
  return map[s] || "Automne";
};

const SUBLINES = [
  "Une quête après l’autre.",
  "Le chaos recule, toi tu avances.",
  "Mission : calmer le bazar. Avec panache.",
  "Le destin a peur de ta to-do.",
  "Tes Éthorions n’ont qu’à bien se tenir."
];
const pickSubline = ()=>SUBLINES[Math.floor(Math.random()*SUBLINES.length)];

function svgUrl(svg){
  const enc = encodeURIComponent(svg).replace(/'/g,"%27").replace(/"/g,"%22");
  return `url("data:image/svg+xml,${enc}")`;
}
const DOODLES = {
  printemps: svgUrl(`<svg xmlns="http://www.w3.org/2000/svg" width="520" height="520" viewBox="0 0 520 520"><g fill="none" stroke="rgba(255,120,170,0.55)" stroke-width="2" stroke-linecap="round"><path d="M90 120c30-30 65-30 95 0-30 30-65 30-95 0z"/><path d="M360 110c28-22 60-22 88 0-28 22-60 22-88 0z"/></g><g fill="none" stroke="rgba(120,207,168,0.50)" stroke-width="2" stroke-linecap="round"><path d="M120 360c28-26 58-26 86 0-28 26-58 26-86 0z"/><path d="M330 360c22-34 44-48 70-52-6 26-26 48-70 52z"/></g></svg>`),
  ete: svgUrl(`<svg xmlns="http://www.w3.org/2000/svg" width="520" height="520" viewBox="0 0 520 520"><g fill="none" stroke="rgba(242,178,75,0.55)" stroke-width="2" stroke-linecap="round"><circle cx="120" cy="120" r="22"/><path d="M120 86v-18M120 172v18M86 120H68M172 120h18"/></g><g fill="none" stroke="rgba(90,190,200,0.45)" stroke-width="2" stroke-linecap="round"><path d="M300 120c30-20 62-20 92 0-30 20-62 20-92 0z"/><path d="M90 360c40 20 80 20 120 0"/></g></svg>`),
  automne: svgUrl(`<svg xmlns="http://www.w3.org/2000/svg" width="520" height="520" viewBox="0 0 520 520"><g fill="none" stroke="rgba(211,138,92,0.55)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M110 140c40-20 70-10 90 10-20 30-60 40-90 10z"/><path d="M360 140c40-20 70-10 90 10-20 30-60 40-90 10z"/></g><g fill="none" stroke="rgba(140,110,85,0.45)" stroke-width="2" stroke-linecap="round"><path d="M120 360c26-22 54-22 80 0-26 22-54 22-80 0z"/><path d="M320 380c26-22 54-22 80 0-26 22-54 22-80 0z"/></g></svg>`),
  hiver: svgUrl(`<svg xmlns="http://www.w3.org/2000/svg" width="520" height="520" viewBox="0 0 520 520"><g fill="none" stroke="rgba(120,160,200,0.55)" stroke-width="2" stroke-linecap="round"><path d="M120 120l22 22M142 120l-22 22M120 98v44M98 120h44"/><path d="M360 140l26 26M386 140l-26 26M360 112v56M332 140h56"/></g></svg>`),
  noirblanc: svgUrl(`<svg xmlns="http://www.w3.org/2000/svg" width="520" height="520" viewBox="0 0 520 520"><g fill="none" stroke="rgba(0,0,0,0.35)" stroke-width="2" stroke-linecap="round"><path d="M110 140c40-20 70-10 90 10-20 30-60 40-90 10z"/><path d="M360 140c40-20 70-10 90 10-20 30-60 40-90 10z"/></g></svg>`)
};

const THEMES = {
  printemps:{
    clair:{ bg:"#F9F7EC", fg:"#15120F", muted:"#5E5A54", barFill:"#7CCFA8", barEmpty:"rgba(124,207,168,.16)", barEdge:"rgba(255,255,255,.86)", accent:"rgba(255,162,190,.14)", accent2:"rgba(124,207,168,.30)", panel:"rgba(255,255,255,.72)", line:"rgba(0,0,0,.10)", glass:"rgba(255,255,255,.60)", glass2:"rgba(255,255,255,.42)", decoA:"rgba(255,162,190,.14)", decoB:"rgba(255,220,140,.10)" },
    sombre:{ bg:"#2A3A3A", fg:"#F6F2EA", muted:"#DAD2C6", barFill:"#8FE3BC", barEmpty:"rgba(143,227,188,.12)", barEdge:"rgba(255,255,255,.20)", accent:"rgba(255,170,200,.10)", accent2:"rgba(143,227,188,.20)", panel:"rgba(54,86,82,.56)", line:"rgba(255,255,255,.14)", glass:"rgba(56,86,82,.40)", glass2:"rgba(72,110,104,.24)", decoA:"rgba(255,170,200,.08)", decoB:"rgba(255,235,180,.06)" }
  },
  ete:{
    clair:{ bg:"#FFF6DF", fg:"#16120F", muted:"#6C5E52", barFill:"#F2B24B", barEmpty:"rgba(242,178,75,.16)", barEdge:"rgba(255,255,255,.88)", accent:"rgba(90,190,200,.12)", accent2:"rgba(242,178,75,.28)", panel:"rgba(255,255,255,.70)", line:"rgba(0,0,0,.10)", glass:"rgba(255,255,255,.60)", glass2:"rgba(255,255,255,.42)", decoA:"rgba(242,178,75,.14)", decoB:"rgba(90,190,200,.10)" },
    sombre:{ bg:"#263748", fg:"#F0FAFF", muted:"#D6E2EA", barFill:"#FFD07A", barEmpty:"rgba(255,208,122,.12)", barEdge:"rgba(255,255,255,.20)", accent:"rgba(255,208,122,.10)", accent2:"rgba(134,210,220,.18)", panel:"rgba(54,86,108,.56)", line:"rgba(255,255,255,.14)", glass:"rgba(54,86,108,.38)", glass2:"rgba(72,110,136,.24)", decoA:"rgba(255,208,122,.08)", decoB:"rgba(134,210,220,.08)" }
  },
  automne:{
    clair:{ bg:"#FBF4E8", fg:"#14120F", muted:"#6A5D53", barFill:"#D38A5C", barEmpty:"rgba(211,138,92,.18)", barEdge:"rgba(255,255,255,.85)", accent:"rgba(211,138,92,.18)", accent2:"rgba(211,138,92,.36)", panel:"rgba(255,255,255,.70)", line:"rgba(0,0,0,.10)", glass:"rgba(255,255,255,.58)", glass2:"rgba(255,255,255,.40)", decoA:"rgba(211,138,92,.12)", decoB:"rgba(255,210,160,.12)" },
    sombre:{ bg:"#2E3A33", fg:"#FFF3E6", muted:"#E3D3C4", barFill:"#E0A77D", barEmpty:"rgba(224,167,125,.12)", barEdge:"rgba(255,255,255,.20)", accent:"rgba(224,167,125,.12)", accent2:"rgba(224,167,125,.22)", panel:"rgba(62,82,70,.56)", line:"rgba(255,255,255,.14)", glass:"rgba(62,82,70,.38)", glass2:"rgba(74,98,84,.24)", decoA:"rgba(224,167,125,.10)", decoB:"rgba(255,245,210,.08)" }
  },
  hiver:{
    clair:{ bg:"#F5F7FA", fg:"#141B22", muted:"#61707E", barFill:"#78A0C8", barEmpty:"rgba(120,160,200,.18)", barEdge:"rgba(255,255,255,.88)", accent:"rgba(120,160,200,.16)", accent2:"rgba(120,160,200,.30)", panel:"rgba(255,255,255,.74)", line:"rgba(0,0,0,.10)", glass:"rgba(255,255,255,.58)", glass2:"rgba(255,255,255,.40)", decoA:"rgba(120,160,200,.12)", decoB:"rgba(220,240,255,.14)" },
    sombre:{ bg:"#273244", fg:"#F0FBFF", muted:"#D0DFE5", barFill:"#9DB8D5", barEmpty:"rgba(157,184,213,.12)", barEdge:"rgba(255,255,255,.20)", accent:"rgba(157,184,213,.12)", accent2:"rgba(157,184,213,.22)", panel:"rgba(54,74,98,.56)", line:"rgba(255,255,255,.14)", glass:"rgba(54,74,98,.38)", glass2:"rgba(66,92,120,.24)", decoA:"rgba(157,184,213,.10)", decoB:"rgba(242,253,255,.08)" }
  },
  noirblanc:{
    clair:{ bg:"#F7F4EE", fg:"#121212", muted:"#595959", barFill:"#4A4A4A", barEmpty:"rgba(0,0,0,.08)", barEdge:"rgba(255,255,255,.82)", accent:"rgba(0,0,0,.06)", accent2:"rgba(0,0,0,.12)", panel:"rgba(255,255,255,.74)", line:"rgba(0,0,0,.10)", glass:"rgba(255,255,255,.58)", glass2:"rgba(255,255,255,.40)", decoA:"rgba(0,0,0,.05)", decoB:"rgba(0,0,0,.03)" },
    sombre:{ bg:"#2B2F38", fg:"#F4F4F4", muted:"#D5D5D8", barFill:"#BEBEBE", barEmpty:"rgba(255,255,255,.10)", barEdge:"rgba(255,255,255,.18)", accent:"rgba(255,255,255,.08)", accent2:"rgba(255,255,255,.14)", panel:"rgba(58,64,78,.56)", line:"rgba(255,255,255,.14)", glass:"rgba(58,64,78,.40)", glass2:"rgba(72,80,98,.26)", decoA:"rgba(255,255,255,.06)", decoB:"rgba(255,255,255,.04)" }
  }
};

const defaultState = {
  ui:{
    mode:"clair",
    season:"automne",
    font:"yomogi",
    baseSize:16,
    leftW:360,
    rightW:420,
    progressStyle:"float"
  },
  baseline:{ totalTasks: 0 },
  tasks:[],
  currentTaskId:null,
  undo:[],
  kiffances:[
    "Respire 30 secondes comme une créature légendaire.",
    "Range 10 objets comme un ninja du tri.",
    "Bois une gorgée d’eau : potion de clarté mentale."
  ],
  pomodoro:{ workMin: 25, breakMin: 5, autoStart: "auto", phase: "work" },
  notes: "",
  typhonse: "",
  reminders: [],   // {id,text,dueDateISO,done}
  projects: []     // {id,title,dueDateISO}
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

/* Status */
let statusTimer = null;
function status(msg, ms=5000){
  const el = $("statusSpot");
  if(!el) return;
  el.textContent = msg || "";
  if(statusTimer) clearTimeout(statusTimer);
  if(msg) statusTimer = setTimeout(()=>{ el.textContent = ""; }, ms);
}

/* Theme */
function applyTheme(){
  const season = (state.ui.season in THEMES) ? state.ui.season : "automne";
  const mode = (state.ui.mode === "sombre") ? "sombre" : "clair";
  const t = THEMES[season][mode];

  const setVar = (k,v)=>document.documentElement.style.setProperty(k, v);
  setVar("--bg", t.bg);
  setVar("--fg", t.fg);
  setVar("--muted", t.muted);

  setVar("--barFill", t.barFill);
  setVar("--barEmpty", t.barEmpty);
  setVar("--barEdge", t.barEdge);

  setVar("--accent", t.accent);
  setVar("--accent2", t.accent2);

  setVar("--panelBg", t.panel);
  setVar("--line", t.line);

  setVar("--glass", t.glass);
  setVar("--glass2", t.glass2);

  setVar("--decoA", t.decoA);
  setVar("--decoB", t.decoB);

  setVar("--baseSize", `${clamp(state.ui.baseSize, 14, 18)}px`);
  setVar("--leftW", `${clamp(state.ui.leftW, 320, 980)}px`);
  setVar("--rightW", `${clamp(state.ui.rightW, 320, 980)}px`);

  if(state.ui.progressStyle === "anchored"){
    setVar("--progressShadow", "inset 0 12px 22px rgba(0,0,0,.12)");
    setVar("--progressBorder", "1px solid rgba(0,0,0,.14)");
  }else{
    setVar("--progressShadow", "0 18px 30px rgba(0,0,0,.10)");
    setVar("--progressBorder", "1px solid var(--line)");
  }

  setVar("--doodle", DOODLES[season] || DOODLES.automne);
  setVar("--doodleOpacity", (mode==="sombre") ? ".16" : ".22");

  document.body.setAttribute("data-font", state.ui.font);
  document.body.setAttribute("data-mode", state.ui.mode);

  const mt = $("modeToggle");
  const sc = $("seasonCycle");
  if(mt){
    mt.textContent = (state.ui.mode === "sombre") ? "Sombre" : "Clair";
    mt.setAttribute("aria-pressed", state.ui.mode === "sombre" ? "true" : "false");
  }
  if(sc) sc.textContent = seasonLabel(state.ui.season);
}

/* Panels */
function openPanel(which){
  $("panelBack")?.classList.add("show");
  document.body.style.overflow = "hidden";
  if(which === "left"){
    $("leftPanel")?.classList.add("open");
    $("rightPanel")?.classList.remove("open");
  }else{
    $("rightPanel")?.classList.add("open");
    $("leftPanel")?.classList.remove("open");
  }
}
function closePanels(){
  $("panelBack")?.classList.remove("show");
  $("leftPanel")?.classList.remove("open");
  $("rightPanel")?.classList.remove("open");
  document.body.style.overflow = "";
}

/* Resizers */
function initResizer(handleId, which){
  const h = $(handleId);
  if(!h) return;
  let dragging=false, sx=0, sw=0;

  const down=(x)=>{
    dragging=true; sx=x;
    sw = which==="left" ? state.ui.leftW : state.ui.rightW;
  };
  const move=(x)=>{
    if(!dragging) return;
    const dx = x - sx;
    if(which==="left") state.ui.leftW = clamp(sw + dx, 320, 980);
    else state.ui.rightW = clamp(sw - dx, 320, 980);
    applyTheme();
  };
  const up=()=>{
    if(!dragging) return;
    dragging=false;
    saveState();
  };

  h.addEventListener("mousedown",(e)=>{ e.preventDefault(); down(e.clientX); });
  window.addEventListener("mousemove",(e)=>move(e.clientX));
  window.addEventListener("mouseup", up);

  h.addEventListener("touchstart",(e)=>{ e.preventDefault(); down(e.touches[0].clientX); }, {passive:false});
  window.addEventListener("touchmove",(e)=>move(e.touches[0].clientX), {passive:true});
  window.addEventListener("touchend", up);
}

/* Tabs */
function bindTabs(){
  $$(".panel-left .tabBtn").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      $$(".panel-left .tabBtn").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      const key = btn.dataset.lefttab;
      $$("#leftPanel .tabPage").forEach(p=>p.classList.remove("show"));
      $("left-"+key)?.classList.add("show");
      if(key==="tasks") renderTasksPanel();
      if(key==="kiffance") renderKiffance();
      if(key==="export") renderExport();
      if(key==="prefs") syncPrefsUI();
    });
  });

  $$(".panel-right .tabBtn").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      $$(".panel-right .tabBtn").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      const key = btn.dataset.righttab;
      $$("#rightPanel .tabPage").forEach(p=>p.classList.remove("show"));
      $("right-"+key)?.classList.add("show");
      if(key==="calendar") renderCalendar();
      if(key==="notes") renderNotesRight();
    });
  });
}

/* Inbox parsing */
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
  if(m){ title=m[1].trim(); et=parseInt(m[2],10); }

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

/* Tasks helpers */
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

/* Progress = remaining% */
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
  document.documentElement.style.setProperty("--progressPct", String(pct));
}

/* Undo */
function pushUndo(label){
  state.undo.unshift({ label, at: Date.now(), payload: structuredClone(state) });
  state.undo = state.undo.slice(0, 25);
  saveState();
}
function doUndo(){
  const snap = state.undo.shift();
  if(!snap) return status("Rien à annuler. Le passé résiste.");
  state = snap.payload;
  saveState();
  renderAll();
  status("Retour : timeline réécrite.");
}

/* Hub render */
function renderHub(){
  const act = activeTasks();
  const done = doneTasks();
  const base = state.baseline.totalTasks || 0;

  $("statActive").textContent = String(act.length);
  $("statDone").textContent = String(done.length);

  $("missionLineLeft").textContent = `Tâches en cours (${done.length} finies · ${act.length}/${base || act.length || 0})`;

  const cur = getTask(state.currentTaskId);
  if(!cur){
    $("taskTitle").textContent = "Aucune tâche sélectionnée";
    $("metaCat").textContent = "—";
    $("metaEt").textContent = "—";
  }else{
    $("taskTitle").textContent = cur.title;
    $("metaCat").textContent = cur.cat || "Inbox";
    $("metaEt").textContent = `${cur.etorionsLeft}/${cur.etorionsTotal}`;
  }
}
function toggleTaskMeta(){
  const m = $("taskMetaDetails");
  m.hidden = !m.hidden;
}

/* Actions */
function degommerOne(){
  const t = getTask(state.currentTaskId);
  if(!t || t.done) return status("Aucune tâche à dég… euh… traiter.");
  pushUndo("degomme");
  t.etorionsLeft = clamp((t.etorionsLeft||1) - 1, 0, 99);
  if(t.etorionsLeft <= 0){
    t.done = true;
    t.doneAt = nowISO();
    ensureCurrentTask();
    status("CHAOS TERRASSÉ. Mission accomplie.");
  }else{
    status("💣 Éthorion dégommé. Encore un.");
  }
  saveState();
  renderAll();
}

/* Roulette */
let spinning = false;
function easeOutCubic(t){ return 1 - Math.pow(1 - t, 3); }
function onRouletteStop(){
  const act = activeTasks();
  if(act.length===0){
    if(state.kiffances.length){
      status("🎁 Kiffance : " + state.kiffances[Math.floor(Math.random()*state.kiffances.length)]);
    }else status("Roulette : rien à tirer.");
    return;
  }
  const roll = Math.random();
  if(roll < 0.20 && state.kiffances.length){
    status("🎁 Kiffance : " + state.kiffances[Math.floor(Math.random()*state.kiffances.length)]);
    return;
  }
  const pick = act[Math.floor(Math.random()*act.length)];
  state.currentTaskId = pick.id;
  saveState();
  renderHub();
  status("🎡 Tirage : " + pick.title);
}
function spinRoulette(){
  if(spinning) return;
  const wheel = $("rouletteWheel");
  if(!wheel) return status("Roulette introuvable (bug DOM).");

  spinning = true;
  wheel.classList.add("spinning");

  const turns = 4 + Math.random()*3;
  const extraDeg = Math.random()*360;
  const start = performance.now();
  const dur = 1400 + Math.random()*600;

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
      wheel.classList.remove("spinning");
      onRouletteStop();
    }
  }
  requestAnimationFrame(frame);
}

/* Tasks panel */
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
  const cats = categories();
  for(const c of cats){
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    sel.appendChild(opt);
  }
  sel.value = cats.includes(prev) ? prev : "Toutes";
}
function renderTasksPanel(){
  renderCatFilter();
  const root = $("taskList");
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
      selBtn.onclick = ()=>{
        state.currentTaskId = t.id;
        saveState();
        renderAll();
        status("Sélection : " + t.title);
      };
      btns.appendChild(selBtn);

      const doneBtn = document.createElement("button");
      doneBtn.className = "iconBtn";
      doneBtn.title = "Terminer";
      doneBtn.textContent = "✓";
      doneBtn.onclick = ()=>{
        pushUndo("complete");
        t.done = true;
        t.doneAt = nowISO();
        ensureCurrentTask();
        saveState();
        renderAll();
        status("GLORIEUX. Une menace de moins.");
      };
      btns.appendChild(doneBtn);
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
      status("Évaporée. Pouf.");
    };
    btns.appendChild(delBtn);

    row.appendChild(left);
    row.appendChild(btns);
    root.appendChild(row);
  }
}

/* Kiffance */
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

    left.appendChild(title);

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
      status("Kiffance supprimée.");
    };
    btns.appendChild(del);

    row.appendChild(left);
    row.appendChild(btns);
    root.appendChild(row);
  });
}

/* Export */
function renderExport(){ $("exportOut").value = JSON.stringify(state, null, 2); }
async function copyText(text){
  try{ await navigator.clipboard.writeText(text); status("JSON copié."); }
  catch(_){ status("Impossible de copier."); }
}

/* Pomodoro */
let pomoTimer = null;
let pomoRunning = false;
let remainingMs = 0;
function pad2(n){ return String(n).padStart(2,"0"); }
function fmtMMSS(ms){
  const s = Math.max(0, Math.floor(ms/1000));
  return `${pad2(Math.floor(s/60))}:${pad2(s%60)}`;
}
function currentPhaseMinutes(){
  return state.pomodoro.phase === "break" ? state.pomodoro.breakMin : state.pomodoro.workMin;
}
function resetPhase(){
  remainingMs = clamp(currentPhaseMinutes(), 1, 120) * 60 * 1000;
  $("pomoTime").textContent = fmtMMSS(remainingMs);
}
function startPomo(){
  if(pomoRunning) return;
  pomoRunning = true;
  $("pomoTime").classList.add("running");
  if(!pomoTimer) pomoTimer = setInterval(tick, 250);
}
function pausePomo(){
  pomoRunning = false;
  $("pomoTime").classList.remove("running");
}
function togglePomo(){
  if(remainingMs <= 0) resetPhase();
  if(pomoRunning) pausePomo();
  else startPomo();
}
function tick(){
  if(!pomoRunning) return;
  remainingMs -= 250;
  if(remainingMs <= 0){
    remainingMs = 0;
    $("pomoTime").textContent = "00:00";
    pausePomo();

    state.pomodoro.phase = (state.pomodoro.phase === "work") ? "break" : "work";
    saveState();

    const phaseLabel = state.pomodoro.phase === "work" ? "Pomodoro" : "Pause";
    status(`⏰ ${phaseLabel} : terminé.`);
    resetPhase();
    if(state.pomodoro.autoStart === "auto") startPomo();
    return;
  }
  $("pomoTime").textContent = fmtMMSS(remainingMs);
}
function openModal(){
  $("modalBack").hidden = false;
  $("pomoModal").hidden = false;
  $("pomoMinutes").value = String(state.pomodoro.workMin);
  $("breakMinutes").value = String(state.pomodoro.breakMin);
  $("autoStartSel").value = state.pomodoro.autoStart;
}
function closeModal(){
  $("modalBack").hidden = true;
  $("pomoModal").hidden = true;
}
function applyPomoSettings(){
  const w = clamp(parseInt($("pomoMinutes").value,10) || 25, 5, 90);
  const b = clamp(parseInt($("breakMinutes").value,10) || 5, 1, 30);
  const a = $("autoStartSel").value === "manual" ? "manual" : "auto";
  state.pomodoro.workMin = w;
  state.pomodoro.breakMin = b;
  state.pomodoro.autoStart = a;
  saveState();
  resetPhase();
  status("Pomodoro réglé.");
  closeModal();
}

/* Topbar */
function bindTopbar(){
  $("modeToggle").addEventListener("click", ()=>{
    state.ui.mode = (state.ui.mode === "clair") ? "sombre" : "clair";
    saveState();
    renderAll();
  });

  $("seasonCycle").addEventListener("click", ()=>{
    const idx = Math.max(0, SEASONS.indexOf(state.ui.season));
    state.ui.season = SEASONS[(idx + 1) % SEASONS.length];
    saveState();
    renderAll();
  });

  $("focusBtn").addEventListener("click", ()=>{
    document.body.classList.toggle("focusMode");
    $("focusBtn").classList.toggle("active", document.body.classList.contains("focusMode"));
  });

  $("countersBtn").addEventListener("click", ()=>{
    document.body.classList.toggle("hideCounters");
    $("countersBtn").classList.toggle("active", !document.body.classList.contains("hideCounters"));
  });
}

/* Prefs */
function syncPrefsUI(){
  $("modeSel").value = state.ui.mode;
  $("seasonSel").value = state.ui.season;
  $("fontSel").value = state.ui.font;
  $("uiScale").value = String(clamp(state.ui.baseSize,14,18));
  $("progressStyleSel").value = state.ui.progressStyle;
  $("pomoQuick").value = String(clamp(state.pomodoro.workMin, 5, 90));
}
function applyPrefsFromUI(){
  state.ui.mode = $("modeSel").value;
  state.ui.season = $("seasonSel").value;
  state.ui.font = $("fontSel").value;
  state.ui.baseSize = parseInt($("uiScale").value, 10) || 16;
  state.ui.progressStyle = $("progressStyleSel").value;

  const quick = clamp(parseInt($("pomoQuick").value,10) || state.pomodoro.workMin, 5, 90);
  state.pomodoro.workMin = quick;

  saveState();
  renderAll();
}
function bindPrefs(){
  ["modeSel","seasonSel","fontSel","progressStyleSel"].forEach(id=>{
    $(id).addEventListener("change", applyPrefsFromUI);
  });
  $("uiScale").addEventListener("input", applyPrefsFromUI);

  $("prefsApply").addEventListener("click", ()=>{
    applyPrefsFromUI();
    status("Préférences appliquées.");
  });

  $("prefsReset").addEventListener("click", ()=>{
    state.ui = structuredClone(defaultState.ui);
    state.pomodoro.workMin = defaultState.pomodoro.workMin;
    state.pomodoro.breakMin = defaultState.pomodoro.breakMin;
    state.pomodoro.autoStart = defaultState.pomodoro.autoStart;
    state.pomodoro.phase = "work";
    saveState();
    renderAll();
    status("Préférences reset.");
  });
}

/* Inbox add */
function inboxAdd(){
  const text = $("inboxText").value || "";
  const parsed = importFromInbox(text);
  if(parsed.length===0) return status("Rien à ajouter.");

  pushUndo("inboxAdd");
  state.tasks.push(...parsed);

  if(state.baseline.totalTasks<=0){
    state.baseline.totalTasks = activeTasks().length;
  }
  ensureCurrentTask();

  saveState();
  renderAll();
  status(`Ajout : ${parsed.length} tâche(s).`);
}
function inboxClear(){ $("inboxText").value = ""; status("Champ effacé."); }

/* Export bind */
function bindExport(){
  $("exportBtn").onclick = ()=>copyText(JSON.stringify(state, null, 2));
  $("wipeBtn").onclick = ()=>{
    if(!confirm("Reset total ? (tout effacer)")) return;
    localStorage.removeItem(LS_KEY);
    state = structuredClone(defaultState);
    saveState();
    renderAll();
    status("Reset complet.");
  };
}

/* ====== Notes & Rappels (panneau droit + overlay futur) ====== */
function ymd(d){
  const dt = (d instanceof Date) ? d : new Date(d);
  const y = dt.getFullYear();
  const m = String(dt.getMonth()+1).padStart(2,"0");
  const dd = String(dt.getDate()).padStart(2,"0");
  return `${y}-${m}-${dd}`;
}
function isTodayDateISO(dateISO){
  const today = ymd(new Date());
  return (dateISO || "").slice(0,10) === today;
}
function isTomorrowDateISO(dateISO){
  const t = new Date();
  t.setDate(t.getDate()+1);
  return (dateISO || "").slice(0,10) === ymd(t);
}

function renderNotesRight(){
  const ta = $("notesRight");
  if(ta){
    ta.value = state.notes || "";
    ta.oninput = ()=>{
      state.notes = ta.value;
      saveState();
    };
  }
  renderReminders();
}

function addReminder(text, dateStr){
  const t = (text||"").trim();
  if(!t) return;
  const due = dateStr ? new Date(dateStr) : new Date();
  const iso = new Date(due.getFullYear(), due.getMonth(), due.getDate(), 9,0,0).toISOString();
  pushUndo("remAdd");
  state.reminders.unshift({ id: uid(), text: t, dueDateISO: iso, done:false });
  saveState();
  renderReminders();
  status("Rappel ajouté.");
}

function toggleReminder(id){
  const r = state.reminders.find(x=>x.id===id);
  if(!r) return;
  pushUndo("remToggle");
  r.done = !r.done;
  saveState();
  renderReminders();
  status(r.done ? "Rappel coché." : "Rappel décoché.");
}

function deleteReminder(id){
  pushUndo("remDel");
  state.reminders = state.reminders.filter(x=>x.id!==id);
  saveState();
  renderReminders();
  status("Rappel supprimé.");
}

function renderReminders(){
  const root = $("remList");
  if(!root) return;

  // tri : non faits d’abord, puis date
  const list = state.reminders.slice().sort((a,b)=>{
    if(a.done && !b.done) return 1;
    if(!a.done && b.done) return -1;
    return String(a.dueDateISO||"").localeCompare(String(b.dueDateISO||""));
  });

  root.innerHTML = "";
  if(list.length === 0){
    const d = document.createElement("div");
    d.className = "muted small";
    d.textContent = "Aucun rappel. Le cerveau peut souffler (rare moment).";
    root.appendChild(d);
    return;
  }

  list.forEach(r=>{
    const row = document.createElement("div");
    row.className = "cardRow";

    const left = document.createElement("div");
    left.className = "cardLeft";

    const title = document.createElement("div");
    title.className = "cardTitle" + (r.done ? " remDone" : "");
    title.textContent = r.text;

    const due = (r.dueDateISO || "").slice(0,10);
    const badge = document.createElement("div");
    badge.className = "remBadge";
    const t = isTodayDateISO(r.dueDateISO) ? "Aujourd’hui" : (isTomorrowDateISO(r.dueDateISO) ? "Demain" : due);
    badge.textContent = `⏳ ${t}`;

    left.appendChild(title);
    left.appendChild(badge);

    const btns = document.createElement("div");
    btns.className = "cardBtns";

    const chk = document.createElement("button");
    chk.className = "iconBtn";
    chk.title = "Cocher / décocher";
    chk.textContent = r.done ? "↩" : "✓";
    chk.onclick = ()=>toggleReminder(r.id);

    const del = document.createElement("button");
    del.className = "iconBtn";
    del.title = "Supprimer";
    del.textContent = "×";
    del.onclick = ()=>deleteReminder(r.id);

    btns.appendChild(chk);
    btns.appendChild(del);

    row.appendChild(left);
    row.appendChild(btns);
    root.appendChild(row);
  });
}

function showStartOfDayReminders(){
  const due = state.reminders.filter(r=>!r.done && (isTodayDateISO(r.dueDateISO) || isTomorrowDateISO(r.dueDateISO)));
  if(due.length === 0) return;
  const nToday = due.filter(r=>isTodayDateISO(r.dueDateISO)).length;
  const nTomorrow = due.filter(r=>isTomorrowDateISO(r.dueDateISO)).length;
  status(`🧠 Mémo: ${nToday} aujourd’hui${nTomorrow ? ` · ${nTomorrow} demain` : ""}.`);
}

/* ====== Calendrier + Timeline ====== */
let calCursor = new Date();
calCursor.setDate(1);

function monthLabel(d){
  const m = d.toLocaleString("fr-FR", { month:"long" });
  return `${m.charAt(0).toUpperCase()+m.slice(1)} ${d.getFullYear()}`;
}

function renderCalendar(){
  const grid = $("calGrid");
  const label = $("calLabel");
  if(!grid || !label) return;

  label.textContent = monthLabel(calCursor);

  const firstDay = new Date(calCursor.getFullYear(), calCursor.getMonth(), 1);
  const startDow = (firstDay.getDay() + 6) % 7; // lundi=0
  const start = new Date(firstDay);
  start.setDate(firstDay.getDate() - startDow);

  const today = ymd(new Date());
  grid.innerHTML = "";

  // Map reminders/projects per date
  const hasDot = new Set();
  state.reminders.forEach(r=>{
    const d = (r.dueDateISO||"").slice(0,10);
    if(d) hasDot.add(d);
  });
  state.projects.forEach(p=>{
    const d = (p.dueDateISO||"").slice(0,10);
    if(d) hasDot.add(d);
  });

  for(let i=0;i<42;i++){
    const d = new Date(start);
    d.setDate(start.getDate()+i);
    const cell = document.createElement("div");
    cell.className = "calCell";

    const dstr = ymd(d);
    const inMonth = d.getMonth() === calCursor.getMonth();
    if(!inMonth) cell.classList.add("dim");
    if(dstr === today) cell.classList.add("today");

    const num = document.createElement("div");
    num.className = "calNum";
    num.textContent = String(d.getDate());

    cell.appendChild(num);

    if(hasDot.has(dstr)){
      const dot = document.createElement("div");
      dot.className = "calDot";
      cell.appendChild(dot);
    }

    // click = pré-remplir date reminder/projet
    cell.onclick = ()=>{
      if($("remDate")) $("remDate").value = dstr;
      if($("projDate")) $("projDate").value = dstr;
      status(`Date sélectionnée : ${dstr}`);
    };

    grid.appendChild(cell);
  }

  renderTimeline();
}

function addProject(title, dateStr){
  const t = (title||"").trim();
  if(!t) return;
  const due = dateStr ? new Date(dateStr) : new Date();
  const iso = new Date(due.getFullYear(), due.getMonth(), due.getDate(), 9,0,0).toISOString();
  pushUndo("projAdd");
  state.projects.unshift({ id: uid(), title: t, dueDateISO: iso });
  saveState();
  renderTimeline();
  renderCalendar();
  status("Projet ajouté.");
}

function deleteProject(id){
  pushUndo("projDel");
  state.projects = state.projects.filter(p=>p.id!==id);
  saveState();
  renderTimeline();
  renderCalendar();
  status("Projet supprimé.");
}

function renderTimeline(){
  const root = $("timeline");
  if(!root) return;
  const list = state.projects.slice().sort((a,b)=>String(a.dueDateISO||"").localeCompare(String(b.dueDateISO||"")));
  root.innerHTML = "";
  if(list.length===0){
    const d = document.createElement("div");
    d.className = "muted small";
    d.textContent = "Aucun projet. Le futur attend sagement.";
    root.appendChild(d);
    return;
  }
  list.forEach(p=>{
    const row = document.createElement("div");
    row.className = "tItem";
    const left = document.createElement("div");
    left.className = "tLeft";
    const title = document.createElement("div");
    title.className = "tTitle";
    title.textContent = p.title;
    const date = document.createElement("div");
    date.className = "tDate";
    date.textContent = (p.dueDateISO||"").slice(0,10);
    left.appendChild(title);
    left.appendChild(date);

    const btns = document.createElement("div");
    btns.className = "tBtns";
    const del = document.createElement("button");
    del.className = "iconBtn";
    del.title = "Supprimer";
    del.textContent = "×";
    del.onclick = ()=>deleteProject(p.id);

    btns.appendChild(del);
    row.appendChild(left);
    row.appendChild(btns);
    root.appendChild(row);
  });
}

/* Render all */
function renderAll(){
  applyTheme();
  ensureCurrentTask();
  renderProgress();
  renderHub();
  renderTasksPanel();
  renderKiffance();
  renderExport();
  syncPrefsUI();
  renderNotesRight();
  renderCalendar();
}

/* Init */
document.addEventListener("DOMContentLoaded", ()=>{
  $("subtitle").textContent = pickSubline();
  setInterval(()=>{ $("subtitle").textContent = pickSubline(); }, 45000);

  $("btnLeft").onclick = ()=>openPanel("left");
  $("btnRight").onclick = ()=>openPanel("right");
  $("leftClose").onclick = closePanels;
  $("rightClose").onclick = closePanels;
  $("panelBack").onclick = closePanels;

  initResizer("leftResizer","left");
  initResizer("rightResizer","right");

  bindTabs();
  bindTopbar();
  bindPrefs();
  bindExport();

  $("inboxAdd").onclick = inboxAdd;
  $("inboxClear").onclick = inboxClear;

  $("rouletteBtn").onclick = spinRoulette;
  $("bombBtn").onclick = degommerOne;
  $("undoBtn").onclick = doUndo;
  $("taskInfoBtn").onclick = toggleTaskMeta;

  $("catFilter").addEventListener("change", renderTasksPanel);
  $("viewFilter").addEventListener("change", renderTasksPanel);

  $("kiffAdd").onclick = ()=>{
    const v = ($("kiffNew").value||"").trim();
    if(!v) return;
    pushUndo("kiffAdd");
    state.kiffances.unshift(v);
    $("kiffNew").value = "";
    saveState();
    renderKiffance();
    status("Kiffance ajoutée.");
  };

  // Pomodoro
  resetPhase();
  $("pomoTime").onclick = togglePomo;
  $("pomoEdit").onclick = (e)=>{ e.preventDefault(); e.stopPropagation(); openModal(); };
  $("modalBack").onclick = closeModal;
  $("modalClose").onclick = closeModal;
  $("pomoApply").onclick = applyPomoSettings;
  $("pomoReset").onclick = ()=>{ pausePomo(); resetPhase(); status("Timer reset."); };

  // Rappels
  $("remAdd").onclick = ()=>{
    addReminder($("remText").value, $("remDate").value);
    $("remText").value = "";
  };

  // Projets
  $("projAdd").onclick = ()=>{
    addProject($("projTitle").value, $("projDate").value);
    $("projTitle").value = "";
  };

  // Calendrier nav
  $("calPrev").onclick = ()=>{
    calCursor = new Date(calCursor.getFullYear(), calCursor.getMonth()-1, 1);
    renderCalendar();
  };
  $("calNext").onclick = ()=>{
    calCursor = new Date(calCursor.getFullYear(), calCursor.getMonth()+1, 1);
    renderCalendar();
  };

  // Raccourcis bas : ouvrent directement onglet notes (panneau droit)
  $("openNotes").onclick = ()=>{ openPanel("right"); $$(`.panel-right .tabBtn`).forEach(b=>b.classList.remove("active")); document.querySelector(`[data-righttab="notes"]`)?.classList.add("active"); $$("#rightPanel .tabPage").forEach(p=>p.classList.remove("show")); $("right-notes")?.classList.add("show"); renderNotesRight(); };
  $("openTyphonse").onclick = ()=>{ status("Typhonse : arrive bientôt (overlay dédié)."); openPanel("right"); };
  $("openStats").onclick = ()=>{ status("Stats : module suivant (infographies)."); openPanel("right"); };
  $("openKiffance").onclick = ()=>{ status("Kiffance : banque à gauche, tirage via roulette."); };

  renderAll();
  showStartOfDayReminders();
});
