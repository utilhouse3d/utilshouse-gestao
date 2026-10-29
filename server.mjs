import http from 'node:http';
import {readFileSync} from 'node:fs';
import {randomBytes,scrypt as derive,timingSafeEqual} from 'node:crypto';
import {promisify} from 'node:util';
import {pathToFileURL} from 'node:url';
const scrypt=promisify(derive);
export async function createApp({password,origin='http://localhost:3000',production=false,now=Date.now}={}) {
 if(typeof password!=='string'||password.length<12)throw Error('Configure INITIAL_PASSWORD com pelo menos 12 caracteres.');
 if(new URL(origin).origin!==origin||production&&!origin.startsWith('https://'))throw Error('Configure APP_ORIGIN corretamente; produção exige HTTPS.');
 const users=new Map();
 for(const name of ['Felipe','Vinicius','Bruxao']){const salt=randomBytes(16);users.set(name.toLowerCase(),{name,salt,hash:await scrypt(password,salt,64)});}
 password=null;
 const dummy={salt:randomBytes(16),hash:randomBytes(64)},sessions=new Map(),attempts=new Map();
 let busy=0;
 const platform=readFileSync(new URL('./private/platform.html',import.meta.url),'utf8');
 const logo=platform.match(/<img class="brand-logo"[^>]*>/)[0];
 const login=error=>`<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Entrar · UtilsHouse</title><style>body{margin:0;background:#0b1220;color:#e9f1fa;font-family:system-ui;min-height:100vh;display:grid;place-items:center}main{width:min(360px,calc(100% - 64px));background:#16253a;border:1px solid #33465e;border-radius:18px;padding:28px;margin:20px}.brand-logo{width:100px;height:100px;object-fit:contain;display:block;margin:auto;border-radius:50%}h1{text-align:center;font-size:24px}p{color:#bcd0e2}label{display:block;margin:16px 0 6px}input,button{box-sizing:border-box;width:100%;padding:12px;border-radius:8px;border:1px solid #455d75;background:#0b1220;color:white;font-size:16px}button{background:#df7400;margin-top:24px;font-weight:bold;cursor:pointer}.error{color:#ffb4b4}</style><main>${logo}<h1>Entrar na UtilsHouse</h1><p>Gestão de impressão 3D</p>${error?'<p role="alert" class="error">'+error+'</p>':''}<form method="post" action="/login"><label for="user">Usuário</label><input id="user" name="username" autocomplete="username" required maxlength="80"><label for="password">Senha</label><input id="password" name="password" type="password" autocomplete="current-password" required maxlength="256"><button>Entrar</button></form></main></html>`;
 const cookie=(token,age)=>`uh_session=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${age}${production?'; Secure':''}`;
 const server=http.createServer(async(req,res)=>{
  res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('X-Frame-Options','DENY');res.setHeader('Referrer-Policy','no-referrer');
  res.setHeader('Content-Security-Policy',"default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:; connect-src 'self'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'");
  if(production)res.setHeader('Strict-Transport-Security','max-age=31536000');
  const send=(status,body)=>{res.writeHead(status,{'Content-Type':'text/html; charset=utf-8'});res.end(body);};
  const redirect=to=>{res.writeHead(303,{Location:to});res.end();};
  try{
   for(const [k,v] of sessions)if(v.expires<=now())sessions.delete(k);
   for(const [k,v] of attempts)if(v.until<=now())attempts.delete(k);
   const token=(req.headers.cookie||'').split(';').map(v=>v.trim()).find(v=>v.startsWith('uh_session='))?.slice(11);
   const session=sessions.get(token);const url=new URL(req.url,origin);
   if(req.method==='POST'){
    if(req.headers.origin!==origin)return send(403,'Origem inválida.');
    if(!['/login','/logout'].includes(url.pathname))return send(404,'Não encontrado.');
    if(!req.headers['content-type']?.startsWith('application/x-www-form-urlencoded'))return send(415,'Formato inválido.');
    let raw='';for await(const chunk of req){raw+=chunk;if(Buffer.byteLength(raw)>4096)return send(413,'Pedido muito grande.');}
    const form=new URLSearchParams(raw);
    if(url.pathname==='/logout'){sessions.delete(token);res.setHeader('Set-Cookie',cookie('',0));return redirect('/login');}
    const id=(form.get('username')||'').trim().toLowerCase();const secret=form.get('password')||'';
    // Account and global limits also protect deployments behind a reverse proxy.
    const keys=['global','account:'+id.slice(0,80),'ip:'+req.socket.remoteAddress];
    const limits=[100,10,50];
    if(busy>=4||keys.some((k,i)=>(attempts.get(k)?.count||0)>=limits[i])){res.setHeader('Retry-After','900');return send(429,login('Muitas tentativas. Tente novamente em 15 minutos.'));}
    keys.forEach(k=>{const a=attempts.get(k)||{count:0,until:now()+900000};a.count++;attempts.set(k,a);});
    if(secret.length>256||id.length>80)return send(401,login('Usuário ou senha incorretos.'));
    const user=users.get(id),record=user||dummy;busy++;
    let hash;try{hash=await scrypt(secret,record.salt,64);}finally{busy--;}
    if(!timingSafeEqual(hash,record.hash)||!user)return send(401,login('Usuário ou senha incorretos.'));
    if(sessions.size>=10000)return send(503,'Tente novamente mais tarde.');
    sessions.delete(token);const next=randomBytes(32).toString('hex');sessions.set(next,{name:user.name,expires:now()+8*3600000});
    res.setHeader('Set-Cookie',cookie(next,8*3600));return redirect('/');
   }
   if(req.method!=='GET')return send(405,'Método não permitido.');
   if(url.pathname==='/login')return session?redirect('/'):send(200,login(''));
   if(url.pathname!=='/'&&url.pathname!=='/index.html')return send(404,'Não encontrado.');
   if(!session)return redirect('/login');
   const bar=`<aside style="padding:12px 24px;background:#16253a;display:flex;align-items:center;justify-content:space-between;gap:16px"><span>Conectado: <strong>${session.name}</strong></span><form method="post" action="/logout"><button style="width:auto;margin:0">Sair</button></form></aside>`;
   // Legacy storage is preserved: all three users on this browser see the same local records.
   const guard=`<script>addEventListener('pageshow',e=>{if(e.persisted)location.reload()});setTimeout(()=>location.reload(),28800000);</script>`;
   return send(200,platform.replace('<body>','<body>'+bar).replace('</body>',guard+'</body>'));
  }catch{if(!res.headersSent)send(500,'Não foi possível concluir. Tente novamente.');else res.end();}
 });
 server.requestTimeout=15000;server.headersTimeout=10000;
 return server;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const password=process.env.INITIAL_PASSWORD;delete process.env.INITIAL_PASSWORD;
 const port=Number(process.env.PORT||3000),production=process.env.NODE_ENV==='production';
 const app=await createApp({password,origin:process.env.APP_ORIGIN||`http://localhost:${port}`,production});
 app.listen(port,production?'0.0.0.0':'127.0.0.1',()=>console.log(`UtilsHouse pronta na porta ${port}.`));
}
