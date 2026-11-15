(function(){
 const toggle=document.getElementById('mobileMenuToggle');
 const menu=document.getElementById('mobileCategoryMenu');
 const backdrop=document.getElementById('mobileMenuBackdrop');
 if(!toggle||!menu||!backdrop)return;
 const names=['Усі товари','Взуття','Вітровки/курточки демісезон','Джинси','Джинсові куртки','Жилетки','Комплекти Сорочка Шорти','Костюми футболка + шорти','Костюми футболка + штани','Куртки зима','Светри','Сорочка + Штани','Сорочки','Спортивні костюми Зима','Спортивні костюми Літо','Спортивні штани Зима','Спортивні штани Літо','Термокомплекти','Футболки / поло','Худі /світшоти /лонгсліви','Штани/чіноси','Шапки / бафи','Шкарпетки','Шорти','Sale'];
 const detailCats=document.getElementById('productMobileCats');
 if(detailCats){const ret=new URLSearchParams(location.search).get('return')||'';detailCats.replaceChildren(...names.map(name=>{const a=document.createElement('a');a.textContent=name;a.className=name==='Sale'?'sale':'';const p=new URLSearchParams(ret);if(name==='Усі товари')p.delete('category');else p.set('category',name);a.href='index.html'+(p.toString()?'?'+p.toString():'');return a;}));}
 function open(){document.body.classList.add('mobile-menu-open');backdrop.hidden=false;toggle.setAttribute('aria-expanded','true');toggle.setAttribute('aria-label','Закрити меню категорій');}
 function close(){document.body.classList.remove('mobile-menu-open');backdrop.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Відкрити меню категорій');}
 toggle.addEventListener('click',()=>document.body.classList.contains('mobile-menu-open')?close():open());
 backdrop.addEventListener('click',close);
 menu.addEventListener('click',e=>{if(e.target.closest('[data-cat],a'))close();});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.body.classList.contains('mobile-menu-open')){close();toggle.focus();}});
 window.addEventListener('resize',()=>{if(window.innerWidth>720)close();});
})();
