const LEX=[
[/school|educat|teacher|scholar|literac|learner|classroom/i,['education','budget'],{education:2,treasury:-.2,approval:1},-.4,1],
[/health|hospital|medic|vaccin|clinic|doctor|nurse|philhealth/i,['health','budget'],{health:2.5,treasury:-.3,approval:1},-.4,1],
[/wage|salary|labor|worker|employ|union|overtime/i,['labor'],{poverty:-1.2,approval:1.5,growth:-.15},-.6,1],
[/tax|tariff|excise|levy|revenue|duty|vat/i,['revenue'],{treasury:.4,approval:-1.2},.5,1],
[/road|bridge|port|airport|rail|infrastructure|internet|broadband|construct/i,['infrastructure','budget'],{growth:.35,treasury:-.3},0,1],
[/corrupt|graft|transparen|audit|procure|dynast|ethic|accountab|red tape/i,['governance'],{corruption:-4,approval:1},-.2,0],
[/police|crime|peace|security|military|army|curfew|drug|terror|penal/i,['order'],{order:3,approval:-.5},.7,0],
[/environment|forest|climate|solar|renewable|pollut|waste|plastic|mining|marine|emission/i,['environment'],{environment:2.5,growth:-.1},-.3,0],
[/subsid|cash transfer|ayuda|welfare|pension|poverty|indigent|4ps|relief|social protection/i,['budget'],{poverty:-1.5,treasury:-.4,approval:1.5},-.6,1],
[/budget|appropriat|allot|expenditure/i,['budget'],{treasury:-.3},0,1],
[/investment|business|trade|export|startup|enterprise|industr|manufactur|tourism/i,['revenue'],{growth:.4,approval:.3,treasury:.1},.4,1],
[/agricultur|farm|rice|fisher|irrigat|crop/i,['budget'],{growth:.2,poverty:-.6,approval:.5},-.1,1]];
const NEG=/\b(cut|reduc|abolish|repeal|slash|remove|eliminat|lower|decreas|suspend|defund)\w*/i;
const WN={one:1,two:2,three:3,four:4,five:5,six:6};const nv=x=>WN[String(x).toLowerCase()]||+x;
const CP=[[/president\w*.{0,50}?(\d+)[- ]year/i,'presTerm',m=>+m[1]],[/president\w*.{0,70}(re-?elect|second term)/i,'presReelect',()=>1],[/senator\w*.{0,60}?(\d+|one|two|three|four) (consecutive )?terms?/i,'senLimit',m=>nv(m[1])],
[/senate.{0,30}?(\d+) (seats|members)/i,'senSize',m=>+m[1]],[/supreme court.{0,40}?(\d+) (justices|members|seats)/i,'scSize',m=>+m[1]],[/party-?list.{0,50}?(\d+)\s*(%|percent)/i,'plShare',m=>+m[1]],
[/house.{0,40}?(\d+)[- ]year terms?/i,'houseTerm',m=>+m[1]],[/impeach.{0,70}?(one-fourth|one-third|one-half)/i,'impHouse',m=>({'one-fourth':25,'one-third':33.3,'one-half':50})[m[1].toLowerCase()]],
[/impeach.{0,70}?(\d+)\s*(%|percent)/i,'impHouse',m=>+m[1]],[/(amendment|constitution)\w*.{0,50}?(\d+)\s*(%|percent)/i,'amendVote',m=>+m[2]],[/veto.{0,50}?(\d+)\s*(%|percent)/i,'vetoOverride',m=>+m[1]],
[/plebiscite.{0,50}?(\d+)\s*(%|percent)/i,'plebiscite',m=>+m[1]],[/local (official|executive)s?.{0,60}?(\d+|one|two|three|four) terms/i,'lguLimit',m=>nv(m[2])]];
const bl=(v,a,b)=>Math.max(a,Math.min(b,v));
function clean(x){x=x||{};const e={};for(const k in SL){const v=+((x.effects||x.e||{})[k]);if(isFinite(v)&&v)e[k]=+bl(v,k=='treasury'||k=='growth'?-1:-5,k=='treasury'||k=='growth'?1:5).toFixed(2)}
 const c={};for(const k in CONB){const raw=(x.constitutional||x.c||{})[k];if(raw!=null&&isFinite(+raw))c[k]=+bl(+raw,CONB[k][0],CONB[k][1])}
 const fn=[];(x.functions||x.fn||[]).slice(0,6).forEach(f=>{if(!f||typeof f!='object')return;if(f.t=='rule'&&RB[f.k]&&isFinite(+f.v))fn.push({t:'rule',k:f.k,v:+bl(+f.v,RB[f.k][0],RB[f.k][1])});else if(f.t=='bud'&&Object.values(BUDKW).includes(f.line)&&isFinite(+f.pct))fn.push({t:'bud',line:f.line,pct:+bl(+f.pct,-50,100)});else if(f.t=='dept'&&(f.add||f.remove))fn.push(f.add?{t:'dept',add:String(f.add).slice(0,60)}:{t:'dept',remove:String(f.remove).slice(0,60)});else if(f.t=='law'&&typeof LAWS!='undefined'&&LAWS.some(l=>l[0]==+f.id))fn.push({t:'law',id:+f.id,on:!!f.on});else if(f.t=='ie'&&isFinite(+f.pct))fn.push({t:'ie',pct:+bl(+f.pct,-10,10)})});
 return{fn:fn.length?fn:undefined,i:+bl(+(x.ideology!=null?x.ideology:x.i)||0,-1,1).toFixed(2),tags:(x.tags||[]).filter(t=>INT.includes(t)).slice(0,4).concat(Object.keys(c).length?['governance']:[]).filter((t,k,a)=>a.indexOf(t)==k),e,c:Object.keys(c).length?c:undefined,summary:String(x.summary||'').slice(0,300),notes:(x.notes||[]).map(n=>String(n).slice(0,240)).slice(0,5)}}
function localAnalyze(text){const hits=[],e={},tags=[],notes=[];let ideo=0,sg=NEG.test(text)?-1:1;
 const pc=text.match(/(\d+(?:\.\d+)?)\s*(%|percent)/i),k=Math.max(.5,Math.min(2.5,(/double/i.test(text)?1.6:/triple/i.test(text)?2.2:/pilot|limited|small/i.test(text)?.6:1)*(pc?1+ +pc[1]/50:1)*(/universal|nationwide|all /i.test(text)?1.2:1)));
 LEX.forEach(([re,tg,ef,id,fl])=>{if(re.test(text)){hits.push(1);const s=fl?sg:1;tg.forEach(t=>tags.includes(t)||tags.push(t));for(const q in ef)e[q]=(e[q]||0)+ef[q]*s*k;ideo+=id*s}});
 const c={};CP.forEach(([re,key,f])=>{const m=text.match(re);if(m&&c[key]==null){const v=f(m);if(v!=null&&isFinite(v))c[key]=v}});
 if(Object.keys(c).length)notes.push('This text changes a structural rule. It needs three-fourths of all members of Congress and a plebiscite (Art. XVII).');
 else if(/constitution|charter/i.test(text))notes.push('No Constitution setting in this simulation matches the wording, so it is treated as an ordinary law.');
 if(tags.includes('budget')||tags.includes('revenue'))notes.push('Appropriation and revenue measures must originate in the House (Art. VI Sec. 24).');
 if(/martial law/i.test(text))notes.push('Martial law is limited to 60 days and is subject to congressional and judicial review (Art. VII Sec. 18).');
 if(/province|municipalit|city|barangay/i.test(text)&&/creat|abolish|merge|divid/i.test(text))notes.push('Creating, merging, or abolishing local units needs the Local Government Code criteria and a plebiscite (Art. X Sec. 10). The Map tool does this directly.');
 if(/(ban|prohibit|censor|restrict).{0,40}(speech|press|assembly|religion|protest)/i.test(text))notes.push('Likely unconstitutional under the Bill of Rights (Art. III); the Supreme Court may strike it down.');
const fn=[];let m;
 if((m=text.match(/(?:create|establish|set up)\s+(?:a |the )?(?:new )?department of ([A-Za-z&, ]{3,50}?)(?:[.;]| to | and |,|$)/i)))fn.push({t:'dept',add:m[1].trim()});
 if((m=text.match(/(?:abolish|dissolve|eliminate)\s+(?:the )?department of ([A-Za-z&, ]{3,50}?)(?:[.;]| and |,|$)/i)))fn.push({t:'dept',remove:m[1].trim()});
 if((m=text.match(/(increase|raise|boost|expand|cut|reduce|slash)[^.]{0,40}?(education|health|social welfare|welfare|infrastructure|defense|defence|agriculture|environment|governance)[^.]{0,40}?(\d+)\s*(%|percent)/i)))fn.push({t:'bud',line:BUDKW[m[2].toLowerCase()],pct:(/cut|reduce|slash/i.test(m[1])?-1:1)*+m[3]});
 if((m=text.match(/(?:internal revenue allotment|local (?:government )?share)[^.]{0,60}?(\d+)\s*(%|percent)/i)))fn.push({t:'rule',k:'ira',v:+m[1]});
 if((m=text.match(/quorum[^.]{0,50}?(\d+)\s*(%|percent)/i)))fn.push({t:'rule',k:'quorum',v:+m[1]});
 if((m=text.match(/voting age[^.]{0,30}?(\d+)/i)))fn.push({t:'rule',k:'votingAge',v:+m[1]});
 if((m=text.match(/barangay[^.]{0,60}?term[^.]{0,30}?(\d+)\s*years?/i)))fn.push({t:'rule',k:'brgyTerm',v:+m[1]});
 if(typeof LAWS!='undefined'){const rp=/repeal|abolish/i.test(text),rs=/restore|reinstate/i.test(text);if(rp||rs)LAWS.forEach(l=>{if(text.toLowerCase().includes(l[1].toLowerCase().slice(0,22)))fn.push({t:'law',id:l[0],on:rs&&!rp})})}
 if(/(tax|fee|permit|levy)/i.test(text)&&/(increase|raise|impose)/i.test(text))fn.push({t:'ie',pct:3});else if(/(tax|fee|permit|levy)/i.test(text)&&/(reduce|cut|exempt|lower)/i.test(text))fn.push({t:'ie',pct:-3});
 if(fn.length)notes.push('Game functions changed: '+fn.map(f=>f.t=='rule'?`rule ${f.k}`:f.t=='bud'?`budget ${f.line}`:f.t=='dept'?'executive departments':f.t=='law'?'statute book':'local income').join(', ')+'.');
 if(!hits.length&&!Object.keys(c).length&&!fn.length)notes.push('The built-in analyzer could not tell what this article does, so it has no measurable effect.');
 return clean({functions:fn,ideology:hits.length?ideo/hits.length:0,tags:tags.length?tags:['governance'],effects:e,constitutional:c,notes,summary:hits.length?'Matched '+hits.length+' policy area(s).':''})}
async function analyzeBill(title,arts){try{const ac=new AbortController(),t=setTimeout(()=>ac.abort(),15000),r=await fetch('/api/analyze',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({title,articles:arts}),signal:ac.signal});clearTimeout(t);
 if(r.ok){const j=await r.json();if(j&&Array.isArray(j.articles)&&j.articles.length==arts.length)return{src:'Claude',arts:j.articles.map(clean)}}}catch(e){}return{src:'the built-in analyzer',arts:arts.map(localAnalyze)}}
