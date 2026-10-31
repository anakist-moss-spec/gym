// 상태와 저장. 기록 형식(S)을 바꿀 때는 DATA_VERSION을 올리고 migrate()에 변환을 추가하세요.
const LS="workoutlog.v1",SEL="workoutlog.sel",DATA_VERSION=2;
let S={v:DATA_VERSION,sets:[],custom:[]},part=null,ex=null,step=2.5,metric="r",per=0;
function migrate(){if(!S.v)S.v=1;/* if(S.v<3){...변환...;S.v=3} */S.v=DATA_VERSION;S.sets=S.sets||[];S.custom=S.custom||[]}
try{const j=JSON.parse(localStorage.getItem(LS)||"null");if(j&&j.sets){S=j;migrate()}}catch(e){}
const save=()=>{try{localStorage.setItem(LS,JSON.stringify(S))}catch(e){}};
const exList=p=>[...new Set([...(BASE[p]||[]),...S.custom.filter(c=>c.p===p).map(c=>c.e)])];
const last=e=>{const pr=S.sets.filter(s=>s.e===e&&s.d<today());if(!pr.length)return null;const d=pr[pr.length-1].d;return pr.filter(s=>s.d===d)};
function saveSel(){try{localStorage.setItem(SEL,JSON.stringify({d:today(),part,ex}))}catch(e){}}
