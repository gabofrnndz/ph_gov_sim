// Cloudflare Pages Function: POST /api/analyze
// Set ANTHROPIC_API_KEY as a secret in Pages > Settings > Variables and Secrets.
const SYSTEM=`You analyze articles of a bill in a Philippine government simulation. For each article, decide what it does to the country.
Reply with JSON only, no prose and no code fences: {"articles":[{"ideology":number,"tags":[],"effects":{},"constitutional":{},"summary":"","notes":[]}]} with exactly one object per article, in order.
ideology: -1 progressive to 1 conservative.
tags: any of education, budget, revenue, health, labor, environment, governance, infrastructure, order.
effects: any of approval, growth, treasury, corruption, order, poverty, education, health, environment. Use moderate numbers: treasury and growth between -1 and 1, others between -5 and 5. Negative corruption and poverty are good. Consider side effects.
constitutional: only if the article rewrites a structural rule; keys from presTerm, presReelect, senTerm, senLimit, senSize, houseTerm, houseLimit, scSize, plShare, plThreshold, plCap, impHouse, impSenate, amendVote, vetoOverride, plebiscite, lguLimit with numeric values; otherwise {}.
notes: up to three short legal observations citing the 1987 Philippine Constitution where relevant (for example, revenue bills originate in the House, Art. VI Sec. 24).`;
const json=(o,s=200)=>new Response(JSON.stringify(o),{status:s,headers:{'content-type':'application/json'}});
export async function onRequestPost({request,env}){
 if(!env.ANTHROPIC_API_KEY)return json({error:'ANTHROPIC_API_KEY is not set'},501);
 let b;try{b=await request.json()}catch(e){return json({error:'bad request'},400)}
 const title=String(b.title||'').slice(0,200),articles=(Array.isArray(b.articles)?b.articles:[]).slice(0,12).map(x=>String(x).slice(0,1500));
 if(!articles.length)return json({error:'no articles'},400);
 const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'x-api-key':env.ANTHROPIC_API_KEY,'anthropic-version':'2023-06-01','content-type':'application/json'},
  body:JSON.stringify({model:'claude-sonnet-5-5',max_tokens:2000,system:SYSTEM,messages:[{role:'user',content:JSON.stringify({title,articles})}]})});
 if(!r.ok)return json({error:'upstream '+r.status},502);
 const d=await r.json(),t=((d.content||[]).find(x=>x.type=='text')||{}).text||'';
 try{const j=JSON.parse(t.replace(/```json|```/g,'').trim());return json(j)}catch(e){return json({error:'unparseable'},502)}}
