function hemi(c,cols,Wd=460){const N=c.reduce((a,b)=>a+b,0);if(!N)return'';
 const rows=Math.max(1,Math.round(Math.sqrt(N/3.4))),R=Wd/2-8,r0=rows>1?.4:.8,rs=Array.from({length:rows},(_,i)=>rows>1?r0+(1-r0)*i/(rows-1):1),tr=rs.reduce((a,b)=>a+b,0);
 const n=rs.map(r=>Math.max(1,Math.round(N*r/tr)));n[rows-1]+=N-n.reduce((a,b)=>a+b,0);
 const pts=[];rs.forEach((r,i)=>{for(let j=0;j<n[i];j++)pts.push([Math.PI*(1-(n[i]>1?j/(n[i]-1):.5)),r])});
 pts.sort((a,b)=>b[0]-a[0]||a[1]-b[1]);
 const dot=Math.max(1.5,Math.min(Math.PI*R/Math.max(...n)*.42,rows>1?R*(1-r0)/(rows-1)*.42:R*.2)),Ht=R+dot+12;
 let ci=0,left=c[0];
 const dots=pts.map(([a,r])=>{while(!left&&ci<c.length-1)left=c[++ci];left--;return `<circle cx="${(Wd/2+Math.cos(a)*R*r).toFixed(1)}" cy="${(R+4-Math.sin(a)*R*r).toFixed(1)}" r="${dot.toFixed(1)}" fill="${cols[ci]}"/>`}).join('');
 return `<svg viewBox="0 0 ${Wd} ${Ht.toFixed(0)}" role="img" aria-label="Seat chart, ${N} seats" style="width:100%;max-width:${Wd}px">${dots}<text x="${Wd/2}" y="${R-4}" text-anchor="middle" font-size="${(R*.22).toFixed(0)}" font-weight="700" fill="currentColor">${N}</text></svg>`}
const hexRGB=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
function mapKey(i){const M=S.map;if(!M.land[i])return -1;if(tool=='group')return M.mun[i]>=0?1000+M.mun[i]:-2;if(sel.p>=0)return M.prov[i]==sel.p?1000+M.mun[i]:-2;return M.prov[i]}
function mapColor(k){
 if(k==-1)return[169,203,221];if(k==-2)return[205,211,206];
 if(k>=1000&&grp.includes(k-1000))return[250,246,200];const e=k>=1000?S.munis[k-1000]:S.provs[k];
 if(mapMode=='pop'){const mx=Math.max(...(k>=1000?S.munis:S.provs).map(x=>x.pop)),t=Math.sqrt(e.pop/mx),a=[232,241,245],b=[27,107,138];return a.map((v,j)=>v+(b[j]-v)*t)}
 const h=k>=1000?e.mayor:e.gov;let c=hexRGB(S.parties[h.party]?S.parties[h.party].color:'#888888');
 if(k>=1000&&k-1000==sel.m)c=c.map(v=>Math.min(255,v*1.25+30));return c}
function drawMap(cv){
 const ctx=cv.getContext('2d'),off=document.createElement('canvas');off.width=W;off.height=H;
 const o=off.getContext('2d'),im=o.createImageData(W,H),d=im.data,keys=new Int16Array(W*H);
 for(let i=0;i<W*H;i++)keys[i]=mapKey(i);
 for(let i=0;i<W*H;i++){const k=keys[i],x=i%W,y=i/W|0;let c=mapColor(k);
  if(k>=0&&((x<W-1&&keys[i+1]!=k)||(y<H-1&&keys[i+W]!=k)||(x>0&&keys[i-1]==-1)||(y>0&&keys[i-W]==-1)))c=c.map(v=>v*.55);
  d[i*4]=c[0];d[i*4+1]=c[1];d[i*4+2]=c[2];d[i*4+3]=255}
 o.putImageData(im,0,0);ctx.imageSmoothingEnabled=false;ctx.drawImage(off,0,0,cv.width,cv.height);
 const sc=cv.width/W;ctx.font='600 11px sans-serif';ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.65)';ctx.fillStyle='#fff';
 if(sel.p<0)S.provs.forEach(p=>{ctx.strokeText(p.name,p.cx*sc,p.cy*sc);ctx.fillText(p.name,p.cx*sc,p.cy*sc)});
 else S.provs[sel.p].mun.forEach(id=>{const m=S.munis[id],i=S.map.mun.indexOf(id);if(i<0)return;const x=(i%W)*sc,y=(i/W|0)*sc;ctx.strokeText(m.name,x,y);ctx.fillText(m.name,x,y)})}
function cellAt(e){const cv=e.currentTarget||e.target,r=cv.getBoundingClientRect();return Math.floor((e.clientY-r.top)/r.height*H)*W+Math.floor((e.clientX-r.left)/r.width*W)}
function paintAt(e){const i=cellAt(e),M=S.map,m=S.munis[sel.m];if(!m||i<0||i>=W*H)return;const x0=i%W,y0=i/W|0;
 for(let dy=-brush;dy<=brush;dy++)for(let dx=-brush;dx<=brush;dx++){const x=x0+dx,y=y0+dy;if(x<0||y<0||x>=W||y>=H)continue;const j=y*W+x;if(M.land[j]&&dx*dx+dy*dy<=brush*brush){M.mun[j]=sel.m;M.prov[j]=m.prov}}
 drawMap($('#cv'))}
function mapClick(e){const M=S.map,i=cellAt(e);if(i<0||i>=W*H||!M.land[i])return;
 if(tool=='group'){const id=M.mun[i];if(id>=0){const k=grp.indexOf(id);if(k<0)grp.push(id);else grp.splice(k,1)}render();return}
 if(tool=='newm'){const p=S.provs[M.prov[i]],id=S.munis.length,m={id,prov:p.id,name:place(),pop:10000,city:false,huc:false,lean:p.lean.slice(),hist:[],bn:8};
  m.mayor=person(m.lean);m.vm=person(m.lean);m.sb=Array.from({length:8},()=>person(m.lean));m.exo=exo();brgys(m);S.munis.push(m);
  const x0=i%W,y0=i/W|0;for(let dy=-3;dy<=3;dy++)for(let dx=-3;dx<=3;dx++){const x=x0+dx,y=y0+dy,j=y*W+x;if(x>=0&&y>=0&&x<W&&y<H&&M.land[j]&&M.prov[j]==p.id&&dx*dx+dy*dy<=9)M.mun[j]=id}
  syncGeo();sel={p:p.id,m:id};tool='sel';render();return}
 if(sel.p>=0&&M.prov[i]==sel.p)sel.m=M.mun[i];else{sel.p=M.prov[i];sel.m=-1}render()}