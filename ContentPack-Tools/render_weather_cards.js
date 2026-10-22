const path = require('path');
const { chromium } = require('playwright-core');

const root = path.resolve(__dirname, '..');
const outDir = path.join(root, '2026.05.29', 'T2');
const chrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

const cards = [
  { id: 'cover16', file: 'cover16x9.png', width: 1920, height: 1080 },
  { id: 'cover9', file: 'cover9x16.png', width: 1080, height: 1920 },
  { id: 'sum16', file: 'sum16x9.png', width: 1920, height: 1080 },
  { id: 'sum9', file: 'sum9x16.png', width: 1080, height: 1920 },
];

function thailandMap(extraClass = '') {
  return `<div class="mapPanel ${extraClass}">
    <svg viewBox="0 0 520 820" aria-hidden="true">
      <defs>
        <filter id="glow"><feGaussianBlur stdDeviation="7" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <linearGradient id="land" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#27ff67"/><stop offset=".45" stop-color="#ffe600"/><stop offset="1" stop-color="#ff2b18"/></linearGradient>
      </defs>
      <path class="mapShape" d="M224 44 C280 46 316 80 318 128 C320 170 291 193 302 233 C315 279 374 303 368 357 C364 397 329 416 332 455 C335 489 374 508 382 552 C389 590 361 612 340 642 C321 669 320 704 302 746 C285 786 246 796 228 761 C210 727 220 687 208 653 C196 616 158 599 156 560 C154 528 184 510 178 472 C172 433 132 419 122 378 C113 342 136 309 128 272 C119 229 73 208 82 164 C91 121 138 115 164 92 C183 75 193 45 224 44 Z" />
      <path class="coast" d="M269 310 C332 346 364 414 356 493 C348 577 304 628 276 702" />
      <path class="coast" d="M170 180 C120 222 121 295 154 354 C183 405 213 443 205 510" />
      <circle class="risk north" cx="220" cy="128" r="54"/>
      <circle class="risk east" cx="342" cy="398" r="62"/>
      <circle class="risk south" cx="282" cy="626" r="82"/>
      <circle class="risk andaman" cx="226" cy="575" r="58"/>
      <path class="radarBand" d="M24 250 C138 180 290 162 454 220"/>
      <path class="radarBand two" d="M10 412 C142 326 318 314 498 390"/>
      <path class="radarBand three" d="M54 586 C174 530 322 532 478 594"/>
      <text x="52" y="94">เหนือ 60%</text>
      <text x="342" y="374">ตอ. 60%</text>
      <text x="265" y="706">ใต้ 70%</text>
    </svg>
  </div>`;
}

const html = `<!doctype html>
<html lang="th">
<head>
<meta charset="utf-8" />
<style>
@font-face { font-family: TahomaLocal; src: url("file:///C:/Windows/Fonts/tahomabd.ttf"); font-weight: 700; }
@font-face { font-family: TahomaLocal; src: url("file:///C:/Windows/Fonts/tahoma.ttf"); font-weight: 400; }
* { box-sizing: border-box; }
body { margin: 0; background: #050608; font-family: TahomaLocal, Tahoma, sans-serif; }
.stage { position: relative; overflow: hidden; color: white; background:
  radial-gradient(circle at 18% 16%, rgba(255,0,0,.58), transparent 28%),
  radial-gradient(circle at 72% 55%, rgba(0,232,255,.30), transparent 31%),
  linear-gradient(140deg, #050505 0%, #10161b 46%, #030303 100%); }
.stage::before { content: ""; position: absolute; inset: -14%; opacity: .44; background:
  repeating-radial-gradient(circle at 55% 52%, transparent 0 62px, rgba(0,229,255,.50) 65px 70px, transparent 74px 132px);
  transform: rotate(-19deg) scale(1.08); }
.stage::after { content: ""; position: absolute; inset: 0; pointer-events: none; background:
  linear-gradient(118deg, transparent 0 38%, rgba(255,255,255,.78) 38.3%, transparent 39.2% 57%, rgba(255,255,255,.45) 57.4%, transparent 58.2%),
  radial-gradient(circle at 30% 72%, rgba(255,55,0,.25), transparent 22%),
  linear-gradient(180deg, rgba(255,255,255,.04), transparent 30%, rgba(0,0,0,.45)); mix-blend-mode: screen; opacity: .48; }
.content { position: relative; z-index: 1; width: 100%; height: 100%; }
.headline { font-weight: 700; line-height: .92; letter-spacing: 0; color: #ffeb00; -webkit-text-stroke: 8px #050505; paint-order: stroke fill; text-shadow: 0 10px 0 #b41610, 0 0 34px rgba(255,0,0,.82); }
.whiteStroke { color: #fff; -webkit-text-stroke: 5px #050505; paint-order: stroke fill; text-shadow: 0 5px 0 rgba(0,0,0,.88), 0 0 20px rgba(255,255,255,.18); }
.redStroke { color: #ff2b1d; -webkit-text-stroke: 6px #050505; paint-order: stroke fill; text-shadow: 0 0 26px rgba(255,0,0,.94); }
.cyan { color:#00e6ff; }
.badge { display: inline-flex; align-items: center; justify-content: center; border: 6px solid #ffe700; background: linear-gradient(180deg, #f11e13, #8f0808); color: #fff; font-weight: 700; box-shadow: 0 0 28px rgba(255,0,0,.70), inset 0 0 32px rgba(0,0,0,.38); -webkit-text-stroke: 2px #050505; paint-order: stroke fill; }
.blueBadge { background: linear-gradient(180deg, #009ce8, #053b76); box-shadow: 0 0 26px rgba(0,229,255,.58), inset 0 0 26px rgba(0,0,0,.35); }
.blackBadge { background: rgba(0,0,0,.72); }
.mapPanel { position:absolute; filter: drop-shadow(0 0 24px rgba(0,229,255,.55)) drop-shadow(0 0 36px rgba(255,0,0,.38)); }
.mapPanel svg { width:100%; height:100%; overflow: visible; }
.mapShape { fill: url(#land); stroke: #fff; stroke-width: 9; filter: url(#glow); }
.coast { fill:none; stroke: rgba(255,255,255,.70); stroke-width: 6; stroke-linecap: round; }
.risk { fill: rgba(255,0,0,.50); stroke:#ffef00; stroke-width:4; filter:url(#glow); }
.risk.andaman { fill: rgba(255,70,0,.60); }
.radarBand { fill:none; stroke: rgba(0,240,255,.76); stroke-width: 16; stroke-linecap: round; filter:url(#glow); }
.radarBand.two { stroke: rgba(255,230,0,.82); }
.radarBand.three { stroke: rgba(255,42,24,.85); }
.mapPanel text { font: 700 42px TahomaLocal, Tahoma; fill:#fff; stroke:#050505; stroke-width:7; paint-order:stroke fill; }
.table { display: grid; gap: 14px; }
.row { display: flex; justify-content: space-between; align-items: center; background: rgba(5,24,34,.90); border: 4px solid #ffe14d; color: white; font-weight: 700; box-shadow: 0 0 18px rgba(0,229,255,.22); }
.row.hot { background: linear-gradient(90deg, rgba(178,8,8,.96), rgba(60,15,8,.9)); border-color: #ffec00; }
.row .name { white-space: nowrap; }
.row .pct { color: #ffec00; -webkit-text-stroke: 2px #050505; paint-order: stroke fill; }
.note { color: #fff; font-weight: 700; background: rgba(0,0,0,.66); border-left: 12px solid #ffdb00; }
.warningStrip { position:absolute; display:flex; align-items:center; justify-content:center; background: linear-gradient(90deg,#090909,#b60808,#090909); border-top:5px solid #ffeb00; border-bottom:5px solid #ffeb00; color:#fff; font-weight:700; -webkit-text-stroke:2px #000; paint-order:stroke fill; box-shadow:0 0 34px rgba(255,0,0,.6); }

#cover16 { width: 1920px; height: 1080px; }
#cover16 .headline { position:absolute; left:58px; top:42px; font-size:124px; }
#cover16 .sub { position:absolute; left:72px; top:232px; font-size:172px; }
#cover16 .mapPanel { right:165px; top:82px; width:650px; height:860px; }
#cover16 .badge.one { left:72px; bottom:185px; width:650px; height:128px; font-size:62px; position:absolute; }
#cover16 .badge.two { left:72px; bottom:44px; width:740px; height:122px; font-size:58px; position:absolute; }
#cover16 .warningStrip { left:865px; right:70px; bottom:46px; height:112px; font-size:52px; }
#cover16 .date { position:absolute; left:86px; top:440px; font-size:70px; }

#cover9 { width:1080px; height:1920px; }
#cover9 .headline { position:absolute; left:60px; top:70px; font-size:136px; }
#cover9 .big { position:absolute; left:78px; top:218px; font-size:292px; color:#ffec00; -webkit-text-stroke:9px #050505; paint-order:stroke fill; text-shadow:0 12px 0 #b31913, 0 0 42px rgba(255,0,0,.82); }
#cover9 .mapPanel { left:165px; top:590px; width:740px; height:790px; }
#cover9 .badge.one { left:72px; bottom:326px; width:936px; height:138px; font-size:60px; position:absolute; }
#cover9 .badge.two { left:72px; bottom:170px; width:936px; height:126px; font-size:54px; position:absolute; }
#cover9 .date { position:absolute; left:90px; bottom:48px; font-size:60px; }

#sum16 { width:1920px; height:1080px; }
#sum16 .title { position:absolute; left:64px; top:34px; font-size:88px; }
#sum16 .mapPanel { left:98px; top:160px; width:610px; height:760px; }
#sum16 .table { position:absolute; right:74px; top:188px; width:1030px; }
#sum16 .row { height:80px; padding:0 34px; font-size:42px; }
#sum16 .wave { position:absolute; left:210px; right:210px; bottom:35px; height:92px; padding:19px 30px; font-size:42px; }
#sum16 .callout { position:absolute; left:780px; top:96px; font-size:54px; }

#sum9 { width:1080px; height:1920px; }
#sum9 .title { position:absolute; left:60px; top:58px; font-size:100px; line-height:1.05; }
#sum9 .mapPanel { left:188px; top:290px; width:705px; height:800px; }
#sum9 .table { position:absolute; left:66px; right:66px; top:1150px; }
#sum9 .row { height:96px; padding:0 28px; font-size:44px; }
#sum9 .wave { position:absolute; left:66px; right:66px; bottom:54px; min-height:126px; padding:24px 28px; font-size:42px; }
</style>
</head>
<body>
<section id="cover16" class="stage"><div class="content">
  <div class="headline">บ่าย-ค่ำ</div>
  <div class="sub whiteStroke">ฝนต่อเนื่อง</div>
  <div class="date whiteStroke">29 พ.ค. 69</div>
  ${thailandMap('')}
  <div class="badge one">ใต้ฝั่งตก 70%</div>
  <div class="badge two blueBadge">อันดามัน 2-3 ม.</div>
  <div class="warningStrip">ใต้ฝั่งตกหนักมากบางแห่ง • กทม. 60%</div>
</div></section>
<section id="cover9" class="stage"><div class="content">
  <div class="headline">ฝนเกิน</div>
  <div class="big">50%</div>
  ${thailandMap('')}
  <div class="badge one">ใต้ฝั่งตก 70%</div>
  <div class="badge two blueBadge">บ่าย-ค่ำ</div>
  <div class="date whiteStroke">กทม.ฝน 60%</div>
</div></section>
<section id="sum16" class="stage"><div class="content">
  <div class="title whiteStroke">สรุปฝน 29 พ.ค. 69</div>
  <div class="callout redStroke">จุดเสี่ยงฝนหนัก</div>
  ${thailandMap('')}
  <div class="table">
    <div class="row"><span class="name">ภาคเหนือ</span><span class="pct">60%</span></div>
    <div class="row"><span class="name">อีสาน</span><span class="pct">60%</span></div>
    <div class="row"><span class="name">ภาคกลาง</span><span class="pct">60%</span></div>
    <div class="row"><span class="name">ตะวันออก</span><span class="pct">60%</span></div>
    <div class="row"><span class="name">ใต้ฝั่งออก</span><span class="pct">60%</span></div>
    <div class="row hot"><span class="name">ใต้ฝั่งตก</span><span class="pct">70%</span></div>
    <div class="row"><span class="name">กทม.-ปริมณฑล</span><span class="pct">60%</span></div>
  </div>
  <div class="note wave">อันดามันตอนบน 2-3 ม. | ฝนฟ้าคะนองมากกว่า 3 ม.</div>
</div></section>
<section id="sum9" class="stage"><div class="content">
  <div class="title whiteStroke">สรุป<br>บ่าย-ค่ำ</div>
  ${thailandMap('')}
  <div class="table">
    <div class="row"><span class="name">เหนือ</span><span class="pct">60%</span></div>
    <div class="row"><span class="name">ตะวันออก</span><span class="pct">60%</span></div>
    <div class="row hot"><span class="name">ใต้ฝั่งตก</span><span class="pct">70%</span></div>
    <div class="row"><span class="name">กทม.</span><span class="pct">60%</span></div>
  </div>
  <div class="note wave">อันดามันบน 2-3 ม.<br>ฝนฟ้าคะนองมากกว่า 3 ม.</div>
</div></section>
</body>
</html>`;

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: chrome,
    args: ['--disable-gpu', '--no-sandbox'],
  });

  for (const card of cards) {
    const page = await browser.newPage({
      viewport: { width: card.width, height: card.height },
      deviceScaleFactor: 1,
      locale: 'th-TH',
    });
    await page.setContent(html, { waitUntil: 'load' });
    await page.locator(`#${card.id}`).screenshot({
      path: path.join(outDir, card.file),
      animations: 'disabled',
    });
    await page.close();
  }

  await browser.close();
})();
