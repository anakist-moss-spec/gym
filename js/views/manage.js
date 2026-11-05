// 운동 관리: 이름 바꾸기(기록도 같이 이동), 부위 바꾸기, 목록에서 숨기기
let editing=null;
function allEx(){const m={};PARTS.forEach(p=>exList(p).forEach(e=>{m[e]=m[e]||{e,p,n:0}}));
  S.sets.forEach(s=>{const o=m[s.e]||(m[s.e]={e:s.e,p:s.p,n:0});o.n++;o.p=s.p});
  return Object.values(m).sort((a,b)=>PARTS.indexOf(a.p)-PARTS.indexOf(b.p)||a.e.localeCompare(b.e,"ko"))}
function renameEx(old,nw,np){
  if(!nw||!BASE[np])return;
  const wasBase=PARTS.some(p=>BASE[p].includes(old));
  S.sets.forEach(s=>{if(s.e===old){s.e=nw;s.p=np}});
  S.custom=S.custom.filter(c=>c.e!==old&&c.e!==nw);
  const sameBase=nw===old&&BASE[np].includes(old);
  if(wasBase&&!sameBase&&!S.hidden.includes(old))S.hidden.push(old);
  if(BASE[np].includes(nw))S.hidden=S.hidden.filter(h=>h!==nw);else S.custom.push({p:np,e:nw});
  if(ex===old){ex=nw;part=np}
  save();renderAll();
}
function hideEx(e){
  if(PARTS.some(p=>BASE[p].includes(e))){if(!S.hidden.includes(e))S.hidden.push(e)}else S.custom=S.custom.filter(c=>c.e!==e);
  if(ex===e)ex=null;save();renderAll();
}
function renderManage(){
  let h='<div class="card"><p class="mini" style="margin:0">운동 이름이 실제로 하는 운동과 다르면 여기서 바꾸세요. 바꾸면 지금까지의 기록도 새 이름으로 옮겨집니다. 이미 있는 이름으로 바꾸면 기록이 합쳐집니다.</p></div>';
  let cur="";
  allEx().forEach(x=>{
    if(x.p!==cur){if(cur)h+="</div>";cur=x.p;h+=`<div class="card"><p class="lbl">${esc(x.p)}</p>`}
    if(editing===x.e)h+=`<div class="row"><input type="text" id="mn" value="${esc(x.e)}"></div><div class="row"><select id="mp">${PARTS.map(p=>`<option ${p===x.p?"selected":""}>${p}</option>`).join("")}</select></div><div class="row"><button class="ghost" data-a="save" data-e="${esc(x.e)}">저장</button><button class="ghost" data-a="cancel">취소</button><button class="ghost" data-a="hide" data-e="${esc(x.e)}">목록에서 숨기기</button></div>`;
    else h+=`<div class="set"><span>${esc(x.e)} <span class="mini">${x.n?x.n+"세트":""}</span></span><button style="color:var(--acc);font-size:14px" data-a="edit" data-e="${esc(x.e)}">수정</button></div>`;
  });
  if(cur)h+="</div>";
  $("#mg").innerHTML=h;
}
$("#mg").addEventListener("click",ev=>{const b=ev.target.closest("button[data-a]");if(!b)return;const a=b.dataset.a,e=b.dataset.e;
  if(a==="edit")editing=e;else if(a==="cancel")editing=null;
  else if(a==="save"){renameEx(e,$("#mn").value.trim(),$("#mp").value);editing=null}
  else if(a==="hide"){hideEx(e);editing=null}
  renderManage()});
