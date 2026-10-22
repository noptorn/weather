const fs = require('fs');
const path = require('path');

const outDir = 'D:\\Content\\Weather\\20261017\\Weather\\T1';
fs.mkdirSync(outDir, { recursive: true });

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
let ids = new Set();
function copyBlock(id, label, content, kind = 'none', cls = '') {
  if (ids.has(id)) throw new Error(`duplicate id ${id}`);
  ids.add(id);
  return `<div class="copy-wrap ${cls}"><button type="button" class="copy-btn" data-copy-target="${id}" data-copy-kind="${kind}">คัดลอก${esc(label)}</button><pre id="${id}" class="copy-content">${esc(content)}</pre></div>`;
}

const input = `ข้อมูลพยากรณ์วันที่: 17–22 ตุลาคม 2569
ประเภทงาน: พยากรณ์ประจำวันที่ 17 ตุลาคม ต่อเนื่องถึงวันที่ 22 ตุลาคม และข้อความเตือนที่เกี่ยวข้อง
รอบการผลิต: T1 สำหรับวันที่เป้าหมาย 17 ตุลาคม 2569 (เริ่มผลิตคืนวันที่ 16 ตุลาคม ภายในช่วง T1 เวลา 22:01–11:00 น.)
Weather Source ที่ใช้:
1) กรมอุตุนิยมวิทยา _ พยากรณ์อากาศประจำวัน.mhtml
2) กรมอุตุนิยมวิทยา _ พยากรณ์อากาศ 7 วัน.mhtml
Warning Bulletin/PDF แยก: MISSING_UPLOAD`;

const sourceSummary = `DAILY — VERIFIED
ไฟล์: กรมอุตุนิยมวิทยา _ พยากรณ์อากาศประจำวัน.mhtml
ฉบับที่เลือกใน dropdown: ประจำวันที่ 16 ตุลาคม 2569 23.00 น.
วันที่ข้อมูล/พยากรณ์: 17 ตุลาคม 2569
ช่วงมีผล: 00:00 น. วันที่ 17 ตุลาคม ถึง 00:00 น. วันที่ 18 ตุลาคม 2569
หลักฐานที่ใช้: ลักษณะอากาศทั่วไป + พยากรณ์รายภาค + เปอร์เซ็นต์พื้นที่มีฝน + รายชื่อจังหวัด + คลื่นลม

SEVEN-DAY — VERIFIED
ไฟล์: กรมอุตุนิยมวิทยา _ พยากรณ์อากาศ 7 วัน.mhtml
ออกประกาศ: 16 ตุลาคม 2569 เวลา 12:00 น.
ช่วงมีผลในเอกสาร: 16–22 ตุลาคม 2569
ช่วงที่ใช้ในงาน: 17–22 ตุลาคม 2569
หลักฐานที่ใช้: แนวโน้มทั่วไป รายภาค เปอร์เซ็นต์พื้นที่มีฝน ระดับฝน คลื่นลม และข้อควรระวัง

WARNING BULLETIN — MISSING_UPLOAD
ไม่มีไฟล์ประกาศเตือนภัย/PDF แยกใน Uploaded Sources จึงไม่มีเลขฉบับ จังหวัด หรืออำเภอจากประกาศเตือนภัยแยก งานนี้ใช้เฉพาะข้อความเตือนที่อยู่ใน Daily และ Seven-day เท่านั้น`;

const coverage = [
  ['ภาคเหนือ','17 ต.ค. ฝนฟ้าคะนอง 40% ลมกระโชกแรงบางแห่ง: แม่ฮ่องสอน เชียงใหม่ ลำปาง ตาก กำแพงเพชร','17–22 ต.ค. 10–30%','VERIFIED'],
  ['ภาคตะวันออกเฉียงเหนือ','17 ต.ค. 20% ลมกระโชกแรงบางแห่ง: เลย ชัยภูมิ นครราชสีมา บุรีรัมย์ สุรินทร์','17–19 ต.ค. 10–30% ส่วนมากตอนล่าง; 20–22 ต.ค. 30–40% และฝนหนักบางแห่งส่วนมากตอนล่าง','VERIFIED'],
  ['ภาคกลาง','17 ต.ค. 40% ฝนหนักและลมกระโชกแรงบางแห่ง: ลพบุรี สระบุรี สุพรรณบุรี พระนครศรีอยุธยา กาญจนบุรี ราชบุรี นครปฐม','17–19 ต.ค. 30–40% ส่วนมากตอนล่าง; 20–22 ต.ค. 60–70% และฝนหนักบางแห่ง','VERIFIED'],
  ['ภาคตะวันออก','17 ต.ค. 60% ฝนหนักบางแห่ง: นครนายก ชลบุรี ระยอง จันทบุรี ตราด; ฝนฟ้าคะนองคลื่นมากกว่า 2 ม.','17–19 ต.ค. 30–40%; 20–22 ต.ค. 60–70% และฝนหนักถึงหนักมากบางแห่ง','VERIFIED'],
  ['ภาคใต้ฝั่งตะวันออก','17 ต.ค. 60% ฝนหนักบางแห่ง: ชุมพร สุราษฎร์ธานี นครศรีธรรมราช สงขลา ยะลา นราธิวาส; ฝนฟ้าคะนองคลื่นมากกว่า 2 ม.','17–20 ต.ค. 60–70% ฝนหนักถึงหนักมากบางแห่ง; 21–22 ต.ค. 40–60% ฝนหนักบางแห่งส่วนมากตอนบน','VERIFIED'],
  ['ภาคใต้ฝั่งตะวันตก','17 ต.ค. 60% ฝนหนักบางแห่ง: ระนอง พังงา ภูเก็ต กระบี่ ตรัง สตูล; ฝนฟ้าคะนองคลื่นมากกว่า 2 ม.','17–22 ต.ค. 60–70% และฝนหนักบางแห่ง','VERIFIED'],
  ['กทม.และปริมณฑล','17 ต.ค. 60% กับลมกระโชกแรงบางแห่ง','17–19 ต.ค. 30–40%; 20–22 ต.ค. 60–70% และฝนหนักบางแห่ง','VERIFIED'],
];

const hooks = [
  '17 ตุลาคม... ภาคกลาง ภาคตะวันออก และภาคใต้ยังต้องระวังฝนหนักบางแห่ง... ส่วนวันที่ 20 ถึง 22 ตุลาคม ฝนจะเพิ่มขึ้นหลายพื้นที่ค่ะ',
  'วันนี้ฝนร้อยละ 60 ปกคลุมภาคตะวันออก ภาคใต้ทั้งสองฝั่ง และกรุงเทพฯ... ก่อนฝนเพิ่มอีกครั้งช่วง 20 ถึง 22 ตุลาคมค่ะ',
  'ชาวเรือต้องระวัง... ทั้งอ่าวไทยและอันดามัน บริเวณฝนฟ้าคะนองคลื่นสูงมากกว่า 2 เมตรตลอดช่วงค่ะ'
];

const longVoice = `วันที่ 17 ตุลาคม... ภาคกลาง ภาคตะวันออก และภาคใต้ยังมีฝนหนักบางแห่ง ต้องระวังฝนสะสม น้ำท่วมฉับพลัน น้ำป่าไหลหลาก และลมกระโชกแรงค่ะ

ภาคเหนือมีฝนฟ้าคะนองร้อยละ 40 กับลมกระโชกแรงบางแห่ง โดยเฉพาะแม่ฮ่องสอน เชียงใหม่ ลำปาง ตาก และกำแพงเพชร... หลังจากนั้นถึงวันที่ 22 ตุลาคม แนวโน้มฝนอยู่ที่ร้อยละ 10 ถึง 30

ภาคอีสานวันนี้มีฝนร้อยละ 20 กับลมกระโชกแรงบางแห่ง แถวเลย ชัยภูมิ นครราชสีมา บุรีรัมย์ และสุรินทร์... ช่วงวันที่ 20 ถึง 22 ตุลาคม ฝนเพิ่มเป็นร้อยละ 30 ถึง 40 และมีฝนหนักบางแห่งทางตอนล่าง

ภาคกลางวันนี้มีฝนร้อยละ 40 และฝนหนักบางแห่ง ตั้งแต่ลพบุรี สระบุรี สุพรรณบุรี พระนครศรีอยุธยา กาญจนบุรี ราชบุรี ถึงนครปฐม... ช่วงวันที่ 20 ถึง 22 ตุลาคม ฝนเพิ่มเป็นร้อยละ 60 ถึง 70 และมีฝนหนักบางแห่ง

ภาคตะวันออกวันนี้มีฝนร้อยละ 60 และฝนหนักบางแห่งที่นครนายก ชลบุรี ระยอง จันทบุรี และตราด... วันที่ 20 ถึง 22 ตุลาคม มีฝนร้อยละ 60 ถึง 70 และอาจหนักถึงหนักมากบางแห่ง

ภาคใต้ฝั่งตะวันออก วันนี้มีฝนร้อยละ 60 และฝนหนักบางแห่งที่ชุมพร สุราษฎร์ธานี นครศรีธรรมราช สงขลา ยะลา และนราธิวาส... ช่วงวันที่ 17 ถึง 20 ตุลาคม มีฝนร้อยละ 60 ถึง 70 และหนักถึงหนักมากบางแห่ง

ภาคใต้ฝั่งตะวันตก วันนี้มีฝนร้อยละ 60 และฝนหนักบางแห่งที่ระนอง พังงา ภูเก็ต กระบี่ ตรัง และสตูล... แนวโน้มวันที่ 17 ถึง 22 ตุลาคมยังมีฝนร้อยละ 60 ถึง 70 และฝนหนักบางแห่ง

กรุงเทพฯ และปริมณฑล วันนี้มีฝนร้อยละ 60 กับลมกระโชกแรงบางแห่ง... วันที่ 20 ถึง 22 ตุลาคม ฝนเพิ่มเป็นร้อยละ 60 ถึง 70 และมีฝนหนักบางแห่ง

ชาวเรือทั้งอ่าวไทยและอันดามันควรหลีกเลี่ยงบริเวณฝนฟ้าคะนอง เพราะคลื่นสูงมากกว่า 2 เมตร... ติดตามพยากรณ์อากาศและประกาศเตือนครั้งต่อไป กดติดตามช่องไว้ด้วยนะคะ`;

const twoDayVoice = `วันที่ 17 ตุลาคม... จุดที่ต้องเฝ้าระวังคือภาคกลาง ภาคตะวันออก และภาคใต้ ซึ่งมีฝนหนักบางแห่งค่ะ ภาคตะวันออก ภาคใต้ทั้งสองฝั่ง และกรุงเทพฯ มีฝนร้อยละ 60... ภาคกลางร้อยละ 40 พร้อมฝนหนักและลมกระโชกแรงบางแห่ง ส่วนภาคเหนือร้อยละ 40 และภาคอีสานร้อยละ 20

วันที่ 18 ตุลาคม... ภาคใต้ยังเป็นพื้นที่เสี่ยงหลัก ฝั่งตะวันออกมีฝนร้อยละ 60 ถึง 70 และอาจหนักถึงหนักมากบางแห่ง ส่วนฝั่งตะวันตกมีฝนร้อยละ 60 ถึง 70 และฝนหนักบางแห่ง... พื้นที่อื่นมีแนวโน้มฝนน้อยกว่า โดยภาคเหนือร้อยละ 10 ถึง 30 ภาคอีสานร้อยละ 10 ถึง 30 และภาคกลาง ภาคตะวันออก รวมถึงกรุงเทพฯ ร้อยละ 30 ถึง 40

ระวังน้ำท่วมฉับพลัน น้ำป่าไหลหลาก และหลีกเลี่ยงเดินเรือในฝนฟ้าคะนอง... กดติดตามช่องไว้สำหรับอัปเดตครั้งต่อไปนะคะ`;

const shortYT = `17 ตุลาคม... ภาคตะวันออก ภาคใต้ทั้งสองฝั่ง และกรุงเทพฯ มีฝนร้อยละ 60 ค่ะ ภาคกลางร้อยละ 40 พร้อมฝนหนักและลมกระโชกแรงบางแห่ง... ชาวเรือระวังคลื่นมากกว่า 2 เมตรในบริเวณฝนฟ้าคะนอง และช่วง 20 ถึง 22 ตุลาคมฝนจะเพิ่มขึ้นในภาคกลาง ภาคตะวันออก และกรุงเทพฯ... กดติดตามช่องไว้นะคะ`;
const shortFB = `วันนี้ภาคตะวันออก ภาคใต้สองฝั่ง และกรุงเทพฯ มีฝนร้อยละ 60... ภาคกลางร้อยละ 40 และมีฝนหนักกับลมกระโชกแรงบางแห่งค่ะ ระวังน้ำท่วมฉับพลัน น้ำป่าไหลหลาก และคลื่นมากกว่า 2 เมตรในเขตฝนฟ้าคะนอง... ไม่พลาดอัปเดตครั้งต่อไป กดติดตามเพจไว้นะคะ`;

const commonMap = `MAP_REFERENCE_MODE = REGION. MAP GEOMETRY LOCK: Use ThaiMap-Region.jpg as immutable geometry. Do not redraw, regenerate, reinterpret, simplify, stretch, squeeze, widen, shorten, rotate, mirror, warp, or alter the silhouette, coastline, or regional positions. Scale uniformly and preserve aspect ratio. Composite weather effects and verified risk overlays without changing geometry. If the required map reference is inaccessible or exact geometry cannot be preserved, set MAP_QA_FAIL and STOP_IMAGE_GENERATION; do not output an approximate map.`;
function prompt({id,file,type,ratio,logo,text,facts,intensity='ALERT',role='INFORMATION'}) {
  const dims = ratio === '16:9' ? '1920x1080' : '1080x1920';
  const safe = ratio === '16:9' ? 'Keep text clear of lower-right timestamp/player controls.' : 'Keep all critical Thai text inside the central Shorts safe area; leave generous top and bottom UI margins.';
  return {
    id, file,
    body: `${id} — ${type}\nOutput filename: ${file}\nCreate one original Thai weather ${role.toLowerCase()} graphic, ${ratio}, ${dims}. VISUAL_INTENSITY = ${intensity}. Use realistic monsoon cloud, rain and radar-energy textures; high contrast and bold legible Thai typography. Do not invent live radar, exact rain cells, provinces, percentages, or warning status.\nRequired uploaded logo in THIS image-generation chat: ${logo}. If missing/inaccessible: STOP_IMAGE_GENERATION and request upload before creating the image. Use this logo only; do not redraw or substitute it.\n${commonMap}\nEXACT THAI TEXT TO RENDER (maximum 3 text blocks):\n${text}\nVERIFIED DATA TO VISUALIZE:\n${facts}\nLayout: one dominant story, clean hierarchy, readable at phone size, no tiny data table. ${safe}\nQA: Thai spelling exact; percentages mean area with rain, not rain intensity; red only for verified heavy or very heavy risk; no unsupported province highlight; no extra logo; no source URL or issue time rendered.`
  };
}

const W='SanhaTham_Logo_Watermark.png', T='SanhaTham_Logo_Transparent.png';
const prompts = [
  prompt({id:'IMG04',file:'T1.HC.png',type:'YouTube Long Cover',ratio:'16:9',logo:T,role:'COVER',intensity:'HIGH IMPACT',text:'17–22 ต.ค. 69\nฝนเพิ่ม 20–22 ต.ค.\nตะวันออก–ใต้เสี่ยงหนัก',facts:'17 ต.ค. ฝนหนักบางแห่งในภาคกลาง ภาคตะวันออก และภาคใต้; 20–22 ต.ค. ภาคตะวันออกมีฝน 60–70% และหนักถึงหนักมากบางแห่ง; ภาคใต้มีฝนต่อเนื่อง'}),
  prompt({id:'IMG05',file:'T1.HS.png',type:'Summary',ratio:'16:9',logo:W,text:'17 ต.ค. จุดเสี่ยงฝนหนัก\nตะวันออก–ใต้ 60%\nฝนเพิ่มอีก 20–22 ต.ค.',facts:'17 ต.ค.: ตะวันออก ใต้ตะวันออก ใต้ตะวันตก และ กทม. 60%; ภาคกลาง 40% และฝนหนักบางแห่ง; คลื่นมากกว่า 2 ม. ในฝนฟ้าคะนอง'}),
  prompt({id:'IMG06',file:'h.n.png',type:'ภาคเหนือ',ratio:'16:9',logo:W,text:'ภาคเหนือ 17 ต.ค.\nฝน 40%\nลมกระโชกแรงบางแห่ง',facts:'แม่ฮ่องสอน เชียงใหม่ ลำปาง ตาก กำแพงเพชร; 17–22 ต.ค. แนวโน้ม 10–30%'}),
  prompt({id:'IMG07',file:'h.ne.png',type:'ภาคอีสาน',ratio:'16:9',logo:W,text:'อีสาน 17 ต.ค. ฝน 20%\n20–22 ต.ค. ฝนเพิ่ม\nตอนล่างระวังฝนหนัก',facts:'17 ต.ค.: เลย ชัยภูมิ นครราชสีมา บุรีรัมย์ สุรินทร์ และลมกระโชกแรงบางแห่ง; 20–22 ต.ค. 30–40% ฝนหนักบางแห่งส่วนมากตอนล่าง'}),
  prompt({id:'IMG08',file:'h.c.png',type:'ภาคกลาง',ratio:'16:9',logo:W,intensity:'HIGH IMPACT',text:'ภาคกลาง 17 ต.ค.\nฝน 40% มีฝนหนัก\n20–22 ต.ค. เพิ่มเป็น 60–70%',facts:'17 ต.ค.: ลพบุรี สระบุรี สุพรรณบุรี พระนครศรีอยุธยา กาญจนบุรี ราชบุรี นครปฐม; ฝนหนักและลมกระโชกแรงบางแห่ง'}),
  prompt({id:'IMG09',file:'h.e.png',type:'ภาคตะวันออก',ratio:'16:9',logo:W,intensity:'HIGH IMPACT',text:'ตะวันออก 17 ต.ค. ฝน 60%\n20–22 ต.ค. 60–70%\nหนักถึงหนักมากบางแห่ง',facts:'17 ต.ค.: นครนายก ชลบุรี ระยอง จันทบุรี ตราด ฝนหนักบางแห่ง; บริเวณฝนฟ้าคะนองคลื่นมากกว่า 2 ม.'}),
  prompt({id:'IMG10',file:'h.se.png',type:'ใต้ฝั่งตะวันออก',ratio:'16:9',logo:W,intensity:'HIGH IMPACT',text:'ใต้ฝั่งอ่าวไทย\n17–20 ต.ค. ฝน 60–70%\nหนักถึงหนักมากบางแห่ง',facts:'17 ต.ค.: ชุมพร สุราษฎร์ธานี นครศรีธรรมราช สงขลา ยะลา นราธิวาส; คลื่นมากกว่า 2 ม. ในฝนฟ้าคะนอง'}),
  prompt({id:'IMG11',file:'h.sw.png',type:'ใต้ฝั่งตะวันตก',ratio:'16:9',logo:W,intensity:'HIGH IMPACT',text:'ใต้ฝั่งอันดามัน\n17–22 ต.ค. ฝน 60–70%\nฝนหนักบางแห่ง',facts:'17 ต.ค.: ระนอง พังงา ภูเก็ต กระบี่ ตรัง สตูล; คลื่นมากกว่า 2 ม. ในฝนฟ้าคะนอง'}),
  prompt({id:'IMG12',file:'h.bkk.png',type:'กทม.และปริมณฑล',ratio:'16:9',logo:W,text:'กทม.–ปริมณฑล\n17 ต.ค. ฝน 60%\n20–22 ต.ค. ฝน 60–70%',facts:'17 ต.ค. ลมกระโชกแรงบางแห่ง; 20–22 ต.ค. มีฝนหนักบางแห่ง'}),
  prompt({id:'IMG13',file:'T1.VC.png',type:'Shorts First Frame',ratio:'9:16',logo:T,role:'FIRST FRAME',intensity:'HIGH IMPACT',text:'17 ต.ค. ฝน 60%\nตะวันออก–ใต้–กทม.\nระวังฝนหนักบางแห่ง',facts:'ภาคตะวันออกและภาคใต้ 60% พร้อมฝนหนักบางแห่ง; กทม. 60% ลมกระโชกแรงบางแห่ง'}),
  prompt({id:'IMG14',file:'T1.VS.png',type:'Vertical Summary',ratio:'9:16',logo:W,text:'17 ต.ค.\nกลาง 40% มีฝนหนัก\nตะวันออก–ใต้–กทม. 60%',facts:'คลื่นมากกว่า 2 ม. เฉพาะบริเวณที่มีฝนฟ้าคะนอง; ไม่แสดงเป็นคลื่นทั้งทะเล'}),
  prompt({id:'IMG15',file:'v.n.png',type:'ภาคเหนือ Vertical',ratio:'9:16',logo:W,text:'เหนือ 17 ต.ค.\nฝน 40%\nลมกระโชกแรงบางแห่ง',facts:'แม่ฮ่องสอน เชียงใหม่ ลำปาง ตาก กำแพงเพชร'}),
  prompt({id:'IMG16',file:'v.ne.png',type:'ภาคอีสาน Vertical',ratio:'9:16',logo:W,text:'อีสาน 17 ต.ค.\nฝน 20%\nลมกระโชกแรงบางแห่ง',facts:'เลย ชัยภูมิ นครราชสีมา บุรีรัมย์ สุรินทร์'}),
  prompt({id:'IMG17',file:'v.c.png',type:'ภาคกลาง Vertical',ratio:'9:16',logo:W,intensity:'HIGH IMPACT',text:'กลาง 17 ต.ค.\nฝน 40%\nฝนหนักบางแห่ง',facts:'ลพบุรี สระบุรี สุพรรณบุรี พระนครศรีอยุธยา กาญจนบุรี ราชบุรี นครปฐม; ลมกระโชกแรงบางแห่ง'}),
  prompt({id:'IMG18',file:'v.e.png',type:'ภาคตะวันออก Vertical',ratio:'9:16',logo:W,intensity:'HIGH IMPACT',text:'ตะวันออก 17 ต.ค.\nฝน 60%\nฝนหนักบางแห่ง',facts:'นครนายก ชลบุรี ระยอง จันทบุรี ตราด; ฝนฟ้าคะนองคลื่นมากกว่า 2 ม.'}),
  prompt({id:'IMG19',file:'v.se.png',type:'ใต้ฝั่งตะวันออก Vertical',ratio:'9:16',logo:W,intensity:'HIGH IMPACT',text:'ใต้ฝั่งอ่าวไทย\n17 ต.ค. ฝน 60%\nฝนหนักบางแห่ง',facts:'ชุมพร สุราษฎร์ธานี นครศรีธรรมราช สงขลา ยะลา นราธิวาส; ฝนฟ้าคะนองคลื่นมากกว่า 2 ม.'}),
  prompt({id:'IMG20',file:'v.sw.png',type:'ใต้ฝั่งตะวันตก Vertical',ratio:'9:16',logo:W,intensity:'HIGH IMPACT',text:'ใต้ฝั่งอันดามัน\n17 ต.ค. ฝน 60%\nฝนหนักบางแห่ง',facts:'ระนอง พังงา ภูเก็ต กระบี่ ตรัง สตูล; ฝนฟ้าคะนองคลื่นมากกว่า 2 ม.'}),
  prompt({id:'IMG21',file:'v.bkk.png',type:'กทม. Vertical',ratio:'9:16',logo:W,text:'กทม.–ปริมณฑล\n17 ต.ค. ฝน 60%\nลมกระโชกแรงบางแห่ง',facts:'20–22 ต.ค. แนวโน้มฝน 60–70% และมีฝนหนักบางแห่ง'}),
  prompt({id:'IMG25',file:'1.VC.short.png',type:'Facebook Reel Cover',ratio:'9:16',logo:T,role:'COVER',intensity:'HIGH IMPACT',text:'วันนี้ฝน 60%\nตะวันออก–ใต้–กทม.\nระวังฝนหนัก',facts:'ตรงกับ Facebook Reels Voice Only: 17 ต.ค. ตะวันออก ใต้สองฝั่ง และ กทม. 60%; กลาง 40% พร้อมฝนหนักบางแห่ง'}),
  prompt({id:'IMG26',file:'1.VS.short.png',type:'Facebook Reel Summary',ratio:'9:16',logo:W,text:'17 ต.ค. จุดเสี่ยง\nฝนหนัก–ลมกระโชก\nคลื่นเกิน 2 ม. ในฝนฟ้าคะนอง',facts:'สรุปเฉพาะ Facebook Reels Voice Only; ห้ามตีความคลื่นเกิน 2 ม. ว่าเกิดทุกพื้นที่ทะเล'}),
  prompt({id:'IMG27',file:'1.VC.2d.png',type:'2-Day Impact Cover',ratio:'9:16',logo:T,role:'COVER',intensity:'HIGH IMPACT',text:'17–18 ต.ค.\nวันแรกฝนหนักหลายภาค\nวันที่สองใต้ยังเสี่ยงสูง',facts:'17 ต.ค. กลาง ตะวันออก ใต้มีฝนหนักบางแห่ง; 18 ต.ค. ใต้ฝั่งตะวันออก 60–70% หนักถึงหนักมากบางแห่ง และฝั่งตะวันตก 60–70% ฝนหนักบางแห่ง'}),
  prompt({id:'IMG28',file:'1.VS.2d.png',type:'2-Day Impact Summary',ratio:'9:16',logo:W,text:'17 ต.ค. ตะวันออก–ใต้–กทม. 60%\n18 ต.ค. ใต้ 60–70%\nระวังน้ำท่วมฉับพลัน',facts:'วันที่ 18 ไม่มีรายชื่อจังหวัดใน Seven-day Source; ห้ามเพิ่มจังหวัดหรืออำเภอ'}),
];

const titles = {
  'YouTube Long': ['17–22 ต.ค. ฝนเพิ่มช่วงปลายตอน ตะวันออก–ใต้เสี่ยงหนัก #พยากรณ์อากาศ','เช็กฝน 17–22 ต.ค. ภาคไหนเพิ่มเป็น 60–70% #ฝนตกหนัก','17 ต.ค. ฝนหนักหลายภาค ก่อนเพิ่มอีก 20–22 ต.ค. #อากาศวันนี้'],
  'YouTube Shorts': ['17 ต.ค. ตะวันออก–ใต้–กทม. ฝน 60% #ฝนวันนี้','วันนี้ภาคกลางฝนหนัก ตะวันออก–ใต้ฝน 60% #เตือนฝนหนัก','ระวังคลื่นเกิน 2 เมตรในฝนฟ้าคะนอง 17 ต.ค. #พยากรณ์อากาศ'],
  'Facebook Reels': ['วันนี้ตะวันออก–ใต้–กทม. ฝน 60% #ฝนวันนี้','17 ต.ค. ภาคกลางมีฝนหนักและลมกระโชก #เตือนฝนหนัก','เช็กจุดเสี่ยงฝนหนักและคลื่นเกิน 2 เมตร #อากาศวันนี้'],
  '2-Day Impact': ['17–18 ต.ค. วันแรกหลายภาคฝนหนัก วันที่สองใต้ยังเสี่ยง #ฝนสองวัน','ฝนสองวัน 17–18 ต.ค. ใต้ 60–70% ต่อเนื่อง #เตือนฝนหนัก','17 ต.ค. หลายภาคเสี่ยงฝนหนัก 18 ต.ค. จับตาภาคใต้ #พยากรณ์อากาศ']
};

const desc = {
  'YouTube Long': `พยากรณ์อากาศวันที่ 17–22 ตุลาคม 2569 วันที่ 17 ภาคกลาง ภาคตะวันออก และภาคใต้มีฝนหนักบางแห่ง ขณะที่ช่วง 20–22 ตุลาคม ฝนเพิ่มในอีสานตอนล่าง ภาคกลางตอนล่าง กรุงเทพฯ และปริมณฑล และภาคตะวันออก โดยภาคตะวันออกมีโอกาสฝนหนักถึงหนักมากบางแห่ง ภาคใต้ยังมีฝนต่อเนื่อง ชาวเรือควรหลีกเลี่ยงบริเวณฝนฟ้าคะนองซึ่งคลื่นสูงมากกว่า 2 เมตร\n\nติดตามพยากรณ์และประกาศเตือนครั้งต่อไป กดติดตามช่องไว้ด้วยนะคะ\n\nแหล่งข้อมูล: กรมอุตุนิยมวิทยา\n#พยากรณ์อากาศ #ฝนตกหนัก #เตือนภัย #อากาศวันนี้`,
  'YouTube Shorts': `17 ตุลาคม 2569 ภาคตะวันออก ภาคใต้ทั้งสองฝั่ง และกรุงเทพฯ มีฝนร้อยละ 60 ภาคกลางมีฝนร้อยละ 40 พร้อมฝนหนักและลมกระโชกแรงบางแห่ง ชาวเรือระวังคลื่นสูงมากกว่า 2 เมตรในบริเวณฝนฟ้าคะนอง\n\nกดติดตามช่องไว้สำหรับอัปเดตครั้งต่อไปนะคะ\n\nแหล่งข้อมูล: กรมอุตุนิยมวิทยา\n#ฝนวันนี้ #พยากรณ์อากาศ #เตือนฝนหนัก`,
  'Facebook Reels': `17 ตุลาคม 2569 ภาคตะวันออก ภาคใต้สองฝั่ง และกรุงเทพฯ มีฝนร้อยละ 60 ภาคกลางร้อยละ 40 และมีฝนหนักกับลมกระโชกแรงบางแห่ง ระวังน้ำท่วมฉับพลัน น้ำป่าไหลหลาก และคลื่นสูงมากกว่า 2 เมตรเฉพาะบริเวณฝนฟ้าคะนอง\n\nไม่พลาดอัปเดตครั้งต่อไป กดติดตามเพจไว้นะคะ\n\nแหล่งข้อมูล: กรมอุตุนิยมวิทยา\n#ฝนวันนี้ #อากาศวันนี้ #เตือนฝนหนัก`,
  '2-Day Impact': `พยากรณ์ 2 วัน 17–18 ตุลาคม 2569\n\n17 ตุลาคม: ภาคตะวันออก ภาคใต้ทั้งสองฝั่ง และกรุงเทพฯ มีฝนร้อยละ 60 ภาคกลางร้อยละ 40 พร้อมฝนหนักและลมกระโชกแรงบางแห่ง\n\n18 ตุลาคม: ภาคใต้ฝั่งตะวันออกมีฝนร้อยละ 60–70 และอาจหนักถึงหนักมากบางแห่ง ภาคใต้ฝั่งตะวันตกมีฝนร้อยละ 60–70 และฝนหนักบางแห่ง ส่วนภาคกลาง ภาคตะวันออก และกรุงเทพฯ อยู่ที่ร้อยละ 30–40 ตามแนวโน้ม 7 วัน\n\nระวังน้ำท่วมฉับพลัน น้ำป่าไหลหลาก และหลีกเลี่ยงการเดินเรือในบริเวณฝนฟ้าคะนอง กดติดตามช่องไว้สำหรับอัปเดตครั้งต่อไปนะคะ\n\nแหล่งข้อมูล: กรมอุตุนิยมวิทยา\n#ฝนสองวัน #พยากรณ์อากาศ #เตือนฝนหนัก #อากาศวันนี้`
};

const qa = `FINAL STATUS = PASS
SOURCE QA = PASS: Daily และ Seven-day อ่านได้และช่วงเวลาตรง Input
WARNING BULLETIN = MISSING_UPLOAD: ไม่มีประกาศเตือนภัยแยก จึงไม่ใช้เลขฉบับ/จังหวัด/อำเภอจาก Bulletin
DATE ALIGNMENT = PASS: Daily ใช้เฉพาะ 17 ต.ค.; แนวโน้มใช้ 17–22 ต.ค.; 2-Day ใช้ 17–18 ต.ค.
RAIN WORDING = PASS: แยกเปอร์เซ็นต์พื้นที่มีฝนออกจากระดับฝนหนัก/หนักมาก
LONG ALL-REGIONS = PASS: กล่าวครบ 7 กลุ่มตามลำดับมาตรฐาน
CTA = PASS: YouTube ใช้ “กดติดตามช่อง”; Facebook ใช้ “กดติดตามเพจ” และอยู่ท้ายบท
IMAGE PROMPTS = PASS: ครบ 22 รายการ IMG04–IMG21 และ IMG25–IMG28; ชื่อไฟล์ตรงกฎ T1
LOGO PROMPT LOCK = PASS: Cover/First Frame ใช้ Transparent; Summary/Regional ใช้ Watermark เพียงไฟล์เดียวต่อ Prompt
MAP PROMPT LOCK = PASS: ทุก Prompt กำหนด REGION และ fail-closed เมื่อรักษา geometry ไม่ได้
ACTUAL IMAGE GENERATION = NOT_REQUESTED
COPY TARGET STATIC QA = PASS
COPY_BROWSER_TEST = NOT_TESTED (เครื่องมือ Browser ไม่อนุญาตเปิด file://; ตรวจโครงสร้างปุ่มและ target แบบ static แล้ว)`;

function section(id, letter, title, body) { return `<section id="${id}" class="panel"><h2><span>${letter}</span>${esc(title)}</h2>${body}</section>`; }
const covRows = coverage.map(r => `<tr>${r.map(x=>`<td>${esc(x)}</td>`).join('')}</tr>`).join('');
const evidenceRows = `
<tr><td>Daily</td><td>กรมอุตุนิยมวิทยา _ พยากรณ์อากาศประจำวัน.mhtml</td><td>dropdown selected: 16 ต.ค. 2569 23.00 น.; วันที่ข้อมูล 17 ต.ค.; บรรทัดพยากรณ์ 00:00 วันนี้–00:00 วันพรุ่งนี้</td><td>VERIFIED</td></tr>
<tr><td>Seven-day</td><td>กรมอุตุนิยมวิทยา _ พยากรณ์อากาศ 7 วัน.mhtml</td><td>หัวข้อ 16–22 ต.ค. 2569; ออกประกาศ 16 ต.ค. 2569 12:00 น.; คาดหมายทั่วไป/รายภาค/ข้อควรระวัง</td><td>VERIFIED</td></tr>
<tr><td>Warning Bulletin</td><td>ไม่ได้อัปโหลด</td><td>ไม่มีหลักฐานเลขฉบับหรือ PDF แยก</td><td>MISSING_UPLOAD</td></tr>`;

let body = '';
body += section('a-input','A','Input', copyBlock('copy-a-input',' Input',input,'weather'));
body += section('b-source','B','Source Validation & Evidence Log', `${copyBlock('copy-b-summary',' Source Summary',sourceSummary,'weather')}<h3>Source Evidence Log</h3><div class="table-scroll"><table><thead><tr><th>Source</th><th>ชื่อไฟล์จริง</th><th>Evidence</th><th>Status</th></tr></thead><tbody>${evidenceRows}</tbody></table></div><h3>Coverage Matrix</h3><div class="table-scroll"><table><thead><tr><th>พื้นที่</th><th>Daily 17 ต.ค.</th><th>แนวโน้ม 17–22 ต.ค.</th><th>Status</th></tr></thead><tbody>${covRows}</tbody></table></div><div class="notice"><strong>Peak Evidence:</strong> 20–22 ต.ค. ภาคตะวันออกมีฝน 60–70% และฝนหนักถึงหนักมากบางแห่ง; ภาคใต้ฝั่งตะวันออก 17–20 ต.ค. มีฝน 60–70% และฝนหนักถึงหนักมากบางแห่ง ไม่ระบุจังหวัดรายวันในไฟล์ 7 วัน</div>`);
body += section('c-hooks','C','Hook Scripts — 3 แบบ', hooks.map((h,i)=>`<article class="card"><h3>${i===0?'Recommended Hook':'Hook '+(i+1)}</h3>${copyBlock(`hook-${i+1}`,' Hook',h,'none')}</article>`).join(''));
body += section('d-long','D','Long Video Script — 60–150 วินาที', `<h3>Voice Only</h3>${copyBlock('long-voice',' Voice Only',longVoice,'none')}<h3>Long Impact Selection Audit</h3>${copyBlock('long-audit',' Audit',`เลือกเล่าครบ 7 กลุ่มพื้นที่ตามลำดับมาตรฐาน โดยให้รายละเอียดรายจังหวัดเฉพาะ Daily วันที่ 17 ต.ค. ส่วนแนวโน้ม 18–22 ต.ค. ใช้ระดับภาคตาม Seven-day เท่านั้น เน้นหนักสุดที่ภาคตะวันออกช่วง 20–22 ต.ค. และภาคใต้ฝั่งตะวันออกช่วง 17–20 ต.ค. รวมคำเตือนคลื่นมากกว่า 2 เมตรเฉพาะบริเวณฝนฟ้าคะนอง ไม่กล่าวเวลาออกประกาศใน Voice Only`,'weather')}`);
body += section('e-2day','E','2-Day Impact Script — 17–18 ตุลาคม 2569', `<h3>Voice Only (YouTube)</h3>${copyBlock('two-day-voice',' Voice Only',twoDayVoice,'none')}<h3>2-Day Impact Selection Audit</h3>${copyBlock('two-day-audit',' Audit',`17 ต.ค. ใช้ Daily ที่ยืนยันรายภาคและจังหวัดได้ ส่วน 18 ต.ค. ใช้ Seven-day ตามช่วงวันที่เท่านั้น จึงไม่ระบุจังหวัดของวันที่ 18 เน้นภาคใต้เพราะฝั่งตะวันออก 60–70% และหนักถึงหนักมากบางแห่ง ฝั่งตะวันตก 60–70% และหนักบางแห่ง`,'weather')}`);
body += section('f-short','F','YouTube Shorts / Facebook Reels', `<div class="grid2"><article class="card"><h3>YouTube Shorts Voice Only</h3>${copyBlock('short-yt',' YouTube Shorts',shortYT,'none')}</article><article class="card"><h3>Facebook Reels Voice Only</h3>${copyBlock('short-fb',' Facebook Reels',shortFB,'none')}</article></div><h3>High-Risk Selection Audit</h3>${copyBlock('short-audit',' Audit',`เลือกภาคตะวันออก ภาคใต้ทั้งสองฝั่ง และกรุงเทพฯ เพราะ Daily ระบุฝน 60% และเลือกภาคกลางเพราะมีฝนหนักกับลมกระโชกแรงบางแห่ง แม้เปอร์เซ็นต์พื้นที่มีฝนอยู่ที่ 40% ไม่ใส่จังหวัดเกินกว่าที่บทสั้นมีเวลาเล่า`,'weather')}`);
body += section('g-images','G','Image Prompts — 22 ภาพ', `<div class="notice">ส่งเฉพาะ Prompt ยังไม่ได้สั่งสร้าง PNG จริง ทุก Prompt ใช้ <code>data-copy-kind="imageWeather"</code> และจะเติม Image Reference Source Prefix ตอนคัดลอก</div>${prompts.map(p=>`<article id="${p.id.toLowerCase()}" class="card image-card"><div class="card-head"><h3>${p.id} · ${esc(p.file)}</h3><span>${esc(p.body.split('\n')[0].split('—')[1].trim())}</span></div>${copyBlock(`prompt-${p.id.toLowerCase()}`,' Prompt',p.body,'imageWeather')}</article>`).join('')}`);
body += section('h-titles','H','Platform Titles', Object.entries(titles).map(([platform,arr])=>`<article class="card"><h3>${esc(platform)}</h3>${arr.map((t,i)=>`<div class="title-row"><span>${i===0?'Recommended':'ตัวเลือก '+(i+1)}</span>${copyBlock(`title-${platform.toLowerCase().replace(/\s+/g,'-')}-${i+1}`,' Title',t,'none')}</div>`).join('')}</article>`).join(''));
body += section('i-desc','I','Descriptions', Object.entries(desc).map(([platform,d])=>`<article class="card"><h3>${esc(platform)}</h3>${copyBlock(`desc-${platform.toLowerCase().replace(/\s+/g,'-')}`,' Description',d,'none')}</article>`).join(''));
body += section('j-qa','J','Final QA Report', copyBlock('qa-report',' QA Report',qa,'none'));

const navMain = [['a-input','A · Input'],['b-source','B · Source Validation'],['c-hooks','C · Hooks'],['d-long','D · Long Video'],['e-2day','E · 2-Day Impact'],['f-short','F · Shorts / Reels'],['g-images','G · Image Prompts'],['h-titles','H · Titles'],['i-desc','I · Descriptions'],['j-qa','J · Final QA']];
const navImages = prompts.filter(p=>['IMG25','IMG26','IMG27','IMG28'].includes(p.id)).map(p=>[p.id.toLowerCase(),`${p.id} · ${p.file}`]);

const html = `<!doctype html>
<html lang="th"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Weather Content Pack · 17–22 ตุลาคม 2569</title>
<style>
:root{--bg:#eef4f7;--paper:#fff;--ink:#152932;--muted:#5d737d;--nav:#0b2631;--cyan:#12b8b0;--blue:#1877a6;--amber:#f3a712;--red:#c33b32;--line:#d8e4e8;--shadow:0 12px 32px rgba(10,40,54,.09)}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:linear-gradient(135deg,#e7f2f5,#f7f1e5);color:var(--ink);font-family:"Leelawadee UI","Noto Sans Thai",Tahoma,sans-serif;line-height:1.62}.layout{display:grid;grid-template-columns:280px minmax(0,1fr);min-height:100vh}.sidebar{position:sticky;top:0;height:100vh;overflow:auto;background:linear-gradient(180deg,#092530,#123f4d);color:#fff;padding:26px 20px}.brand{font-size:1.32rem;font-weight:800;line-height:1.25}.brand small{display:block;margin-top:8px;color:#a9dce0;font-size:.78rem;font-weight:500}.nav-title{margin:24px 8px 8px;color:#7fc9cf;font-size:.72rem;letter-spacing:.12em;text-transform:uppercase}.sidebar a{display:block;color:#dff2f3;text-decoration:none;padding:9px 11px;border-radius:10px;margin:3px 0;font-size:.9rem}.sidebar a:hover,.sidebar a:focus{background:#ffffff17;color:#fff}.sidebar .sub{padding-left:20px;font-size:.82rem;color:#b8dbdf}.main{width:min(1180px,100%);padding:34px 38px 80px}.hero{background:linear-gradient(125deg,#0f5969,#178c98 60%,#efb03c);color:#fff;border-radius:22px;padding:32px;box-shadow:var(--shadow);margin-bottom:24px}.eyebrow{font-size:.78rem;letter-spacing:.14em;text-transform:uppercase;color:#c7f5f2}.hero h1{margin:.2rem 0 .5rem;font-size:clamp(1.7rem,4vw,3rem);line-height:1.12}.hero p{max-width:800px;margin:0;color:#e9ffff}.status-row{display:flex;gap:8px;flex-wrap:wrap;margin-top:18px}.pill{background:#ffffff20;border:1px solid #ffffff45;border-radius:99px;padding:6px 10px;font-size:.78rem}.panel{scroll-margin-top:16px;background:var(--paper);border:1px solid #ffffff;border-radius:18px;padding:24px;margin:18px 0;box-shadow:var(--shadow)}.panel>h2{margin:0 0 18px;font-size:1.45rem}.panel>h2 span{display:inline-grid;place-items:center;width:36px;height:36px;border-radius:11px;background:var(--nav);color:#fff;margin-right:10px}.panel h3{margin:22px 0 10px}.card{border:1px solid var(--line);border-radius:14px;padding:16px;margin:14px 0;background:#fbfdfd}.card-head{display:flex;justify-content:space-between;gap:12px;align-items:center}.card-head h3{margin:0}.card-head span{color:var(--muted);font-size:.82rem}.copy-wrap{position:relative}.copy-btn{display:inline-flex;align-items:center;border:0;border-radius:9px;background:var(--blue);color:#fff;padding:8px 12px;font:inherit;font-weight:700;font-size:.82rem;cursor:pointer;margin:0 0 8px}.copy-btn:hover{filter:brightness(.93)}.copy-content{white-space:pre-wrap;overflow-wrap:anywhere;margin:0;background:#f4f8f9;border:1px solid var(--line);border-left:4px solid var(--cyan);border-radius:10px;padding:15px;font:inherit;font-size:.92rem;color:#203b45}.image-card .copy-content{font-size:.85rem;border-left-color:var(--amber)}.notice{background:#fff7df;border:1px solid #eed699;border-radius:12px;padding:13px 15px;margin:14px 0}.table-scroll{overflow:auto}table{width:100%;border-collapse:collapse;font-size:.86rem}th,td{padding:10px;border:1px solid var(--line);vertical-align:top;text-align:left}th{background:#eaf3f5}.grid2{display:grid;grid-template-columns:1fr 1fr;gap:14px}.title-row{display:grid;grid-template-columns:110px 1fr;gap:12px;align-items:start;margin:10px 0}.title-row>span{font-size:.78rem;color:var(--muted);padding-top:9px}.footer{color:var(--muted);font-size:.8rem;margin-top:24px;text-align:center}@media(max-width:900px){.layout{display:block}.sidebar{position:relative;height:auto}.main{padding:18px}.grid2{grid-template-columns:1fr}.title-row{grid-template-columns:1fr}.card-head{display:block}}
</style></head><body><div class="layout"><aside class="sidebar"><div class="brand">Weather Content Pack<small>17–22 ตุลาคม 2569 · T1</small></div><div class="nav-title">หัวข้อ A–J</div>${navMain.map(([id,t])=>`<a href="#${id}">${esc(t)}</a>`).join('')}<div class="nav-title">ภาพเพิ่ม 25–28</div>${navImages.map(([id,t])=>`<a class="sub" href="#${id}">${esc(t)}</a>`).join('')}</aside><main class="main"><header class="hero"><div class="eyebrow">กรมอุตุนิยมวิทยา · Upload-only source mode</div><h1>พยากรณ์ 17–22 ตุลาคม 2569</h1><p>ประจำวันที่ 17 ตุลาคม ต่อเนื่องถึง 22 ตุลาคม พร้อมข้อความเตือนจาก Daily และ Seven-day ที่อัปโหลด</p><div class="status-row"><span class="pill">Daily: VERIFIED</span><span class="pill">7-Day: VERIFIED</span><span class="pill">Warning Bulletin: MISSING_UPLOAD</span><span class="pill">22 Image Prompts</span></div></header>${body}<div class="footer">Standalone HTML5 · Offline-ready · Weather facts locked to uploaded files</div></main></div>
<script>
(function () {
  'use strict';
  const COPY_PREFIX = Object.freeze({
    weather: 'Reference source (WEATHER DATA IN CHATGPT): ใช้เฉพาะไฟล์ข้อมูลพยากรณ์ที่ผู้ใช้อัปโหลดและเข้าถึงได้จริงในแชตที่ทำงาน ตามวัน/รอบ/ช่วงเวลาที่กำหนดใน Prompt; ห้ามสมมติว่าเข้าถึงไฟล์แล้วเพียงเพราะระบุชื่อไฟล์.',
    flood: 'Reference source (FLOOD DATA IN CHATGPT): ใช้เฉพาะรายงาน RID/SWOC และไฟล์ข้อมูลน้ำที่เข้าถึงได้จริงตาม Source Lock ของงานนี้; ห้ามสมมติว่าเข้าถึงไฟล์แล้วเพียงเพราะระบุชื่อไฟล์.',
    imageWeather: 'Reference source (IMAGE ASSETS IN CHATGPT): use only image assets actually accessible to this image-generation chat. For branding, the canonical logo PNG files MUST be uploaded directly in this target chat: SanhaTham_Logo_Transparent.png for COVER/THUMBNAIL/FIRST FRAME, and SanhaTham_Logo_Watermark.png for SUMMARY/REGIONAL/INFORMATION graphics. Before generating any requested image, verify the exact required logo file(s). If any required logo is missing or unreadable, STOP_IMAGE_GENERATION and ask the user to upload the missing canonical logo file(s); do not generate any requested image without the required logo, and do not omit, recreate, redraw, substitute, trace, stylize, or hallucinate a logo. ImageCTRHot.png may be used only as style reference and ThaiMap-Region.jpg / ThaiMap-Province.jpg only as map-geometry references when those files are actually accessible. This Reference source line selects image assets only; weather facts remain locked to the validated uploaded weather-data files.',
    imageFlood: 'Reference source (IMAGE ASSETS IN CHATGPT): use only image assets actually accessible to this image-generation chat. For branding, the canonical logo PNG files MUST be uploaded directly in this target chat: SanhaTham_Logo_Transparent.png for COVER/THUMBNAIL/FIRST FRAME, and SanhaTham_Logo_Watermark.png for SUMMARY/INFORMATION/MONITOR BOARD graphics. Before generating any requested image, verify the exact required logo file(s). If any required logo is missing or unreadable, STOP_IMAGE_GENERATION and ask the user to upload the missing canonical logo file(s); do not generate any requested image without the required logo, and do not omit, recreate, redraw, substitute, trace, stylize, or hallucinate a logo. Other flood/map/style assets may be used only when actually accessible. This Reference source line selects image assets only; flood facts remain locked to the validated RID/SWOC source.',
    none: ''
  });
  function getCopyText(target) { if (!target) return ''; const tag=String(target.tagName||'').toUpperCase(); if(tag==='TEXTAREA'||tag==='INPUT') return String(target.value||''); return String(target.textContent||''); }
  function normalizeBody(text) { let value=String(text||'').replace(/^\\uFEFF/,'').replace(/\\r\\n?/g,'\\n'); const lines=value.split('\\n'); while(lines.length&&/^\\s*Reference source\\b/i.test(lines[0])) lines.shift(); while(lines.length&&lines[0].trim()==='') lines.shift(); while(lines.length&&lines[lines.length-1].trim()==='') lines.pop(); return lines.join('\\n'); }
  function legacyCopy(text) { return new Promise(function(resolve){ let textarea=null; const active=document.activeElement; try{ textarea=document.createElement('textarea'); textarea.value=text; textarea.setAttribute('readonly',''); textarea.setAttribute('aria-hidden','true'); textarea.style.position='fixed'; textarea.style.top='0'; textarea.style.left='-9999px'; textarea.style.width='1px'; textarea.style.height='1px'; textarea.style.opacity='0'; document.body.appendChild(textarea); try{textarea.focus({preventScroll:true});}catch(e){textarea.focus();} textarea.select(); textarea.setSelectionRange(0,textarea.value.length); const ok=typeof document.execCommand==='function'&&document.execCommand('copy')===true; resolve(ok);}catch(e){resolve(false);}finally{if(textarea&&textarea.parentNode)textarea.parentNode.removeChild(textarea);if(active&&typeof active.focus==='function'){try{active.focus({preventScroll:true});}catch(e){try{active.focus();}catch(_){}}}}}); }
  async function writeClipboard(text) { try{if(window.isSecureContext&&navigator.clipboard&&typeof navigator.clipboard.writeText==='function'){await navigator.clipboard.writeText(text);return true;}}catch(e){} return legacyCopy(text); }
  function selectForManualCopy(target){try{const tag=String(target.tagName||'').toUpperCase();if(tag==='TEXTAREA'||tag==='INPUT'){target.focus();target.select();return;}const selection=window.getSelection&&window.getSelection();if(!selection||!document.createRange)return;const range=document.createRange();range.selectNodeContents(target);selection.removeAllRanges();selection.addRange(range);}catch(e){}}
  function showFeedback(button,ok){if(!button.dataset.copyOriginalLabel)button.dataset.copyOriginalLabel=button.textContent||'คัดลอก';if(button._copyResetTimer)window.clearTimeout(button._copyResetTimer);button.textContent=ok?'คัดลอกแล้ว ✓':'คัดลอกไม่สำเร็จ — เลือกข้อความไว้ให้แล้ว';button.setAttribute('aria-live','polite');button._copyResetTimer=window.setTimeout(function(){button.textContent=button.dataset.copyOriginalLabel||'คัดลอก';},1800);}
  document.addEventListener('click',function(event){const source=event.target;const button=source&&source.nodeType===1&&typeof source.closest==='function'?source.closest('button[data-copy-target]'):null;if(!button)return;event.preventDefault();const targetId=String(button.getAttribute('data-copy-target')||'').trim();const target=targetId?document.getElementById(targetId):null;if(!target){showFeedback(button,false);return;}const body=normalizeBody(getCopyText(target));if(!body){selectForManualCopy(target);showFeedback(button,false);return;}const kind=String(button.getAttribute('data-copy-kind')||'weather');const prefix=Object.prototype.hasOwnProperty.call(COPY_PREFIX,kind)?COPY_PREFIX[kind]:COPY_PREFIX.weather;const copyValue=prefix?prefix+'\\n'+body:body;writeClipboard(copyValue).then(function(ok){if(!ok)selectForManualCopy(target);showFeedback(button,ok);}).catch(function(){selectForManualCopy(target);showFeedback(button,false);});});
})();
</script></body></html>`;

const outPath = path.join(outDir, 'content_pack.html');
fs.writeFileSync(outPath, html, 'utf8');
console.log(outPath);
