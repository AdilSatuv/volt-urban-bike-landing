import { spawn, execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { tmpdir } from 'node:os';
const baseline=JSON.parse(readFileSync('scripts/performance-baseline.json')).commit;
const current=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
const target=resolve(tmpdir(),`landing-baseline-${process.pid}`);
const run=(cmd,args,options={})=>execFileSync(cmd,args,{stdio:'inherit',...options});
mkdirSync('performance-comparison',{recursive:true});
run('git',['worktree','add','--detach',target,baseline]);
run('npm',['ci'],{cwd:target});run('npm',['run','build'],{cwd:target});
const server=resolve('scripts/serve-performance.mjs');
const servers=[spawn(process.execPath,[server],{cwd:target,env:{...process.env,PORT:'4176'},stdio:'ignore'}),spawn(process.execPath,[server],{env:{...process.env,PORT:'4177'},stdio:'ignore'})];
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const results=[];
try{
 for(const port of [4176,4177]){let ready=false;for(let i=0;i<30;i++){try{const r=await fetch(`http://127.0.0.1:${port}/`);if(r.ok){ready=true;break}}catch{}await sleep(500)}if(!ready)throw Error('server not ready: '+port)}
 const environment={baseline,current,node:process.version,chrome:execFileSync('google-chrome',['--version'],{encoding:'utf8'}).trim(),lighthouse:'13.5.0',profile:'Lighthouse default mobile simulated throttling, cold browser per run',order:['before','after','after','before','before','after'],server:'same gzip server; localhost ports 4176/4177'};
 writeFileSync('performance-comparison/environment.json',JSON.stringify(environment,null,2));
 const counts={before:0,after:0};
 for(const label of environment.order){const n=++counts[label],port=label==='before'?4176:4177,out=`performance-comparison/${label}-${n}`;
  run('npx',['--yes','lighthouse@13.5.0',`http://127.0.0.1:${port}/`,'--chrome-flags=--headless --no-sandbox','--only-categories=performance','--output=json','--output=html',`--output-path=${out}`,'--quiet']);
  const report=JSON.parse(readFileSync(out+'.report.json'));if(report.runtimeError)throw Error(JSON.stringify(report.runtimeError));
  const a=report.audits;results.push({label,run:n,score:Math.round(report.categories.performance.score*100),lcp:a['largest-contentful-paint'].numericValue,tbt:a['total-blocking-time'].numericValue,cls:a['cumulative-layout-shift'].numericValue,jsTransferBytes:a['network-requests'].details.items.filter(x=>x.resourceType==='Script').reduce((sum,x)=>sum+(x.transferSize||0),0)});
 }
 const median=a=>a.sort((x,y)=>x-y)[1];let md='# Controlled mobile performance comparison\n\nThree runs per version on one runner. AB / BA / AB order. Laboratory results, not field INP.\n\n';
 md+='| Metric | Before median (min–max) | After median (min–max) |\n|---|---:|---:|\n';
 for(const key of ['score','lcp','tbt','cls','jsTransferBytes']){const show=label=>{const a=results.filter(x=>x.label===label).map(x=>x[key]);return `${median([...a]).toFixed(2)} (${Math.min(...a).toFixed(2)}–${Math.max(...a).toFixed(2)})`};md+=`| ${key} | ${show('before')} | ${show('after')} |\n`}
 md+='\nLCP and TBT in ms; JS bytes transferred (including lazy-loaded chunks requested during Lighthouse). Each JSON/HTML report is retained.\n\n```json\n'+JSON.stringify(environment,null,2)+'\n```\n';
 writeFileSync('performance-comparison/results.json',JSON.stringify(results,null,2));writeFileSync('performance-comparison/SUMMARY.md',md);
 if(process.env.GITHUB_STEP_SUMMARY)writeFileSync(process.env.GITHUB_STEP_SUMMARY,md,{flag:'a'});
}finally{for(const child of servers)child.kill()}
