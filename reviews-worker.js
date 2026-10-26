// Cloudflare Worker + D1: public reviews API for PM | Pavel Dark Artifacts
// Bind D1 as DB. Configure TURNSTILE_SECRET and SITE_ORIGIN in Worker secrets/vars.
// Run reviews-schema.sql in the D1 database before deploying.
const json=(data,status=200,origin="https://pecos8891.github.io")=>new Response(JSON.stringify(data),{status,headers:{"content-type":"application/json; charset=utf-8","access-control-allow-origin":origin,"vary":"Origin","cache-control":"no-store"}});
export default {async fetch(request,env){
 const origin="https://pecos8891.github.io";
 const cors={"access-control-allow-origin":origin,"access-control-allow-methods":"GET, POST, OPTIONS","access-control-allow-headers":"content-type","vary":"Origin"};
 const url=new URL(request.url);
 if(request.method==="OPTIONS")return new Response(null,{status:204,headers:cors});
 if(url.pathname!=="/reviews")return json({error:"Not found"},404,origin);
 if(request.method==="GET"){
  try{const {results}=await env.DB.prepare("SELECT id,name,artwork,rating,text,created_at FROM reviews ORDER BY created_at DESC LIMIT 100").all();return json({reviews:results},200,origin)}
  catch{return json({error:"Отзывы временно недоступны"},503,origin)}
 }
 if(request.method!=="POST")return json({error:"Method not allowed"},405,origin);
 if(request.headers.get("origin")!==origin)return json({error:"Недопустимый источник"},403,origin);
 if(!env.TURNSTILE_SECRET)return json({error:"Защита отзывов не настроена"},503,origin);
 const len=Number(request.headers.get("content-length")||0);
 if(len>12000)return json({error:"Слишком большой запрос"},413,origin);
 let body;try{body=await request.json()}catch{return json({error:"Неверный формат"},400,origin)}
 const clean=(v,max)=>typeof v==="string"?v.trim().slice(0,max):"";
 const name=clean(body.name,70),artwork=clean(body.artwork,120),review=clean(body.text,1200);
 const rating=Number(body.rating),captcha=clean(body.captcha,4096);
 if(name.length<2||artwork.length<2||review.length<15||![1,2,3,4,5].includes(rating)||!captcha)return json({error:"Заполните все поля и пройдите проверку"},400,origin);
 if(/https?:\/\/|www\.|<[^>]*>|(?:telegram|whatsapp|t\.me)\//i.test(review+" "+name))return json({error:"Ссылки в отзывах запрещены"},400,origin);
 const ip=request.headers.get("CF-Connecting-IP")||"unknown";
 const result=await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({secret:env.TURNSTILE_SECRET,response:captcha,remoteip:ip})}).then(r=>r.json()).catch(()=>({success:false}));
 if(!result.success)return json({error:"Проверка на спам не пройдена"},403,origin);
 // Hash IP before storing; never store the address itself.
 const hash=Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(ip+"|"+(env.RATE_SALT||"pm-reviews"))))).map(x=>x.toString(16).padStart(2,"0")).join("");
 try{
  const recent=await env.DB.prepare("SELECT COUNT(*) AS n FROM reviews WHERE ip_hash=? AND created_at > datetime('now','-24 hours')").bind(hash).first();
  if(Number(recent?.n||0)>=2)return json({error:"Лимит: не более двух отзывов в сутки"},429,origin);
  await env.DB.prepare("INSERT INTO reviews(id,name,artwork,rating,text,ip_hash) VALUES(?,?,?,?,?,?)").bind(crypto.randomUUID(),name,artwork,rating,review,hash).run();
  return json({ok:true},201,origin);
 }catch{return json({error:"Не удалось сохранить отзыв"},503,origin)}
}};