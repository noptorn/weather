const fs = require('fs');

const [source, destination] = process.argv.slice(2);
if (!source || !destination) throw new Error('Usage: node extract_mhtml_text.js source.mhtml destination.txt');

const raw = fs.readFileSync(source, 'latin1');
const boundaryMatch = raw.match(/boundary="([^"]+)"/i);
if (!boundaryMatch) throw new Error('MIME boundary not found');
const boundary = boundaryMatch[1];
const parts = raw.split(`--${boundary}`);
const htmlPart = parts.find((part) => /Content-Type:\s*text\/html/i.test(part));
if (!htmlPart) throw new Error('text/html MIME part not found');
const splitAt = htmlPart.search(/\r?\n\r?\n/);
let body = htmlPart.slice(splitAt).replace(/^\r?\n\r?\n/, '');
body = body.replace(/=\r?\n/g, '').replace(/=([0-9A-F]{2})/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
let html = Buffer.from(body, 'latin1').toString('utf8');
html = html
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
  .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, ' ')
  .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, ' ')
  .replace(/<(?:br|\/p|\/div|\/li|\/tr|\/td|\/th|\/h[1-6]|\/section|\/article|\/table)\b[^>]*>/gi, '\n')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;|&#160;/gi, ' ')
  .replace(/&amp;/gi, '&')
  .replace(/&lt;/gi, '<')
  .replace(/&gt;/gi, '>')
  .replace(/&quot;/gi, '"')
  .replace(/&#39;|&apos;/gi, "'")
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
  .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));
const lines = [];
for (const rawLine of html.split(/\r?\n/)) {
  const line = rawLine.replace(/\s+/g, ' ').trim();
  if (line && line !== lines.at(-1)) lines.push(line);
}
fs.writeFileSync(destination, `${lines.join('\n')}\n`, 'utf8');
