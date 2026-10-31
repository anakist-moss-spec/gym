// 기록 화면: 부위 선택, 운동 선택, 세트 입력, 오늘 한 운동
let touched=false; // 사용자가 입력칸을 직접 바꿨을 때만 true (자동으로 채운 값은 기록으로 치지 않음)
function renderParts(){chips($("#parts"),PARTS.map(p=>({v:p,label:p})),part,p=>{part=p;ex=null;renderAll()})}
function renderEx(){
  $("#exbox").classList.toggle("hide",!part);if(!part){$("#entry").classList.add("hide");return}
  const sel=$("#ex");sel.innerHTML='<option value="">운동 선택</option>'+exList(part).map(e=>`<option ${e===ex?"selected":""}>${esc(e)}</option>`).join("")+'<option value="__new">+ 새 운동 추가</option>';
  $("#entry").classList.toggle("hide",!ex);
}
function fillDefaults(){
  const td=S.sets.filter(s=>s.e===ex&&s.d===today()),lv=last(ex)||[],i=td.length,same=lv[i]||null,prev=td.length?td[td.length-1]:null;
  const w=prev?prev.w:(same?same.w:(lv.length?lv[lv.length-1].w:0)),r=same?same.r:(prev?prev.r:(part==="유산소"?600:10));
  touched=false;$("#w").value=w;$("#r").value=r;if(part==="유산소"){$("#cm").value=Math.floor(r/60);$("#cs").value=r%60}
}
function renderEntry(){
  if(!ex)return;const cd=part==="유산소";$("#rrow").classList.toggle("hide",cd);$("#crow").classList.toggle("hide",!cd);$("#stl").classList.toggle("hide",cd);$("#steps").classList.toggle("hide",cd);$("#wname").textContent=cd?(unit(ex)==="층"?"층수":"거리(km)"):"무게";const l=last(ex);
  renderCompare();
  chips($("#steps"),[1,2.5,5].map(v=>({v,label:String(v)})),step,v=>{step=v;renderEntry()});
  
  const td=S.sets.filter(s=>s.e===ex&&s.d===today());
  $("#todaysets").innerHTML=td.map((s,i)=>`<div class="set"><span>${i+1}세트&nbsp; <b>${fmtS(s)}</b></span><button data-t="${s.t}" aria-label="삭제">×</button></div>`).join("");
  $("#todaysets").querySelectorAll("button").forEach(b=>b.onclick=()=>del(+b.dataset.t));
}
function renderSum(){
  const td=S.sets.filter(s=>s.d===today());if(!td.length){$("#sum").textContent="아직 기록이 없습니다. 부위부터 골라 보세요.";return}
  const by={};td.forEach(s=>by[s.p]=(by[s.p]||0)+1);
  $("#sum").textContent=`${td.length}세트 (`+Object.entries(by).map(([k,v])=>k+" "+v).join(", ")+")";
}
function del(t){const s=S.sets.find(x=>x.t===t);if(!s)return;S.sets=S.sets.filter(x=>x.t!==t);save();renderAll()}
function add(){
  const cd=part==="유산소";const w=Math.max(0,parseFloat($("#w").value)||0),r=cd?(parseInt($("#cm").value)||0)*60+(parseInt($("#cs").value)||0):(parseInt($("#r").value)||0);
  if(r<1){$("#r").focus();return}
  const s={t:Date.now(),d:today(),p:part,e:ex,w,r};S.sets.push(s);if(S.days[s.d]&&S.days[s.d].end&&s.t>S.days[s.d].end)delete S.days[s.d].end;save();fillDefaults();renderAll();
}
function pick(p,e){part=p;ex=e;fillDefaults();renderAll()}
function renderQuick(){const seen=[];S.sets.filter(s=>s.d===today()).forEach(s=>{if(!seen.some(x=>x.e===s.e))seen.push({p:s.p,e:s.e})});
  $("#qk").classList.toggle("hide",!seen.length);const el=$("#qkc");el.innerHTML="";
  seen.forEach(x=>{const b=document.createElement("button");b.className="chip";b.textContent=x.e;b.setAttribute("aria-pressed",String(x.e===ex));b.onclick=()=>pick(x.p,x.e);el.appendChild(b)})}
$("#ex").onchange=e=>{const v=e.target.value;if(v==="__new"){$("#newbox").classList.remove("hide");$("#nx").focus();ex=null;$("#entry").classList.add("hide");return}
  $("#newbox").classList.add("hide");ex=v||null;if(ex)fillDefaults();renderAll()};
$("#nxb").onclick=()=>{const n=$("#nx").value.trim();if(!n)return;if(!S.custom.some(c=>c.p===part&&c.e===n)&&!BASE[part].includes(n)){S.custom.push({p:part,e:n});save();}
  $("#nx").value="";$("#newbox").classList.add("hide");ex=n;fillDefaults();renderAll()};
$("#wm").onclick=()=>nudge("#w",-stp(),0);$("#wp").onclick=()=>nudge("#w",stp(),0);
$("#rm").onclick=()=>nudge("#r",-1,0);$("#rp").onclick=()=>nudge("#r",1,0);
$("#add").onclick=add;

// 세트별 비교표: 지난번 같은 세트와 오늘을 나란히, 합계는 입력 중인 값까지 실시간 반영
function cur(){const cd=part==="유산소";return{w:Math.max(0,parseFloat($("#w").value)||0),r:cd?(parseInt($("#cm").value)||0)*60+(parseInt($("#cs").value)||0):(parseInt($("#r").value)||0)}}
function renderCompare(){
  const box=$("#cmp");if(!ex){box.innerHTML="";return}
  const cd=part==="유산소",lv=last(ex)||[],td=S.sets.filter(s=>s.e===ex&&s.d===today()),c=cur(),n=Math.max(lv.length,td.length+1);
  const val=s=>cd?mmss(s.r):(s.w?s.w+"kg×"+s.r:""+s.r);
  const dif=(a,b)=>{if(!a||!b||cd)return"";if(a.w!==b.w){const d=Math.round((b.w-a.w)*10)/10;return`<span class="${d>0?"up":"dn"}">${d>0?"+":""}${d}kg</span>`}const d=b.r-a.r;return`<span class="${d>0?"up":d<0?"dn":""}">${d>0?"+"+d:d<0?d:"="}</span>`};
  const sum=a=>a.reduce((t,s)=>t+s.r,0),tot=x=>cd?mmss(x):x+"회";
  let h=lv.length?"":'<p class="mini" style="margin:0 0 6px">이 운동은 아직 지난번 기록이 없습니다.</p>';
  const g=lv[td.length];if(g&&!cd)h+=`<p class="goal">${td.length+1}세트 목표: 지난번 ${val(g)} → ${g.r+1}회</p>`;
  h+='<table class="cmp"><tr><th>세트</th><th>지난번'+(lv.length?" ("+lv[0].d.slice(5)+")":"")+'</th><th>오늘</th><th></th></tr>';
  for(let i=0;i<n;i++){const a=lv[i],b=td[i],now=i===td.length;
    const mid=b?val(b):now?(touched?val(c)+" (입력 중)":'<span class="mini">아직 기록 안 함</span>'):"-";
    h+=`<tr class="${now?"now":""}"><td>${i+1}</td><td>${a?val(a):"-"}</td><td>${mid}</td><td>${dif(a,b||(now&&touched?c:null))}</td></tr>`}
  const tt=sum(td),live=tt+(touched?c.r:0),ref=td.length+(touched?1:0),d=live-sum(lv.slice(0,ref));
  h+=`<tr class="tot"><td colspan="4">합계 &nbsp;지난번 ${lv.length?tot(sum(lv)):"-"} &nbsp;/&nbsp; 오늘 기록 <b>${tot(tt)}</b>${touched?` &nbsp;/&nbsp; 입력 중 포함 <b>${tot(live)}</b>`:""}${lv.length&&!cd&&ref>0?` (지난번 같은 세트까지 ${d>=0?"+":""}${d}회)`:""}</td></tr></table>`;
  const du=exDurations(ex),tdur=dayEx(today())[ex],past=du.filter(x=>x[0]<today()).slice(-10);
  if(tdur>0||past.length)h+=`<p class="mini" style="margin:0">이 운동 소요 시간: ${tdur>0?"오늘 "+mins(tdur):"오늘 -"}${past.length?" / 평균 "+mins(past.reduce((a,x)=>a+x[1],0)/past.length)+" ("+past.length+"회 기준)":""}</p>`;
  box.innerHTML=h;
}
["#w","#r","#cm","#cs"].forEach(id=>$(id).addEventListener("input",()=>{touched=true;renderCompare()}));

// 오늘 운동 공유: 휴대폰 공유창, 안 되면 복사
async function shareToday(){
  const td=S.sets.filter(s=>s.d===today());if(!td.length){$("#shrmsg").textContent="오늘 기록이 없습니다.";return}
  const by={};td.forEach(s=>{by[s.p]=by[s.p]||{};(by[s.p][s.e]=by[s.p][s.e]||[]).push(s)});
  let t="🏋️ "+today()+" 운동\n";
  Object.entries(by).forEach(([p,es])=>{t+="\n["+p+"]\n";Object.entries(es).forEach(([e,ss])=>{t+=e+" "+ss.map(x=>fmtS(x)).join(", ")+"\n"})});
  t+="\n총 "+td.length+"세트";
  try{if(navigator.share){await navigator.share({text:t});return}}catch(e){if(e&&e.name==="AbortError")return}
  try{await navigator.clipboard.writeText(t);$("#shrmsg").textContent="복사했습니다. 인스타나 메모에 붙여 넣으세요."}catch(e){$("#shrmsg").textContent="복사할 수 없습니다."}
}
$("#shr").onclick=shareToday;

// 하루 시작/마감 카드
function renderDay(){
  const t=today(),D=S.days[t]||{},ss=daySets(t),el=$("#daycard");let h="";
  const from=D.start||(ss.length&&!fake(ss)?ss[0].t:0);
  if(D.end&&from)h=`<p class="lbl">오늘 운동</p><div class="big">${hm(from)}~${hm(D.end)} <b>${mins(D.end-from)}</b></div><button class="ghost" id="dopen">마감 취소</button>`;
  else if(from)h=`<p class="lbl">${D.start?"운동 중":"운동 중 (시작 버튼 없이 기록됨)"}</p><div class="big">${D.start?"시작":"첫 기록"} ${hm(from)} / 경과 <b>${mins(Date.now()-from)}</b></div><button class="go" id="dend" style="margin-top:0">운동 마감</button>`;
  else h='<button class="go" id="dstart" style="margin-top:0">운동 시작</button>';
  el.innerHTML=h;
  const set=(f)=>{S.days[t]=S.days[t]||{};f(S.days[t]);save();renderAll()};
  if($("#dstart"))$("#dstart").onclick=()=>set(o=>{o.start=Date.now()});
  if($("#dend"))$("#dend").onclick=()=>set(o=>{o.end=Date.now()});
  if($("#dopen"))$("#dopen").onclick=()=>set(o=>{delete o.end});
}
