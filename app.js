// Данные редактируются только через Supabase Auth + RLS. Никаких паролей в исходном коде.
const TELEGRAM_URL="https://t.me/CriptoWi";
const seed = [];

const $=id=>document.getElementById(id);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const money=n=>Number(n)>0?new Intl.NumberFormat("ru-RU").format(n)+" ₽":"Цена по запросу";
const configured=Boolean(window.SUPABASE_URL&&window.SUPABASE_ANON_KEY&&window.supabase);
const db=configured?window.supabase.createClient(window.SUPABASE_URL,window.SUPABASE_ANON_KEY):null;
let items=seed,cat="Все",authorized=false,collection="Все";
const errText=e=>e?.message||"Неизвестная ошибка";
function image(p){return p.image?`<img src="${esc(p.image)}" alt="${esc(p.title)}" loading="lazy">`:`<div class="placeholder">${esc(p.title)}</div>`}
function render(){const availableCollections=cat==="Все"?[]:[...new Set(items.filter(p=>p.category===cat).map(p=>p.collection).filter(Boolean))].sort((a,b)=>a.localeCompare(b,"ru"));if(collection!=="Все"&&!availableCollections.includes(collection))collection="Все";$("collectionArea").hidden=availableCollections.length===0;$("collectionFilters").innerHTML=availableCollections.length?`<button class="${collection==="Все"?"active":""}" data-collection="Все">Все в категории</button>`+availableCollections.map(name=>`<button class="${collection===name?"active":""}" data-collection="${esc(name)}">${esc(name)}</button>`).join(""):"";$("collectionFilters").querySelectorAll("[data-collection]").forEach(button=>button.onclick=()=>{collection=button.dataset.collection;render()});const list=items.filter(p=>(cat==="Все"||p.category===cat)&&(collection==="Все"||p.collection===collection));$("workCount").textContent=String(items.length).padStart(2,"0");$("grid").innerHTML=list.map(p=>`<article class="card" tabindex="0" data-id="${esc(p.id)}"><div class="photo">${image(p)}</div><div class="meta"><div><h3>${esc(p.title)}</h3><p>${esc(p.category)}${p.collection?" · "+esc(p.collection):""}${p.size?" · "+esc(p.size):""}</p><span class="status">${p.available?"Доступно для заказа":"Нет в наличии"}</span></div><span class="price">${money(p.price)}</span></div></article>`).join("");$("empty").classList.toggle("hidden",list.length>0);document.querySelectorAll(".card").forEach(c=>{c.onclick=()=>detail(c.dataset.id);c.onkeydown=e=>{if(e.key==="Enter")detail(c.dataset.id)}})}
function detail(id){const p=items.find(x=>x.id===id);if(!p)return;const url=TELEGRAM_URL+"?text="+encodeURIComponent("Здравствуйте! Интересует работа «"+p.title+"». Подскажите наличие и условия заказа.");$("detailContent").innerHTML=`<div class="detail-layout"><div class="detail-photos">${(p.gallery?.length?p.gallery:[p.image]).filter(Boolean).map((src,i)=>`<img src="${esc(src)}" alt="${esc(p.title)} — фото ${i+1}" loading="lazy">`).join("")||image(p)}</div><div><p class="eyebrow">${esc(p.category)}</p><h2>${esc(p.title)}</h2><p>${esc(p.description)}</p><p>${p.size?"Размер: "+esc(p.size):""}</p><h3>${money(p.price)}</h3><button class="button dark pm-order-trigger" type="button" data-pm-order="${esc(p.title)}">Оформить заказ ↗</button></div></div>`;$("detail").showModal()}
document.querySelectorAll("[data-cat]").forEach(b=>b.onclick=()=>{cat=b.dataset.cat;collection="Все";document.querySelectorAll("[data-cat]").forEach(x=>x.classList.toggle("active",x===b));render()});
$("telegram").href=TELEGRAM_URL;document.querySelectorAll("[data-close]").forEach(b=>b.onclick=()=>$(b.dataset.close).close());
async function refresh(){
// GitHub catalog is authoritative. Do not merge old hardcoded cards or Supabase:
 // removed or unpublished artworks must not reappear.
try{
  const response=await Promise.race([
    fetch("./catalog-github.json?ts="+Date.now(),{cache:"no-store"}),
    new Promise((_,reject)=>setTimeout(()=>reject(new Error("Catalog timeout")),8000))
  ]);
  if(!response.ok)throw new Error("HTTP "+response.status);
  const parsed=await response.json();
  if(!Array.isArray(parsed))throw new Error("Invalid catalog format");
  items=parsed.filter(p=>p&&p.published!==false&&p.id&&p.title);
}catch(e){
  console.warn("GitHub catalog unavailable; do not restore deleted artworks from old fallbacks",e);
  items=[];
}
render();
$("collectionSuggestions").innerHTML=[...new Set(items.map(p=>p.collection).filter(Boolean))].map(c=>`<option value="${esc(c)}"></option>`).join("");
}
async function checkAdmin(){if(!db)return false;const {data:{user}}=await db.auth.getUser();if(!user)return false;const {data,error}=await db.from("admins").select("user_id").eq("user_id",user.id).maybeSingle();return !error&&!!data}
async function showAuth(){authorized=await checkAdmin();$("login").classList.toggle("hidden",authorized);$("panel").classList.toggle("hidden",!authorized);if(authorized)await adminRender()}
$("adminOpen").onclick=()=>{window.location.href="./admin-dashboard.html"};
$("loginBtn").onclick=async()=>{if(!db){$("error").textContent="Сначала настройте Supabase в config.js";return}$("loginBtn").disabled=true;try{const {error}=await db.auth.signInWithPassword({email:$("email").value.trim(),password:$("password").value});if(error)throw error;await showAuth();if(!authorized){await db.auth.signOut();$("error").textContent="Этот аккаунт не назначен администратором."}}catch(e){$("error").textContent="Ошибка входа: "+errText(e)}finally{$("loginBtn").disabled=false}};
$("password").onkeydown=e=>{if(e.key==="Enter")$("loginBtn").click()};
$("logout").onclick=async()=>{await db.auth.signOut();authorized=false;$("panel").classList.add("hidden");$("login").classList.remove("hidden");reset();await refresh()};
$("add").onclick=()=>{reset();$("form").classList.remove("hidden")};$("cancel").onclick=reset;
function reset(){$("form").reset();$("pid").value="";$("collection").value="";$("available").checked=true;$("published").checked=true;$("form").classList.add("hidden");$("formStatus").textContent=""}
async function adminRender(){if(!authorized)return;const {data,error}=await db.from("artworks").select("*").order("created_at",{ascending:false});if(error){$("adminList").textContent=errText(error);return}$("adminList").innerHTML=(data||[]).map(p=>`<div class="admin-row"><div>${p.image?`<img class="thumb" src="${esc(p.image)}" alt="">`:'<div class="thumb"></div>'}</div><div><strong>${esc(p.title)}</strong><small>${esc(p.category)} · ${money(p.price)} · ${p.published?"Опубликовано":"Черновик"}</small></div><div class="actions"><button data-edit="${esc(p.id)}">Изменить</button> <button data-del="${esc(p.id)}">Удалить</button></div></div>`).join("");document.querySelectorAll("[data-edit]").forEach(b=>b.onclick=()=>edit(b.dataset.edit));document.querySelectorAll("[data-del]").forEach(b=>b.onclick=async()=>{const p=data.find(x=>x.id===b.dataset.del);if(!p||!confirm("Удалить «"+p.title+"»?"))return;const {error}=await db.from("artworks").delete().eq("id",p.id);if(error)alert(errText(error));else{await refresh();await adminRender()}});window._adminRows=data}
function edit(id){const p=(window._adminRows||[]).find(x=>x.id===id);if(!p)return;$("pid").value=p.id;$("title").value=p.title;$("category").value=p.category;$("collection").value=p.collection||"";$("price").value=p.price;$("size").value=p.size||"";$("image").value=p.image?.startsWith("http")?p.image:"";$("description").value=p.description||"";$("available").checked=p.available;$("published").checked=p.published;$("form").classList.remove("hidden");$("form").scrollIntoView({behavior:"smooth",block:"nearest"})}
async function uploadFiles(files){const urls=[];for(const file of files){if(file.size>10*1024*1024)throw Error("Файл больше 10 МБ: "+file.name);if(!["image/jpeg","image/png","image/webp"].includes(file.type))throw Error("Недопустимый формат: "+file.name);const ext=({"image/jpeg":"jpg","image/png":"png","image/webp":"webp"})[file.type];const path=crypto.randomUUID()+"."+ext;const {error}=await db.storage.from("artworks").upload(path,file,{contentType:file.type,upsert:false});if(error)throw error;urls.push(db.storage.from("artworks").getPublicUrl(path).data.publicUrl)}return urls}
$("form").onsubmit=async e=>{e.preventDefault();if(!authorized)return;$("saveBtn").disabled=true;$("formStatus").textContent="Сохраняем...";try{const id=$("pid").value,old=(window._adminRows||[]).find(x=>x.id===id);const uploaded=await uploadFiles([...( $("photos").files||[] )]);const external=$("image").value.trim();const gallery=uploaded.length?uploaded:(external&&external!==old?.image?[external]:old?.gallery||[]);const payload={title:$("title").value.trim(),category:$("category").value,collection:$("collection").value.trim(),price:Number($("price").value)||0,size:$("size").value.trim(),image:uploaded[0]||external||old?.image||"",gallery,description:$("description").value.trim(),available:$("available").checked,published:$("published").checked};const result=id?await db.from("artworks").update(payload).eq("id",id):await db.from("artworks").insert(payload);if(result.error)throw result.error;reset();await refresh();await adminRender()}catch(e){$("formStatus").textContent="Ошибка: "+errText(e)}finally{$("saveBtn").disabled=false}};
refresh();

// Collections feature preparation: managed categories remain unchanged.
