import fs from 'node:fs';
const rows = ['| Page | Performance | LCP | CLS | TBT |', '|---|---:|---:|---:|---:|'];
for (const file of fs.readdirSync('performance').filter(file => file.endsWith('.json'))) {
 const report = JSON.parse(fs.readFileSync('performance/' + file));
 if (report.runtimeError) throw new Error(report.runtimeError.message);
 const audits = report.audits;
 rows.push('| ' + file + ' | ' + Math.round(report.categories.performance.score * 100) + ' | ' + audits['largest-contentful-paint'].displayValue + ' | ' + audits['cumulative-layout-shift'].displayValue + ' | ' + audits['total-blocking-time'].displayValue + ' |');
}
const summary = '## Mobile Lighthouse — production export\n\n' + rows.join('\n') + '\n\nLab run on GitHub Actions with gzip for text assets; not field Core Web Vitals. INP needs real interaction data.\n';
fs.writeFileSync('performance/SUMMARY.md', summary);
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
console.log(summary);
