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
function hsl2rgb(h,s,l){const a=s*Math.min(l,1-l),f=n=>{const k=(n+h/30)%12;return Math.round(255*(l-a*Math.max(-1,Math.min(k-3,9-k,1))))};return[f(0),f(8),f(4)]}
const regCol=r=>hsl2rgb((r*67+20)%360,.5,.58),pcol=p=>S.parties[p]?S.parties[p].color:'#888888';
let BL=null,VIEW={x:0,y:0,w:W,h:H},BRG={};
let GBASE=[];
function mapKey(i){const M=S.map;if(!M.land[i])return -1;if(tool=='group')return M.mun[i]>=0?1000+M.mun[i]:-2;if(tool=='gbrg')return M.bg[i]>=0&&M.mun[i]>=0&&(sel.p<0||M.prov[i]==sel.p)?100000+GBASE[M.mun[i]]+M.bg[i]:-2;const p=M.prov[i];if(tool=='greg')return p>=0?p:-2;
 if(sel.m>=0&&S.munis[sel.m]){if(M.mun[i]==sel.m){const b=M.bg[i];return b>=0?5000+b:1000+sel.m}return p==sel.p?1000+M.mun[i]:-2}
 if(sel.p>=0)return p==sel.p?1000+M.mun[i]:-2;
 if(sel.r>=0)return p>=0&&S.provs[p]&&S.provs[p].reg==sel.r?p:-2;
 if(layer=='reg')return p>=0&&S.provs[p]?2000+S.provs[p].reg:-2;return p}
function mapColor(k){if(k==-1)return[169,203,221];if(k==-2)return[205,211,206];
 if(k>=100000){const g=k-100000;let mi=GBASE.length-1;while(mi>0&&GBASE[mi]>g)mi--;const m=S.munis[mi],b=m&&m.brgy[g-GBASE[mi]];if(!b)return[200,200,200];if(grpB.includes(g))return[250,246,200];const c=hexRGB(pcol(b.pb.party)),t=((g*37)%7)/14;return c.map(v=>Math.min(255,v*(.8+t)))}
 if(k>=5000&&k<100000){const m=S.munis[sel.m],b=m&&m.brgy[k-5000];if(!b)return[200,200,200];const c=hexRGB(pcol(b.pb.party)),t=((k*37)%7)/14;return c.map(v=>Math.min(255,v*(.85+t)+(k-5000==sel.b?70:0)))}
 if(k>=2000){const c=regCol(k-2000);return k-2000==sel.r?c.map(v=>Math.min(255,v*1.15+25)):c}
 if(k>=1000&&grp.includes(k-1000))return[250,246,200];if(tool=='greg'&&grpP.includes(k))return[250,246,200];
 const e=k>=1000?S.munis[k-1000]:S.provs[k];if(!e)return[200,200,200];if(tool=='greg')return regCol(e.reg);
 if(mapMode=='pop'){const L=k>=1000?S.munis:S.provs,mx=Math.max(...L.map(x=>x.pop)),t=Math.sqrt(e.pop/mx),a=[232,241,245],b=[27,107,138];return a.map((v,j)=>v+(b[j]-v)*t)}
 const h=k>=1000?e.mayor:e.gov;let c=hexRGB(pcol(h.party));if(k>=1000&&k-1000==sel.m)c=c.map(v=>Math.min(255,v*1.25+30));return c}
function zoomRect(){const M=S.map;let test=null;
 if(tool=='sel'||tool=='paint'||tool=='newm'||tool=='paintb'||tool=='newb'){test=sel.b>=0&&sel.m>=0?(i=>M.mun[i]==sel.m&&M.bg[i]==sel.b):sel.m>=0?(i=>M.mun[i]==sel.m):sel.p>=0?(i=>M.prov[i]==sel.p):sel.r>=0?(i=>M.prov[i]>=0&&S.provs[M.prov[i]]&&S.provs[M.prov[i]].reg==sel.r):null}
 if(test){let x0=W,x1=0,y0=H,y1=0;for(let i=0;i<W*H;i++)if(M.land[i]&&test(i)){const x=i%W,y=i/W|0;if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y}
  if(x1>=x0){const ar=520/760,pad=3;let w=x1-x0+1+2*pad,h=y1-y0+1+2*pad;if(w/h>ar)h=w/ar;else w=h*ar;if(w>W){w=W;h=w/ar}if(h>H){h=H;w=h*ar}return{x:cl((x0+x1)/2-w/2,0,W-w),y:cl((y0+y1)/2-h/2,0,H-h),w,h}}}
 return{x:0,y:0,w:W,h:H}}
function drawMap(cv){const ctx=cv.getContext('2d'),off=document.createElement('canvas');off.width=W;off.height=H;const o=off.getContext('2d'),im=o.createImageData(W,H),d=im.data,keys=new Int32Array(W*H);
 GBASE=[];{let t=0;S.munis.forEach(m=>{GBASE.push(t);t+=m.brgy.length})}VIEW=zoomRect();
 for(let i=0;i<W*H;i++)keys[i]=mapKey(i);
 for(let i=0;i<W*H;i++){const k=keys[i],x=i%W,y=i/W|0;let c=mapColor(k);if(k>=0&&((x<W-1&&keys[i+1]!=k)||(y<H-1&&keys[i+W]!=k)||(x>0&&keys[i-1]==-1)||(y>0&&keys[i-W]==-1)))c=c.map(v=>v*.55);d[i*4]=c[0];d[i*4+1]=c[1];d[i*4+2]=c[2];d[i*4+3]=255}
 o.putImageData(im,0,0);ctx.imageSmoothingEnabled=false;ctx.drawImage(off,VIEW.x,VIEW.y,VIEW.w,VIEW.h,0,0,cv.width,cv.height);
 const sc=cv.width/VIEW.w;ctx.font=`600 ${sc>8?13:11}px sans-serif`;ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.65)';ctx.fillStyle='#fff';
 if(showNames){const by=new Map();for(let i=0;i<W*H;i++){const k=keys[i];if(k>=0&&k<100000){let a=by.get(k);if(!a){a=[];by.set(k,a)}a.push(i)}}
  const C=sel.p>=0&&sel.m<0?null:null,nameOf=k=>{if(k>=5000){const m=S.munis[sel.m],b=m&&m.brgy[k-5000];return b?b.name:''}if(k>=2000){const r=S.regs[k-2000];return r?r.name.replace(/^Region \d+: /,''):''}if(k>=1000){const m=S.munis[k-1000];return m?(S.provs[m.prov]&&S.provs[m.prov].capital==m.id?'\u2605 ':'')+m.name:''}const p=S.provs[k];return p?p.name:''};
  const show=k=>{if(tool=='group'&&!(k>=1000&&grp.includes(k-1000)))return false;if(tool=='greg')return false;return true};
  by.forEach((cells,k)=>{if(!show(k))return;const t=nameOf(k);if(!t)return;const n=cells.length,kk=Math.min(3,n<70?1:n<220?2:3),pts=cells.map(c=>[c%W,c/W|0]),sp=a=>Math.max(...a)-Math.min(...a),ax=sp(pts.map(p=>p[0]))>=sp(pts.map(p=>p[1]))?0:1,o=pts.map((p,i)=>i).sort((a,b)=>pts[a][ax]-pts[b][ax]);
   for(let g=0;g<kk;g++){const grp0=o.slice(Math.floor(g*n/kk),Math.floor((g+1)*n/kk));if(!grp0.length)continue;if(grp0.length*sc*sc<t.length*45)continue;const cx=grp0.reduce((a,i)=>a+pts[i][0],0)/grp0.length,cy=grp0.reduce((a,i)=>a+pts[i][1],0)/grp0.length;let b=grp0[0],bd=1e9;grp0.forEach(i=>{const d=(pts[i][0]-cx)**2+(pts[i][1]-cy)**2;if(d<bd){bd=d;b=i}});
    const X=(pts[b][0]+.5-VIEW.x)*sc,Y=(pts[b][1]+.5-VIEW.y)*sc;if(X<0||Y<0||X>cv.width||Y>cv.height)continue;ctx.strokeText(t,X,Y);ctx.fillText(t,X,Y)}})}}
function cellAt(e){const cv=e.currentTarget||e.target,r=cv.getBoundingClientRect(),x=Math.floor(VIEW.x+(e.clientX-r.left)/r.width*VIEW.w),y=Math.floor(VIEW.y+(e.clientY-r.top)/r.height*VIEW.h);return x<0||y<0||x>=W||y>=H?-1:y*W+x}
function paintAt(e){const i=cellAt(e),M=S.map,m=S.munis[sel.m];if(!m||i<0)return;if(tool=='paintb'){if(sel.b<0)return;const x0=i%W,y0=i/W|0;for(let dy=-brush;dy<=brush;dy++)for(let dx=-brush;dx<=brush;dx++){const x=x0+dx,y=y0+dy;if(x<0||y<0||x>=W||y>=H)continue;const j=y*W+x;if(M.mun[j]==sel.m&&dx*dx+dy*dy<=brush*brush)M.bg[j]=sel.b}drawMap($('#cv'));return}const x0=i%W,y0=i/W|0;for(let dy=-brush;dy<=brush;dy++)for(let dx=-brush;dx<=brush;dx++){const x=x0+dx,y=y0+dy;if(x<0||y<0||x>=W||y>=H)continue;const j=y*W+x;if(M.land[j]&&dx*dx+dy*dy<=brush*brush){M.mun[j]=sel.m;M.prov[j]=m.prov}}drawMap($('#cv'))}
function mapClick(e){const M=S.map,i=cellAt(e);if(i<0||!M.land[i])return;const pv=M.prov[i],mu=M.mun[i];
 if(tool=='newm'){const p=S.provs[pv],id=S.munis.length,m={id,prov:p.id,name:place(),pop:10000,city:false,huc:false,lean:p.lean.slice(),hist:[],bn:8,dev:50};m.mayor=person(m.lean,21);m.vm=person(m.lean,21);m.sb=Array.from({length:8},()=>person(m.lean,18));m.exo=exo();brgys(m);m.ie=+(.6+rnd()*.9).toFixed(2);S.munis.push(m);
  const x0=i%W,y0=i/W|0;for(let dy=-3;dy<=3;dy++)for(let dx=-3;dx<=3;dx++){const x=x0+dx,y=y0+dy,j=y*W+x;if(x>=0&&y>=0&&x<W&&y<H&&M.land[j]&&M.prov[j]==p.id&&dx*dx+dy*dy<=9)M.mun[j]=id}
  m.incH=[incomeOf(m,'municipality')];reclassOne(m,'municipality');layoutBrgys(S,m);syncGeo();sel={r:p.reg,p:p.id,m:id,b:-1};tool='sel';render();return}
 if(tool=='newb'){if(mu>=0&&M.bg[i]!==undefined)bcreateDlg(mu,i);return}
 if(tool=='gbrg'){const bg=M.bg[i];if(mu>=0&&bg>=0){const g=GBASE[mu]+bg,k=grpB.indexOf(g);if(k<0)grpB.push(g);else grpB.splice(k,1)}render();return}
 if(tool=='group'){if(mu>=0){const k=grp.indexOf(mu);if(k<0)grp.push(mu);else grp.splice(k,1)}render();return}
 if(tool=='greg'){if(pv>=0){const k=grpP.indexOf(pv);if(k<0)grpP.push(pv);else grpP.splice(k,1)}render();return}
 if(pv<0||!S.provs[pv])return;
 if(sel.m>=0&&S.munis[sel.m]){if(mu==sel.m){const b=BL&&BL.idx.get(i);if(b!=null)sel.b=b}else if(pv==sel.p){sel.m=mu;sel.b=-1}else{sel={r:S.provs[pv].reg,p:pv,m:-1,b:-1}}}
 else if(sel.p>=0){if(pv==sel.p){sel.m=mu;sel.b=-1}else{sel={r:S.provs[pv].reg,p:pv,m:-1,b:-1}}}
 else if(sel.r>=0){if(S.provs[pv].reg==sel.r)sel.p=pv;else sel.r=S.provs[pv].reg}
 else if(layer=='reg')sel.r=S.provs[pv].reg;else{sel.p=pv;sel.r=S.provs[pv].reg}
 render()}
