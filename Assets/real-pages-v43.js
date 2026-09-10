
document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.faq-row').forEach(row=>{
    if(row.dataset.fpBound) return;
    row.dataset.fpBound='1';
    row.addEventListener('click',(e)=>{
      if(e.target.closest('a')) return;
      row.classList.toggle('open');
      const b=row.querySelector('button');
      if(b) b.textContent=row.classList.contains('open')?'−':'+';
    });
  });
});
