const dbp=()=>new Promise((res,rej)=>{const r=indexedDB.open('phsim',1);r.onupgradeneeded=()=>r.result.createObjectStore('s');r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)});
const tx=(m,f)=>dbp().then(d=>new Promise((res,rej)=>{const t=d.transaction('s',m),q=f(t.objectStore('s'));t.oncomplete=()=>res(q&&q.result);t.onerror=()=>rej(t.error)}));
const ser=o=>JSON.stringify(o,(k,v)=>ArrayBuffer.isView(v)?{__ta:v.constructor.name,d:Array.from(v)}:v);
const des=s=>JSON.parse(s,(k,v)=>v&&v.__ta?new self[v.__ta](v.d):v);
const saveSlot=n=>Promise.all([tx('readwrite',s=>s.put(ser(S),'d:'+n)),tx('readwrite',s=>s.put({n,d:dstr()},'m:'+n))]);
const loadSlot=n=>tx('readonly',s=>s.get('d:'+n)).then(x=>des(x));
const listSlots=()=>tx('readonly',s=>s.getAll(IDBKeyRange.bound('m:','m:\uffff')));
const delSlot=n=>Promise.all([tx('readwrite',s=>s.delete('d:'+n)),tx('readwrite',s=>s.delete('m:'+n))]);
const autosave=()=>{if(S)saveSlot('autosave').catch(()=>{})};
function download(name,text){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type:'application/json'}));a.download=name;a.click()}
function imgToLand(file,thr,light){return new Promise(res=>{const im=new Image();im.onload=()=>{const c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');x.drawImage(im,0,0,W,H);
 const d=x.getImageData(0,0,W,H).data,land=new Uint8Array(W*H);for(let i=0;i<W*H;i++){const l=.3*d[i*4]+.59*d[i*4+1]+.11*d[i*4+2];if(d[i*4+3]>40&&(light?l>thr:l<thr))land[i]=1+Math.min(2,Math.floor((i/W|0)/(H/3)))}res(land)};im.src=URL.createObjectURL(file)})}
