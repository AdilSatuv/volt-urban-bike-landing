import {readFileSync,readdirSync,statSync,writeFileSync} from 'node:fs';import {join} from 'node:path';import {gzipSync} from 'node:zlib';
const config=JSON.parse(readFileSync('scripts/resource-budgets.json'));
const html=readFileSync('out/index.html','utf8');
const scripts=[...new Set([...html.matchAll(/<script[^>]*src="([^"]+\.js)"/g)].map(m=>m[1]))];
const walk=dir=>readdirSync(dir).flatMap(name=>{const p=join(dir,name);return statSync(p).isDirectory()?walk(p):[p]});
const raster=walk('public').filter(p=>/\.(avif|webp|png|jpe?g)$/i.test(p));
const actual={initialJsGzip:scripts.reduce((sum,url)=>sum+gzipSync(readFileSync(join('out',url.replace(/^\//,'')))).length,0),homeHtmlGzip:gzipSync(html).length,largestRaster:Math.max(0,...raster.map(p=>statSync(p).size)),totalRaster:raster.reduce((sum,p)=>sum+statSync(p).size,0)};
let failed=false;let md='# Resource budgets\n\nCompressed external scripts referenced by home HTML, gzip HTML, and source raster assets. Lazy chunks and video are not counted as initial JS. Lighthouse measures the full request trace separately.\n\n| Resource | Actual bytes | Limit bytes |\n|---|---:|---:|\n';
for(const [key,value]of Object.entries(actual)){console.log(`${key}: ${value} / ${config[key]}`);if(value>config[key])failed=true;md+=`| ${key} | ${value} | ${config[key]} |\n`}
if(process.env.GITHUB_STEP_SUMMARY)writeFileSync(process.env.GITHUB_STEP_SUMMARY,md,{flag:'a'});if(failed)throw Error('Resource budget exceeded; optimize the change or explicitly review a new budget.');
