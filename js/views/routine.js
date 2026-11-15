// 요일별 루틴과 "오늘만" 커스텀 계획. 항목: {p:부위, e:운동, n:목표 세트 수}
const DAYS=["일","월","화","수","목","금","토"],DORDER=["1","2","3","4","5","6","0"];
let editRt=false,rpPart="가슴";
const getPlan=()=>rk==="c"?(S.plans[today()]||[]):(S.routines[rk]||[]);
function putPlan(l){if(rk==="c")S.plans[today()]=l;else S.routines[rk]=l;save()}
const doneN=e=>S.sets.filter(s=>s.d===today()&&s.e===e).length;
function renderRoutine(){
  const plan=getPlan(),tn=String(new Date().getDay());
  let h='<p class="lbl">루틴</p><div class="chips">'+DORDER.map(k=>`<button class="chip" data-k="${k}" aria-pressed="${rk===k}" style="${k===tn?"text-decoration:underline":""}">${DAYS[k]}</button>`).join("")+`<button class="chip" data-k="c" aria-pressed="${rk==="c"}">커스텀</button></div>`;
  h+=`<p class="mini" style="margin:8px 0 4px">${rk==="c"?"오늘만 쓰는 임시 계획입니다. 요일 루틴은 바뀌지 않습니다.":"선택한 요일의 루틴입니다. 밑줄 친 요일이 오늘입니다."}</p>`;
  const next=plan.findIndex(it=>doneN(it.e)<it.n);
  if(!plan.length)h+='<p class="mini" style="margin:8px 0">아직 루틴이 없습니다. 아래 편집을 눌러 운동을 추가하세요.</p>';
  plan.forEach((it,i)=>{const dn=doneN(it.e);
    h+=`<div class="set"><button class="pl${i===next?" next":""}" data-a="go" data-i="${i}">${esc(it.e)}</button><span class="mini">${dn>=it.n?"✓ ":""}${dn}/${it.n}세트</span>${editRt?`<span><button class="ic" data-a="up" data-i="${i}">↑</button><button class="ic" data-a="dn" data-i="${i}">↓</button><button data-a="rm" data-i="${i}">×</button></span>`:""}</div>`});
  if(editRt)h+=`<div class="row"><select id="rp_p">${PARTS.map(p=>`<option ${p===rpPart?"selected":""}>${p}</option>`).join("")}</select></div><div class="row"><input type="text" id="rp_e" list="rp_dl" placeholder="운동 이름 (고르거나 직접 입력)"><input type="number" id="rp_n" value="${rk==="c"?4:5}" inputmode="numeric" style="width:72px"></div><datalist id="rp_dl"></datalist><button class="ghost" data-a="add" style="margin-top:8px">추가 (오른쪽은 목표 세트 수)</button>`;
  h+=`<button class="ghost" data-a="edit" style="margin-top:10px">${editRt?"편집 끝내기":"루틴 편집"}</button>`;
  $("#rt").innerHTML=h;fillDl();
}
function fillDl(){const p=$("#rp_p");if(!p)return;$("#rp_dl").innerHTML=exList(p.value).map(e=>`<option value="${esc(e)}">`).join("")}
$("#rt").addEventListener("change",ev=>{if(ev.target.id==="rp_p"){rpPart=ev.target.value;fillDl()}});
$("#rt").addEventListener("click",ev=>{const b=ev.target.closest("button");if(!b)return;
  if(b.dataset.k!==undefined){rk=b.dataset.k;renderAll();return}
  const a=b.dataset.a,i=+b.dataset.i,pl=getPlan().slice();
  if(a==="go"){pick(pl[i].p,pl[i].e);return}
  if(a==="edit")editRt=!editRt;
  else if(a==="up"&&i>0){[pl[i-1],pl[i]]=[pl[i],pl[i-1]];putPlan(pl)}
  else if(a==="dn"&&i<pl.length-1){[pl[i+1],pl[i]]=[pl[i],pl[i+1]];putPlan(pl)}
  else if(a==="rm"){pl.splice(i,1);putPlan(pl)}
  else if(a==="add"){const name=$("#rp_e").value.trim(),p=$("#rp_p").value,n=Math.max(1,parseInt($("#rp_n").value)||4);if(!name)return;
    if(!exList(p).includes(name)){S.hidden=S.hidden.filter(h=>h!==name);if(!BASE[p].includes(name))S.custom.push({p,e:name})}
    pl.push({p,e:name,n});putPlan(pl);rpPart=p}
  renderAll()});
