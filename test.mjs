import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createApp} from './server.mjs';
test('authentication, protected files, sessions and rate limiting',async()=>{
 const password='Test-only-Password-42!';let time=Date.now();
 const app=await createApp({password,origin:'http://localhost:3000',now:()=>time});
 await new Promise(r=>app.listen(0,'127.0.0.1',r));const base=`http://127.0.0.1:${app.address().port}`;
 const get=(path,cookie)=>fetch(base+path,{redirect:'manual',headers:cookie?{cookie}:{}});
 const post=(path,body,cookie,origin='http://localhost:3000')=>fetch(base+path,{method:'POST',redirect:'manual',headers:{origin,'content-type':'application/x-www-form-urlencoded',...(cookie?{cookie}:{})},body:new URLSearchParams(body)});
 try{
  assert.equal((await get('/')).status,303);
  for(const path of ['/private/platform.html','/server.mjs','/.env','/../private/platform.html'])assert.equal((await get(path)).status,404);
  assert.equal((await post('/login',{username:'Felipe',password},null,'https://evil.example')).status,403);
  assert.equal((await post('/login',{username:'Felipe',password:'wrong'})).status,401);
  let last;
  for(const username of ['Felipe','VINICIUS','bruxao']){
   const r=await post('/login',{username,password});assert.equal(r.status,303);
   const full=r.headers.get('set-cookie');assert.match(full,/HttpOnly/);assert.match(full,/SameSite=Strict/);
   last=full.split(';')[0];const p=await get('/',last);assert.equal(p.status,200);const html=await p.text();assert.match(html,/Receitas e Financeiro/);assert.ok(!html.includes(password));
  }
  await post('/logout',{},last);assert.equal((await get('/',last)).status,303);
  const r=await post('/login',{username:'Felipe',password});last=r.headers.get('set-cookie').split(';')[0];time+=8*3600000+1;assert.equal((await get('/',last)).status,303);
  for(let i=0;i<10;i++)await post('/login',{username:'nobody',password:'wrong'});
  assert.equal((await post('/login',{username:'nobody',password:'wrong'})).status,429);
 }finally{await new Promise(r=>app.close(r));}
});
test('production requires HTTPS and secure cookies',async()=>{
 await assert.rejects(createApp({password:'Test-only-Password-42!',production:true}));
 const app=await createApp({password:'Test-only-Password-42!',production:true,origin:'https://gestao.example'});
 await new Promise(r=>app.listen(0,'127.0.0.1',r));
 try{const r=await fetch(`http://127.0.0.1:${app.address().port}/login`,{method:'POST',redirect:'manual',headers:{origin:'https://gestao.example','content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({username:'Felipe',password:'Test-only-Password-42!'})});assert.match(r.headers.get('set-cookie'),/; Secure/);}finally{await new Promise(r=>app.close(r));}
});
