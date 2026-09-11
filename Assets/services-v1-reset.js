
document.addEventListener("DOMContentLoaded", () => {
  const viewport = document.querySelector(".v1-desktop-viewport");
  const canvas = document.querySelector(".v1-canvas");

  function fitDesktop(){
    if(!viewport || !canvas || window.innerWidth < 901) return;
    const scale = window.innerWidth / 1135;
    canvas.style.transform = `scale(${scale})`;
    viewport.style.height = `${canvas.offsetHeight * scale}px`;
  }

  fitDesktop();
  window.addEventListener("resize", fitDesktop);

  document.querySelectorAll(".v1-desktop-viewport .faq-item button").forEach(btn => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      const open = item.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      const sign = btn.querySelector("b");
      if(sign) sign.textContent = open ? "−" : "+";
      requestAnimationFrame(fitDesktop);
    });
  });
});
