let seed=1;
const rnd=()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const pick=a=>a[Math.floor(rnd()*a.length)],nm=()=>pick(F)+' '+pick(L),cl=(v,a,b)=>Math.max(a,Math.min(b,v));
const cap=s=>s[0].toUpperCase()+s.slice(1),place=()=>cap(pick(SYL)+pick(SYL)+(rnd()<.5?pick(SYL):''));
const sample=w=>{let t=w.reduce((a,b)=>a+b,0)*rnd();for(let i=0;i<w.length;i++){t-=w[i];if(t<=0)return i}return w.length-1};
const norm=w=>{const t=w.reduce((a,b)=>a+b,0)||1;return w.map(x=>x/t)};
const lean=P=>norm(P.map(p=>p.pop*(.4+rnd()*1.2)));
const person=w=>({name:nm(),party:sample(w),terms:1});
const exo=()=>[{name:nm(),party:-1,role:'Liga ng mga Barangay President'},{name:nm(),party:-1,role:'SK Federation President'}];
const tally=(a,n)=>{n=n||S.parties.length+1;const c=Array(n).fill(0);a.forEach(o=>c[o.party<0?n-1:o.party]++);return c};
const W=130,H=190;
function setSeed(s){seed=s|0}
function mem(p,P){P=P||S.parties;const pt=P[p]||{ideo:0};return{name:nm(),party:p,ideo:+cl(pt.ideo+(rnd()-.5)*.7,-1,1).toFixed(2),integ:+rnd().toFixed(2),loyal:+rnd().toFixed(2),ambit:+rnd().toFixed(2),int:[pick(INT),pick(INT)],bio:pick(OCC)+', who '+pick(HIST)+'.',trust:50,terms:1,hist:[]}}
function alloc(n,w){const c=w.map(x=>Math.floor(x*n));let k=n-c.reduce((a,b)=>a+b,0);const o=w.map((x,i)=>[x*n-c[i],i]).sort((a,b)=>b[0]-a[0]);for(let i=0;k>0;i++,k--)c[o[i%o.length][1]]++;return c}
function plSeats(s,n,w0){const w=w0||norm(s.plg.map(g=>g.pop*(.85+rnd()*.3))),th=s.con.plThreshold/100,cp=s.con.plCap,c=w.map(x=>x>=th?1:0);let k=n-c.reduce((a,b)=>a+b,0),g=0;
 while(k>0&&g++<999){let b=-1,bv=-1;w.forEach((x,i)=>{if(x>=th&&c[i]<cp){const v=x*n-c[i];if(v>bv){bv=v;b=i}}});if(b<0)break;c[b]++;k--}return c}
function rebuildPL(s,seats){s=s||S;const d=s.house.filter(r=>r.prov>=0),n=Math.floor(d.length*s.con.plShare/(100-s.con.plShare));s.pls=seats||plSeats(s,n);
 s.house=d.concat(s.plg.flatMap((g,gi)=>Array.from({length:s.pls[gi]},()=>({prov:-1,grp:gi,...mem(g.party,s.parties)}))))}
function rebuildCmt(s){s=s||S;s.committees.forEach(c=>{const idx=s.house.map((_,i)=>i).sort(()=>rnd()-.5).slice(0,9);c.mem=idx;c.chair=idx[0]})}
function autoElect(s,ri){const n=ri==5?80:50,ps=s.provs.filter(p=>p.reg==ri),w=ps.length?norm(s.parties.map((_,i)=>ps.reduce((a,p)=>a+p.lean[i],0))):norm(s.parties.map(p=>p.pop));
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
 setSeed(o.seed);const parties=o.parties.map(p=>({...p})),map=genMap(o.N,o.land),cen=[[65,38],[68,100],[60,150]];
 const regs=['Hilagang Isla','Gitnang Isla','Silangang Visaya','Kanlurang Visaya','Hilagang Mindanao','BARMM: Bangsamoro Autonomous Region'].map((n,i)=>({name:i<5?'Region '+(i+1)+': '+n:n,auto:i==5,rd:{name:nm(),party:-1}}));
 const provs=[],munis=[],cells=map.sites.map(()=>[]);
 map.land.forEach((v,i)=>{if(v)cells[map.prov[i]].push(i)});
 map.sites.forEach((s,id)=>{
  const g=Math.min(2,map.land[s[1]*W+s[0]]-1),pop=Math.round(120000+rnd()**2*2400000);
  const cls=pop>1.7e6?1:pop>1.1e6?2:pop>7e5?3:pop>4e5?4:pop>2.2e5?5:6,dist=Math.max(1,Math.min(8,Math.round(pop/290000))),ln=lean(parties);
  const p={id,name:place(),pop,cls,dist,reg:g*2+(s[0]>cen[g][0]?1:0),cx:s[0],cy:s[1],lean:ln,mun:[],hist:[]};
  p.gov=person(ln);p.vg=person(ln);p.sp=Array.from({length:dist>5?dist*2:cls<3?10:cls<5?8:6},()=>person(ln));
  p.exo=exo().concat([{name:nm(),party:-1,role:'League of Cities Council Presidents'},{name:nm(),party:-1,role:'League of Municipal Councilors President'}]);
  provs.push(p);
  const cs=cells[id],k=Math.min(cs.length,4+Math.floor(rnd()*5)),ms=[];
  while(ms.length<k){const c=pick(cs);if(!ms.includes(c))ms.push(c)}
  const base=munis.length,cnt=ms.map(()=>0);
  cs.forEach(c=>{const x=c%W,y=c/W|0;let b=0,bd=1e9;ms.forEach((m,j)=>{const d=(m%W-x)**2+((m/W|0)-y)**2;if(d<bd){bd=d;b=j}});map.mun[c]=base+b;cnt[b]++});
  const ms2=ms.map((c,j)=>({id:base+j,prov:id,name:place(),pop:Math.max(5000,Math.round(pop*cnt[j]/cs.length)),city:false,huc:false,lean:norm(ln.map(x=>x*(.6+rnd()*.8))),hist:[]}));
  const order=[...ms2].sort((a,b)=>b.pop-a.pop);if(rnd()<.7)order[0].city=true;if(order[1]&&rnd()<.35)order[1].city=true;
  ms2.forEach(m=>{m.huc=m.city&&m.pop>=200000;m.mayor=person(m.lean);m.vm=person(m.lean);m.sb=Array.from({length:m.huc?12:m.city?10:8},()=>person(m.lean));m.exo=exo();m.bn=m.city?20+Math.floor(rnd()*25):8+Math.floor(rnd()*20);brgys(m);munis.push(m);p.mun.push(m.id)})});
 const pw=parties.map(p=>p.pop),con={...CON0};
 const plg=PLN.map(([name,sector])=>({name,sector,pop:+(.04+rnd()*.14).toFixed(3),party:sample(norm(pw))}));
 const house=provs.flatMap(p=>Array.from({length:p.dist},(_,d)=>({prov:p.id,d:d+1,...mem(sample(p.lean),parties)})));
 const st={dt:0,y0:o.y0,seed:o.seed,parties,map,regs,provs,munis,house,plg,con,player:{party:0},
  pres:mem(0,parties),vp:mem(1,parties),cabinet:DEPTS.map(d=>({role:d,...mem(sample(norm(pw)),parties)})),
  senate:Array.from({length:24},(_,i)=>({...mem(sample(norm(pw)),parties),cls:i%2})),
  justices:Array.from({length:15},(_,i)=>({name:nm(),role:i?'Associate Justice':'Chief Justice',lean:+(rnd()*2-1).toFixed(1)})),
  bodies:[['COMELEC',7],['Commission on Audit',3],['Civil Service Commission',3],['Commission on Human Rights',5],['Office of the Ombudsman',1]].flatMap(([b,n])=>Array.from({length:n},(_,i)=>({name:nm(),role:b+(i?', Commissioner':', Chair')}))),
  committees:CMT.map(([name,tag])=>({name,tag,mem:[],chair:0})),speaker:0,bills:[],nbid:1,crisis:0,next:elecDay(o.y0,o.y0),nextB:bskeDay(o.y0,o.y0),lastPresY:null,
  stats:{approval:56,growth:5.1,treasury:6,corruption:44,order:68,poverty:22,education:55,health:55,environment:50},news:[],elections:[]};
 st.pres.terms=1;rebuildPL(st);rebuildCmt(st);st.autos={};autoElect(st,5);st.pend=null;st.inaug=null;st.convene=null;return st}
