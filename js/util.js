// 공통 도구: DOM 선택, 날짜, 표시 형식, 버튼 묶음
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const today=()=>{const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")};
const fmt=(w,r)=>(w?w+"kg×":"맨몸×")+r;
const unit=e=>/계단/.test(e||"")?"층":"km";
const mmss=r=>Math.floor(r/60)+"분"+(r%60?" "+r%60+"초":"");
const fmtS=s=>s.p==="유산소"?(s.w?s.w+unit(s.e)+", ":"")+mmss(s.r):fmt(s.w,s.r);
const stp=()=>part==="유산소"?(unit(ex)==="층"?1:0.1):step;
function chips(el,items,cur,fn){el.innerHTML="";items.forEach(it=>{const b=document.createElement("button");b.className="chip";b.textContent=it.label;b.setAttribute("aria-pressed",String(it.v===cur));b.onclick=()=>fn(it.v);el.appendChild(b)})}
const nudge=(id,d,min)=>{const el=$(id);el.value=Math.max(min,Math.round((parseFloat(el.value||0)+d)*100)/100);el.dispatchEvent(new Event("input",{bubbles:true}))};
function dl(text,name,type){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([text],{type}));a.download=name;document.body.appendChild(a);a.click();a.remove()}
// 시간 계산: 날짜별 시작/마감 버튼(S.days)과 세트 기록 시각(t)을 사용합니다.
// 가져오기로 넣은 기록(1분 간격의 가짜 시각)은 계산에서 제외합니다.
const hm=t=>{const d=new Date(t);return String(d.getHours()).padStart(2,"0")+":"+String(d.getMinutes()).padStart(2,"0")};
const mins=ms=>{const m=Math.round(ms/60000);return m<1?"1분 미만":m+"분"};
const fake=ss=>ss.length>1&&ss.every((s,i)=>i===0||s.t-ss[i-1].t===60000);
const daySets=d=>S.sets.filter(s=>s.d===d).sort((a,b)=>a.t-b.t);
// 하루 운동 시간: 시작 버튼 없으면 첫 세트 시각, 마감 버튼 없으면 마지막 세트 시각을 대신 사용
function dayRange(d){const ss=daySets(d),D=S.days[d]||{};if(fake(ss)&&!D.start)return null;
  const from=D.start||(ss.length?ss[0].t:0),to=D.end||(ss.length?ss[ss.length-1].t:0);
  return(from&&to&&to>from)?{from,to,ms:to-from}:null}
// 운동별 소요 시간: 이전 운동의 마지막 세트(첫 운동은 시작 시각)부터 이 운동의 마지막 세트까지
function dayEx(d){const ss=daySets(d);if(!ss.length||fake(ss))return{};const D=S.days[d]||{},m={};
  ss.forEach(s=>{const o=m[s.e]||(m[s.e]={first:s.t,last:s.t,n:0});o.last=s.t;o.n++});
  const list=Object.entries(m).sort((a,b)=>a[1].last-b[1].last),out={};
  list.forEach(([e,o],i)=>{const from=i===0?(D.start||null):list[i-1][1].last;
    if(from!==null)out[e]=o.last-from;else if(o.n>1)out[e]=(o.last-o.first)*o.n/(o.n-1)});
  return out}
function exDurations(e){const days=[...new Set(S.sets.filter(s=>s.e===e).map(s=>s.d))].sort();
  return days.map(d=>[d,dayEx(d)[e]]).filter(x=>x[1]>0)}
