/* ====== v8 add: Typhonse ====== */
.tyRow{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap: 10px;
}
.tyText{
  font-weight: 900;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tyText.done{
  opacity:.58;
  text-decoration: line-through;
}
.tyBadges{
  display:flex;
  gap: 8px;
  align-items:center;
}
.tyBadge{
  font-size: 11px;
  font-weight: 900;
  color: var(--muted);
  opacity:.9;
  padding: 4px 8px;
  border-radius: 999px;
  background: rgba(255,255,255,.10);
  border: 1px solid var(--line);
}
.tyBadge.pin{
  background: var(--accent);
  border-color: var(--accent2);
  color: var(--fg);
}
