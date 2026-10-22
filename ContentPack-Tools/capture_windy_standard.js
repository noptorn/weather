const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright-core');
const ffmpegPath = require('ffmpeg-static');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const TARGET_DATE = '2026-05-30';
const OUT_DIR = path.join(ROOT, '2026.05.30', 'T1');
const TMP_DIR = path.join(OUT_DIR, 'windy-video-tmp');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const VIEW = { width: 1920, height: 1080 };
const FILTER = 'crop=1422:800:249:140,scale=1920:1080,setsar=1';
const STEP_HOURS = [5, 8, 11, 14, 17, 20, 23];

const jobs = [
  { overlay: 'rain', output: 'windy_Rain.mp4' },
  { overlay: 'thunder', output: 'windy_Storm.mp4' },
];

function bangkokTimestamp(hour) {
  return new Date(`${TARGET_DATE}T${String(hour).padStart(2, '0')}:00:00+07:00`).getTime();
}

function convert(input, output) {
  const args = [
    '-y',
    '-i', input,
    '-vf', FILTER,
    '-r', '25',
    '-an',
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-preset', 'medium',
    '-crf', '18',
    '-movflags', '+faststart',
    output,
  ];
  const result = spawnSync(ffmpegPath, args, { cwd: ROOT, stdio: 'inherit' });
  if (result.status !== 0) {
    throw new Error(`ffmpeg failed for ${output}`);
  }
}

async function waitForWindy(page) {
  await page.waitForFunction(() => window.W && window.W.store && window.W.map, null, { timeout: 60000 });
  await page.waitForTimeout(7000);
}

async function setWindyState(page, overlay, timestamp) {
  await page.evaluate(({ overlay, timestamp }) => {
    window.W.store.set('overlay', overlay);
    window.W.store.set('timestamp', timestamp);
    window.W.map.map.setView([13.6, 101.0], 6, { animate: false });
  }, { overlay, timestamp });
}

async function capture(job) {
  fs.mkdirSync(TMP_DIR, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    executablePath: CHROME,
    args: [
      '--disable-gpu',
      '--no-sandbox',
      '--autoplay-policy=no-user-gesture-required',
      '--window-size=1920,1080',
    ],
  });

  const context = await browser.newContext({
    viewport: VIEW,
    deviceScaleFactor: 1,
    locale: 'th-TH',
    timezoneId: 'Asia/Bangkok',
    recordVideo: { dir: TMP_DIR, size: VIEW },
  });

  const page = await context.newPage();
  await page.goto(`https://www.windy.com/?${job.overlay},13.600,101.000,6`, {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });
  await waitForWindy(page);

  for (const hour of STEP_HOURS) {
    await setWindyState(page, job.overlay, bangkokTimestamp(hour));
    await page.waitForTimeout(hour === STEP_HOURS[0] ? 5000 : 7000);
  }

  await page.close();
  await context.close();
  await browser.close();

  const webms = fs.readdirSync(TMP_DIR)
    .filter((name) => name.endsWith('.webm'))
    .map((name) => path.join(TMP_DIR, name))
    .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
  if (!webms.length) {
    throw new Error(`No WebM capture produced for ${job.overlay}`);
  }

  const raw = path.join(OUT_DIR, `${job.overlay}-raw.webm`);
  fs.renameSync(webms[0], raw);
  convert(raw, path.join(OUT_DIR, job.output));
}

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  for (const job of jobs) {
    console.log(`Capturing ${job.overlay}...`);
    await capture(job);
  }
})();
