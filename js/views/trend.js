// 추이 화면: 그래프와 주별 횟수
function renderTrend(){
  const names=[...new Set(S.sets.map(s=>s.e))];const sel=$("#cx");const cur=sel.value;
  sel.innerHTML=names.map(n=>`<option ${n===cur?"selected":""}>${esc(n)}</option>`).join("");
  const e0=sel.value||names[0],cdo=!!e0&&S.sets.some(s=>s.e===e0&&s.p==="유산소");chips($("#mets"),cdo?[{v:"r",label:"총 시간(분)"},{v:"v",label:"총 거리"},{v:"m",label:"분/거리 (낮을수록 빠름)"}]:[{v:"r",label:"총 반복수"},{v:"v",label:"볼륨(kg×횟수)"},{v:"m",label:"최고 무게"}],metric,v=>{metric=v;renderTrend()});
  chips($("#pers"),[{v:28,label:"4주"},{v:56,label:"8주"},{v:0,label:"전체"}],per,v=>{per=v;renderTrend()});
  if(!names.length){$("#chart").innerHTML='<p class="mini">기록이 쌓이면 여기에 그래프가 나옵니다.</p>';$("#cvals").textContent="";return}
  const e=sel.value||names[0];const by={};const pd=d=>d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");const cut=per?pd(new Date(Date.now()-per*864e5)):"";const wkOf=s=>{const d=new Date(s+"T00:00:00");d.setDate(d.getDate()-(d.getDay()+6)%7);return pd(d)};const wk={};S.sets.filter(s=>s.e===e).forEach(s=>{const k=wkOf(s.d);(wk[k]=wk[k]||{d:new Set(),n:0}).d.add(s.d);wk[k].n++});const thisWk=wkOf(today());const du=exDurations(e),durHtml=du.length?'<p class="lbl">소요 시간 (첫 세트~마지막 세트 기준)</p><div class="set"><span>평균</span><b>'+mins(du.reduce((a,x)=>a+x[1],0)/du.length)+" ("+du.length+"회)</b></div>"+du.slice(-5).reverse().map(x=>`<div class="set"><span>${x[0].slice(5)}</span><b>${mins(x[1])}</b></div>`).join(""):"";$("#wk").innerHTML=durHtml+'<p class="lbl" style="margin-top:14px">주별 횟수 ('+esc(e)+', 월요일 시작)</p>'+Object.keys(wk).sort().reverse().slice(0,8).map(k=>`<div class="set"><span>${k===thisWk?"이번 주":k.slice(5)+" 주"}</span><b>${wk[k].d.size}일, ${wk[k].n}세트</b></div>`).join("");
  const cdo2=S.sets.some(s=>s.e===e&&s.p==="유산소");if(cdo2){const A={};S.sets.filter(s=>s.e===e&&s.d>=cut).forEach(s=>{const a=A[s.d]||(A[s.d]={t:0,k:0});a.t+=s.r;a.k+=s.w});Object.keys(A).forEach(d=>{const a=A[d];by[d]=metric==="r"?Math.round(a.t/6)/10:metric==="v"?Math.round(a.k*10)/10:(a.k?Math.round(a.t/60/a.k*100)/100:0)})}else S.sets.filter(s=>s.e===e&&s.d>=cut).forEach(s=>{by[s.d]=metric==="r"?(by[s.d]||0)+s.r:metric==="v"?(by[s.d]||0)+s.w*s.r:Math.max(by[s.d]||0,s.w)});
  const ds=Object.keys(by).sort(),vs=ds.map(d=>by[d]);if(!ds.length){$("#chart").innerHTML='<p class="mini">이 기간에는 기록이 없습니다.</p>';$("#cvals").textContent="";return}
  const W=320,H=190,L=34,R=12,T=16,B=26,mx=Math.max(...vs,1),mn=0;
  const X=i=>ds.length===1?(L+W-R)/2:L+i*(W-L-R)/(ds.length-1),Y=v=>T+(H-T-B)*(1-(v-mn)/(mx-mn||1));
  let g=`<line x1="${L}" y1="${H-B}" x2="${W-R}" y2="${H-B}" stroke="var(--line)"/><line x1="${L}" y1="${T}" x2="${L}" y2="${H-B}" stroke="var(--line)"/>`;
  g+=`<text x="${L-4}" y="${T+4}" text-anchor="end" font-size="10" fill="var(--mute)">${Math.round(mx*10)/10}</text><text x="${L-4}" y="${H-B+4}" text-anchor="end" font-size="10" fill="var(--mute)">0</text>`;
  g+=`<polyline fill="none" stroke="var(--acc)" stroke-width="2.5" stroke-linejoin="round" points="${vs.map((v,i)=>X(i)+","+Y(v)).join(" ")}"/>`;
  vs.forEach((v,i)=>{g+=`<circle cx="${X(i)}" cy="${Y(v)}" r="3.5" fill="var(--acc)"/>`;if(ds.length<=10)g+=`<text x="${X(i)}" y="${Y(v)-8}" text-anchor="middle" font-size="10" fill="var(--ink)">${Math.round(v*10)/10}</text>`});
  g+=`<text x="${X(0)}" y="${H-8}" text-anchor="${ds.length===1?"middle":"start"}" font-size="10" fill="var(--mute)">${ds[0].slice(5)}</text>`;
  if(ds.length>1)g+=`<text x="${X(ds.length-1)}" y="${H-8}" text-anchor="end" font-size="10" fill="var(--mute)">${ds[ds.length-1].slice(5)}</text>`;
  $("#chart").innerHTML=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(e)} 추이">${g}</svg>`;
  $("#cvals").textContent=ds.length<2?"기록이 하루뿐이라 점 하나만 보입니다. 다음 운동 뒤에 선이 이어집니다.":ds.slice(-6).map(d=>d.slice(5)+" "+Math.round(by[d]*10)/10).join(",  ");
}
$("#cx").onchange=renderTrend;
