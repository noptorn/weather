#!/usr/bin/env node
'use strict';
// Generic, source-locked weather Content Pack HTML builder.
// Usage: node build_content_pack_generic.js verified_content.json content_pack.html
// Does NOT fetch weather, choose dates, or embed historical forecasts.
const fs=require('fs'),path=require('path');
const [input,output='content_pack.html']=process.argv.slice(2);
if(!input) { console.error('Usage: node build_content_pack_generic.js verified_content.json [content_pack.html]'); process.exit(2); }
const data=JSON.parse(fs.readFileSync(input,'utf8'));
function fail(s){throw Error(s);}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
if(!data || !Array.isArray(data.sections) || !data.sections.length) fail('Input requires nonempty sections[]');
if(!data.title || !data.target_date) fail('title and target_date are required');
if(!Array.isArray(data.sources) || !data.sources.length) fail('sources[] evidence is required; do not invent weather data');
const ids=new Set(), kinds=new Set(['none','weather','imageWeather']);
for(const section of data.sections){
  if(!section.id || !/^[a-zA-Z][\w-]*$/.test(section.id) || ids.has(section.id)) fail('Invalid or duplicate section.id: '+section.id);
  ids.add(section.id);
  if(!section.title || typeof section.content!=='string' || !section.content.trim()) fail('Missing title/content in '+section.id);
  if(!kinds.has(section.kind||'none')) fail('Invalid copy kind in '+section.id);
}
const imgPrefix='Reference source (IMAGE ASSETS CHATGPT → GITHUB FALLBACK): First verify actual readable ImageCTRHot.png, ThaiMap-Region.jpg, ThaiMap-Province.jpg and the applicable original SanhaTham_Logo_Transparent.png (cover) or SanhaTham_Logo_Watermark.png (summary) in ChatGPT Project/current chat; independently fallback for missing files to connected GitHub noptorn/weather main ImageSource/<exact filename> (https://raw.githubusercontent.com/noptorn/weather/main/ImageSource/<exact filename>). A URL or file listing is not proof of image ingestion. Style reference is not weather data; maps are compare-only geographic QA. Omit unavailable optional logo without drawing a substitute; missing required references block Final image QA. CTR_PRIORITY=HIGH_TRUTH_LOCKED.';
const sources=data.sources.map(s=>'<tr><td>'+esc(s.file||'')+'</td><td>'+esc(s.type||'')+'</td><td>'+esc(s.issue||'')+'</td><td>'+esc(s.status||'NOT_VERIFIED')+'</td><td>'+esc(s.notes||'')+'</td></tr>').join('');
const sections=data.sections.map(s=>'<section id="'+esc(s.id)+'"><div class="section-head"><h2>'+esc(s.title)+'</h2><button type="button" class="copy-btn" data-copy-target="text-'+esc(s.id)+'" data-copy-kind="'+esc(s.kind||'none')+'">คัดลอก</button></div><pre id="text-'+esc(s.id)+'">'+esc(s.content)+'</pre></section>').join('\n');
const nav=data.sections.map(s=>'<a href="#'+esc(s.id)+'">'+esc(s.title)+'</a>').join('\n');
const qa=esc(data.qa_status||'NEEDS_REVIEW');
const html='<!doctype html>\n<html lang="th"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>'+esc(data.title)+'</title><style>'+
'body{margin:0;background:#f3f6fa;color:#17243b;font-family:system-ui,"Noto Sans Thai",sans-serif}aside{position:fixed;top:0;bottom:0;left:0;width:240px;overflow:auto;background:#13213b;padding:20px;box-sizing:border-box}aside a{display:block;color:#f2f8ff;text-decoration:none;padding:8px;border-radius:7px}aside a:hover{background:#304d78}main{margin-left:260px;padding:24px;max-width:1100px}section{background:white;border:1px solid #dfe7f0;border-radius:12px;padding:18px;margin:18px 0}pre{white-space:pre-wrap;overflow-wrap:anywhere;font:14px/1.7 ui-monospace,monospace;background:#f8fafc;padding:15px;border-radius:8px}table{border-collapse:collapse;width:100%}td,th{border:1px solid #dce4f0;padding:8px;text-align:left}.section-head{display:flex;justify-content:space-between;align-items:center;gap:16px}button{padding:8px 12px;cursor:pointer;border:0;border-radius:7px;background:#2056a1;color:white}@media(max-width:750px){aside{position:static;width:auto;max-height:230px}main{margin:0;padding:12px}}'+
'</style></head><body><aside><strong style="color:white">Content Pack</strong>'+nav+'</aside><main><h1>'+esc(data.title)+'</h1><p>Forecast target: '+esc(data.target_date)+' | QA: '+qa+'</p><section><h2>Source Evidence</h2><div style="overflow:auto"><table><thead><tr><th>File</th><th>Type</th><th>Issue</th><th>Status</th><th>Notes</th></tr></thead><tbody>'+sources+'</tbody></table></div></section>'+sections+'</main><script>\n'+
"(function(){\n\"use strict\";\nconst IMG=\"Reference source (IMAGE ASSETS CHATGPT → GITHUB FALLBACK): Check and actually read ImageCTRHot.png, ThaiMap-Region.jpg, ThaiMap-Province.jpg and the applicable original SanhaTham_Logo_Transparent.png (cover) or SanhaTham_Logo_Watermark.png (summary) in ChatGPT Project/current chat; independently fallback for missing files to connected GitHub noptorn/weather main ImageSource/<exact filename> (https://raw.githubusercontent.com/noptorn/weather/main/ImageSource/<exact filename>). Image references are not weather data; maps are compare-only QA. Omit optional missing logo and never recreate it. Missing required reference blocks final image QA. CTR_PRIORITY=HIGH_TRUTH_LOCKED.\";\nfunction legacyCopy(value){\n const ta=document.createElement(\"textarea\");\n ta.value=value;ta.readOnly=true;\n ta.style.cssText=\"position:fixed;left:0;top:0;width:2px;height:2px;opacity:0\";\n document.body.appendChild(ta);ta.focus();ta.select();ta.setSelectionRange(0,ta.value.length);\n let ok=false;try{ok=document.execCommand(\"copy\")}catch(_){}\n ta.remove();return ok;\n}\ndocument.addEventListener(\"click\",async function(e){\n const b=e.target.closest(\"button[data-copy-target]\");if(!b)return;\n const el=document.getElementById(b.dataset.copyTarget);if(!el)return;\n let s=el.textContent.replace(/\\r\\n?/g,\"\\n\");\n if(b.dataset.copyKind===\"imageWeather\"){s=s.replace(/^Reference source[^\\n]*\\n?/,\"\");s=IMG+\"\\n\"+s;}\n let ok=false;\n try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(s);ok=true;}}catch(_){}\n if(!ok)ok=legacyCopy(s);\n const old=b.dataset.label||b.textContent;b.dataset.label=old;\n b.textContent=ok?\"คัดลอกแล้ว ✓\":\"เลือกข้อความแล้ว กด Ctrl+C\";\n if(!ok){const sel=window.getSelection(),range=document.createRange();range.selectNodeContents(el);sel.removeAllRanges();sel.addRange(range);}\n setTimeout(()=>{b.textContent=old},2200);\n});\n})();\\n"+
'</script></body></html>\n';
fs.mkdirSync(path.dirname(path.resolve(output)),{recursive:true});
fs.writeFileSync(output,html,'utf8');
console.log('Wrote '+output+'; sections='+data.sections.length+'; QA='+qa);
