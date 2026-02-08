:root {
  --bg: #fbf4e8;
  --fg: #14120f;
  --muted: #6a5d53;

  --panel-bg: rgba(255,255,255,0.7);
  --line: rgba(0,0,0,0.1);

  --leftW: 360px;
  --rightW: 420px;
}

/* RESET */
* { box-sizing: border-box; }

body {
  margin: 0;
  background: var(--bg);
  color: var(--fg);
  font-family: "Yomogi", cursive;
}

/* TOP BAR */
#topBar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 56px;
  padding: 0 16px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  background: rgba(255,255,255,0.6);
  backdrop-filter: blur(10px);
  z-index: 1000;
}

#topBar button {
  background: none;
  border: none;
  font-family: inherit;
  cursor: pointer;
  font-size: 14px;
}

/* HUB */
#hub {
  padding-top: 56px;
  min-height: 100vh;
  display: flex;
  justify-content: center;
}

#hub-inner {
  max-width: 700px;
  padding: 48px 24px;
  text-align: center;
}

#appTitle {
  font-size: 48px;
  margin-bottom: 8px;
}

#subtitle {
  color: var(--muted);
}

/* BACKDROP */
#panelBack {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.25);
  backdrop-filter: blur(6px);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s ease;
  z-index: 900;
}

#panelBack.show {
  opacity: 1;
  pointer-events: auto;
}

/* PANELS */
.panel {
  position: fixed;
  top: 0;
  bottom: 0;
  background: var(--panel-bg);
  backdrop-filter: blur(14px);
  border: 1px solid var(--line);
  z-index: 1000;
  transition: transform 0.25s ease;
  overflow-y: auto;
}

#leftPanel {
  left: 0;
  width: var(--leftW);
  transform: translateX(-100%);
}

#rightPanel {
  right: 0;
  width: var(--rightW);
  transform: translateX(100%);
}

.panel.open {
  transform: translateX(0);
}

.panel-content {
  padding: 24px;
}

.closeBtn {
  position: absolute;
  top: 10px;
  right: 12px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}
