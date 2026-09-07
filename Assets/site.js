/* ForgePC Mauricie — navigation mobile + formulaires FormSubmit */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.menu').forEach(button => {
    const header = button.closest('header');
    const nav = header ? header.querySelector('nav') : document.querySelector('nav');
    if (!nav) return;
    button.addEventListener('click', () => {
      nav.classList.toggle('open');
      button.setAttribute('aria-expanded', nav.classList.contains('open') ? 'true' : 'false');
      document.querySelectorAll('.services-page .info h3').forEach(title => {
    title.addEventListener('click', () => {
      const info = title.closest('.info');
      if (window.innerWidth <= 900) info.classList.toggle('open');
    });
  });
});
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
  });
});
