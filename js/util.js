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
