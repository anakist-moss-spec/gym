// 내역 화면: 날짜별 기록, CSV 내보내기, 백업과 복원
function renderHist(){
  const ds=[...new Set(S.sets.map(s=>s.d))].sort().reverse();
  $("#days").innerHTML=ds.length?ds.map(d=>{const day=S.sets.filter(s=>s.d===d),ex=[...new Set(day.map(s=>s.e))];
    return `<div class="card day"><h3>${d}  (${day.length}세트)</h3>`+ex.map(e=>{const ss=day.filter(s=>s.e===e);return `<p><b>${esc(e)}</b> ${ss.map(s=>fmtS(s)).join(", ")}  (${ss[0].p==="유산소"?"합계 "+mmss(ss.reduce((a,s)=>a+s.r,0)):"합계 "+ss.reduce((a,s)=>a+s.r,0)+"회"})</p>`}).join("")+"</div>"}).join(""):'<p class="mini">아직 기록이 없습니다.</p>';
}
$("#csv").onclick=async()=>{
  const rows=[["날짜","부위","운동","무게(kg) 또는 거리","횟수 또는 초(유산소)"],...S.sets.map(s=>[s.d,s.p,s.e,s.w,s.r])];
  const text="\ufeff"+rows.map(r=>r.map(c=>'"'+String(c).replace(/"/g,'""')+'"').join(",")).join("\n");
  dl(text,"운동일지.csv","text/csv");$("#csvmsg").textContent="CSV 파일을 저장했습니다.";
};
$("#bk").onclick=()=>{dl(JSON.stringify(S),"운동일지-백업-"+today()+".json","application/json");$("#csvmsg").textContent="백업 파일을 저장했습니다. 폰을 바꾸거나 브라우저 데이터를 지우기 전에 꼭 저장해 두세요."};
$("#rsb").onclick=()=>$("#rs").click();
$("#rs").onchange=async e=>{const f=e.target.files[0];if(!f)return;try{const j=JSON.parse(await f.text());const have=new Set(S.sets.map(s=>s.t));let n=0;(j.sets||[]).forEach(s=>{if(!have.has(s.t)){S.sets.push(s);have.add(s.t);n++}});(j.custom||[]).forEach(c=>{if(!S.custom.some(k=>k.p===c.p&&k.e===c.e))S.custom.push(c)});S.sets.sort((a,b)=>a.t-b.t);save();renderAll();$("#csvmsg").textContent=n+"세트를 불러왔습니다."}catch(err){$("#csvmsg").textContent="불러오지 못했습니다. 백업 파일이 맞는지 확인하세요."}e.target.value=""};
