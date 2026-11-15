const qs=new URLSearchParams(location.search), id=qs.get('id');
const p=products().find(x=>x.id===id), mount=document.querySelector('#productDetail');
const returnURL='index.html'+(qs.get('return')||'');document.querySelector('#back').href=returnURL;document.querySelector('#backTop').href=returnURL;
if(!p){mount.innerHTML='<h1>Товар не знайдено</h1><p>Поверніться до каталогу.</p>';}else{
 document.title=p.name+' — OUTFIT STORE';
 const photos=p.images||[], sizes=Object.entries(p.stock).sort(([a],[b])=>compareSizes(a,b)),available=sizes.some(([,n])=>n>0);
 const main=photos[0]||'';
 mount.innerHTML=`<div class="detail-layout"><div class="gallery"><div class="gallery-main" id="galleryMain" role="button" tabindex="0" aria-label="Відкрити фото на весь екран">${main?`<img id="mainImage" src="${escapeHTML(main)}" alt="${escapeHTML(p.name)}" decoding="async" fetchpriority="high">`:'<div class="gallery-placeholder">OUTFIT<br><small>Фото буде додано</small></div>'}</div><div class="gallery-thumbs" id="galleryThumbs">${photos.map((src,i)=>`<button type="button" class="gallery-thumb ${i===0?'active':''}" data-photo="${i}" aria-label="Фото ${i+1}" aria-pressed="${i===0}"><img src="${escapeHTML(src)}" alt="${escapeHTML(p.name)} — фото ${i+1}" loading="lazy"></button>`).join('')}</div></div><div class="detail-info"><p class="detail-cat">${escapeHTML(p.category)}</p><h1>${escapeHTML(p.name)}</h1><p class="detail-price">${money(p.price)} ${p.oldPrice>p.price?`<span class="old">${money(p.oldPrice)}</span>`:''}</p><p class="detail-label">Оберіть розмір</p><div class="sizes detail-sizes">${sizes.map(([s,n])=>`<button type="button" class="size" data-detail-size="${escapeHTML(s)}" ${n<1?'disabled':''}>${escapeHTML(s)}</button>`).join('')}</div><p id="sizeMessage" class="detail-hint">${available?'Виберіть доступний розмір':'Немає в наявності'}</p><button class="add detail-add" id="detailAdd" ${!available?'disabled':''}>${available?'ДОДАТИ В КОШИК':'НЕМАЄ В НАЯВНОСТІ'}</button><p class="notice">Тестовий каталог: оформлення замовлень поки недоступне.</p><p class="detail-id">ID товару: ${escapeHTML(p.id)}</p></div></div>`;
 // Fullscreen viewer uses the actual product images, never a thumbnail.
 if(photos.length){
  const viewer=document.createElement('div');viewer.className='photo-viewer';viewer.id='photoViewer';viewer.hidden=true;
  viewer.innerHTML='<div class="photo-viewer-top"><span id="photoViewerCount"></span><div class="photo-zoom-actions"><button type="button" id="photoZoomOut" aria-label="Зменшити фото">−</button><span id="photoZoomLevel">100%</span><button type="button" id="photoZoomIn" aria-label="Збільшити фото">+</button><button type="button" id="photoZoomReset" aria-label="Повернути масштаб">↺</button></div><button type="button" id="photoViewerClose" aria-label="Закрити фото">✕</button></div><button type="button" class="photo-viewer-arrow prev" id="photoViewerPrev" aria-label="Попереднє фото">‹</button><img id="photoViewerImage" alt="Фото товару у повному розмірі"><button type="button" class="photo-viewer-arrow next" id="photoViewerNext" aria-label="Наступне фото">›</button><p class="photo-viewer-tip">Натисніть на фото, щоб збільшити · Проведіть пальцем для наступного</p>';
  document.body.appendChild(viewer);
  let current=0, zoomed=false, touchX=null, priorFocus=null, scale=1, offsetX=0, offsetY=0, pinchStart=null;
  const viewImg=viewer.querySelector('#photoViewerImage');
  function applyZoom(){viewImg.style.transform=`translate(${offsetX}px, ${offsetY}px) scale(${scale})`;viewer.querySelector('#photoZoomLevel').textContent=Math.round(scale*100)+'%';viewImg.style.cursor=scale>1?'grab':'zoom-in'}
  function setZoom(n){scale=Math.max(1,Math.min(4,n));if(scale===1){offsetX=0;offsetY=0}applyZoom()}
  function renderViewer(){scale=1;offsetX=0;offsetY=0;applyZoom();viewImg.src=photos[current];viewImg.alt=p.name+' — фото '+(current+1);viewer.querySelector('#photoViewerCount').textContent=(current+1)+' / '+photos.length;viewer.querySelector('#photoViewerPrev').hidden=photos.length<2;viewer.querySelector('#photoViewerNext').hidden=photos.length<2;zoomed=false;viewImg.classList.remove('zoomed')}
  function openViewer(i){priorFocus=document.activeElement;current=i;viewer.hidden=false;document.body.classList.add('photo-viewer-open');renderViewer();viewer.querySelector('#photoViewerClose').focus()}
  function closeViewer(){viewer.hidden=true;document.body.classList.remove('photo-viewer-open');viewImg.removeAttribute('src');if(priorFocus&&priorFocus.focus)priorFocus.focus()}
  function moveViewer(n){current=(current+n+photos.length)%photos.length;renderViewer()}
  document.querySelector('#galleryMain').addEventListener('click',()=>{const active=document.querySelector('.gallery-thumb.active');openViewer(active?Number(active.dataset.photo):0)});
  document.querySelector('#galleryMain').addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();const active=document.querySelector('.gallery-thumb.active');openViewer(active?Number(active.dataset.photo):0)}});
  viewer.querySelector('#photoViewerClose').onclick=closeViewer;
  viewer.querySelector('#photoViewerPrev').onclick=()=>moveViewer(-1);
  viewer.querySelector('#photoViewerNext').onclick=()=>moveViewer(1);
  viewer.addEventListener('click',e=>{if(e.target===viewer)closeViewer()});
  viewer.querySelector('#photoZoomIn').onclick=()=>setZoom(scale+.5);
  viewer.querySelector('#photoZoomOut').onclick=()=>setZoom(scale-.5);
  viewer.querySelector('#photoZoomReset').onclick=()=>setZoom(1);
  viewImg.addEventListener('click',()=>setZoom(scale>1?1:2));
  viewImg.addEventListener('wheel',e=>{e.preventDefault();setZoom(scale+(e.deltaY<0?.25:-.25))},{passive:false});
  let drag=null;viewImg.addEventListener('pointerdown',e=>{if(scale<=1||e.pointerType==='touch')return;drag={x:e.clientX,y:e.clientY,ox:offsetX,oy:offsetY};viewImg.setPointerCapture(e.pointerId)});
  viewImg.addEventListener('pointermove',e=>{if(!drag)return;offsetX=drag.ox+e.clientX-drag.x;offsetY=drag.oy+e.clientY-drag.y;applyZoom()});
  viewImg.addEventListener('pointerup',()=>drag=null);viewImg.addEventListener('pointercancel',()=>drag=null);
  viewImg.addEventListener('touchstart',e=>{if(e.touches.length===2){pinchStart={dist:Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY),scale};touchX=null}},{passive:true});
  viewImg.addEventListener('touchmove',e=>{if(e.touches.length===2&&pinchStart){e.preventDefault();const d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);setZoom(pinchStart.scale*d/pinchStart.dist)}},{passive:false});
  viewImg.addEventListener('touchend',e=>{if(e.touches.length<2)pinchStart=null},{passive:true});
  viewer.addEventListener('touchstart',e=>{if(e.touches.length===1)touchX=e.touches[0].clientX},{passive:true});
  viewer.addEventListener('touchend',e=>{if(touchX===null)return;const dx=e.changedTouches[0].clientX-touchX;touchX=null;if(scale===1&&Math.abs(dx)>55&&photos.length>1)moveViewer(dx<0?1:-1)},{passive:true});
  document.addEventListener('keydown',e=>{if(viewer.hidden)return;if(e.key==='Escape')closeViewer();else if(e.key==='ArrowLeft')moveViewer(-1);else if(e.key==='ArrowRight')moveViewer(1)});
 }
 let selected='';document.querySelectorAll('[data-detail-size]').forEach(b=>b.onclick=()=>{selected=b.dataset.detailSize;document.querySelectorAll('[data-detail-size]').forEach(x=>x.classList.toggle('selected',x===b));document.querySelector('#sizeMessage').textContent='Розмір є в наявності'});
 document.querySelectorAll('[data-photo]').forEach(b=>b.onclick=()=>{const i=Number(b.dataset.photo);const img=document.querySelector('#mainImage');if(img){img.src=photos[i];img.alt=p.name+' — фото '+(i+1)}document.querySelectorAll('[data-photo]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b))})});
 document.querySelector('#detailAdd').onclick=()=>{if(!selected){document.querySelector('#sizeMessage').textContent='Спочатку оберіть розмір';return;}const lines=cart();const line=lines.find(x=>x.id===p.id&&x.size===selected);if(line){if(line.qty>=p.stock[selected]){alert('Більше немає в наявності');return;}line.qty++}else lines.push({id:p.id,size:selected,qty:1});set('cart',lines);document.querySelector('#sizeMessage').textContent='Додано до кошика (тестовий режим)'};
}
