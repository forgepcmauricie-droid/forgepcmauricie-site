/* ForgePC Mauricie — navigation mobile + formulaires */
document.addEventListener('DOMContentLoaded', () => {
  const closeMenu = (header, button, nav) => {
    if (!nav) return;
    nav.classList.remove('open');
    button?.setAttribute('aria-expanded', 'false');
    button?.setAttribute('aria-label', 'Ouvrir le menu');
  };

  document.querySelectorAll('header .menu').forEach(button => {
    const header = button.closest('header');
    const nav = header ? header.querySelector('nav') : null;
    if (!nav || button.dataset.menuReady === 'true') return;
    button.dataset.menuReady = 'true';

    button.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      const isOpen = nav.classList.toggle('open');
      button.setAttribute('aria-expanded', String(isOpen));
      button.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
    });

    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => closeMenu(header, button, nav)));
    document.addEventListener('click', event => {
      if (!header.contains(event.target)) closeMenu(header, button, nav);
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeMenu(header, button, nav);
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) closeMenu(header, button, nav);
    });
  });

  document.querySelectorAll('form[data-mailto]').forEach(form => {
    if (form.dataset.mailReady === 'true') return;
    form.dataset.mailReady = 'true';
    form.addEventListener('submit', event => {
      event.preventDefault();
      const to = form.dataset.mailto;
      const subject = form.dataset.subject || 'Demande ForgePC Mauricie';
      const lines = [];
      form.querySelectorAll('input, select, textarea').forEach(field => {
        if (!field.name || field.type === 'submit' || field.type === 'button' || field.type === 'file') return;
        if ((field.type === 'checkbox' || field.type === 'radio') && !field.checked) return;
        const value = field.value.trim();
        if (value) lines.push(`${field.name} : ${value}`);
      });
      const files = [...form.querySelectorAll('input[type="file"]')].flatMap(input => [...input.files].map(file => file.name));
      if (files.length) lines.push(`Pièces jointes sélectionnées : ${files.join(', ')}`);
      window.location.href = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
      const status = form.querySelector('[data-form-status]');
      if (status) status.textContent = 'Votre logiciel de courriel va s’ouvrir avec votre demande. Vérifiez le message puis envoyez-le.';
    });
  });
});
