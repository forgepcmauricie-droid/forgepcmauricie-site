(function(){
  const file=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  const section=file==='index.html'?'index':file.includes('inventaire')||file==='pc.html'||file.includes('vente')?'inventaire':file.includes('propos')?'apropos':file.includes('contact')?'contact':file.includes('rendez-vous')||file.startsWith('rdv-')?'rendezvous':'services';
  const active=name=>section===name?' class="active"':'';
  const links=`<a${active('index')} href="index.html">Accueil</a><a${active('services')} href="services.html">Services</a><a${active('inventaire')} href="inventaire.html">Inventaire</a><a${active('apropos')} href="a-propos.html">À propos</a><a${active('contact')} href="contact.html">Contact</a>`;
  const mobileLinks=`<a${active('index')} href="index.html">Accueil</a><a${active('inventaire')} href="inventaire.html">Inventaire</a><a${active('services')} href="services.html">Services</a><a${active('apropos')} href="a-propos.html">À propos</a><a${active('rendezvous')} href="rendez-vous.html">Rendez-vous</a><a${active('contact')} href="contact.html">Contact</a>`;
  const header=`<header class="forgepc-unified-header"><div class="shell-nav"><a class="brand-link" href="index.html" aria-label="ForgePC Mauricie"><img class="logo" src="Assets/forgepc-logo-web.png" alt="ForgePC Mauricie"></a><nav class="desktop-nav" aria-label="Navigation principale">${links}</nav><div class="nav-location"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a7 7 0 0 0-7 7c0 5.1 7 13 7 13s7-7.9 7-13a7 7 0 0 0-7-7Zm0 9.6A2.6 2.6 0 1 1 12 6a2.6 2.6 0 0 1 0 5.6Z"/></svg><span>Shawinigan et<br>toute la Mauricie</span></div><button class="menu" type="button" aria-label="Ouvrir le menu" aria-expanded="false"><span class="menu-bar"></span><span class="menu-bar"></span><span class="menu-bar"></span></button></div></header><nav class="forgepc-unified-mobile-nav" aria-label="Navigation mobile">${mobileLinks}</nav>`;
  const footer=`<footer id="forgepc-footer"><div class="fp-wrap"><div class="fp-main"><img alt="ForgePC Mauricie" class="fp-logo" src="Assets/forgepc-logo-web.png"><div class="fp-tag">Votre technologie, notre expertise.</div><div class="fp-social" aria-label="Réseaux sociaux"><span class="social-circle">f</span><span class="social-circle">◎</span></div><div class="fp-contact"><span><svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-7 7c0 5.1 7 13 7 13s7-7.9 7-13a7 7 0 0 0-7-7Zm0 9.6A2.6 2.6 0 1 1 12 6a2.6 2.6 0 0 1 0 5.6Z"/></svg>Shawinigan et toute la Mauricie</span><span><svg viewBox="0 0 24 24"><path d="M6.6 2.8 10 8.1 7.8 10c1.6 3.3 3.9 5.6 7.2 7.2l1.9-2.2 5.3 3.4c-.5 2.1-2.1 3.6-4.2 3.6C9.2 22 2 14.8 2 6c0-2.1 1.5-3.7 4.6-3.2Z"/></svg>819-944-7418</span><span><svg viewBox="0 0 24 24"><path d="M3 5h18v14H3V5Zm2 2 7 5 7-5H5Z"/></svg>info@forgepcmauricie.ca</span></div></div><div class="fp-bottom"><span>© 2026 ForgePC Mauricie. Tous droits réservés.</span><span>Politique de confidentialité&nbsp;&nbsp; | &nbsp;&nbsp;Mentions légales</span></div></div></footer>`;

  document.addEventListener('DOMContentLoaded',()=>{
    document.querySelectorAll('header, footer, nav.mobile-only, nav.mobile-nav, .m-menu').forEach(el=>el.remove());
    document.body.insertAdjacentHTML('afterbegin',header);
    document.body.insertAdjacentHTML('beforeend',footer);
    const button=document.querySelector('.forgepc-unified-header .menu');
    const nav=document.querySelector('.forgepc-unified-mobile-nav');
    button.addEventListener('click',()=>{const open=nav.classList.toggle('open');button.setAttribute('aria-expanded',open?'true':'false')});
    nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');button.setAttribute('aria-expanded','false')}));
  });
})();
