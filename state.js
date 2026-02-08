/* =====================================
   ELIMINATOR — STATE GLOBAL (ÉTAPE 0)
===================================== */

const STORAGE_KEY = "eliminator_state_v0";

const defaultState = {
  ui: {
    mode: "clair",          // clair | fonce
    season: "automne",      // printemps | ete | automne | hiver | noirblanc
    font: "yomogi",         // yomogi | zen | kiwi

    leftOpen: false,
    rightOpen: false,
    leftWidth: 360,
    rightWidth: 420
  }
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(defaultState);
    return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    return structuredClone(defaultState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

let state = loadState();

/* =====================================
   APPLY UI STATE
===================================== */

function applyUI() {
  document.body.dataset.mode = state.ui.mode;
  document.body.dataset.season = state.ui.season;
  document.body.dataset.font = state.ui.font;

  document.documentElement.style.setProperty("--left-width", state.ui.leftWidth + "px");
  document.documentElement.style.setProperty("--right-width", state.ui.rightWidth + "px");
}

applyUI();
