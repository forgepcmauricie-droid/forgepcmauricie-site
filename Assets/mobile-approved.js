/* Mobile presentation only; existing form endpoints and footer remain intact. */
(()=>{
 const media=matchMedia('(max-width:800px)');
 const page=document.body.dataset.mobilePage;
 const wizardPages=['rdv-service-domicile','rendez-vous','mise-a-niveau','forgepc_diagnostic'];
 if(!wizardPages.includes(page))return;
 const form=document.querySelector('form'),cards=[...form.querySelectorAll('.form-grid > .card')],bottom=form.querySelector('.bottom');
 if(!form||cards.length<3||!bottom)return;
 document.body.classList.add('fp-wizard');
 const photo=document.createElement('img');photo.className='fp-mobile-photo';photo.alt='';
 photo.src='Assets/'+(page==='mise-a-niveau'?'gaming-approche-assemblage.jpg':page==='forgepc_diagnostic'?'hero-workstation-crop.jpg':'subaru-wrx-officiel-crop.jpg');
 document.querySelector('.steps').before(photo);
 const controls=document.createElement('div');controls.className='fp-wizard-controls';
 const back=document.createElement('button'),next=document.createElement('button');back.type=next.type='button';back.textContent='← Retour';next.textContent='Suivant →';controls.append(back,next);form.append(controls);
 const privacy=document.createElement('p');privacy.className='fp-wizard-privacy';privacy.textContent='🔒 Vos informations sont confidentielles.';form.append(privacy);
 const summary=document.createElement('div');summary.className='fp-wizard-summary';summary.tabIndex=-1;bottom.before(summary);
 const signature=document.createElement('div');signature.className='fp-wizard-signature';signature.textContent='Votre technologie, notre expertise.';form.append(signature);
 let step=0;const indicators=[...document.querySelectorAll('.steps .step')],originalActive=indicators.map(e=>e.classList.contains('active'));
 const initial=page==='mise-a-niveau'?2:page==='forgepc_diagnostic'?3:1;
 const advanced=[];
 if(page==='mise-a-niveau'){
  const nodes=[...cards[1].children];const label=nodes.findIndex(e=>e.tagName==='LABEL'&&e.textContent.includes('en main'));
  if(label>=0)advanced.push(...nodes.slice(label));
  const notice=cards[1].querySelector('.notice');if(notice)advanced.push(notice);
 }
 if(page==='forgepc_diagnostic'){
  const children=[...cards[1].children];const start=children.findIndex(e=>e.tagName==='LABEL'&&e.textContent.includes('Âge'));
  advanced.push(...children.slice(start));
  const radios=cards[1].querySelector('.radio-list');
  if(radios){const select=document.createElement('select');select.className='fp-type-select';select.setAttribute('aria-label',"Type d’ordinateur");select.innerHTML='<option value="">Sélectionnez</option>';radios.querySelectorAll('input').forEach(r=>{const o=document.createElement('option');o.value=r.value;o.textContent=r.parentElement.textContent.trim();select.append(o)});select.onchange=()=>radios.querySelectorAll('input').forEach(r=>r.checked=r.value===select.value);radios.before(select);media.addEventListener('change',()=>{select.required=media.matches});select.required=media.matches;}
  const symptoms=cards[2].querySelector('.checks');if(symptoms)advanced.push(symptoms.previousElementSibling,symptoms);
 }
 const mark=(e,hide)=>e.classList.toggle('fp-step-hidden',hide);
 function render(){
  cards.forEach((e,i)=>mark(e,media.matches&&(step===2||(step===0?i>=initial:i<initial))));
  if(page==='forgepc_diagnostic'&&media.matches&&step===1){mark(cards[1],false);mark(cards[2],false);}
  if(page==='mise-a-niveau'&&media.matches&&step===1)mark(cards[1],false);
  advanced.forEach(e=>mark(e,media.matches&&step===0));
  mark(bottom,media.matches&&step!==2);summary.style.setProperty('display',media.matches&&step===2?'block':'none','important');
  back.hidden=step===0;next.hidden=step===2;
  indicators.forEach((e,i)=>{e.classList.toggle('active',media.matches?i===step:originalActive[i]);if(media.matches&&i===step)e.setAttribute('aria-current','step');else e.removeAttribute('aria-current')});
  if(step===2){const lines=['Vérifiez votre demande avant de l’envoyer.'];for(const [key,value] of new FormData(form)){if(key.startsWith('_')||value instanceof File||!value)continue;lines.push(key+' : '+value)}summary.textContent=lines.join('\n');}
 }
 function valid(){for(const e of form.querySelectorAll('input,select,textarea')){if(e.getClientRects().length&&!e.checkValidity()){e.reportValidity();return false}}return true}
 next.onclick=()=>{if(!valid())return;step=Math.min(2,step+1);render();document.querySelector('.steps').scrollIntoView({block:'start',behavior:'smooth'})};
 back.onclick=()=>{step=Math.max(0,step-1);render();document.querySelector('.steps').scrollIntoView({block:'start',behavior:'smooth'})};
 form.addEventListener('invalid',e=>{if(!media.matches)return;const index=cards.findIndex(c=>c.contains(e.target));if(index>=0){step=index<initial?0:1;render()}},true);
 form.addEventListener('keydown',e=>{if(media.matches&&step<2&&e.key==='Enter'&&e.target.tagName!=='TEXTAREA'){e.preventDefault();next.click()}});
 media.addEventListener('change',render);render();
})();
