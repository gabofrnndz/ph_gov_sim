let seed=1;
const rnd=()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const pick=a=>a[Math.floor(rnd()*a.length)],nm=()=>pick(F)+' '+pick(L),cl=(v,a,b)=>Math.max(a,Math.min(b,v));
const cap=s=>s[0].toUpperCase()+s.slice(1),place=()=>cap(pick(SYL)+pick(SYL)+(rnd()<.5?pick(SYL):''));
const sample=w=>{let t=w.reduce((a,b)=>a+b,0)*rnd();for(let i=0;i<w.length;i++){t-=w[i];if(t<=0)return i}return w.length-1};
const norm=w=>{const t=w.reduce((a,b)=>a+b,0)||1;return w.map(x=>x/t)};
const lean=P=>norm(P.map(p=>p.pop*(.4+rnd()*1.2)));
let GEN=false,CTX=null,BASEY=2025,NMAP={};
const FEM=new Set(['Maria','Ana','Liza','Luz','Carmela','Teresita','Nena','Josefa','Pilar','Marites']);
const curY=()=>GEN||typeof S=='undefined'||!S||S.dt==null?BASEY:yr();
const plist=()=>CTX||(typeof S!='undefined'&&S?S.parties:[]);
function takeName(P){const lines=String((P&&P.names)||'').split('\n').map(x=>x.trim()).filter(Boolean),k=(P&&P.ni)||0;
 if(P&&k<lines.length){P.ni=k+1;const s=lines[k],c=s.indexOf(','),i=s.indexOf(' ');let f,l;if(c>0){l=s.slice(0,c).trim();f=s.slice(c+1).trim()}else if(i>0){f=s.slice(0,i);l=s.slice(i+1).trim()}else{f=s;l=pick(L)}
  ((typeof S!='undefined'&&S&&S.nmap&&!GEN)?S.nmap:NMAP)[f+' '+l]=[l,f];return[f,l]}return[pick(F),pick(L)]}
const ident=(P,lo)=>{const[f,l]=takeName(P);return{name:f+' '+l,first:f,last:l,by:curY()-(lo+Math.floor(rnd()*Math.max(1,72-lo))),sex:FEM.has(f)?'F':'M',occ:pick(OCC)}};
const person=(w,lo)=>{const p=sample(w);return lo==null?{name:nm(),party:p,terms:1}:{...ident(plist()[p],lo),party:p,terms:1}};
const exo=()=>[{name:nm(),party:-1,role:'Liga ng mga Barangay President'},{name:nm(),party:-1,role:'SK Federation President'}];
const tally=(a,n)=>{n=n||S.parties.length+1;const c=Array(n).fill(0);a.forEach(o=>c[o.party<0?n-1:o.party]++);return c};
const W=130,H=190;
function setSeed(s){seed=s|0}
function mem(p,P,lo){P=P||S.parties;const pt=P[p]||{ideo:0},id=ident(P[p],lo||25);return{...id,party:p,ideo:+cl(pt.ideo+(rnd()-.5)*.7,-1,1).toFixed(2),integ:+rnd().toFixed(2),loyal:+rnd().toFixed(2),ambit:+rnd().toFixed(2),int:[pick(INT),pick(INT)],bio:id.occ+', who '+pick(HIST)+'.',trust:50,terms:1,hist:[]}}
function alloc(n,w){const c=w.map(x=>Math.floor(x*n));let k=n-c.reduce((a,b)=>a+b,0);const o=w.map((x,i)=>[x*n-c[i],i]).sort((a,b)=>b[0]-a[0]);for(let i=0;k>0;i++,k--)c[o[i%o.length][1]]++;return c}
function plSeats(s,n,w0){const w=w0||norm(s.plg.map(g=>g.pop*(.85+rnd()*.3))),th=s.con.plThreshold/100,cp=s.con.plCap,c=w.map(x=>x>=th?1:0);let k=n-c.reduce((a,b)=>a+b,0),g=0;
 while(k>0&&g++<999){let b=-1,bv=-1;w.forEach((x,i)=>{if(x>=th&&c[i]<cp){const v=x*n-c[i];if(v>bv){bv=v;b=i}}});if(b<0)break;c[b]++;k--}return c}
function rebuildPL(s,seats){s=s||S;const d=s.house.filter(r=>r.prov>=0),n=Math.floor(d.length*s.con.plShare/(100-s.con.plShare));s.pls=seats||plSeats(s,n);
 s.house=d.concat(s.plg.flatMap((g,gi)=>Array.from({length:s.pls[gi]},()=>({prov:-1,grp:gi,...mem(g.party,s.parties)}))))}
function rebuildCmt(s){s=s||S;s.committees.forEach(c=>{const idx=s.house.map((_,i)=>i).sort(()=>rnd()-.5).slice(0,9);c.mem=idx;c.chair=idx[0]})}
function autoElect(s,ri){const n=(s.regs[ri]&&/BARMM|Bangsamoro/.test(s.regs[ri].name))?80:50,ps=s.provs.filter(p=>p.reg==ri),w=ps.length?norm(s.parties.map((_,i)=>ps.reduce((a,p)=>a+p.lean[i],0))):norm(s.parties.map(p=>p.pop));
 const parl=Array.from({length:n},()=>mem(sample(w),s.parties)),c=tally(parl,s.parties.length),top=c.indexOf(Math.max(...c));s.autos=s.autos||{};s.autos[ri]={parl,cm:{name:parl.find(m=>m.party==top).name,party:top,terms:1}}}
function mkBrgy(m,i){return{name:rnd()<.3?'Poblacion '+(i+1):place(),pb:person(m.lean),kag:Array.from({length:7},()=>person(m.lean)),sk:person(m.lean)}}
function brgys(m){m.brgy=Array.from({length:m.bn},(_,i)=>mkBrgy(m,i))}
function genMap(N,custom){
 let land=custom;
 if(!land){land=new Uint8Array(W*H);
 [[65,38,5,14,21,26,12],[68,100,9,5,10,38,14],[60,150,4,14,20,24,14]].forEach(([cx,cy,n,a,b,sx,sy],g)=>{for(let k=0;k<n;k++){const x=cx+(rnd()*2-1)*sx,y=cy+(rnd()*2-1)*sy,r=a+rnd()*(b-a),p1=rnd()*6,p2=rnd()*6;
  for(let j=0;j<H;j++)for(let i=0;i<W;i++){const dx=i-x,dy=j-y,an=Math.atan2(dy,dx);if(Math.hypot(dx,dy)<r*(1+.18*Math.sin(an*3+p1)+.1*Math.sin(an*7+p2)))land[j*W+i]=g+1}}})}
 const cells=[];land.forEach((v,i)=>{if(v)cells.push(i)});
 const minD=Math.sqrt(cells.length/N)*.72,sites=[];
 for(let t=0;t<8000&&sites.length<N;t++){const c=pick(cells),x=c%W,y=c/W|0;if(sites.every(s=>Math.hypot(s[0]-x,s[1]-y)>minD*(1-t/12000)))sites.push([x,y])}
 while(sites.length<N){const c=pick(cells);sites.push([c%W,c/W|0])}
 const prov=new Int16Array(W*H).fill(-1);
 cells.forEach(c=>{const x=c%W,y=c/W|0;let b=0,bd=1e9;sites.forEach((s,i)=>{const d=(s[0]-x)**2+(s[1]-y)**2;if(d<bd){bd=d;b=i}});prov[c]=b});
 return{land,prov,mun:new Int16Array(W*H).fill(-1),sites}}
function fresh(o){o=Object.assign({N:24,seed:Date.now()%1e9,y0:2025,parties:PARTIES.map(p=>({...p})),land:null},o);
 setSeed(o.seed);GEN=true;BASEY=o.y0;NMAP={};const parties=o.parties.map(p=>({...p})),map=genMap(o.N,o.land),cen=[[65,38],[68,100],[60,150]];CTX=parties;
 const regs=['Hilagang Isla','Gitnang Isla','Silangang Visaya','Kanlurang Visaya','Hilagang Mindanao','BARMM: Bangsamoro Autonomous Region'].map((n,i)=>({name:i<5?'Region '+(i+1)+': '+n:n,auto:i==5,rd:{name:nm(),party:-1}}));
 const provs=[],munis=[],cells=map.sites.map(()=>[]);
 map.land.forEach((v,i)=>{if(v)cells[map.prov[i]].push(i)});
 map.sites.forEach((s,id)=>{
  const g=Math.min(2,map.land[s[1]*W+s[0]]-1),pop=Math.round(120000+rnd()**2*2400000);
  const cls=pop>1.7e6?1:pop>1.1e6?2:pop>7e5?3:pop>4e5?4:pop>2.2e5?5:6,dist=Math.max(1,Math.min(8,Math.round(pop/290000))),ln=lean(parties);
  const p={id,name:place(),pop,cls,dist,reg:g*2+(s[0]>cen[g][0]?1:0),cx:s[0],cy:s[1],lean:ln,mun:[],hist:[]};
  p.gov=person(ln,23);p.vg=person(ln,23);p.sp=Array.from({length:dist>5?dist*2:cls<3?10:cls<5?8:6},()=>person(ln,18));
  p.exo=exo().concat([{name:nm(),party:-1,role:'League of Cities Council Presidents'},{name:nm(),party:-1,role:'League of Municipal Councilors President'}]);
  provs.push(p);
  const cs=cells[id],k=Math.min(cs.length,4+Math.floor(rnd()*5)),ms=[];
  while(ms.length<k){const c=pick(cs);if(!ms.includes(c))ms.push(c)}
  const base=munis.length,cnt=ms.map(()=>0);
  cs.forEach(c=>{const x=c%W,y=c/W|0;let b=0,bd=1e9;ms.forEach((m,j)=>{const d=(m%W-x)**2+((m/W|0)-y)**2;if(d<bd){bd=d;b=j}});map.mun[c]=base+b;cnt[b]++});
  const ms2=ms.map((c,j)=>({id:base+j,prov:id,name:place(),pop:Math.max(5000,Math.round(pop*cnt[j]/cs.length)),city:false,huc:false,lean:norm(ln.map(x=>x*(.6+rnd()*.8))),hist:[]}));
  const order=[...ms2].sort((a,b)=>b.pop-a.pop);if(rnd()<.7)order[0].city=true;if(order[1]&&rnd()<.35)order[1].city=true;
  ms2.forEach(m=>{m.huc=m.city&&m.pop>=200000;m.mayor=person(m.lean,m.city?23:21);m.vm=person(m.lean,m.city?23:21);m.sb=Array.from({length:m.huc?12:m.city?10:8},()=>person(m.lean,18));m.exo=exo();m.bn=m.city?20+Math.floor(rnd()*25):8+Math.floor(rnd()*20);brgys(m);munis.push(m);p.mun.push(m.id)})});
 const pw=parties.map(p=>p.pop),con={...CON0};
 const plg=PLN.map(([name,sector])=>({name,sector,pop:+(.04+rnd()*.14).toFixed(3),party:sample(norm(pw))}));
 const st0={provs,munis,map};provs.forEach(p=>autoDist(p,null,st0));
 const house=provs.flatMap(p=>Array.from({length:p.dist},(_,d)=>({prov:p.id,d:d+1,...mem(sample(p.lean),parties)})));
 const st={dt:0,y0:o.y0,seed:o.seed,parties,map,regs,provs,munis,house,plg,con,player:{party:0},
  pres:mem(0,parties,40),vp:mem(1,parties,40),cabinet:DEPTS.map(d=>({role:d,...mem(sample(norm(pw)),parties)})),
  senate:Array.from({length:24},(_,i)=>({...mem(sample(norm(pw)),parties,35),cls:i%2})),
  justices:Array.from({length:15},(_,i)=>({name:nm(),role:i?'Associate Justice':'Chief Justice',lean:+(rnd()*2-1).toFixed(1)})),
  bodies:[['COMELEC',7],['Commission on Audit',3],['Civil Service Commission',3],['Commission on Human Rights',5],['Office of the Ombudsman',1]].flatMap(([b,n])=>Array.from({length:n},(_,i)=>({name:nm(),role:b+(i?', Commissioner':', Chair')}))),
  committees:CMT.map(([name,tag])=>({name,tag,mem:[],chair:0})),speaker:0,bills:[],nbid:1,crisis:0,next:elecDay(o.y0,o.y0),nextB:bskeDay(o.y0,o.y0),lastPresY:null,
  stats:{approval:56,growth:5.1,treasury:6,corruption:44,order:68,poverty:22,education:55,health:55,environment:50},news:[],elections:[]};
 initExtras(st);st.pres.terms=1;rebuildPL(st);rebuildCmt(st);st.autos={};autoElect(st,5);st.pend=null;st.inaug=null;st.convene=null;GEN=false;CTX=null;st.nmap=NMAP;return st}

function initExtras(st){st.nation=st.nation||{name:'Republic of the Philippines',motto:'Maka-Diyos, Maka-tao, Makakalikasan at Makabansa',currency:'PHP'};
 st.rules=Object.assign({votingAge:18,quorum:50,attend:.93,sepDays:1,printDays:3,vetoDays:15,overrideLocal:66.7,reviewDays:30,ira:40,ratio:290000},st.rules||{});
 st.budget=st.budget||{fy:st.y0,rev:5600,lines:BUD0.map(([id,name,base,fx,tag,i])=>({id,name,amt:base,nep:base,base,fx,tag,i}))};
 st.laws=st.laws||{};st.ords=st.ords||[];st.plebs=st.plebs||[];st.floor=st.floor||{};st.nmap=st.nmap||NMAP;
 st.provs.forEach(p=>{if(p.dev==null)p.dev=50;if(!p.districts)autoDist(p,p.dist,st);if(!p.distStatus)p.distStatus='enacted'});st.munis.forEach(m=>{if(m.dev==null)m.dev=50});
 if(st.provs.some(p=>!p.ic)||st.munis.some(m=>!m.ic))initIncome(st);st.provs.forEach(p=>{if(!p.pds)autoProv(p,st)});if(st.edit==null)st.edit=true;
 if(st.nation.capital==null||st.provs.some(p=>p.capital==null)||st.regs.some(r=>r.capital===undefined))capitals(st);
 st.flagSd=st.flagSd==null?hash('flag'+st.seed):st.flagSd;return st}
const centroids=s=>{const M=s.map,c=s.munis.map(()=>[0,0,0]);for(let i=0;i<W*H;i++){const m=M.mun[i];if(m>=0&&c[m]){c[m][0]+=i%W;c[m][1]+=(i/W|0);c[m][2]++}}return c.map(x=>x[2]?[x[0]/x[2],x[1]/x[2]]:[0,0])};
function splitK(ids,k,C,s){if(!ids.length||k<1)return[];k=Math.min(k,ids.length);const sp=a=>Math.max(...a)-Math.min(...a),ax=sp(ids.map(i=>C[i][0]))>=sp(ids.map(i=>C[i][1]))?0:1,o=[...ids].sort((a,b)=>C[a][ax]-C[b][ax]),tot=o.reduce((a,i)=>a+s.munis[i].pop,0),out=[];
 let cur=[],acc=0;o.forEach((id,j)=>{cur.push(id);acc+=s.munis[id].pop;if(out.length<k-1&&acc>=tot/k*(out.length+1)&&o.length-j-1>=k-out.length-1){out.push(cur);cur=[]}});if(cur.length)out.push(cur);while(out.length<k){let bi=0;out.forEach((g,i)=>{if(g.length>out[bi].length)bi=i});const g=out[bi];if(g.length<2)break;out.splice(bi,1,g.slice(0,Math.ceil(g.length/2)),g.slice(Math.ceil(g.length/2)))}return out}
function autoDist(p,k,s){s=s||S;const C=centroids(s),ids=p.mun.slice(),ratio=(s.rules&&s.rules.ratio)||290000,big=k==null?ids.filter(id=>s.munis[id].city&&s.munis[id].pop>=250000):[],rest=ids.filter(id=>!big.includes(id)),R=rest.reduce((a,id)=>a+s.munis[id].pop,0),kr=k==null?(rest.length?Math.max(1,Math.round(R/ratio)):0):k;
 const ds=big.map(id=>[id]).concat(splitK(rest,kr,C,s));p.districts=ds.map((m,i)=>({n:i+1,munis:m}));p.dist=Math.max(1,p.districts.length)}
function capitals(s){s=s||S;const big=ids=>ids.length?ids.reduce((b,id)=>s.munis[id].pop>s.munis[b].pop?id:b,ids[0]):null;s.provs.forEach(p=>{p.capital=big(p.mun)});s.regs.forEach((r,ri)=>{r.capital=big(s.provs.filter(p=>p.reg==ri).flatMap(p=>p.mun))});
 const ci=s.munis.filter(m=>m.city).map(m=>m.id);s.nation.capital=big(ci.length?ci:s.munis.map(m=>m.id))}
