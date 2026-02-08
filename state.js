const $ = (id)=>document.getElementById(id);
const $$ = (sel, root=document)=>Array.from(root.querySelectorAll(sel));
const clamp = (n,a,b)=>Math.max(a, Math.min(b,n));
const uid = ()=>Math.random().toString(36).slice(2,10)+"_"+Date.now().toString(36);
const nowISO = ()=>new Date().toISOString();

const LS_KEY = "eliminator_step2_3";

const SEASONS = ["printemps","ete","automne","hiver","noirblanc"];
const seasonLabel = (s)=>{
  const map = { printemps:"Printemps", ete:"Été", automne:"Automne", hiver:"Hiver", noirblanc:"Noir & blanc" };
  return map[s] || "Automne";
};

/* ✅ Palettes VRAIMENT distinctes + sombre pastel (pas noir) */
const THEMES = {
  printemps:{
    clair:{
      bg:"#FBF4E8", fg:"#15120F", muted:"#6A5D53",
      barFill:"#6EBE96", barEmpty:"rgba(110,190,150,.18)", barEdge:"rgba(255,255,255,.85)",
      accent:"rgba(110,190,150,.18)", accent2:"rgba(110,190,150,.38)",
      panel:"rgba(255,255,255,.70)", line:"rgba(0,0,0,.10)",
      glass:"rgba(255,255,255,.58)", glass2:"rgba(255,255,255,.40)",
      decoA:"rgba(110,190,150,.16)", decoB:"rgba(250,210,140,.14)"
    },
    fonce:{
      bg:"#2A3440", fg:"#F6F2EA", muted:"#D7D0C5",
      barFill:"#7FD3AC", barEmpty:"rgba(127,211,172,.14)", barEdge:"rgba(255,255,255,.26)",
      accent:"rgba(127,211,172,.14)", accent2:"rgba(127,211,172,.28)",
      panel:"rgba(44,58,70,.62)", line:"rgba(255,255,255,.14)",
      glass:"rgba(54,72,92,.40)", glass2:"rgba(64,86,110,.26)",
      decoA:"rgba(127,211,172,.12)", decoB:"rgba(255,220,170,.10)"
    }
  },
  ete:{
    clair:{
      bg:"#FFF3DF", fg:"#16120F", muted:"#6C5E52",
      barFill:"#5AAAD2", barEmpty:"rgba(90,170,210,.18)", barEdge:"rgba(255,255,255,.85)",
      accent:"rgba(90,170,210,.16)", accent2:"rgba(90,170,210,.34)",
      panel:"rgba(255,255,255,.70)", line:"rgba(0,0,0,.10)",
      glass:"rgba(255,255,255,.58)", glass2:"rgba(255,255,255,.40)",
      decoA:"rgba(90,170,210,.14)", decoB:"rgba(255,215,120,.14)"
    },
    fonce:{
      bg:"#253845", fg:"#F0FAFF", muted:"#D2E0E8",
      barFill:"#86C7E8", barEmpty:"rgba(134,199,232,.12)", barEdge:"rgba(255,255,255,.22)",
      accent:"rgba(134,199,232,.12)", accent2:"rgba(134,199,232,.26)",
      panel:"rgba(40,58,72,.62)", line:"rgba(255,255,255,.14)",
      glass:"rgba(50,76,92,.38)", glass2:"rgba(60,92,112,.24)",
      decoA:"rgba(134,199,232,.10)", decoB:"rgba(255,230,170,.09)"
    }
  },
  automne:{
    clair:{
      bg:"#FBF4E8", fg:"#14120F", muted:"#6A5D53",
      barFill:"#D38A5C", barEmpty:"rgba(211,138,92,.18)", barEdge:"rgba(255,255,255,.85)",
      accent:"rgba(211,138,92,.18)", accent2:"rgba(211,138,92,.36)",
      panel:"rgba(255,255,255,.70)", line:"rgba(0,0,0,.10)",
      glass:"rgba(255,255,255,.58)", glass2:"rgba(255,255,255,.40)",
      decoA:"rgba(211,138,92,.14)", decoB:"rgba(255,210,160,.14)"
    },
    fonce:{
      bg:"#2E3A33", fg:"#FFF3E6", muted:"#E3D3C4",
      barFill:"#E0A77D", barEmpty:"rgba(224,167,125,.12)", barEdge:"rgba(255,255,255,.22)",
      accent:"rgba(224,167,125,.12)", accent2:"rgba(224,167,125,.26)",
      panel:"rgba(50,64,56,.62)", line:"rgba(255,255,255,.14)",
      glass:"rgba(62,82,70,.38)", glass2:"rgba(74,98,84,.24)",
      decoA:"rgba(224,167,125,.10)", decoB:"rgba(255,245,210,.09)"
    }
  },
  hiver:{
    clair:{
      bg:"#F5F7FA", fg:"#141B22", muted:"#61707E",
      barFill:"#78A0C8", barEmpty:"rgba(120,160,200,.18)", barEdge:"rgba(255,255,255,.88)",
      accent:"rgba(120,160,200,.16)", accent2:"rgba(120,160,200,.34)",
      panel:"rgba(255,255,255,.74)", line:"rgba(0,0,0,.10)",
      glass:"rgba(255,255,255,.58)", glass2:"rgba(255,255,255,.40)",
      decoA:"rgba(120,160,200,.14)", decoB:"rgba(220,240,255,.16)"
    },
    fonce:{
      bg:"#273244", fg:"#F0FBFF", muted:"#D0DFE5",
      barFill:"#9DB8D5", barEmpty:"rgba(157,184,213,.12)", barEdge:"rgba(255,255,255,.22)",
      accent:"rgba(157,184,213,.12)", accent2:"rgba(157,184,213,.26)",
      panel:"rgba(40,54,72,.62)", line:"rgba(255,255,255,.14)",
      glass:"rgba(54,74,98,.38)", glass2:"rgba(66,92,120,.24)",
      decoA:"rgba(157,184,213,.10)", decoB:"rgba(242,253,255,.08)"
    }
  },
  noirblanc:{
    clair:{
      bg:"#F7F4EE", fg:"#121212", muted:"#595959",
      barFill:"#444444", barEmpty:"rgba(0,0,0,.08)", barEdge:"rgba(255,255,255,.82)",
      accent:"rgba(0,0,0,.08)", accent2:"rgba(0,0,0,.14)",
      panel:"rgba(255,255,255,.74)", line:"rgba(0,0,0,.10)",
      glass:"rgba(255,255,255,.58)", glass2:"rgba(255,255,255,.40)",
      decoA:"rgba(0,0,0,.06)", decoB:"rgba(0,0,0,.04)"
    },
    fonce:{
      bg:"#2B2F38", fg:"#F4F4F4", muted:"#D5D5D8",
      barFill:"#BEBEBE", barEmpty:"rgba(255,255,255,.10)", barEdge:"rgba(255,255,255,.20)",
      accent:"rgba(255,255,255,.08)", accent2:"rgba(255,255,255,.14)",
      panel:"rgba(44,48,58,.66)", line:"rgba(255,255,255,.14)",
      glass:"rgba(58,64,78,.40)", glass2:"rgba(72,80,98,.26)",
      decoA:"rgba(255,255,255,.06)", decoB:"rgba(255,255,255,.04)"
    }
  }
};

const defaultState = {
  ui:{
    mode:"clair",
    season:"automne",
    font:"yomogi",
    baseSize: 16,
    leftW: 360,
    rightW: 420
  },
  baseline:{ totalTasks: 0 },
  tasks:[],
  currentTaskId:null,
  undo:[],
  kiffances:[
    "Respire 30 secondes comme une créature légendaire.",
    "Range 10 objets comme un ninja du tri.",
    "Bois une gorgée d’eau : potion de clarté mentale.",
    "Étirement de dragon : 45 secondes."
  ],
  pomodoro:{ minutes: 25 }
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

/* ---------- Theme apply (et là, ça bouge VRAIMENT) ---------- */
function applyTheme(){
  const season = (state.ui.season in THEMES) ? state.ui.season : "automne";
  const mode = state.ui.mode === "fonce" ? "fonce" : "clair";
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

  document.body.setAttribute("data-font", state.ui.font);

  // top bar
  $("modeToggle").textContent = (state.ui.mode === "fonce") ? "Foncé" : "Clair";
  $("modeToggle").setAttribute("aria-pressed", state.ui.mode === "fonce" ? "true" : "false");
  $("seasonCycle").textContent = seasonLabel(state.ui.season);
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

/* ---------- Resizers ---------- */
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

/* ---------- Undo ---------- */
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
  renderAll();
  toast("Retour : timeline réécrite.");
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

/* ---------- Hub rendering ---------- */
function renderHubTask(){
  const act = activeTasks();
  const done = doneTasks();
  const base = state.baseline.totalTasks || 0;

  $("statActive").textContent = String(act.length);
  $("statDone").textContent = String(done.length);

  $("missionLineLeft").textContent = `Tâches en cours (${act.length})`;
  $("missionLineRight").textContent = `${done.length} finies · ${act.length}/${base || act.length || 0}`;

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

  const list = $("tasksList");
  list.innerHTML = "";
  if(act.length===0){
    const d = document.createElement("div");
    d.className = "muted small";
    d.textContent = "Aucune tâche active. Le chaos fait une sieste.";
    list.appendChild(d);
    return;
  }
  act.slice(0, 8).forEach(t=>{
    const b = document.createElement("button");
    b.type = "button";
    b.className = "hubTaskRow" + (t.id===state.currentTaskId ? " active" : "");
    b.textContent = t.title;
    b.onclick = ()=>selectTask(t.id);
    list.appendChild(b);
  });
}

function toggleTaskMeta(){
  const meta = $("taskMetaDetails");
  meta.hidden = !meta.hidden;
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

/* ---------- Roulette ---------- */
let spinning = false;
function easeOutCubic(t){ return 1 - Math.pow(1 - t, 3); }

function onRouletteStop(){
  const act = activeTasks();
  if(act.length===0){
    if(state.kiffances.length){
      toast("🎁 Kiffance : " + state.kiffances[Math.floor(Math.random()*state.kiffances.length)]);
    }else toast("Roulette : rien à tirer. Même le destin hésite.");
    return;
  }

  const roll = Math.random();
  if(roll < 0.20 && state.kiffances.length){
    toast("🎁 Kiffance : " + state.kiffances[Math.floor(Math.random()*state.kiffances.length)]);
    return;
  }

  const pick = act[Math.floor(Math.random()*act.length)];
  state.currentTaskId = pick.id;
  saveState();
  renderHubTask();
  toast("🎡 Tirage : " + pick.title);
}

function spinRoulette(){
  if(spinning) return;
  const wheel = $("rouletteWheel");
  if(!wheel) return;

  spinning = true;
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
    else{ spinning = false; onRouletteStop(); }
  }
  requestAnimationFrame(frame);
}

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

/* ---------- Export ---------- */
function renderExport(){
  $("exportOut").value = JSON.stringify(state, null, 2);
}
async function copyText(text){
  try{ await navigator.clipboard.writeText(text); toast("JSON copié."); }
  catch(_){ toast("Impossible de copier (clipboard)."); }
}

/* ---------- Pomodoro discret : 1 toggle + stop + edit ---------- */
let pomoTimer = null;
let pomoRemainingMs = 0;
let pomoRunning = false;

function pad2(n){ return String(n).padStart(2,"0"); }
function fmtMMSS(ms){
  const s = Math.max(0, Math.floor(ms/1000));
  return `${pad2(Math.floor(s/60))}:${pad2(s%60)}`;
}
function pomoSetToMinutes(){
  const m = clamp(parseInt(state.pomodoro.minutes,10) || 25, 5, 90);
  state.pomodoro.minutes = m;
  pomoRemainingMs = m * 60 * 1000;
  $("pomoTime").textContent = fmtMMSS(pomoRemainingMs);
  $("pomoToggle").textContent = "▶";
  saveState();
}
function pomoTick(){
  if(!pomoRunning) return;
  pomoRemainingMs -= 250;
  if(pomoRemainingMs <= 0){
    pomoRemainingMs = 0;
    pomoPause();
    toast("⏰ Pomodoro terminé. Victoire temporo-spatiale.");
  }
  $("pomoTime").textContent = fmtMMSS(pomoRemainingMs);
}
function pomoPlay(){
  if(pomoRunning) return;
  if(pomoRemainingMs <= 0) pomoSetToMinutes();
  pomoRunning = true;
  $("pomoToggle").textContent = "⏸";
  if(!pomoTimer) pomoTimer = setInterval(pomoTick, 250);
}
function pomoPause(){
  pomoRunning = false;
  $("pomoToggle").textContent = "▶";
}
function pomoStop(){
  pomoRunning = false;
  pomoSetToMinutes();
  toast("■ Reset.");
}
function pomoToggle(){
  if(pomoRunning) pomoPause();
  else pomoPlay();
}
function pomoEdit(){
  const v = prompt("Durée pomodoro (minutes) :", String(state.pomodoro.minutes || 25));
  if(v === null) return;
  const n = parseInt(v,10);
  if(Number.isFinite(n) && n >= 5 && n <= 90){
    state.pomodoro.minutes = n;
    pomoSetToMinutes();
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
function inboxClear(){ $("inboxText").value = ""; toast("Champ effacé."); }

/* ---------- Focus + counters ---------- */
let focusMode = false;
let showCounters = true;

function bindTopActions(){
  $("focusBtn").addEventListener("click", ()=>{
    focusMode = !focusMode;
    document.body.classList.toggle("focusMode", focusMode);
    $("focusBtn").classList.toggle("active", focusMode);
  });

  $("countersBtn").addEventListener("click", ()=>{
    showCounters = !showCounters;
    document.body.classList.toggle("hideCounters", !showCounters);
    $("countersBtn").classList.toggle("active", showCounters);
  });
}

/* ---------- Mode + Season cycle ---------- */
function bindVisuals(){
  $("modeToggle").addEventListener("click", ()=>{
    state.ui.mode = (state.ui.mode === "clair") ? "fonce" : "clair";
    saveState();
    renderAll();
  });

  $("seasonCycle").addEventListener("click", ()=>{
    const idx = Math.max(0, SEASONS.indexOf(state.ui.season));
    state.ui.season = SEASONS[(idx + 1) % SEASONS.length];
    saveState();
    renderAll();
  });
}

/* ---------- Prefs apply (✅ ça change vraiment) ---------- */
function bindPrefs(){
  $("prefsApply").addEventListener("click", ()=>{
    state.ui.mode = $("modeSel").value;
    state.ui.season = $("seasonSel").value;
    state.ui.font = $("fontSel").value;
    state.ui.baseSize = parseInt($("uiScale").value, 10) || 16;
    saveState();
    renderAll();
    toast("Préférences appliquées.");
  });

  $("prefsReset").addEventListener("click", ()=>{
    state.ui = structuredClone(defaultState.ui);
    saveState();
    renderAll();
    toast("Préférences reset.");
  });

  // sync UI inputs à l'ouverture / render
  $("modeSel").value = state.ui.mode;
  $("seasonSel").value = state.ui.season;
  $("fontSel").value = state.ui.font;
  $("uiScale").value = String(clamp(state.ui.baseSize,14,18));
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

  // sync prefs controls (sans casser si panel fermé)
  $("modeSel").value = state.ui.mode;
  $("seasonSel").value = state.ui.season;
  $("fontSel").value = state.ui.font;
  $("uiScale").value = String(clamp(state.ui.baseSize,14,18));
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", ()=>{
  $("btnLeft").onclick = ()=>openPanel("left");
  $("btnRight").onclick = ()=>openPanel("right");
  $("leftClose").onclick = closePanels;
  $("rightClose").onclick = closePanels;
  $("panelBack").onclick = closePanels;

  initResizer("leftResizer","left");
  initResizer("rightResizer","right");

  bindTabs();

  $("inboxAdd").onclick = inboxAdd;
  $("inboxClear").onclick = inboxClear;

  $("rouletteBtn").onclick = spinRoulette;
  $("bombBtn").onclick = degommerOne;
  $("undoBtn").onclick = doUndo;

  $("taskInfoBtn").onclick = toggleTaskMeta;

  $("pomoToggle").onclick = pomoToggle;
  $("pomoStop").onclick = pomoStop;
  $("pomoEdit").onclick = pomoEdit;
  $("pomoTime").onclick = pomoToggle;
  pomoSetToMinutes();

  bindTopActions();
  bindVisuals();
  bindPrefs();

  $("catFilter").addEventListener("change", renderTasksPanel);
  $("viewFilter").addEventListener("change", renderTasksPanel);

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
