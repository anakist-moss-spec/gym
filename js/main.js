// 시작점: 탭 전환, 전체 다시 그리기, 마지막 선택 복원
document.querySelectorAll(".tabs button").forEach(b=>b.onclick=()=>{
  document.querySelectorAll(".tabs button").forEach(x=>x.setAttribute("aria-selected",String(x===b)));
  ["log","trend","hist"].forEach(t=>$("#v-"+t).classList.toggle("hide",t!==b.dataset.t));
  if(b.dataset.t==="trend")renderTrend();if(b.dataset.t==="hist")renderHist()});
function renderAll(){saveSel();$("#today").textContent=today();renderParts();renderEx();renderEntry();renderSum();renderQuick()}
try{const q=JSON.parse(localStorage.getItem(SEL)||"null");if(q&&q.d===today()&&PARTS.includes(q.part)){part=q.part;if(q.ex&&exList(part).includes(q.ex)){ex=q.ex;fillDefaults()}}}catch(e){}
renderAll();
