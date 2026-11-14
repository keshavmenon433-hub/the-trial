// Simulates students of different strengths to sanity-check the model and the Trial Score.
import * as E from '../js/engine.js';
function rng(seed){ let s=seed; return ()=>{ s=(s*1664525+1013904223)%4294967296; return s/4294967296; }; }
function simulate(label, trueSkill, learnRate, seed=1, days=21){
  const r = rng(seed); const st = E.newState({startDate:'2026-11-16', name:'Sim'});
  const course = {sessions: Array.from({length:365},(_,i)=>({id:'s'+i,type:(i%7===6)?'trial':'lesson',title:'S'+i,skills:['k'+i]}))};
  const truth = {};
  for (let day=0; day<days; day++){
    const now = new Date(Date.UTC(2026,10,16+day,18));
    const sess = course.sessions[st.progress.idx];
    let items=0, correct=0;
    const sk = sess.skills[0]; truth[sk] = truth[sk] ?? (trueSkill - 1.0);
    // warmup on review queue
    for (const k of E.reviewQueue(st, now, {limit:6})) { const d=3; const p=E.sigmoid(truth[k]-E.B_BY_D[d] - 0.15*E.daysBetween(st.skills[k].lastRev, E.dateStr(now))/ (st.skills[k].S||1)); const c=r()<p; E.recordAttempt(st,{skill:k,d,correct:c,timeSec:100,context:'warmup'},now); items++; correct+=c; truth[k]+=c?0.05:0.15; }
    // practice today's skill
    for (let i=0;i<16;i++){ const cand=[1,2,3,4,5].map(d=>({id:sk+'-'+d+'-'+i,skill:sk,d,gen:true})); const it=E.pickItem(st,cand,{rng:r,today:E.dateStr(now)}); const p=E.sigmoid(truth[sk]-E.B_BY_D[it.d]); const c=r()<p; E.recordAttempt(st,{skill:sk,d:it.d,correct:c,hints:c?0:(r()<.5?1:0),timeSec:90,context:'practice',confidence:c?0.8:0.5},now); truth[sk]+=learnRate; items++; correct+=c; }
    let ex=0; for(let i=0;i<5;i++){ const p=E.sigmoid(truth[sk]-E.B_BY_D[3]); const c=r()<p; ex+=c; E.recordAttempt(st,{skill:sk,d:3,correct:c,timeSec:100,context:'exit'},now); items++; correct+=c; }
    const v=E.skillView(st,sk,now);
    E.completeSession(st, course, {session:sess, mode:'normal', exitPct:ex*20, weakSkills: v.M<0.6?[sk]:[], minutes:118, items, correct, trialPct:80}, {}, now);
  }
  const now = new Date(Date.UTC(2026,10,16+days,18));
  const ts=E.trialScore(st,{},now); const pc=E.pace(st,course,now);
  console.log(label.padEnd(28), 'Trial Score', ts.score, E.band(ts.score).label.padEnd(11), 'M',ts.parts.mastery.toFixed(2),'R',ts.parts.retention.toFixed(2),'F',ts.parts.fluency.toFixed(2), '| idx',pc.idx,'lag',pc.lag, '| alerts', st.outbox.filter(a=>a.kind!=='day_complete').map(a=>a.kind).join(','));
}
simulate('strong, fast learner', 3.0, 0.12);
simulate('solid learner', 2.0, 0.10);
simulate('average learner', 1.0, 0.08);
simulate('struggling learner', 0.0, 0.05);
