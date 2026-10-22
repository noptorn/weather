const fs = require('fs');

const file = process.argv[2];
if (!file) throw new Error('Provide content_pack.html');
const html = fs.readFileSync(file, 'utf8');
const decode = (s) => s.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,'&');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
const targets = [...html.matchAll(/<button\b[^>]*\btype="button"[^>]*\bdata-copy-target="([^"]+)"[^>]*\bdata-copy-kind="([^"]+)"[^>]*>/g)].map(m => ({id:m[1],kind:m[2]}));
const missing = targets.filter(t => !ids.includes(t.id));
const dupIds = ids.filter((id,i) => ids.indexOf(id) !== i);
const imageTargets = targets.filter(t => t.kind === 'imageWeather');
const imageBlocks = [...html.matchAll(/<pre id="prompt-(img(?:0[4-9]|1\d|2[015678]))"[^>]*>([\s\S]*?)<\/pre>/g)];
const logoErrors = imageBlocks.filter(m => {
  const text = decode(m[2]);
  const logos = (text.match(/SanhaTham_Logo_(?:Transparent|Watermark)\.png/g) || []);
  return logos.length !== 1;
}).map(m => m[1]);
const textLen = {};
for (const id of ['long-voice','two-day-voice','short-yt','short-fb']) {
  const match = html.match(new RegExp(`<pre id="${id}"[^>]*>([\\s\\S]*?)<\\/pre>`));
  textLen[id] = match ? decode(match[1]).length : null;
}
const sourceLines = [...html.matchAll(/แหล่งข้อมูล: กรมอุตุนิยมวิทยา/g)].length;
const result = {
  doctype: html.startsWith('<!doctype html>'),
  langTh: html.includes('<html lang="th">'),
  responsive: html.includes('name="viewport"'),
  externalDependencyCount: [...html.matchAll(/<script\s+src|<link\s|https?:\/\//g)].length,
  buttonCount: targets.length,
  missingTargets: missing,
  duplicateIds: [...new Set(dupIds)],
  imageWeatherButtonCount: imageTargets.length,
  imagePromptCount: imageBlocks.length,
  imagePromptLogoErrors: logoErrors,
  publishDescriptionSourceLineCount: sourceLines,
  copyBrowserStatus: html.includes('COPY_BROWSER_TEST = NOT_TESTED') ? 'NOT_TESTED' : 'UNKNOWN',
  voiceCharacterCounts: textLen,
};
console.log(JSON.stringify(result, null, 2));
if (!result.doctype || !result.langTh || !result.responsive || result.externalDependencyCount || missing.length || dupIds.length || imageTargets.length !== 22 || imageBlocks.length !== 22 || logoErrors.length || sourceLines !== 4) process.exitCode = 1;
