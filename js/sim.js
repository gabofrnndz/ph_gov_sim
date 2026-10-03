const D=()=>new Date(Date.UTC(S.y0,0,1+S.dt));
const fday=n=>new Date(Date.UTC(S.y0,0,1+n)).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric',timeZone:'UTC'});
const dstr=()=>fday(S.dt),yr=()=>D().getUTCFullYear();
const dn=(y,m,d,y0)=>Math.round((Date.UTC(y,m,d)-Date.UTC(y0,0,1))/864e5);
const elecDay=(y,y0)=>{const w=new Date(Date.UTC(y,4,1)).getUTCDay();return dn(y,4,1+(1-w+7)%7+7,y0)};
const bskeDay=(y,y0)=>{const w=new Date(Date.UTC(y,9,31)).getUTCDay();return dn(y,9,31-(w+6)%7,y0)};
const openDay=(y,y0)=>{const w=new Date(Date.UTC(y,6,1)).getUTCDay();return dn(y,6,1+(1-w+7)%7+21,y0)};
const inSession=()=>{const y=yr(),op=openDay(y,S.y0);return S.dt>=op||S.dt<op-30};
const log=t=>{S.news.unshift(`${dstr()}: ${t}`);S.news.length=Math.min(S.news.length,80)};
const z=()=>S.parties.map(()=>0);
function wt(e,inc){const mood=(S.stats.approval-50)/100;return e.lean.map((x,i)=>Math.pow(x*(1+(i==S.pres.party?mood:-mood/4))*(i==inc?1.3:1),1.5))}
function re(o,w,lim,mk,lo){const p=sample(w);if(p==o.party&&rnd()<.6&&(o.terms||1)<lim&&(!lo||o.by==null||curY()-o.by>=lo)){o.terms=(o.terms||1)+1;return o}return mk?mk(p):{name:nm(),party:p,terms:1}}
const houseCounts=()=>{const c=z();S.house.forEach(r=>c[r.party]++);return c};
const senCounts=()=>tally(S.senate).slice(0,S.parties.length);
function natW(){const t=z();S.provs.forEach(p=>wt(p,-1).forEach((x,i)=>t[i]+=x*p.pop));return norm(t)}
const addLog=(b,t)=>{b.log.unshift(`${dstr()}: ${t}`);b.log.length=Math.min(b.log.length,12)};
function score(m,b,art,sec){const t=art||b,tg=t.tags||[];let s=.8-Math.abs(m.ideo-t.i)*1.1+(tg.some(x=>m.int.includes(x))?.3:0)+(rnd()-.5)*.4;
 if((t.e||{}).corruption>0)s-=m.integ*.5;
 if(!sec)s+=m.loyal*((m.party==b.spp?.25:0)+(m.party==S.pres.party?.1:-.05));
 if(b.mine)s+=(m.trust-50)/100*(S.crisis>0?1:.6);return s}
function ballot(list,b,art,sec,need){let y=0,n=0,a=0;const v=list.map(m=>{const s=score(m,b,art,sec);if(Math.abs(s)<.07){a++;return 0}if(s>0){y++;return 1}n++;return -1}),maj={};
 list.forEach((m,i)=>{if(v[i]){const q=maj[m.party]=maj[m.party]||[0,0];q[v[i]>0?0:1]++}});
 const reb=list.filter((m,i)=>v[i]&&((v[i]>0)!=(maj[m.party][0]>=maj[m.party][1]))).slice(0,4);
 if(b.mine)list.forEach((m,i)=>{if(v[i])m.trust=cl(m.trust+(v[i]>0?1.5:-1),0,100)});
 return{y,n,a,tot:list.length,pass:need?y>=need*list.length:y>n,reb}}
const vtxt=(l,r,sec)=>`${l}${sec?' (secret ballot)':''}: ${r.y} yes, ${r.n} no, ${r.a} abstain of ${r.tot}. ${r.pass?'Passed':'Failed'}.${r.reb.length?' Defied their party: '+r.reb.map(m=>m.name).join(', ')+'.':''}`;
const ORD=o=>o=='H'?['H-Com','H-2nd','H-3rd','S-Com','S-3rd']:['S-Com','S-3rd','H-Com','H-2nd','H-3rd'];
const nextSt=b=>{if(b.st=='Bicam')return'Pres';const o=ORD(b.orig),i=o.indexOf(b.st);return i<o.length-1?o[i+1]:(b.kind=='amend'?'Plebiscite':'Bicam')};
const cmtOf=b=>S.committees.find(c=>c.tag==b.tags[0])||S.committees[0];
function calc(b){b.i=b.arts.reduce((s,a)=>s+a.i,0)/b.arts.length;b.tags=[...new Set(b.arts.flatMap(a=>a.tags))];b.e={};b.arts.forEach(a=>{for(const k in a.e)b.e[k]=(b.e[k]||0)+a.e[k]});b.kind=b.entr||b.arts.some(a=>a.c)?'amend':'law'}
function makeBill(o){const arts=o.arts||o.ids.map(id=>({...ART_LIB.find(a=>a.id==id)}));arts.forEach(a=>{a.ok=null;a.tags=a.tags||[];a.e=a.e||{}});
 const sp=o.sp||{ch:'H',i:Math.floor(rnd()*S.house.length)},m=(sp.ch=='H'?S.house:S.senate)[sp.i],b={id:S.nbid++,t:o.title,arts,sp,spn:m.name,spp:m.party,mine:!!o.mine,urgent:!o.mine&&rnd()<.05,dm:S.dt,entr:!!o.entr,repeals:o.repeals||0,log:[]};
 calc(b);b.orig=b.tags.some(t=>t=='budget'||t=='revenue')?'H':(o.orig||pick(['H','S']));b.st=ORD(b.orig)[0];S.bills.unshift(b);addLog(b,`Filed by ${m.name} in the ${b.orig=='H'?'House':'Senate'}.`);return b}
function draft(t0){const [t,ids]=t0||(rnd()<.06?pick(BT.slice(11)):pick(BT.slice(0,11)));if(S.bills.some(b=>b.t==t&&STN[b.st]))return;const b=makeBill({title:t,ids});log(`${b.spn} files "${t}".`)}
function artVote(b,k,sec,force){const a=b.arts[k];if(force==null){const r=ballot(S.house,b,a,sec);a.ok=r.pass;addLog(b,vtxt('Article '+(k+1),r,sec))}else{a.ok=!!force;addLog(b,`Article ${k+1} ${force?'approved':'struck'} by the floor leader.`)}}
function closeSecond(b){b.arts.forEach((a,k)=>{if(a.ok==null)artVote(b,k,false)});const keep=b.arts.filter(a=>a.ok);if(!keep.length){b.st='Failed';addLog(b,'All articles were struck. The bill dies.');return}b.arts=keep;calc(b);b.st=nextSt(b);addLog(b,`Second reading closed with ${keep.length} article(s).`)}
function applyArts(b,k){b.arts.forEach(a=>{for(const x in a.e)S.stats[x]=+cl((S.stats[x]||0)+a.e[x]*(k||1),x=='treasury'||x=='growth'?-20:0,x=='treasury'?999:x=='growth'?20:100).toFixed(2);if(a.c&&k!=-1)applyCon(a.c);localFx(a,k)})}
function enact(b,t){b.st='Law';addLog(b,t);if(b.repeals){const o=S.bills.find(x=>x.id==b.repeals);if(o){o.st='Repealed';addLog(o,'Repealed by "'+b.t+'".')}}log(`"${b.t}" becomes law.`);applyArts(b);
 if(b.kind=='law'&&rnd()<.25){const n=S.justices.filter(j=>Math.abs(j.lean-b.i)>.8).length;if(n>S.justices.length/2){b.st='Struck down';applyArts(b,-1);addLog(b,`The Supreme Court strikes the law down (${n} to ${S.justices.length-n}).`);log(`The Supreme Court strikes down "${b.t}".`)}else addLog(b,`The Supreme Court upholds the law (${S.justices.length-n} to ${n}).`)}}
function fail(b,ai){if(ai&&rnd()<.4&&!/^General Appropriations/.test(b.t)){b.st='Failed';addLog(b,'The bill dies.')}}
function act(b,sec,ai){const s0=b.st;act0(b,sec,ai);if(b.st!=s0)b.dm=S.dt}
const attend=L=>{const p=L.filter(()=>rnd()<S.rules.attend);return p.length>L.length*S.rules.quorum/100?p:null};
function act0(b,sec,ai){if(!['Pres','Plebiscite'].includes(b.st)&&!inSession()){if(!ai)addLog(b,'Congress is in recess; the vote is postponed (Art. VI Sec. 15).');return}
 const st=b.st,ch=st[0],need=b.kind=='amend'&&st.endsWith('3rd')?S.con.amendVote/100:0;let r;
 if(st=='H-Com'||st=='S-Com'){const c=cmtOf(b),list=ch=='H'?c.mem.map(i=>S.house[i]).filter(Boolean):S.senate.filter((_,i)=>i%3==b.id%3),sp=S.house[S.speaker];
  if(ch=='H'&&!b.mine&&sp&&sp.party!=b.spp&&rnd()<.25){addLog(b,'The Speaker keeps the bill pending in committee.');return}
  r=ballot(list,b,null,sec);addLog(b,vtxt(ch=='H'?c.name+' committee':'Senate committee',r,sec));if(r.pass)b.st=nextSt(b);else fail(b,ai)}
 else if(st=='H-2nd')closeSecond(b);
 else if(st.endsWith('3rd')){if(S.rules.sepDays&&!b.urgent&&b.dm!=null&&S.dt-b.dm<S.rules.printDays){addLog(b,`Third reading must wait ${S.rules.printDays} days after the final bill is distributed, unless the President certifies urgency (Art. VI Sec. 26).`);return}
  const L=ch=='H'?S.house:S.senate,pr=attend(L);if(!pr){addLog(b,'No quorum: a majority of members is not present (Art. VI Sec. 16). The vote is deferred.');return}
  r=ballot(pr,b,null,sec,need?need*L.length/pr.length:0);addLog(b,vtxt((ch=='H'?'House':'Senate')+' third reading',r,sec));if(r.pass)b.st=nextSt(b);else fail(b,ai)}
 else if(st=='Bicam'){const c=cmtOf(b),l=c.mem.slice(0,3).map(i=>S.house[i]).filter(Boolean).concat(S.senate.slice(b.id%20,b.id%20+3));r=ballot(l,b,null,sec);addLog(b,vtxt('Bicameral conference committee',r,sec));if(r.pass)b.st='Pres';else fail(b,ai)}
 else if(st=='Pres'){if(1-Math.abs(S.pres.ideo-b.i)*.9+(rnd()-.4)>.35)enact(b,'The President signs the bill.');else if(b.tags.includes('budget')&&b.arts.length>1){const a=b.arts.splice(Math.floor(rnd()*b.arts.length),1)[0];calc(b);addLog(b,`Line-item veto of "${a.t}" (Art. VI Sec. 27).`);enact(b,'The President signs the rest of the appropriation.')}else{b.st='Vetoed';addLog(b,'The President vetoes the bill.')}}
 else if(st=='Plebiscite'){const y=50+(S.stats.approval-50)*.4+(rnd()-.5)*24;addLog(b,`Plebiscite: ${y.toFixed(1)}% yes (${S.con.plebiscite}% needed).`);if(y>S.con.plebiscite){b.st='Ratified';applyArts(b);log(`Voters ratify "${b.t}".`)}else{b.st='Failed';log(`Voters reject "${b.t}".`)}}
 else if(st=='Vetoed'&&!b.ov){b.ov=1;const o=S.con.vetoOverride/100,h=ballot(S.house,b,null,sec,o),s=ballot(S.senate,b,null,sec,o);addLog(b,vtxt('Override, House',h,sec)+' '+vtxt('Override, Senate',s,sec));if(h.pass&&s.pass)enact(b,'Congress overrides the veto.')}}
function applyCon(c){const sp=S.house[S.speaker];Object.assign(S.con,c);log('The Constitution is amended: '+Object.keys(c).map(k=>`${CONL[k][0]} is now ${c[k]}`).join('; ')+'.');
 while(S.senate.length<S.con.senSize)S.senate.push({...mem(sample(natW()),S.parties),cls:S.senate.length%2});S.senate.length=Math.min(S.senate.length,S.con.senSize);
 while(S.justices.length<S.con.scSize)S.justices.push({name:nm(),role:'Associate Justice',lean:+(rnd()*2-1).toFixed(1)});S.justices.length=Math.min(S.justices.length,S.con.scSize);
 rebuildPL();rebuildCmt();S.speaker=Math.max(0,S.house.indexOf(sp))}
function electSpeaker(forced){const H=S.house,cands=S.parties.map((p,i)=>{let b=-1,bt=-1;H.forEach((m,j)=>{if(m.party==i&&m.terms*10+m.integ>bt){bt=m.terms*10+m.integ;b=j}});return b}).filter(j=>j>=0);
 if(forced!=null&&!cands.includes(forced))cands.push(forced);
 const vote=cs=>{const t=cs.map(()=>0);H.forEach(m=>{let bs=-9,bi=0;cs.forEach((j,k)=>{const c=H[j],s=(m.party==c.party?.9*m.loyal+.3:0)-Math.abs(m.ideo-c.ideo)*.8+(c.party==S.player.party?(m.trust-50)/150:0)+(rnd()-.5)*.3;if(s>bs){bs=s;bi=k}});t[bi]++});return t};
 let t=vote(cands),w=cands[t.indexOf(Math.max(...t))],txt=`${t.join(', ')} votes`;
 if(Math.max(...t)<=H.length/2){const top=cands.map((j,k)=>[t[k],j]).sort((a,b)=>b[0]-a[0]).slice(0,2).map(x=>x[1]);t=vote(top);w=top[t.indexOf(Math.max(...t))];txt+=`; runoff ${t.join(' to ')}`}
 S.speaker=w;log(`${H[w].name} is elected Speaker of the House (${txt}).`);leaders()}
function repealBill(b){if(!Object.keys(b.e).length)return null;return makeBill({title:'Repeal of '+b.t,arts:b.arts.map(a=>({...a,t:'Repeal: '+a.t,i:-a.i,c:undefined,ok:null,e:Object.fromEntries(Object.entries(a.e).map(([k,v])=>[k,-v]))})),orig:'H',sp:{ch:'H',i:Math.max(0,S.house.findIndex(m=>m.party==S.player.party))},mine:true,entr:b.entr,repeals:b.id})}
function impeach(sec){if(!inSession()){log('Congress is in recess; no impeachment vote can be held (Art. VI Sec. 15).');return}
 if(S.imp&&S.imp.d>S.dt-365){log('Only one impeachment proceeding may be initiated against the same official within a year (Art. XI Sec. 3).');return}
 const sc=(m,th)=>(m.party!=S.pres.party?.3:-.5)*(sec?.5:1)+(S.stats.corruption-40)/90-(S.stats.approval-50)/110+(m.integ-.5)*.3+(rnd()-.5)*.3>th;
 const y=S.house.filter(m=>sc(m,.15)).length,need=Math.ceil(S.con.impHouse/100*S.house.length);S.imp={d:S.dt};
 log(`Impeachment of ${S.pres.name}: ${y} of ${S.house.length} House members vote to impeach${sec?' (secret ballot)':''}; ${need} needed.`);
 if(y<need){log('The complaint fails in the House.');return}
 const c=S.senate.filter(m=>sc(m,.3)).length,n2=Math.ceil(S.con.impSenate/100*S.senate.length);log(`Senate trial: ${c} of ${S.senate.length} senators vote to convict; ${n2} needed.`);
 if(c>=n2){log(`${S.pres.name} is removed from office. ${S.vp.name} becomes President.`);S.pres=S.vp;S.vp=nominateVP();S.stats.approval=50}else{log(`${S.pres.name} is acquitted.`);S.stats.approval=cl(S.stats.approval-2,0,100)}}
function rally(){S.house.concat(S.senate).forEach(m=>{if(m.party==S.player.party)m.trust=cl(m.trust+8,0,100)});S.crisis=Math.max(0,S.crisis-15);log('You rally your lawmakers behind the government.')}
function syncGeo(){const M=S.map,n0=S.house.filter(r=>r.prov>=0).length;for(let i=0;i<W*H;i++)if(M.land[i]&&M.mun[i]>=0)M.prov[i]=S.munis[M.mun[i]].prov;
 S.provs.forEach(p=>p.mun=[]);S.munis.forEach(m=>{S.provs[m.prov].mun.push(m.id);const t=m.huc?12:m.city?10:8;while(m.sb.length<t)m.sb.push(person(m.lean));m.sb.length=t});
 S.provs.forEach(fixDistricts);fixCaps();S.provs.forEach(p=>{const have=S.house.filter(r=>r.prov==p.id).length;for(let k=have;k<p.dist;k++)S.house.push({prov:p.id,d:k+1,...mem(sample(p.lean),S.parties)});let rm=have-p.dist;for(let i=S.house.length-1;i>=0&&rm>0;i--)if(S.house[i].prov==p.id){S.house.splice(i,1);rm--}});
 if(S.house.filter(r=>r.prov>=0).length!=n0){rebuildPL();rebuildCmt();S.speaker=Math.min(S.speaker,S.house.length-1)}}
const hist=(e,o)=>{e.hist=e.hist||[];e.hist.unshift(`${yr()}: ${o.name} (${S.parties[o.party].name})`);e.hist.length=Math.min(e.hist.length,4)};
function elect(){const P=S.parties,Y=yr(),presYr=S.lastPresY==null||Y-S.lastPresY>=S.con.presTerm,lg=S.con.lguLimit,pend={provs:[],munis:[],house:[],senate:[],pres:null,vp:null};
 const reg=Math.round(S.provs.reduce((a,p)=>a+p.pop,0)*.62),ballots=Math.round(reg*.78),valid=Math.round(ballots*.97);
 const R={id:S.elections.length+1,d:dstr(),pres:presYr,P:P.map(p=>({name:p.name,color:p.color,acr:p.acr||''})),reg,ballots,valid,gov:z(),vg:z(),sp:z(),my:z(),cc:z(),mc:z(),huc:z(),govRows:[],houseRows:[],hucRows:[]};
 const vs=(e,party,n)=>{const w=wt(e,-1),t=w.reduce((a,b)=>a+b,0)||1;return Math.round(n*cl(w[party]/t*1.5,.35,.85))};
 S.provs.forEach(p=>{const gov=re(p.gov,wt(p,p.gov.party),lg),vg=re(p.vg,wt(p,p.vg.party),lg),sp=p.sp.map(o=>re(o,wt(p,o.party),lg)),vv=Math.round(p.pop*.62*.78*.97);pend.provs.push({gov,vg,sp});R.gov[gov.party]++;R.vg[vg.party]++;sp.forEach(o=>R.sp[o.party]++);R.govRows.push({loc:p.name,name:gov.name,party:gov.party,votes:vs(p,gov.party,vv),valid:vv})});
 S.munis.forEach(m=>{const k=m.huc?'huc':m.city?'cc':'mc',mayor=re(m.mayor,wt(m,m.mayor.party),lg),vm=re(m.vm,wt(m,m.vm.party),lg),sb=m.sb.map(o=>re(o,wt(m,o.party),lg)),vv=Math.round(m.pop*.62*.78*.97);pend.munis.push({mayor,vm,sb});R.my[mayor.party]++;sb.forEach(o=>R[k][o.party]++);if(m.huc)R.hucRows.push({loc:m.name+' (HUC)',name:mayor.name,party:mayor.party,votes:vs(m,mayor.party,vv),valid:vv})});
 const hc=z();S.house.forEach((r,i)=>{if(r.prov<0)return;const pv=S.provs[r.prov],n=re(r,wt(pv,r.party),S.con.houseLimit,p=>mem(p),25),f=n===r?r:{...n,prov:r.prov,d:r.d},vv=Math.round(pv.pop/Math.max(1,pv.dist)*.62*.78*.97);pend.house.push([i,f]);hc[f.party]++;R.houseRows.push({loc:`${pv.name}, District ${r.d}`,name:f.name,party:f.party,votes:vs(pv,f.party,vv),valid:vv})});
 S.plg.forEach(g=>g.pop=+Math.max(.01,g.pop*(.8+rnd()*.4)).toFixed(3));
 const dcount=S.house.filter(r=>r.prov>=0).length,plw=norm(S.plg.map(g=>g.pop*(.85+rnd()*.3))),plv=alloc(valid,plw);pend.pls=plSeats(S,Math.floor(dcount*S.con.plShare/(100-S.con.plShare)),plw);pend.pls.forEach((n,i)=>hc[S.plg[i].party]+=n);
 const nw=natW(),full=S.con.senTerm<=S.con.houseTerm,c=S.elections.length%2,slots=[];S.senate.forEach((s,i)=>{if(full||s.cls==c)slots.push(i)});
 const n=slots.length,per=Math.max(4,Math.ceil(n/2)),cands=[];P.forEach((p,pi)=>{for(let k=0;k<per;k++)cands.push({...cName(pi),party:pi,w:nw[pi]*(.4+rnd()*1.2)})});
 slots.forEach(i=>{const s=S.senate[i];if((s.terms||1)<S.con.senLimit)cands.push({name:s.name,party:s.party,w:nw[s.party]*(.8+rnd()*1.2),inc:i})});
 const sv=alloc(Math.round(valid*n*.9),norm(cands.map(x=>x.w)));cands.forEach((x,k)=>x.votes=sv[k]);cands.sort((a,b)=>b.votes-a.votes);
 R.senRace=cands.slice(0,n+6).map((x,k)=>({name:x.name,party:x.party,votes:x.votes,won:k<n}));
 const sc=S.senate.slice(),sen=[];cands.slice(0,n).forEach((x,k)=>{const i=slots[k],m=x.inc!=null?S.senate[x.inc]:Object.assign(mem(x.party,S.parties,35),{name:x.name,first:x.first,last:x.last});if(x.inc!=null)m.terms=(m.terms||1)+1;const nn=Object.assign(m,{cls:S.senate[i].cls});pend.senate.push([i,nn]);sc[i]=nn;sen.push({name:nn.name,party:nn.party})});R.sen=sen;
 if(presYr){const pw=alloc(valid,norm(nw.map(x=>x*(.8+rnd()*.4)))),inc=S.con.presReelect>=S.pres.terms,cs=P.map((p,i)=>({...(inc&&i==S.pres.party?{name:S.pres.name,first:S.pres.first,last:S.pres.last}:cName(i)),party:i,votes:pw[i]})),w=pw.indexOf(Math.max(...pw));
  const vw=alloc(valid,norm(nw.map(x=>x*(.8+rnd()*.4)))),vc=P.map((p,i)=>({...cName(i),party:i,votes:vw[i]})),w2=vw.indexOf(Math.max(...vw));
  R.cands=cs;R.win=w;R.vc=vc;R.vwin=w2;R.vpw=vc[w2];
  if(inc&&w==S.pres.party&&cs[w].name==S.pres.name){S.pres.terms++;pend.pres=S.pres}else pend.pres=Object.assign(mem(w,S.parties,40),{name:cs[w].name,first:cs[w].first,last:cs[w].last});
  pend.vp=Object.assign(mem(w2,S.parties,40),{name:vc[w2].name,first:vc[w2].first,last:vc[w2].last});S.lastPresY=Y}
 R.house=hc;R.senAll=tally(sc).slice(0,P.length);R.pl=S.plg.map((g,i)=>({name:g.name,n:pend.pls[i],votes:plv[i],pct:plw[i]*100}));
 R.label=`${Y} ${presYr?'Presidential':'Midterm'} and Local Election`;S.elections.unshift(R);S.pend=pend;
 S.inaug=dn(Y,5,30,S.y0);S.convene=openDay(Y,S.y0);S.next=elecDay(Y+S.con.houseTerm,S.y0);
 log(presYr?`${pend.pres.name} of ${P[pend.pres.party].name} wins the presidency. Winners take office on June 30.`:'Midterm results are in. Winners take office on June 30.')}
function inaugurate(){const p=S.pend;if(!p)return;
 p.provs.forEach((x,i)=>{const o=S.provs[i];if(o){Object.assign(o,x);hist(o,x.gov)}});p.munis.forEach((x,i)=>{const o=S.munis[i];if(o){Object.assign(o,x);hist(o,x.mayor)}});
 p.house.forEach(([i,n])=>{if(S.house[i]&&S.house[i].prov>=0)S.house[i]=n});p.senate.forEach(([i,n])=>{if(S.senate[i])S.senate[i]=n});rebuildPL(S,p.pls);
 if(p.pres){S.pres=p.pres;S.vp=p.vp;S.stats.approval=58}
 Object.keys(S.autos).forEach(r=>autoElect(S,+r));S.pend=null;S.inaug=null;tribunals();log(p.pres?`${S.pres.name} is inaugurated as President. Newly elected local officials take office.`:'Newly elected officials take office.')}
function openSession(){log('Congress opens its regular session (Art. VI Sec. 15). The President delivers the State of the Nation Address.');if(S.convene!=null&&S.dt>=S.convene){S.convene=null;rebuildCmt();electSpeaker();electSenPres()}}
function migrate(s){initExtras(s);if(s.barmm&&!s.autos){s.autos={5:s.barmm};delete s.barmm}s.autos=s.autos||{};['pend','inaug','convene'].forEach(k=>{if(s[k]===undefined)s[k]=null});if(s.next==null)s.next=elecDay(s.y0,s.y0);s.plebs=s.plebs||[];if(s.ml===undefined)s.ml=null;if(s.senPres==null)s.senPres=0;if(s.flagSd==null)s.flagSd=hash('flag'+s.seed);s.justices.forEach(j=>{if(j.age==null)j.age=55+Math.floor(Math.random()*15)});s.bodies.forEach(b=>{if(b.since==null)b.since=s.y0-Math.floor(Math.random()*7)});return s}
function bske(){const P=S.parties,Y=yr(),R={id:S.elections.length+1,d:dstr(),bske:true,P:P.map(p=>({name:p.name,color:p.color})),pb:z(),kg:z(),sk:z()};
 S.munis.forEach(m=>m.brgy.forEach(b=>{const w=wt(m,-1),l=S.con.lguLimit;b.pb=re(b.pb,w,l);b.kag=b.kag.map(o=>re(o,w,l));b.sk=re(b.sk,w,3);R.pb[b.pb.party]++;b.kag.forEach(o=>R.kg[o.party]++);R.sk[b.sk.party]++}));
 R.label=`${Y} Barangay and SK Elections`;S.elections.unshift(R);S.nextB=bskeDay(Y+S.con.houseTerm,S.y0);log('Barangay and Sangguniang Kabataan elections are held nationwide.')}
function monthly(){const s=S.stats;applyBudget(s);LAWS.forEach(l=>{if(S.laws[l[0]]!==false)for(const k in l[6])s[k]=(s[k]||0)+l[6][k]});s.treasury=+(s.treasury+(s.growth-4)*.03).toFixed(2);s.approval+=(rnd()-.5)*2+(s.growth-4)*.15-(s.corruption-40)*.01;s.growth+=(5-s.growth)*.08+(rnd()-.5)*.3;s.corruption+=(rnd()-.5)*1.2;s.order+=(68-s.order)*.05+(rnd()-.5);
 s.poverty+=(rnd()-.52)*.3-(s.growth-4)*.05;['education','health','environment'].forEach(k=>s[k]+=(rnd()-.48)*.4);
 for(const k in s)s[k]=+cl(s[k],k=='treasury'||k=='growth'?-20:0,k=='treasury'?999:k=='growth'?20:100).toFixed(2)}

const clsOf=pop=>pop>1.7e6?1:pop>1.1e6?2:pop>7e5?3:pop>4e5?4:pop>2.2e5?5:6,distOf=pop=>Math.max(1,Math.min(8,Math.round(pop/290000)));
const cellsOf=ids=>{const t=new Set(ids),M=S.map;let n=0;for(let i=0;i<W*H;i++)if(M.mun[i]>=0&&t.has(M.mun[i]))n++;return n};
function provCheck(ids){const ms=ids.map(i=>S.munis[i]),pop=ms.reduce((a,m)=>a+m.pop,0),area=cellsOf(ids)*10,inc=Math.round(pop*220/1e5)/10,notes=[],from=[...new Set(ms.map(m=>m.prov))];
 if(!(pop>=250000||area>=2000))notes.push(`A province needs 250,000 residents or 2,000 sq km (this has ${fmt(pop)} and ${fmt(area)}). LGC Sec. 461.`);
 if(inc<20)notes.push(`A province needs PHP 20 million in annual income (estimated ${inc} million).`);
 from.forEach(pi=>{const p=S.provs[pi],rest=p.mun.filter(id=>!ids.includes(id));if(!rest.length)return;const rp=rest.reduce((a,id)=>a+S.munis[id].pop,0);if(!(rp>=250000||cellsOf(rest)*10>=2000))notes.push(`${p.name} would fall below the minimum (${fmt(rp)} residents) after the split.`)});
 return{pop,area,inc,notes,ok:!notes.length,from}}
function proposeProvince(ids,name,ov){if(S.pend)return'Wait until the newly elected officials take office.';const c=provCheck(ids);if(!c.ok&&!ov)return c.notes.join(' ');
 const d=S.dt+60+Math.floor(rnd()*31);S.plebs.push({kind:'prov',ids:ids.slice(),name,d});log(`A plebiscite on creating ${name} Province is set for ${fday(d)} in the affected municipalities (Art. X Sec. 10).`);return''}
function dropProv(k){S.provs.splice(k,1);S.provs.forEach((p,i)=>p.id=i);const M=S.map;for(let i=0;i<W*H;i++){if(M.prov[i]>k)M.prov[i]--;else if(M.prov[i]==k)M.prov[i]=-1}S.munis.forEach(m=>{if(m.prov>k)m.prov--});S.house=S.house.filter(r=>r.prov!=k);S.house.forEach(r=>{if(r.prov>k)r.prov--})}
function createProvince(ids,name){const ms=ids.map(i=>S.munis[i]),pop=ms.reduce((a,m)=>a+m.pop,0),from=[...new Set(ms.map(m=>m.prov))],id=S.provs.length,ln=norm(S.parties.map((_,k)=>ms.reduce((a,m)=>a+m.lean[k]*m.pop,0)+1e-6)),M=S.map,t=new Set(ids);
 let sx=0,sy=0,n=0;for(let i=0;i<W*H;i++)if(M.mun[i]>=0&&t.has(M.mun[i])){sx+=i%W;sy+=i/W|0;n++}
 const cls=clsOf(pop),dist=distOf(pop),p={id,name,pop,cls,dist,reg:S.provs[ms[0].prov].reg,cx:Math.round(sx/Math.max(1,n)),cy:Math.round(sy/Math.max(1,n)),lean:ln,mun:[],hist:[]};
 p.gov=person(ln);p.vg=person(ln);p.sp=Array.from({length:dist>5?dist*2:cls<3?10:cls<5?8:6},()=>person(ln));p.exo=exo().concat([{name:nm(),party:-1,role:'League of Cities Council Presidents'},{name:nm(),party:-1,role:'League of Municipal Councilors President'}]);
 from.forEach(pi=>{const q=S.provs[pi];q.pop=Math.max(20000,q.pop-ms.filter(m=>m.prov==pi).reduce((a,m)=>a+m.pop,0));q.cls=clsOf(q.pop);q.dist=distOf(q.pop)});
 S.provs.push(p);ms.forEach(m=>m.prov=id);syncGeo();for(let k=S.provs.length-2;k>=0;k--)if(!S.provs[k].mun.length)dropProv(k);syncGeo();
 if(typeof sel!='undefined')sel={p:-1,m:-1};log(`${name} Province is created from ${ms.length} municipalities with ${fmt(pop)} residents.`)}
function plebs(){S.plebs=S.plebs.filter(p=>{if(S.dt<p.d)return true;const y=52+(S.stats.approval-50)*.3+(rnd()-.5)*20;
 if(p.kind=='prov'){log(`Plebiscite on ${p.name} Province: ${y.toFixed(1)}% yes.`);if(y>50&&!S.pend&&p.ids.every(i=>S.munis[i]))createProvince(p.ids,p.name);else log(`${p.name} Province is not created.`)}
 else if(p.kind=='auto'){log(`Plebiscite on autonomy for ${S.regs[p.reg].name}: ${y.toFixed(1)}% yes.`);if(y>50){S.regs[p.reg].auto=true;autoElect(S,p.reg);log(`${S.regs[p.reg].name} becomes an autonomous region (Art. X Sec. 18).`)}else log('Autonomy is rejected.')}else if(p.kind=='mmerge'){log(`Plebiscite on merging municipalities into ${p.name}: ${y.toFixed(1)}% yes.`);if(y>50&&!S.pend&&p.ids.every(i=>S.munis[i]))mergeMunis(p.ids,p.name);else log('The merger is rejected.')}
 return false})}
function tribunals(){const d=S.house.filter(r=>r.prov>=0).length,n=Math.max(1,Math.round(d*.05));let up=0,ov=0;for(let k=0;k<n;k++){const i=Math.floor(rnd()*S.house.length),r=S.house[i];if(!r||r.prov<0)continue;if(rnd()<.2){ov++;S.house[i]={...mem(sample(S.parties.map((_,j)=>j==r.party?0:1)),S.parties),prov:r.prov,d:r.d}}else up++}
 log(`The House Electoral Tribunal (3 Justices and 6 members, Art. VI Sec. 17) rules on ${up+ov} election protests: ${up} upheld, ${ov} overturned.`)}
function caVote(){const sen=S.senate.filter((_,i)=>i%2==0).slice(0,12),st=Math.max(1,Math.floor(S.house.length/12)),hs=S.house.filter((_,i)=>i%st==0).slice(0,12);return ballot(sen.concat(hs),{i:S.pres.ideo,tags:[],e:{},spp:S.pres.party,mine:false},null,false)}
function caConfirm(name,role){const r=caVote(),sp=S.senate[S.senPres];return `The Commission on Appointments${sp?' (chaired by Senate President '+sp.name+')':''} ${r.pass?'confirms':'bypasses'} ${name}${role?', '+role:''}: ${r.y} yes, ${r.n} no.`}
function electSenPres(){const L=S.senate,cands=S.parties.map((p,i)=>{let b=-1,bt=-1;L.forEach((m,j)=>{if(m.party==i&&(m.terms||1)*10+m.integ>bt){bt=(m.terms||1)*10+m.integ;b=j}});return b}).filter(j=>j>=0),t=cands.map(()=>0);
 L.forEach(m=>{let bi=0,bs=-9;cands.forEach((j,k)=>{const c=L[j],s=(m.party==c.party?.9*m.loyal+.3:0)-Math.abs(m.ideo-c.ideo)*.8+(rnd()-.5)*.3;if(s>bs){bs=s;bi=k}});t[bi]++});S.senPres=cands[t.indexOf(Math.max(...t))];log(`${L[S.senPres].name} is elected Senate President (${t.join(', ')} votes).`);leaders()}
function nominateVP(){let c;for(let k=0;k<3;k++){c=mem(sample(natW()),S.parties);const b={i:c.ideo,tags:[],e:{},spp:S.pres.party,mine:false},h=ballot(S.house,b,null,false,.5),s=ballot(S.senate,b,null,false,.5);if(h.pass&&s.pass){log(`${c.name} is nominated Vice President and confirmed by both Houses voting separately (Art. VII Sec. 9).`);return c}}log('Congress does not confirm the nominees. The last nominee serves until confirmed.');return c}
const jointVote=(f)=>{const all=S.house.concat(S.senate);return{y:all.filter(f).length,n:all.length}};
function martial(){if(S.ml)return;S.ml={d:S.dt,end:S.dt+60};S.stats.order=cl(S.stats.order+8,0,100);S.stats.approval=cl(S.stats.approval-6,0,100);log(`${S.pres.name} proclaims martial law for 60 days (Art. VII Sec. 18). Congress reviews the proclamation in joint session.`);
 const r=jointVote(m=>(m.party!=S.pres.party?.3:-.5)+(m.integ-.5)*.4-(S.stats.order-55)/120+(rnd()-.5)*.3>.1);log(`Joint vote on revocation: ${r.y} of ${r.n} vote to revoke; a majority of all members is needed.`);
 if(r.y>r.n/2){log('Congress revokes the proclamation. The President cannot set the revocation aside.');S.ml=null;return}
 if(rnd()<.3){log('The Supreme Court finds no sufficient factual basis and nullifies the proclamation.');S.ml=null}}
function extendML(){if(!S.ml)return;const r=jointVote(m=>(m.party==S.pres.party?.3:-.4)-(m.integ-.5)*.3+(rnd()-.5)*.3>.1);log(`Joint vote to extend martial law: ${r.y} of ${r.n} yes.`);if(r.y>r.n/2){S.ml.end+=60;log('Congress extends martial law for 60 days.')}else log('The extension is not approved.')}
function revokeML(){if(!S.ml)return;const r=jointVote(m=>(m.party!=S.pres.party?.3:-.5)+(m.integ-.5)*.4+(rnd()-.5)*.3>.1);log(`Joint vote to revoke martial law: ${r.y} of ${r.n} yes.`);if(r.y>r.n/2){log('Congress revokes martial law.');S.ml=null}else log('The motion to revoke fails.')}
function gaaDraft(force){const Y=yr()+1;let t=`General Appropriations Act of FY ${Y}`;if(S.bills.some(b=>b.t==t&&STN[b.st]))return;if(S.bills.some(b=>b.t==t)){if(!force)return;t=`Supplemental Appropriations Act of FY ${Y}`}
 const arts=S.budget.lines.map(l=>({id:0,t:`${l.name}: ${l.nep} billion`,i:l.i||0,tags:['budget',l.tag].filter(Boolean),e:{},bud:{id:l.id,amt:l.nep}}));
 const b=makeBill({title:t,arts,orig:'H',sp:{ch:'H',i:Math.floor(rnd()*S.house.length)}});S.budget.fy=Y;log(`The President submits the National Expenditure Program. ${b.spn} files the ${t} in the House (Art. VII Sec. 22).`)}
function budgetCheck(){const t=`General Appropriations Act of FY ${yr()}`,b=S.bills.find(x=>x.t==t);if(b&&b.st=='Law')return;S.stats.growth=cl(S.stats.growth-.2,-20,20);S.stats.approval=cl(S.stats.approval-1,0,100);log(`Congress did not pass the ${t}. The previous appropriations are re-enacted (Art. VI Sec. 25).`)}
function yearly(){S.justices.forEach(j=>{j.age=(j.age||60)+1;if(j.age>=70){const o=j.name;j.name=nm();j.age=48+Math.floor(rnd()*10);j.lean=+(rnd()*2-1).toFixed(1);log(`Justice ${o} reaches the mandatory retirement age of 70 (Art. VIII Sec. 11). The President appoints ${j.name} from the Judicial and Bar Council's list.`)}});
 S.bodies.forEach(b=>{if(yr()-(b.since||S.y0)>=7){const o=b.name;b.name=nm();b.since=yr();log(`${o}'s seven-year term ends at ${b.role}. ${caConfirm(b.name,b.role)}`)}})}
function tick(){S.dt++;const sit0=()=>inSession();const dd=D(),mo=dd.getUTCMonth(),dm=dd.getUTCDate();
 S.bills.forEach(b=>{if(b.mine)return;if(STN[b.st]&&rnd()<.04)act(b,false,true);else if(b.st=='Vetoed'&&!b.ov&&rnd()<.05)act(b,false,true)});
 if(rnd()<.012)draft();if(rnd()<.015)log(pick(E)[1](S));
 if(S.crisis>0){S.crisis--;S.house.concat(S.senate).forEach(m=>m.trust=cl(m.trust-(m.party==S.player.party?.02:.05),0,100))}
 if(S.ml){S.stats.approval=cl(S.stats.approval-.03,0,100);if(S.dt>=S.ml.end){log('Martial law lapses after its 60-day limit (Art. VII Sec. 18).');S.ml=null}}
 if(dm==1)monthly();if(mo==0&&dm==1){budgetCheck();yearly()}if(mo==7&&dm==25)gaaDraft();
 plebs();S.ords.filter(o=>['Council','Executive','Vetoed','Review'].includes(o.st)).forEach(ordStep);if(rnd()<.05)ordAI();if(rnd()<.006&&sit0())localAI();
 if(S.dt==S.inaug)inaugurate();if(S.dt==openDay(yr(),S.y0))openSession();if(S.dt==S.next)elect();if(S.dt==S.nextB)bske();
 if(S.dt%60==0&&typeof autosave=='function')autosave()}

function applyBudget(s){const b=S.budget;if(!b)return;let sp=0;b.lines.forEach(l=>{sp+=l.amt;const r=l.amt/Math.max(1,l.base);for(const k in l.fx)s[k]=(s[k]||0)+l.fx[k]*(r-1)});const rv=b.rev*(1+(s.growth-5)/100),nta=rv*S.rules.ira/100;s.treasury+=(rv-sp-nta)/12/1000}
function localFx(a,k){k=k||1;if(a.loc!=null&&S.provs[a.loc]){const p=S.provs[a.loc];p.dev=cl((p.dev||50)+(a.dev||0)*k,0,100);if(k>0){p.laws=p.laws||[];p.laws.unshift(a.t);p.laws.length=Math.min(p.laws.length,6)}}
 if(a.bud){const l=S.budget.lines.find(x=>x.id==a.bud.id);if(l){if(k>0){a.bud.prev=l.amt;l.amt=a.bud.amt}else if(a.bud.prev!=null)l.amt=a.bud.prev}}
 if(a.st)S.laws[a.st.id]=k>0?a.st.on:!a.st.on}
function cName(pi){const[f,l]=takeName(S.parties[pi]);return{name:f+' '+l,first:f,last:l}}
function localBill(ri,t,title,mine){const r=S.house[ri];if(!r||r.prov<0)return null;const p=S.provs[r.prov],[tt,e,tag,i,dev]=LOCAL_LIB[t||0],txt=title||tt.replace('{p}',p.name);
 return makeBill({title:txt,arts:[{id:0,t:txt,i,tags:[tag,'local'],e:{...e},loc:p.id,dev}],orig:'H',sp:{ch:'H',i:ri},mine:!!mine})}
function localAI(){const ids=S.house.map((r,i)=>r.prov>=0?i:-1).filter(i=>i>=0);if(!ids.length)return;const ri=pick(ids),b=localBill(ri,Math.floor(rnd()*LOCAL_LIB.length));if(b)log(`${b.spn}, representative of ${S.provs[S.house[ri].prov].name}, files "${b.t}".`)}
const olog=(o,t)=>{o.log.unshift(`${dstr()}: ${t}`);o.log.length=Math.min(o.log.length,8)};
function ordInfo(o){if(o.lvl=='p'){const p=S.provs[o.ref];return p&&{mem:p.sp,exec:p.gov,name:p.name+' Sangguniang Panlalawigan',pop:p.pop,days:S.rules.vetoDays}}
 const m=S.munis[o.ref];if(!m)return null;if(o.lvl=='m')return{mem:m.sb,exec:m.mayor,name:m.name+(m.city?' Sangguniang Panlungsod':' Sangguniang Bayan'),pop:m.pop,days:S.rules.vetoDays};
 const b=m.brgy[o.bi];return b&&{mem:b.kag,exec:b.pb,name:'Sangguniang Barangay of '+b.name,pop:m.pop/Math.max(1,m.bn),days:Math.max(5,S.rules.vetoDays-5)}}
const ordReview=o=>o.lvl=='b'||(o.lvl=='m'&&!S.munis[o.ref].huc);
function ordEnact(o,c){const tp=S.provs.reduce((a,p)=>a+p.pop,0)||1,f=Math.min(1,c.pop/tp*4);for(const k in o.e)S.stats[k]=+cl((S.stats[k]||0)+o.e[k]*f,k=='treasury'||k=='growth'?-20:0,k=='treasury'?999:k=='growth'?20:100).toFixed(2);
 const e=o.lvl=='p'?S.provs[o.ref]:S.munis[o.ref];if(e)e.dev=cl((e.dev||50)+(o.dev||0),0,100);log(`The ${c.name} enacts the ordinance "${o.t}".`)}
function ordStep(o){const c=ordInfo(o);if(!c){o.st='Failed';return}const P=S.parties,near=m=>Math.abs((P[m.party]||{ideo:0}).ideo-o.i)<.9,vote=m=>rnd()<(near(m)?.82:.22);
 if(o.st=='Council'&&S.dt-o.d>=3){const pr=c.mem.filter(()=>rnd()<S.rules.attend),y=pr.filter(vote).length;if(pr.length<=c.mem.length/2)olog(o,'The council lacks a quorum (LGC Sec. 53).');else if(y>pr.length/2){o.st='Executive';o.d2=S.dt;olog(o,`The council passes the ordinance on third reading, ${y} to ${pr.length-y}.`)}else{o.st='Failed';olog(o,`The ordinance fails, ${y} to ${pr.length-y}.`)}}
 else if(o.st=='Executive'){const sign=near(c.exec)?rnd()<.9:rnd()<.5,go=sign&&rnd()<.35,lapse=S.dt-o.d2>=c.days;
  if(go||lapse){o.st=ordReview(o)?'Review':'Enacted';o.d3=S.dt;olog(o,lapse&&!go?'The executive does not act within the period; the ordinance is deemed approved (LGC Sec. 54).':'The executive signs the ordinance.');if(o.st=='Enacted')ordEnact(o,c)}
  else if(!sign&&rnd()<.3){o.st='Vetoed';olog(o,'The executive vetoes the ordinance.')}}
 else if(o.st=='Vetoed'&&!o.ov){o.ov=1;const y=c.mem.filter(vote).length;if(y>=c.mem.length*S.rules.overrideLocal/100){o.st=ordReview(o)?'Review':'Enacted';o.d3=S.dt;olog(o,`The council overrides the veto, ${y} of ${c.mem.length} (LGC Sec. 54).`);if(o.st=='Enacted')ordEnact(o,c)}else{o.st='Failed';olog(o,`The override fails, ${y} of ${c.mem.length}.`)}}
 else if(o.st=='Review'&&S.dt-o.d3>=S.rules.reviewDays){if(rnd()<.08){o.st='Failed';olog(o,'The reviewing council declares the ordinance invalid (LGC Sec. 56).')}else{o.st='Enacted';olog(o,'The review period lapses and the ordinance takes effect.');ordEnact(o,c)}}}
function ordFile(lvl,ref,bi,title,x,mine){const o={id:(S.ords.reduce((a,q)=>Math.max(a,q.id),0))+1,lvl,ref,bi,t:title,i:x.i,tags:x.tags,e:x.e,dev:x.dev||0,st:'Council',d:S.dt,log:[],mine:!!mine};S.ords.unshift(o);olog(o,'Filed and read on first reading.');if(S.ords.length>300)S.ords.length=300;return o}
function ordAI(){const r=rnd(),lvl=r<.5?'m':r<.8?'p':'b',[t,i,e,tags,dev]=pick(ORD_LIB);let ref,bi;if(lvl=='p')ref=Math.floor(rnd()*S.provs.length);else{ref=Math.floor(rnd()*S.munis.length);if(lvl=='b')bi=Math.floor(rnd()*S.munis[ref].brgy.length)}ordFile(lvl,ref,bi,t,{i,tags,e,dev})}
function leaders(){const P=S.parties.length,top=(L,party,ex)=>{let b=-1,bt=-1;L.forEach((m,j)=>{if(m.party==party&&j!=ex&&(m.terms||1)*10+m.integ>bt){bt=(m.terms||1)*10+m.integ;b=j}});return b},big=(L,ex)=>{const c=tally(L,P+1).slice(0,P);c[ex]=-1;return c.indexOf(Math.max(...c))},sp=S.house[S.speaker],sn=S.senate[S.senPres];S.floor={};
 if(sp){S.floor.hMaj=top(S.house,sp.party,S.speaker);S.floor.hMin=top(S.house,big(S.house,sp.party),-1)}if(sn){S.floor.sMaj=top(S.senate,sn.party,S.senPres);S.floor.sMin=top(S.senate,big(S.senate,sn.party),-1)}}
function fixDistricts(p){if(!p.districts||!p.districts.length){autoDist(p,p.mun.length?p.dist:null);return}p.districts.forEach(d=>d.munis=d.munis.filter(id=>S.munis[id]&&S.munis[id].prov==p.id));
 const have=new Set(p.districts.flatMap(d=>d.munis)),pop=d=>d.munis.reduce((a,i)=>a+S.munis[i].pop,0);p.mun.filter(id=>!have.has(id)).forEach(id=>{if(!p.districts.length)p.districts.push({n:1,munis:[]});p.districts.sort((a,b)=>pop(a)-pop(b))[0].munis.push(id)});
 p.districts=p.districts.filter(d=>d.munis.length);p.districts.forEach((d,i)=>d.n=i+1);if(p.districts.length&&p.dist!=p.districts.length)autoDist(p,p.dist)}
function fixCaps(){const big=ids=>ids.length?ids.reduce((b,id)=>S.munis[id].pop>S.munis[b].pop?id:b,ids[0]):null;S.provs.forEach(p=>{const c=p.capital;if(c==null||!S.munis[c]||S.munis[c].prov!=p.id)p.capital=big(p.mun)});
 S.regs.forEach((r,ri)=>{const ids=S.provs.filter(p=>p.reg==ri).flatMap(p=>p.mun);if(r.capital==null||!ids.includes(r.capital))r.capital=big(ids)});const n=S.nation.capital;if(n==null||!S.munis[n])capitals(S)}
function dropRegion(k){S.regs.splice(k,1);S.provs.forEach(p=>{if(p.reg>k)p.reg--});const na={};for(const r in S.autos){const i=+r;if(i!=k)na[i>k?i-1:i]=S.autos[r]}S.autos=na;S.plebs.forEach(p=>{if(p.reg!=null&&p.reg>k)p.reg--})}
function pruneRegions(){for(let k=S.regs.length-1;k>=0;k--)if(!S.provs.some(p=>p.reg==k))dropRegion(k)}
function setRegion(ids,ri){ids.forEach(id=>{S.provs[id].reg=ri});pruneRegions();fixCaps()}
function newRegion(name,ids){S.regs.push({name,auto:false,capital:null,rd:{name:nm(),party:-1}});const ri=S.regs.length-1;ids.forEach(id=>{S.provs[id].reg=ri});pruneRegions();fixCaps();log(`An executive order creates the region ${name} (Art. X Sec. 14).`);return ri}
function mergeRegions(a,b){if(a==b)return;const na=S.regs[a].name;S.provs.forEach(p=>{if(p.reg==b)p.reg=a});pruneRegions();fixCaps();log(`The region ${S.regs[b]?S.regs[b].name:''} is merged into ${na}.`)}
function dropMuni(k,into){const g=x=>x>k?x-1:x,f=id=>id==k?g(into):g(id),M=S.map;for(let i=0;i<W*H;i++)if(M.mun[i]==k)M.mun[i]=into;for(let i=0;i<W*H;i++)if(M.mun[i]>k)M.mun[i]--;
 S.munis.splice(k,1);S.munis.forEach((m,i)=>m.id=i);S.provs.forEach(p=>{(p.districts||[]).forEach(d=>d.munis=[...new Set(d.munis.map(f))]);if(p.capital!=null)p.capital=f(p.capital)});S.regs.forEach(r=>{if(r.capital!=null)r.capital=f(r.capital)});
 if(S.nation.capital!=null)S.nation.capital=f(S.nation.capital);S.ords.forEach(o=>{if(o.lvl!='p')o.ref=f(o.ref)});S.plebs.forEach(p=>{if(p.ids)p.ids=p.ids.map(f)})}
function proposeMerge(ids,name){if(S.pend)return'Wait until the newly elected officials take office.';if(ids.length<2)return'Select at least two municipalities.';if(new Set(ids.map(i=>S.munis[i].prov)).size>1)return'Municipalities must be in the same province to merge. Group them into a province first.';
 const d=S.dt+60+Math.floor(rnd()*31);S.plebs.push({kind:'mmerge',ids:ids.slice(),name,d});log(`A plebiscite on merging ${ids.length} municipalities into ${name} is set for ${fday(d)} (Art. X Sec. 10).`);return''}
function mergeMunis(ids,name){const ms=ids.map(i=>S.munis[i]).sort((a,b)=>b.pop-a.pop),base=ms[0],others=ms.slice(1).map(m=>m.id).sort((a,b)=>b-a);
 base.lean=norm(S.parties.map((_,k)=>ms.reduce((a,m)=>a+m.lean[k]*m.pop,0)+1e-6));base.pop=ms.reduce((a,m)=>a+m.pop,0);base.name=name;base.city=ms.some(m=>m.city);base.huc=base.city&&base.pop>=200000;base.bn=ms.reduce((a,m)=>a+m.bn,0);base.brgy=ms.flatMap(m=>m.brgy);
 others.forEach(id=>dropMuni(id,S.munis.indexOf(base)));syncGeo();if(typeof grp!='undefined')grp=[];if(typeof sel!='undefined')sel={r:-1,p:-1,m:-1,b:-1};log(`${name} is formed by merging ${ms.length} municipalities, with ${fmt(base.pop)} residents.`)}
