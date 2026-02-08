/* ===== PATCH PANELS: robust open/close ===== */
const panel = {
  back: () => document.getElementById("panelBack"),
  left: () => document.getElementById("leftPanel"),
  right: () => document.getElementById("rightPanel"),

  open(which){
    const back = this.back();
    const L = this.left();
    const R = this.right();
    if(!back || !L || !R) return;

    // close the other side
    if(which === "left") R.classList.remove("open");
    if(which === "right") L.classList.remove("open");

    back.classList.add("show");
    document.body.style.overflow = "hidden";

    if(which === "left") L.classList.add("open");
    if(which === "right") R.classList.add("open");
  },

  closeAll(){
    const back = this.back();
    const L = this.left();
    const R = this.right();
    if(L) L.classList.remove("open");
    if(R) R.classList.remove("open");
    if(back) back.classList.remove("show");
    document.body.style.overflow = "";
  }
};

// Bindings (ids must exist: openLeft/openRight/closeLeft/closeRight/panelBack)
(function bindPanels(){
  const openLeft = document.getElementById("openLeft");
  const openRight = document.getElementById("openRight");
  const closeLeft = document.getElementById("closeLeft");
  const closeRight = document.getElementById("closeRight");
  const back = document.getElementById("panelBack");

  if(openLeft) openLeft.addEventListener("click", ()=>panel.open("left"));
  if(openRight) openRight.addEventListener("click", ()=>panel.open("right"));
  if(closeLeft) closeLeft.addEventListener("click", ()=>panel.closeAll());
  if(closeRight) closeRight.addEventListener("click", ()=>panel.closeAll());
  if(back) back.addEventListener("click", ()=>panel.closeAll());

  window.addEventListener("keydown",(e)=>{
    if(e.key === "Escape") panel.closeAll();
  });
})();
