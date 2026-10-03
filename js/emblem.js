const hash=s=>{let h=2166136261;for(const ch of String(s)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0};
const prng=a=>()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
let EMB=0;
const sdOf=(o,k)=>o.sd!=null?o.sd:(o.sd=hash(S.seed+':'+k));
function seal(name,sd,size=88){const r=prng(sd),h=Math.floor(r()*360),c1=`hsl(${h} 50% 30%)`,c2=`hsl(${(h+160)%360} 55% 55%)`,g='#E3A008',id='sp'+(++EMB),m=Math.floor(r()*5);let mo='';
 if(m==0)mo=`<circle cx="60" cy="60" r="12" fill="${g}"/>`+Array.from({length:12},(_,i)=>{const a=i*Math.PI/6;return `<line x1="${(60+16*Math.cos(a)).toFixed(1)}" y1="${(60+16*Math.sin(a)).toFixed(1)}" x2="${(60+25*Math.cos(a)).toFixed(1)}" y2="${(60+25*Math.sin(a)).toFixed(1)}" stroke="${g}" stroke-width="3"/>`}).join('');
 else if(m==1)mo=`<circle cx="72" cy="46" r="7" fill="${g}"/><polygon points="34,80 54,48 70,80" fill="${c1}"/><polygon points="52,80 74,56 90,80" fill="#fff" opacity=".85"/>`;
 else if(m==2)mo=[0,1,2].map(i=>`<path d="M32,${54+i*9} q7,-7 14,0 t14,0 t14,0 t14,0" fill="none" stroke="#fff" stroke-width="3"/>`).join('')+`<circle cx="60" cy="42" r="6" fill="${g}"/>`;
 else if(m==3)mo=`<polygon points="${Array.from({length:10},(_,i)=>{const a=-Math.PI/2+i*Math.PI/5,q=i%2?9:24;return (60+q*Math.cos(a)).toFixed(1)+','+(60+q*Math.sin(a)).toFixed(1)}).join(' ')}" fill="${g}"/>`;
 else mo=`<rect x="57" y="62" width="6" height="18" fill="#6b4a2b"/><circle cx="60" cy="52" r="15" fill="${c1}"/><circle cx="50" cy="58" r="9" fill="${c1}"/><circle cx="70" cy="58" r="9" fill="${c1}"/>`;
 const t=esc(String(name).toUpperCase());
 return `<svg viewBox="0 0 120 120" width="${size}" height="${size}" role="img" aria-label="Seal of ${esc(name)}"><defs><path id="${id}" d="M16,60 A44,44 0 0 1 104,60"/></defs><circle cx="60" cy="60" r="58" fill="${g}"/><circle cx="60" cy="60" r="55" fill="#fff"/><circle cx="60" cy="60" r="53" fill="${c1}"/><text font-size="${t.length>14?7:9}" font-weight="700" fill="#fff" letter-spacing=".5" font-family="sans-serif"><textPath href="#${id}" startOffset="50%" text-anchor="middle">${t}</textPath></text><circle cx="60" cy="60" r="33" fill="${c2}" stroke="#fff" stroke-width="2"/>${mo}</svg>`}
function flag(sd,w=140){const r=prng(sd),h=Math.floor(r()*360),a=`hsl(${h} 62% 36%)`,b=`hsl(${(h+170)%360} 65% 42%)`,c='#F7F4EA',g='#E3A008',p=Math.floor(r()*4),H2=w/2;let bg='';
 if(p==0)bg=`<rect width="${w}" height="${H2/2}" fill="${a}"/><rect y="${H2/2}" width="${w}" height="${H2/2}" fill="${b}"/>`;
 else if(p==1)bg=[a,c,b].map((x,i)=>`<rect y="${i*H2/3}" width="${w}" height="${H2/3+.5}" fill="${x}"/>`).join('');
 else if(p==2)bg=`<rect width="${w}" height="${H2/2}" fill="${a}"/><rect y="${H2/2}" width="${w}" height="${H2/2}" fill="${b}"/><polygon points="0,0 ${w*.4},${H2/2} 0,${H2}" fill="${c}"/>`;
 else bg=[a,c,b].map((x,i)=>`<rect x="${i*w/3}" width="${w/3+.5}" height="${H2}" fill="${x}"/>`).join('');
 const cx=p==2?w*.12:w/2,cy=H2/2,k=H2*.2,sun=`<circle cx="${cx}" cy="${cy}" r="${k*.55}" fill="${g}"/>`+Array.from({length:8},(_,i)=>{const t=i*Math.PI/4;return `<line x1="${cx+k*.7*Math.cos(t)}" y1="${cy+k*.7*Math.sin(t)}" x2="${cx+k*Math.cos(t)}" y2="${cy+k*Math.sin(t)}" stroke="${g}" stroke-width="${k*.14}"/>`}).join('');
 return `<svg viewBox="0 0 ${w} ${H2}" width="${w}" height="${H2}" role="img" aria-label="National flag">${bg}${sun}<rect width="${w}" height="${H2}" fill="none" stroke="#0003"/></svg>`}
