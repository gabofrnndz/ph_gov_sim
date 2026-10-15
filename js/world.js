let seed=1;
const rnd=()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const pick=a=>a[Math.floor(rnd()*a.length)],nm=()=>genName(NAMECTX).join(' '),cl=(v,a,b)=>Math.max(a,Math.min(b,v));
const cap=s=>s[0].toUpperCase()+s.slice(1),place=()=>cap(pick(SYL)+pick(SYL)+(rnd()<.5?pick(SYL):''));
let USED=new Set();const placeU=()=>{let n,t=0;do{n=place()}while(USED.has(n)&&t++<80);USED.add(n);return n};
const sample=w=>{let t=w.reduce((a,b)=>a+b,0)*rnd();for(let i=0;i<w.length;i++){t-=w[i];if(t<=0)return i}return w.length-1};
const norm=w=>{const t=w.reduce((a,b)=>a+b,0)||1;return w.map(x=>x/t)};
const lean=P=>norm(P.map(p=>p.pop*(.4+rnd()*1.2)));
let GEN=false,CTX=null,BASEY=2025,NMAP={};
const FEM=new Set(FF);
const curY=()=>GEN||typeof S=='undefined'||!S||S.dt==null?BASEY:yr();
const plist=()=>CTX||(typeof S!='undefined'&&S?S.parties:[]);
function takeName(P){const lines=String((P&&P.names)||'').split('\n').map(x=>x.trim()).filter(Boolean),k=(P&&P.ni)||0;
 if(P&&k<lines.length){P.ni=k+1;const s=lines[k],c=s.indexOf(','),i=s.indexOf(' ');let f,l;if(c>0){l=s.slice(0,c).trim();f=s.slice(c+1).trim()}else if(i>0){f=s.slice(0,i);l=s.slice(i+1).trim()}else{f=s;l=pick(L)}
  ((typeof S!='undefined'&&S&&S.nmap&&!GEN)?S.nmap:NMAP)[f+' '+l]=[l,f];NUSED.add(f+' '+l);return[f,l]}return genName(NAMECTX)}
const ident=(P,lo,skip)=>{const[f,l]=skip?genName(NAMECTX):takeName(P);return{name:f+' '+l,first:f,last:l,by:curY()-(lo+Math.floor(rnd()*Math.max(1,72-lo))),sex:FEM.has(String(f).split(' ')[0])?'F':'M',occ:pick(OCC)}};
const person=(w,lo)=>{const p=sample(w);return lo==null?{name:nm(),party:p,terms:1}:{...ident(plist()[p],lo),party:p,terms:1}};
const exo=()=>[{name:nm(),party:-1,role:'Liga ng mga Barangay President'},{name:nm(),party:-1,role:'SK Federation President'}];
const tally=(a,n)=>{n=n||S.parties.length+1;const c=Array(n).fill(0);a.forEach(o=>c[o.party<0?n-1:o.party]++);return c};
const W=130,H=190;
function setSeed(s){seed=s|0}
function mem(p,P,lo,skip){P=P||S.parties;const pt=P[p]||{ideo:0},id=ident(P[p],lo||25,skip);return{...id,party:p,ideo:+cl(pt.ideo+(rnd()-.5)*.7,-1,1).toFixed(2),integ:+rnd().toFixed(2),loyal:+rnd().toFixed(2),ambit:+rnd().toFixed(2),int:[pick(INT),pick(INT)],bio:id.occ+', who '+pick(HIST)+'.',trust:50,terms:1,hist:[]}}
function alloc(n,w){const c=w.map(x=>Math.floor(x*n));let k=n-c.reduce((a,b)=>a+b,0);const o=w.map((x,i)=>[x*n-c[i],i]).sort((a,b)=>b[0]-a[0]);for(let i=0;k>0;i++,k--)c[o[i%o.length][1]]++;return c}
function plSeats(s,n,w0){const w=w0||norm(s.plg.map(g=>g.pop*(.85+rnd()*.3))),th=s.con.plThreshold/100,cp=s.con.plCap,c=w.map(x=>x>=th?1:0);let k=n-c.reduce((a,b)=>a+b,0),g=0;
 while(k>0&&g++<999){let b=-1,bv=-1;w.forEach((x,i)=>{if(x>=th&&c[i]<cp){const v=x*n-c[i];if(v>bv){bv=v;b=i}}});if(b<0)break;c[b]++;k--}return c}
function rebuildPL(s,seats){s=s||S;const d=s.house.filter(r=>r.prov>=0),n=Math.floor(d.length*s.con.plShare/(100-s.con.plShare));s.pls=seats||plSeats(s,n);
 s.house=d.concat(s.plg.flatMap((g,gi)=>{ensureNominees(g,s.pls[gi]);const bloc=g.party>=0?g.party:(g.bloc!=null?g.bloc:0);return Array.from({length:s.pls[gi]},(_,j)=>{const m={prov:-1,grp:gi,...mem(bloc,s.parties,25,true)},nn=g.nominees[j];m.name=nn.name;m.first=nn.first;m.last=nn.last;m.indep=g.party<0;return m})}))}
const nominee=()=>{const[f,l]=genName(NAMECTX);return{name:f+' '+l,first:f,last:l}};
function ensureNominees(g,n){g.nominees=g.nominees||[];while(g.nominees.length<Math.max(5,n||0))g.nominees.push(nominee())}
function newPlg(s,name,sector,kind,pop){s=s||S;const P=s.parties,party=rnd()<.35?-1:sample(norm(P.map(p=>p.pop))),g={name,sector,kind,pop,party,bloc:party>=0?party:sample(norm(P.map(p=>p.pop))),region:kind=='regional'?Math.floor(rnd()*Math.max(1,s.regs?s.regs.length:6)):null,nominees:[]};ensureNominees(g,5);return g}
function rebuildCmt(s){s=s||S;s.committees.forEach(c=>{const idx=s.house.map((_,i)=>i).sort(()=>rnd()-.5).slice(0,9);c.mem=idx;c.chair=idx[0]})}
function autoElect(s,ri){const n=(s.regs[ri]&&/BARMM|Bangsamoro/.test(s.regs[ri].name))?80:50,ps=s.provs.filter(p=>p.reg==ri),w=ps.length?norm(s.parties.map((_,i)=>ps.reduce((a,p)=>a+p.lean[i],0))):norm(s.parties.map(p=>p.pop));
 const parl=Array.from({length:n},()=>mem(sample(w),s.parties)),c=tally(parl,s.parties.length),top=c.indexOf(Math.max(...c));s.autos=s.autos||{};s.autos[ri]={parl,cm:{name:parl.find(m=>m.party==top).name,party:top,terms:1}}}
function brgName(m,i){const u=BU[m.prov]=BU[m.prov]||new Set(),mine=new Set((m.brgy||[]).map(b=>b.name));let n,t=0;do{n=rnd()<.4?pick(BNAMES):place();if(t>10&&u.has(n))n=n+' '+['I','II','III','Uno','Dos'][t%5];t++}while((u.has(n)||mine.has(n))&&t<60);u.add(n);return n}
function mkBrgy(m,i){return{name:brgName(m,i),pb:person(m.lean),kag:Array.from({length:7},()=>person(m.lean)),sk:person(m.lean)}}
function brgys(m){m.brgy=Array.from({length:m.bn},(_,i)=>mkBrgy(m,i))}
function genMap(N,custom,ph){
 if(ph){const prov=phCells(),land=new Uint8Array(W*H),acc=PHMAP.names.map(()=>[0,0,0]);prov.forEach((v,i)=>{if(v>=0){land[i]=1+Math.min(2,Math.floor((i/W|0)/(H/3)));acc[v][0]+=i%W;acc[v][1]+=(i/W|0);acc[v][2]++}});
  const sites=acc.map((a,v)=>{const cx=a[0]/Math.max(1,a[2]),cy=a[1]/Math.max(1,a[2]);let b=-1,bd=1e9;prov.forEach((q,i)=>{if(q==v){const d=(i%W-cx)**2+((i/W|0)-cy)**2;if(d<bd){bd=d;b=i}}});return[b%W,b/W|0]});return{land,prov,mun:new Int16Array(W*H).fill(-1),sites}}
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
 setSeed(o.seed);GEN=true;BASEY=o.y0;NMAP={};const parties=o.parties.map(p=>({...p})),map=genMap(o.N,o.land,o.ph),cen=[[65,38],[68,100],[60,150]];CTX=parties;
 USED=new Set(o.ph?PHMAP.names:[]);NUSED=new Set();BU={};NAMECTX=null;const regs=o.ph?PHMAP.regs.map(n=>({name:n,auto:/BARMM/.test(n),rd:{name:nm(),party:-1}})):['Hilagang Isla','Gitnang Isla','Silangang Visaya','Kanlurang Visaya','Hilagang Mindanao','BARMM: Bangsamoro Autonomous Region'].map((n,i)=>({name:i<5?'Region '+(i+1)+': '+n:n,auto:i==5,rd:{name:nm(),party:-1}}));
 const provs=[],munis=[],cells=map.sites.map(()=>[]);
 map.land.forEach((v,i)=>{if(v)cells[map.prov[i]].push(i)});
 map.sites.forEach((s,id)=>{
  const g=Math.min(2,map.land[s[1]*W+s[0]]-1),pop=Math.round(120000+rnd()**2*2400000);
  const cls=pop>1.7e6?1:pop>1.1e6?2:pop>7e5?3:pop>4e5?4:pop>2.2e5?5:6,dist=Math.max(1,Math.min(8,Math.round(pop/290000))),ln=lean(parties);
  const p={id,name:o.ph?PHMAP.names[id]:placeU(),pop,cls,dist,reg:o.ph?PHMAP.reg[id]:g*2+(s[0]>cen[g][0]?1:0),cx:s[0],cy:s[1],lean:ln,mun:[],hist:[]};
  NAMECTX=flavorOf((regs[p.reg]||{}).name||'');p.gov=person(ln,23);p.vg=person(ln,23);p.sp=Array.from({length:dist>5?dist*2:cls<3?10:cls<5?8:6},()=>person(ln,18));
  p.exo=exo().concat([{name:nm(),party:-1,role:'League of Cities Council Presidents'},{name:nm(),party:-1,role:'League of Municipal Councilors President'}]);
  provs.push(p);
  const cs=cells[id],k=Math.min(cs.length,4+Math.floor(rnd()*5)),ms=[];
  while(ms.length<k){const c=pick(cs);if(!ms.includes(c))ms.push(c)}
  const base=munis.length,cnt=ms.map(()=>0);
  cs.forEach(c=>{const x=c%W,y=c/W|0;let b=0,bd=1e9;ms.forEach((m,j)=>{const d=(m%W-x)**2+((m/W|0)-y)**2;if(d<bd){bd=d;b=j}});map.mun[c]=base+b;cnt[b]++});
  const ms2=ms.map((c,j)=>({id:base+j,prov:id,name:placeU(),pop:Math.max(5000,Math.round(pop*cnt[j]/cs.length)),city:false,huc:false,lean:norm(ln.map(x=>x*(.6+rnd()*.8))),hist:[]}));
  const order=[...ms2].sort((a,b)=>b.pop-a.pop);if(rnd()<.7)order[0].city=true;if(order[1]&&rnd()<.35)order[1].city=true;
  ms2.forEach(m=>{m.huc=m.city&&m.pop>=200000;m.icc=m.city&&!m.huc&&rnd()<.35;m.mayor=person(m.lean,m.city?23:21);m.vm=person(m.lean,m.city?23:21);m.sb=Array.from({length:m.huc?12:m.city?10:8},()=>person(m.lean,18));m.exo=exo();m.bn=m.city?20+Math.floor(rnd()*25):8+Math.floor(rnd()*20);brgys(m);munis.push(m);p.mun.push(m.id)})});
 const pw=parties.map(p=>p.pop),con={...CON0};
 const plg=PLN.map(([name,sector,kind])=>newPlg({parties,regs},name,sector,kind,+(.04+rnd()*.14).toFixed(3)));
 const st0={provs,munis,map};provs.forEach(p=>autoDist(p,null,st0));
 const house=provs.flatMap(p=>Array.from({length:p.dist},(_,d)=>({prov:p.id,d:d+1,...mem(sample(p.lean),parties)})));
 const st={dt:0,y0:o.y0,seed:o.seed,parties,map,regs,provs,munis,house,plg,con,player:{party:0},
  pres:mem(0,parties,40),vp:mem(1,parties,40),cabinet:DEPTS.map(d=>({role:d,...mem(sample(norm(pw)),parties)})),
  senate:Array.from({length:24},(_,i)=>({...mem(sample(norm(pw)),parties,35),cls:i%2})),
  justices:Array.from({length:15},(_,i)=>({name:nm(),role:i?'Associate Justice':'Chief Justice',lean:+(rnd()*2-1).toFixed(1)})),
  bodies:[['COMELEC',7],['Commission on Audit',3],['Civil Service Commission',3],['Commission on Human Rights',5],['Office of the Ombudsman',1]].flatMap(([b,n])=>Array.from({length:n},(_,i)=>({name:nm(),role:b+(i?', Commissioner':', Chair')}))),
  committees:CMT.map(([name,tag])=>({name,tag,mem:[],chair:0})),speaker:0,bills:[],nbid:1,crisis:0,next:elecDay(o.y0,o.y0),nextB:bskeDay(o.y0>2028?2028+Math.ceil((o.y0-2028)/5)*5:2028,o.y0),lastPresY:null,
  stats:{approval:56,growth:5.1,treasury:6,corruption:44,order:68,poverty:22,education:55,health:55,environment:50},news:[],elections:[]};
 initExtras(st);st.pres.terms=1;rebuildPL(st);rebuildCmt(st);st.autos={};st.regs.forEach((r,i)=>{if(r.auto)autoElect(st,i)});st.pend=null;st.inaug=null;st.convene=null;GEN=false;CTX=null;NAMECTX=null;st.nmap=NMAP;return st}

function initExtras(st){st.nation=st.nation||{name:'Republic of the Philippines',motto:'Maka-Diyos, Maka-tao, Makakalikasan at Makabansa',currency:'PHP'};
 initCampState(st);st.rules=Object.assign({brgyTerm:5,brgyLimit:2,skLimit:1,votingAge:18,quorum:50,attend:.93,sepDays:1,printDays:3,vetoDays:15,overrideLocal:66.7,reviewDays:30,ira:40,ratio:290000},st.rules||{});
 st.budget=st.budget||{fy:st.y0,rev:5600,lines:BUD0.map(([id,name,base,fx,tag,i])=>({id,name,amt:base,nep:base,base,fx,tag,i}))};
 st.laws=st.laws||{};st.ords=st.ords||[];st.plebs=st.plebs||[];st.floor=st.floor||{};st.nmap=st.nmap||NMAP;
 st.provs.forEach(p=>{if(p.dev==null)p.dev=50;if(!p.districts)autoDist(p,p.dist,st);if(!p.distStatus)p.distStatus='enacted'});st.munis.forEach(m=>{if(m.dev==null)m.dev=50});
 if(st.provs.some(p=>!p.ic)||st.munis.some(m=>!m.ic))initIncome(st);st.provs.forEach(p=>{if(!p.pds)autoProv(p,st)});if(st.edit==null)st.edit=true;if(!st.brgy)initBrgy(st,st.dt===0&&!(st.elections&&st.elections.length));if(st.skipPleb==null)st.skipPleb=true;st.slate=st.slate||{};st.debateSkip=st.debateSkip||{};st.territory=st.territory||{other:[]};st.parties.forEach(p=>{if(!p.scope){p.scope='national';p.area=null}});st.enacted=st.enacted||[];st.raNext=st.raNext||12500;st.munis.forEach(m=>{if(m.icc==null)m.icc=false});if(!st.map.bg)initBrgyMap(st);pruneBrgys(st);st.plg.forEach(g=>{if(g.kind==null)g.kind='sectoral';if(g.bloc==null)g.bloc=g.party>=0?g.party:0;ensureNominees(g,st.pls?st.pls[st.plg.indexOf(g)]:5)});
 if(st.nation.capital==null||st.provs.some(p=>p.capital==null)||st.regs.some(r=>r.capital===undefined))capitals(st);
 st.flagSd=st.flagSd==null?hash('flag'+st.seed):st.flagSd;return st}
const centroids=s=>{const M=s.map,c=s.munis.map(()=>[0,0,0]);for(let i=0;i<W*H;i++){const m=M.mun[i];if(m>=0&&c[m]){c[m][0]+=i%W;c[m][1]+=(i/W|0);c[m][2]++}}return c.map(x=>x[2]?[x[0]/x[2],x[1]/x[2]]:[0,0])};
function splitK(ids,k,C,s){if(!ids.length||k<1)return[];k=Math.min(k,ids.length);const sp=a=>Math.max(...a)-Math.min(...a),ax=sp(ids.map(i=>C[i][0]))>=sp(ids.map(i=>C[i][1]))?0:1,o=[...ids].sort((a,b)=>C[a][ax]-C[b][ax]),tot=o.reduce((a,i)=>a+s.munis[i].pop,0),out=[];
 let cur=[],acc=0;o.forEach((id,j)=>{cur.push(id);acc+=s.munis[id].pop;if(out.length<k-1&&acc>=tot/k*(out.length+1)&&o.length-j-1>=k-out.length-1){out.push(cur);cur=[]}});if(cur.length)out.push(cur);while(out.length<k){let bi=0;out.forEach((g,i)=>{if(g.length>out[bi].length)bi=i});const g=out[bi];if(g.length<2)break;out.splice(bi,1,g.slice(0,Math.ceil(g.length/2)),g.slice(Math.ceil(g.length/2)))}return out}
function autoDist(p,k,s){s=s||S;const C=centroids(s),ids=p.mun.slice(),ratio=(s.rules&&s.rules.ratio)||290000,big=k==null?ids.filter(id=>s.munis[id].city&&s.munis[id].pop>=250000):[],rest=ids.filter(id=>!big.includes(id)),R=rest.reduce((a,id)=>a+s.munis[id].pop,0),kr=k==null?(rest.length?Math.max(1,Math.round(R/ratio)):0):k;
 const ds=big.map(id=>[id]).concat(splitK(rest,kr,C,s));p.districts=ds.map((m,i)=>({n:i+1,munis:m}));p.dist=Math.max(1,p.districts.length)}
function capitals(s){s=s||S;const big=ids=>ids.length?ids.reduce((b,id)=>s.munis[id].pop>s.munis[b].pop?id:b,ids[0]):null;s.provs.forEach(p=>{p.capital=big(p.mun)});s.regs.forEach((r,ri)=>{r.capital=big(s.provs.filter(p=>p.reg==ri).flatMap(p=>p.mun))});
 const ci=s.munis.filter(m=>m.city).map(m=>m.id);s.nation.capital=big(ci.length?ci:s.munis.map(m=>m.id))}

function layoutBrgys(s,m){const M=s.map,cells=[];for(let i=0;i<W*H;i++)if(M.mun[i]==m.id)cells.push(i);if(!cells.length)return;const r=prng(hash(s.seed+':b'+m.id+':'+m.brgy.length)),n=Math.min(m.brgy.length,cells.length),sites=[];for(let j=0;j<n;j++)sites.push(cells[Math.floor(r()*cells.length)]);
 cells.forEach(c=>{const x=c%W,y=c/W|0;let b=0,bd=1e9;sites.forEach((q,j)=>{const d=(q%W-x)**2+((q/W|0)-y)**2;if(d<bd){bd=d;b=j}});M.bg[c]=b})}
function initBrgyMap(s){s.map.bg=new Int16Array(W*H).fill(-1);s.munis.forEach(m=>layoutBrgys(s,m))}

function pruneBrgys(s){const M=s.map,cnt=s.munis.map(m=>m.brgy.map(()=>0));for(let i=0;i<W*H;i++){const m=M.mun[i];if(m>=0&&M.bg[i]>=0&&cnt[m]&&cnt[m][M.bg[i]]!==undefined)cnt[m][M.bg[i]]++}
 s.munis.forEach((m,mi)=>{const keep=[];m.brgy.forEach((b,j)=>{if(cnt[mi][j]>0)keep.push(j)});if(!keep.length)keep.push(0);if(keep.length==m.brgy.length)return;const mp={};keep.forEach((j,k)=>mp[j]=k);
  for(let i=0;i<W*H;i++)if(M.mun[i]==mi&&M.bg[i]>=0)M.bg[i]=mp[M.bg[i]]!=null?mp[M.bg[i]]:-1;m.brgy=keep.map(j=>m.brgy[j]);m.bn=m.brgy.length;if(s.ords)s.ords=s.ords.filter(o=>!(o.lvl=='b'&&o.ref==mi))})}

function initCampState(st){const n=st.parties.length;st.camp=st.camp||{funds:[],media:[],org:[],spent:[],mom:{},momP:{},polls:[],debates:[],flow:null,prev:null};const c=st.camp;while(c.funds.length<n){const i=c.funds.length;c.funds.push(40+(st.parties[i]?st.parties[i].pop*80:0));c.media.push(0);c.org.push({});c.spent.push(0)}}

let NUSED=new Set(),NAMECTX=null,BU={};
const flavorOf=n=>{n=String(n||'');return /Cordillera/i.test(n)?'igorot':/Ilocos|Cagayan/i.test(n)?'ilocano':/Bicol/i.test(n)?'bicol':/BARMM|Bangsamoro|Muslim/i.test(n)?'muslim':/Visayas|Caraga|Davao|Mindanao|Zamboanga|SOCCSKSARGEN/i.test(n)?'visayan':/Central Luzon/i.test(n)?'kapampangan':null};
function pickLast(fl){const x=fl&&LASTF[fl];if(x&&rnd()<.55)return pick(x);if(rnd()<.04)return pick(LASTF.chinese);return pick(LAST)}
function genName(fl){for(let t=0;t<90;t++){const fem=rnd()<.5;let pool=fem?FF:FM;if(fl=='muslim'&&rnd()<.4)pool=fem?FFMUS:FMUS;let f=pick(pool);if(t>20&&rnd()<.6)f+=' '+pick(fem?FF:FM);const l=pickLast(fl),n=f+' '+l;if(!NUSED.has(n)){NUSED.add(n);return[f,l]}}
 const f=pick(FF.concat(FM)),l0=pickLast(fl);for(let k=0;k<12;k++){const l=l0+' '+['Jr.','II','III','IV','Sr.'][k%5]+(k>4?' '+(k+1):'');if(!NUSED.has(f+' '+l)){NUSED.add(f+' '+l);return[f,l]}}return[f,l0]}
function rebuildNames(s){NUSED=new Set();BU={};const add=o=>{if(o&&o.name)NUSED.add(o.name)};[s.pres,s.vp].forEach(add);(s.cabinet||[]).forEach(add);(s.senate||[]).forEach(add);(s.house||[]).forEach(add);(s.justices||[]).forEach(add);(s.bodies||[]).forEach(add);(s.regs||[]).forEach(r=>add(r.rd));
 (s.provs||[]).forEach(p=>{add(p.gov);add(p.vg);(p.sp||[]).forEach(add);(p.exo||[]).forEach(add)});(s.munis||[]).forEach(m=>{add(m.mayor);add(m.vm);(m.sb||[]).forEach(add);(m.exo||[]).forEach(add);const u=BU[m.prov]=BU[m.prov]||new Set();(m.brgy||[]).forEach(b=>{add(b.pb);(b.kag||[]).forEach(add);add(b.sk);u.add(b.name)})});
 Object.keys(s.autos||{}).forEach(k=>{const a=s.autos[k];if(a){add(a.cm);(a.parl||[]).forEach(add)}});(s.plg||[]).forEach(g=>(g.nominees||[]).forEach(add))}
