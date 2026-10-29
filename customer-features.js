(()=>{
const tg="https://t.me/CriptoWi";
const wa="https://wa.me/79614752898";
const max="https://max.ru/u/f9LHodD0cOKMQiGT25vi2PJVlsUYnlIQKWIL05nfoQ5C6WfHNeq9M0hcJnU";
const css=document.createElement("style");
css.textContent=`.pm-section{padding:65px clamp(18px,6vw,95px);background:#151517;color:#e8e2d8}.pm-inner{max-width:1120px;margin:auto}.pm-section h2,.pm-modal h2{font:clamp(27px,4vw,44px) Georgia,serif;color:#dac8ae}.pm-card{border:1px solid #554636;background:#201f21;padding:23px;border-radius:12px}.pm-columns{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px}.pm-muted{color:#bdb5aa;line-height:1.6}.pm-modal{background:#19181a;color:#f1e9dd;border:1px solid #7b6247;border-radius:12px;max-width:560px;width:calc(100% - 28px);padding:28px;max-height:90vh;overflow:auto}.pm-modal::backdrop{background:#000b}.pm-modal label{display:block;margin:15px 0;color:#e3d2ba}.pm-modal input,.pm-modal select,.pm-modal textarea{width:100%;display:block;margin-top:7px;background:#282629;color:white;border:1px solid #70604a;border-radius:7px;padding:12px;font:inherit;box-sizing:border-box}.pm-modal textarea{min-height:100px}.pm-modal button,.pm-review-btn{display:inline-block;margin:7px 6px 7px 0;padding:13px 17px;background:#bba076;color:#161313;border:0;border-radius:7px;font-weight:700;cursor:pointer;font:inherit}.pm-modal .pm-close{float:right;background:#393235;color:#fff}.pm-note{font-size:13px;color:#d1c0a8;line-height:1.5}.pm-review{border-bottom:1px solid #514332;padding:14px 0}.pm-review p{white-space:pre-wrap}.pm-order-trigger{margin-top:12px}.pm-section .eyebrow{color:#bfa376}.pm-review-summary{margin:18px 0 25px;padding:17px 20px;border:1px solid #675137;border-radius:10px;background:linear-gradient(120deg,#27211d,#1a191a);color:#dfc39a}.pm-review-summary strong{font-size:24px;color:#f1d3a1}.pm-review-summary small{color:#c5b9a8}.pm-review-date{font-size:12px;color:#b9a994;margin-top:10px}.pm-card{box-shadow:0 8px 25px #0003}.pm-card .pm-stars{letter-spacing:3px;color:#d5ae68;font-size:21px;margin:0 0 10px}.pm-review-btn:focus-visible,.pm-modal button:focus-visible{outline:2px solid #eacb9b;outline-offset:3px}`;
document.head.append(css);
const mount=document.createElement("section");mount.className="pm-section";mount.id="reviews";mount.innerHTML=`<div class="pm-inner"><p class="eyebrow">ОТЗЫВЫ ПОКУПАТЕЛЕЙ</p><h2>Голоса коллекционеров</h2><p class="pm-muted">Впечатления коллекционеров. Отзывы публикуются автоматически после отправки.</p><div id="pm-review-summary" class="pm-review-summary" hidden></div><div id="pm-review-list" class="pm-columns"></div><button id="pm-review-open" class="pm-review-btn" type="button">Оставить отзыв ↗</button></div>`;
const contact=document.getElementById("contact");contact?.parentNode.insertBefore(mount,contact);
const order=document.createElement("dialog");order.className="pm-modal";order.id="pm-order";order.innerHTML=`<button class="pm-close" type="button" data-close-pm="pm-order">Закрыть ×</button><p class="eyebrow">PAVEL DARK ARTIFACTS</p><h2>Оформить заказ</h2><p class="pm-muted">Выберите работу и удобный мессенджер. Личные данные на сайте указывать не нужно. Сообщение отправится только после вашего подтверждения в приложении.</p><form id="pm-order-form"><label>Работа<input id="pm-order-art" maxlength="120" required></label><label>Куда отправить<select id="pm-order-channel"><option value="telegram">Telegram</option><option value="whatsapp">WhatsApp</option><option value="max">MAX</option></select></label><button type="submit">Продолжить в мессенджере ↗</button><p id="pm-order-status" class="pm-note" role="status"></p></form></dialog>`;
const review=document.createElement("dialog");review.className="pm-modal";review.id="pm-review-dialog";review.innerHTML=`<button class="pm-close" type="button" data-close-pm="pm-review-dialog">Закрыть ×</button><h2>Оставить отзыв</h2><p class="pm-muted">Поделитесь впечатлением — отзыв появится на сайте автоматически. Пожалуйста, не указывайте личные контакты.</p><form id="pm-review-form"><label>Как вас представить<input id="pm-review-name" maxlength="70" required></label><label>Название приобретённой работы<input id="pm-review-art" maxlength="120" required></label><label>Оценка<select id="pm-review-rating"><option value="5">★★★★★ 5</option><option value="4">★★★★☆ 4</option><option value="3">★★★☆☆ 3</option><option value="2">★★☆☆☆ 2</option><option value="1">★☆☆☆☆ 1</option></select></label><label>Ваш отзыв<textarea id="pm-review-text" maxlength="1200" required></textarea></label><label style="position:absolute;left:-9999px" aria-hidden="true">Сайт<input id="pm-review-website" tabindex="-1" autocomplete="off"></label><button type="submit" id="pm-review-submit">Опубликовать отзыв ↗</button><p id="pm-review-status" class="pm-note" role="status"></p></form></dialog>`;
document.body.append(order,review);
function byId(id){return document.getElementById(id)}
document.querySelectorAll("[data-close-pm]").forEach(b=>b.onclick=()=>byId(b.dataset.closePm).close());
byId("pm-review-open").onclick=()=>review.showModal();
function openOrder(art){byId("pm-order-art").value=art||"";order.showModal()}
window.pmOpenOrder=openOrder;
const contactCta=document.createElement("button");contactCta.type="button";contactCta.className="pm-review-btn";contactCta.textContent="Оформить заявку ↗";contactCta.onclick=()=>openOrder("");contact?.querySelector(".contact-actions")?.prepend(contactCta);
document.addEventListener("click",e=>{const b=e.target.closest("[data-pm-order]");if(!b)return;openOrder(b.dataset.pmOrder||"");});
async function deliver(message,channel,statusId){
 const status=byId(statusId);
 if(channel==="whatsapp"){window.open(wa+"?text="+encodeURIComponent(message),"_blank","noopener");status.textContent="Открылся WhatsApp. Проверьте сообщение и нажмите «Отправить».";return}
 // Telegram profile links and MAX do not reliably support prefilled text.
 try{await navigator.clipboard.writeText(message);status.textContent="Текст скопирован! Вставьте его в открывшийся чат и отправьте."}
 catch(e){status.textContent="Скопируйте текст ниже вручную, затем отправьте его в чат:\n"+message}
 window.open(channel==="telegram"?tg:max,"_blank","noopener");
}
byId("pm-order-form").onsubmit=e=>{e.preventDefault();const val=id=>byId(id).value.trim();const msg=`Здравствуйте! Меня интересует работа «${val("pm-order-art")}» из галереи PM | Pavel Dark Artifacts. Подскажите, пожалуйста, наличие, стоимость и условия покупки.`;deliver(msg,val("pm-order-channel"),"pm-order-status")};
const firebaseConfig={apiKey:"AIzaSyCOZXpnkgJdATABb6kuVWGF6j3OunHLI78",authDomain:"pm-dark-artifacts.firebaseapp.com",projectId:"pm-dark-artifacts",appId:"1:467232570292:web:8c5551e5a786a87c8510e1"};
let firestorePromise;
function getFirestore(){
 if(!firestorePromise)firestorePromise=Promise.all([
  import("https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js"),
  import("https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js")
 ]).then(([app,db])=>{
  const instance=app.getApps().length?app.getApp():app.initializeApp(firebaseConfig);
  return {db:db.getFirestore(instance),api:db};
 });
 return firestorePromise;
}
byId("pm-review-form").onsubmit=async e=>{
 e.preventDefault();
 const status=byId("pm-review-status"),button=byId("pm-review-submit");
 const val=id=>byId(id).value.trim();
 if(val("pm-review-website")){status.textContent="Спасибо!";return}
 const name=val("pm-review-name"),artwork=val("pm-review-art"),text=val("pm-review-text"),rating=Number(val("pm-review-rating"));
 if(name.length<2||name.length>60||artwork.length<1||artwork.length>100||text.length<10||text.length>1000||!Number.isInteger(rating)||rating<1||rating>5){status.textContent="Проверьте поля: имя 2–60, работа 1–100, отзыв 10–1000 символов.";return}
 const suspicious=/(https?:\/\/|www\.|t\.me\/|wa\.me\/|@[a-z0-9_]{4,}|(?:\+?\d[\d\s()\-]{8,}\d))/i;
 if(suspicious.test(name+" "+artwork+" "+text)){status.textContent="В отзыве нельзя размещать ссылки, номера телефонов и рекламные контакты.";return}
 const normalized=text.toLocaleLowerCase().replace(/\s+/g," ").trim();
 if(normalized===localStorage.getItem("pm-last-review-text")){status.textContent="Этот отзыв уже был отправлен.";return}
 if(localStorage.getItem("pm-last-review")&&Date.now()-Number(localStorage.getItem("pm-last-review"))<60000){status.textContent="Подождите минуту перед повторной отправкой.";return}
 button.disabled=true;status.textContent="Публикуем отзыв…";
 try{
  const {db,api}=await getFirestore();
  await api.addDoc(api.collection(db,"reviews"),{name,artwork,text,rating,created_at:api.serverTimestamp()});
  localStorage.setItem("pm-last-review",String(Date.now()));
  localStorage.setItem("pm-last-review-text",normalized);
  status.textContent="Спасибо! Ваш отзыв опубликован.";
  byId("pm-review-form").reset();
  await refreshReviews();
 }catch(err){console.error("Review publish error",err);status.textContent="Не удалось отправить отзыв. Проверьте соединение и попробуйте ещё раз."}
 finally{button.disabled=false}
};
async function refreshReviews(){
 const list=byId("pm-review-list");
 try{
  const {db,api}=await getFirestore();
  const snap=await api.getDocs(api.query(api.collection(db,"reviews"),api.limit(150)));
  const visible=snap.docs.map(d=>d.data()).filter(x=>x&&x.name&&x.text&&x.setup!=="ready").sort((a,b)=>(b.created_at?.seconds||0)-(a.created_at?.seconds||0)).slice(0,60);
  list.replaceChildren();
  const summary=byId("pm-review-summary");
  if(visible.length){const avg=visible.reduce((sum,x)=>sum+Math.max(1,Math.min(5,Number(x.rating)||5)),0)/visible.length;summary.hidden=false;summary.replaceChildren();const strong=document.createElement("strong");strong.textContent=avg.toFixed(1)+" ★";const small=document.createElement("small");small.textContent="  ·  "+visible.length+" "+(visible.length===1?"отзыв":"отзывов")+" коллекционеров";summary.append(strong,small)}else{summary.hidden=true}
  for(const entry of visible){
   const box=document.createElement("div");box.className="pm-card";
   const stars=document.createElement("p");stars.className="pm-stars";stars.textContent="★".repeat(Math.max(1,Math.min(5,Number(entry.rating)||5)));
   const body=document.createElement("p");body.textContent=entry.text;body.className="pm-muted";
   const name=document.createElement("strong");name.textContent=entry.name+" · "+(entry.artwork||"Авторская работа");
   box.append(stars,body,name);if(entry.created_at?.toDate){const date=document.createElement("div");date.className="pm-review-date";date.textContent=entry.created_at.toDate().toLocaleDateString("ru-RU",{day:"numeric",month:"long",year:"numeric"});box.append(date)}list.append(box)
  }
  if(!visible.length){const empty=document.createElement("p");empty.className="pm-muted";empty.textContent="Пока отзывов нет. Станьте первым!";list.append(empty)}
 }catch(e){console.error("Review loading error",e);list.textContent="Отзывы временно недоступны. Попробуйте обновить страницу."}
}
refreshReviews();
})();