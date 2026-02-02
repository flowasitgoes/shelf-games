/**
 * 整理書櫃 - p5.js 遊戲
 * 9 個書櫃（3×3 排列）× 每櫃 3 格（1×3 排列）= 27 小格，3 種物品（A、B、C）各 9 份，拖放整理成每櫃同類 3 件。
 */

// --- 常數與資料 ---
const GRID_COLS = 3;       // 書櫃排列：每列 3 櫃
const GRID_ROWS = 3;       // 書櫃排列：共 3 列
const NUM_CELLS = GRID_COLS * GRID_ROWS;  // 9 個書櫃
const ITEMS_PER_CELL = 3;  // 每櫃 3 格（小格），共 27 小格
const ITEMS_PER_TYPE = 9;  // A、B、C 各 9 份，共 27 個物品
const SLOTS_GRID_COLS = 3; // 每櫃內 3 格排成 1×3（橫排）
const SLOTS_GRID_ROWS = 1; // 每櫃只有 1 列
// 關卡 0–7: ABC, DEF, GHI, JKL, MNO, PQR, STU, VWX（過關後換成下一關的卡片）
const ITEM_TYPES = [
  { id: 'a', name: 'A', color: [52, 152, 219] },
  { id: 'b', name: 'B', color: [241, 196, 15] },
  { id: 'c', name: 'C', color: [231, 76, 60] },
  { id: 'd', name: 'D', color: [46, 204, 113] },
  { id: 'e', name: 'E', color: [155, 89, 182] },
  { id: 'f', name: 'F', color: [230, 126, 34] },
  { id: 'g', name: 'G', color: [26, 188, 156] },
  { id: 'h', name: 'H', color: [241, 148, 138] },
  { id: 'i', name: 'I', color: [149, 165, 166] },
  { id: 'j', name: 'J', color: [52, 73, 94] },
  { id: 'k', name: 'K', color: [255, 154, 158] },
  { id: 'l', name: 'L', color: [129, 199, 132] },
  { id: 'm', name: 'M', color: [171, 71, 188] },
  { id: 'n', name: 'N', color: [255, 213, 79] },
  { id: 'o', name: 'O', color: [66, 165, 245] },
  { id: 'p', name: 'P', color: [239, 83, 80] },
  { id: 'q', name: 'Q', color: [102, 187, 106] },
  { id: 'r', name: 'R', color: [156, 39, 176] },
  { id: 's', name: 'S', color: [255, 167, 38] },
  { id: 't', name: 'T', color: [0, 188, 212] },
  { id: 'u', name: 'U', color: [233, 30, 99] },
  { id: 'v', name: 'V', color: [76, 175, 80] },
  { id: 'w', name: 'W', color: [255, 235, 59] },
  { id: 'x', name: 'X', color: [121, 85, 72] },
  { id: 'wo', name: '我', color: [233, 30, 99] },
  { id: 'ai', name: '愛', color: [244, 67, 54] },
  { id: 'ni', name: '你', color: [63, 81, 181] },
  { id: 'yin', name: '因', color: [94, 53, 177] },
  { id: 'wei', name: '為', color: [255, 152, 0] },
  { id: 'ni2', name: '你', color: [63, 81, 181] },
  { id: 'ni3', name: '你', color: [69, 90, 100] },
  { id: 'shi', name: '是', color: [205, 220, 57] },
  { id: 'nv', name: '妳', color: [255, 64, 129] },
  { id: 'ke', name: '可', color: [57, 73, 171] },
  { id: 'yi', name: '以', color: [0, 137, 123] },
  { id: 'ma', name: '嗎', color: [255, 87, 34] },
  { id: 'ai2', name: '矮', color: [103, 58, 183] },
  { id: 'you', name: '油', color: [255, 193, 7] },
  { id: 'la', name: '啦', color: [38, 166, 154] },
  { id: 'dang', name: '當', color: [183, 28, 28] },
  { id: 'ran', name: '然', color: [85, 139, 47] },
  { id: 'hao', name: '好', color: [97, 97, 97] },
  { id: 'ni4', name: '你', color: [55, 71, 79] },
  { id: 'zao', name: '早', color: [255, 160, 0] },
  { id: 'shuo', name: '說', color: [2, 119, 189] },
  { id: 'a_zh', name: '阿', color: [142, 36, 170] },
  { id: 'bu', name: '不', color: [211, 47, 47] },
  { id: 'ran2', name: '然', color: [51, 105, 30] },
  { id: 'qin', name: '親', color: [0, 96, 100] },
  { id: 'yi2', name: '一', color: [245, 124, 0] },
  { id: 'ge', name: '個', color: [93, 64, 55] },
  { id: 'wo2', name: '我', color: [194, 24, 91] },
  { id: 'bu2', name: '不', color: [198, 40, 40] },
  { id: 'yao', name: '要', color: [123, 31, 162] },
  { id: 'qin2', name: '親', color: [0, 77, 64] },
  { id: 'liang', name: '兩', color: [251, 192, 45] },
  { id: 'ge2', name: '個', color: [109, 76, 65] },
  { id: 'cai', name: '才', color: [30, 136, 229] },
  { id: 'bu3', name: '不', color: [229, 57, 53] },
  { id: 'yao2', name: '要', color: [106, 27, 154] },
  { id: 'qin3', name: '親', color: [0, 121, 107] },
  { id: 'san', name: '三', color: [255, 202, 40] },
  { id: 'ge3', name: '個', color: [78, 52, 46] },
  { id: 'na', name: '那', color: [62, 39, 35] },
  { id: 'hao2', name: '好', color: [115, 115, 115] },
  { id: 'ba', name: '吧', color: [255, 112, 67] },
  { id: 'av1', name: '①', color: [52, 152, 219] },
  { id: 'av2', name: '②', color: [241, 196, 15] },
  { id: 'av3', name: '③', color: [231, 76, 60] },
  // awe1～awe30 關卡背景：隨機 hue (0–360)，S=45% L=68% 固定
  { id: 'slab1', name: '◇', color: [210, 137, 145] },
  { id: 'slab2', name: '◇', color: [149, 210, 137] },
  { id: 'slab3', name: '◇', color: [137, 210, 203] },
  { id: 'slab4', name: '◇', color: [204, 137, 210] },
  { id: 'slab5', name: '◇', color: [137, 206, 210] },
  { id: 'slab6', name: '◇', color: [137, 210, 143] },
  { id: 'slab7', name: '◇', color: [210, 169, 137] },
  { id: 'slab8', name: '◇', color: [181, 137, 210] },
  { id: 'slab9', name: '◇', color: [210, 137, 138] },
  { id: 'slab10', name: '◇', color: [206, 137, 210] },
  { id: 'slab11', name: '◇', color: [137, 210, 193] },
  { id: 'slab12', name: '◇', color: [210, 137, 160] },
  { id: 'slab13', name: '◇', color: [210, 137, 184] },
  { id: 'slab14', name: '◇', color: [210, 137, 150] },
  { id: 'slab15', name: '◇', color: [137, 154, 210] },
  { id: 'slab16', name: '◇', color: [175, 210, 137] },
  { id: 'slab17', name: '◇', color: [137, 210, 198] },
  { id: 'slab18', name: '◇', color: [149, 210, 137] },
  { id: 'slab19', name: '◇', color: [183, 137, 210] },
  { id: 'slab20', name: '◇', color: [210, 137, 195] },
  { id: 'slab21', name: '◇', color: [137, 145, 210] },
  { id: 'slab22', name: '◇', color: [187, 137, 210] },
  { id: 'slab23', name: '◇', color: [191, 137, 210] },
  { id: 'slab24', name: '◇', color: [137, 143, 210] },
  { id: 'slab25', name: '◇', color: [137, 210, 189] },
  { id: 'slab26', name: '◇', color: [210, 169, 137] },
  { id: 'slab27', name: '◇', color: [140, 210, 137] },
  { id: 'slab28', name: '◇', color: [193, 210, 137] },
  { id: 'slab29', name: '◇', color: [175, 137, 210] },
  { id: 'slab30', name: '◇', color: [210, 181, 137] },
  // awe12～awe30 關卡用（level 34～52，typeIndex 102～158）
  { id: 'slab31', name: '◇', color: [161, 210, 137] },
  { id: 'slab32', name: '◇', color: [210, 165, 137] },
  { id: 'slab33', name: '◇', color: [137, 153, 210] },
  { id: 'slab34', name: '◇', color: [210, 137, 169] },
  { id: 'slab35', name: '◇', color: [137, 210, 143] },
  { id: 'slab36', name: '◇', color: [191, 210, 137] },
  { id: 'slab37', name: '◇', color: [210, 137, 137] },
  { id: 'slab38', name: '◇', color: [143, 137, 210] },
  { id: 'slab39', name: '◇', color: [200, 137, 210] },
  { id: 'slab40', name: '◇', color: [210, 157, 137] },
  { id: 'slab41', name: '◇', color: [137, 167, 210] },
  { id: 'slab42', name: '◇', color: [153, 137, 210] },
  { id: 'slab43', name: '◇', color: [210, 137, 164] },
  { id: 'slab44', name: '◇', color: [210, 153, 137] },
  { id: 'slab45', name: '◇', color: [137, 182, 210] },
  { id: 'slab46', name: '◇', color: [210, 137, 180] },
  { id: 'slab47', name: '◇', color: [137, 171, 210] },
  { id: 'slab48', name: '◇', color: [210, 137, 206] },
  { id: 'slab49', name: '◇', color: [137, 210, 193] },
  { id: 'slab50', name: '◇', color: [169, 210, 137] },
  { id: 'slab51', name: '◇', color: [167, 210, 137] },
  { id: 'slab52', name: '◇', color: [137, 203, 210] },
  { id: 'slab53', name: '◇', color: [160, 137, 210] },
  { id: 'slab54', name: '◇', color: [149, 210, 137] },
  { id: 'slab55', name: '◇', color: [210, 178, 137] },
  { id: 'slab56', name: '◇', color: [210, 137, 200] },
  { id: 'slab57', name: '◇', color: [137, 210, 182] },
  { id: 'slab58', name: '◇', color: [210, 137, 183] },
  { id: 'slab59', name: '◇', color: [210, 200, 137] },
  { id: 'slab60', name: '◇', color: [210, 142, 137] },
  { id: 'slab61', name: '◇', color: [203, 210, 137] },
  { id: 'slab62', name: '◇', color: [177, 137, 210] },
  { id: 'slab63', name: '◇', color: [137, 210, 177] },
  { id: 'slab64', name: '◇', color: [165, 137, 210] },
  { id: 'slab65', name: '◇', color: [137, 210, 180] },
  { id: 'slab66', name: '◇', color: [210, 171, 137] },
  { id: 'slab67', name: '◇', color: [137, 210, 150] },
  { id: 'slab68', name: '◇', color: [210, 137, 146] },
  { id: 'slab69', name: '◇', color: [210, 137, 148] },
  { id: 'slab70', name: '◇', color: [182, 137, 210] },
  { id: 'slab71', name: '◇', color: [151, 210, 137] },
  { id: 'slab72', name: '◇', color: [210, 137, 137] },
  { id: 'slab73', name: '◇', color: [137, 171, 210] },
  { id: 'slab74', name: '◇', color: [210, 205, 137] },
  { id: 'slab75', name: '◇', color: [137, 209, 210] },
  { id: 'slab76', name: '◇', color: [210, 210, 137] },
  { id: 'slab77', name: '◇', color: [208, 137, 210] },
  { id: 'slab78', name: '◇', color: [210, 137, 172] },
  { id: 'slab79', name: '◇', color: [182, 210, 137] },
  { id: 'slab80', name: '◇', color: [181, 137, 210] },
  { id: 'slab81', name: '◇', color: [153, 210, 137] },
  { id: 'slab82', name: '◇', color: [180, 137, 210] },
  { id: 'slab83', name: '◇', color: [210, 137, 155] },
  { id: 'slab84', name: '◇', color: [210, 208, 137] },
  { id: 'slab85', name: '◇', color: [210, 137, 194] },
  { id: 'slab86', name: '◇', color: [210, 137, 160] },
  { id: 'slab87', name: '◇', color: [137, 192, 210] }
].concat((function () {
  // 54～98 關 Avatars：卡片背景色隨機變色邏輯像 1～24 關（每關 3 種各一色，HSL 分散 hue）
  const arr = [];
  const hue2rgb = function (p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  for (let i = 0; i < 135; i++) {
    const h = ((i * 137.5) % 360) / 360;
    const s = 0.45;
    const l = 0.68;
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    const r = hue2rgb(p, q, h + 1 / 3);
    const g = hue2rgb(p, q, h);
    const b = hue2rgb(p, q, h - 1 / 3);
    const level = 54 + Math.floor(i / 3);
    const local = i % 3 + 1;
    arr.push({
      id: 'av' + level + '_' + local,
      name: ['①', '②', '③'][i % 3],
      color: [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
    });
  }
  return arr;
})());
const TYPES_PER_LEVEL = 3;  // 每關 3 種
const NUM_LEVELS = 98;      // 關卡數（…Avatars, awe1～awe30, Avatars 54～98）

// --- 小動物療癒風主題色（暖米/奶油/薄荷/蜜桃）---
const THEME_BG = [250, 245, 235];           // 畫布背景 暖米
const THEME_BG_BOTTOM = [245, 238, 225];    // 漸層底 稍深米
const THEME_SHELF_FRAME = [180, 155, 130];  // 書櫃外框 暖木（備用）
const THEME_SHELF_INNER = [200, 178, 150];  // 書櫃內底（備用）
// 櫃 0～櫃 8 lofi 紫羅蘭＋玻璃感（參考 lg-bg-color / glass-overlay / glass-specular）
const THEME_SHELF_LAVENDER_BORDER = [195, 175, 215];   // 淡淡紫羅蘭邊框（外層與內層一致）
const THEME_SHELF_GLASS_OUTER = [230, 215, 245];       // 外層「環」：偏白紫、高透（對應 lg-bg ~0.25）
const THEME_SHELF_GLASS_INNER = [245, 238, 252];       // 內層卡片：更透明白紫（玻璃感更強）
const THEME_SHELF_GLASS_HIGHLIGHT = [255, 255, 255];   // 玻璃高光（對應 lg-highlight 內緣反光）
const THEME_SHELF_SLOT = [140, 120, 100];   // 格洞
const THEME_SWAP_ZONE = [180, 220, 210];    // 交換區 薄荷綠
const THEME_SWAP_ZONE_BORDER = [140, 185, 175];
const THEME_SWAP_ZONE_TEXT = [50, 80, 75];
const THEME_CONVEYOR = [220, 210, 195];     // 輸送帶 奶油燕麥
const THEME_CONVEYOR_BORDER = [180, 170, 155];
const THEME_CONVEYOR_TEXT = [80, 70, 60];
const THEME_HISTORY_BG = [230, 222, 210];   // 已交換區背景
const THEME_HISTORY_TEXT = [100, 90, 80];   // 已交換區/標題文字
const THEME_HISTORY_TEXT_SOFT = [140, 130, 118];
const THEME_TEXT_SOFT = [120, 110, 100];    // 一般說明 柔灰褐
const THEME_TEXT_DARK = [80, 70, 60];       // 標題/深字 深褐
const THEME_ACCENT = [255, 200, 180];       // 按鈕/高亮 蜜桃
const THEME_ACCENT_BORDER = [230, 175, 155];
const THEME_SEPARATOR = [220, 205, 190];    // 分隔線 柔和
const THEME_OVERLAY = [40, 35, 30];         // 結果遮罩 暖褐 (RGBA 自填 alpha)
const THEME_CELEBRATION_OVERLAY = [60, 50, 45]; // 慶祝遮罩
// 畫布背景圖 + overlay（讓背景圖不要那麼明顯）
let bgImage = null;
const THEME_BG_OVERLAY_ALPHA = 30;         // overlay 不透明度（0～255，愈大背景圖愈淡）

let cells;           // [ [], [], ... ] 共 9 櫃，每櫃 3 格為 { typeIndex, displayX, displayY }[]
let draggedItem;     // { cellIndex, slotIndex, typeIndex, offsetX, offsetY } | null
let dragX, dragY;     // 當前拖動時物品繪製位置（pointer - offset）
let gameState;       // 'idle' | 'playing' | 'completed'
let startTime;
let endTime;
let replayBtn;       // 再玩一次按鈕區域 { x, y, w, h }
let audioCtx = null; // Web Audio 用於拖放音效（首次使用者操作時建立並 resume）
let soundEnabled = false; // 使用者點「開啟音效」後才播放
let soundBarDiv = null;   // 正上方音效按鈕列
const AVATAR_54_98_BG_GRAY = 23; // 54～98 關卡片底色固定 23% 灰階（0%=白、100%=全黑）

// 書櫃佈局：9 櫃排成 3×3，每櫃寬 cellW、高 cellH
let shelfY, shelfH;   // 書櫃區域上緣與總高度（3 列）
let cellW, cellH;    // 每櫃寬度、每櫃高度

// 右上角交換區（兩格、青綠色背景）
const SWAP_ZONE_SLOTS = 2;
let swapZone;         // { x, y, w, h, slotW, slotH, gap } 每格中心由 getSwapZoneSlotCenter 算
let swapHistoryZone;  // 最下面已交換區 { x, y, w, h, pad, lineHeight }
// 輸送帶（關卡預覽）：在已交換區上方，顯示接下來的關卡組
const LEVEL_GROUPS = ['ABC', 'DEF', 'GHI', 'JKL', 'MNO', 'PQR', 'STU', 'VWX', '我愛你', '因為你', '你是妳', '可以嗎', '矮油啦', '當然好', '你早說', '阿不然', '親一個', '我不要', '親兩個', '才不要', '親三個', '那好吧', 'Avatars', 'awe1', 'awe2', 'awe3', 'awe4', 'awe5', 'awe6', 'awe7', 'awe8', 'awe9', 'awe10', 'awe11', 'awe12', 'awe13', 'awe14', 'awe15', 'awe16', 'awe17', 'awe18', 'awe19', 'awe20', 'awe21', 'awe22', 'awe23', 'awe24', 'awe25', 'awe26', 'awe27', 'awe28', 'awe29', 'awe30', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90', '91', '92', '93', '94', '95', '96', '97', '98'];
// 關卡頭像：key = 關卡索引，value = 該關 3 種類型依序的圖片 URL。第 23 關用 avatar_1/2/3.png；54～98 關用 public/avatars/{關卡號}/ 底下 1,2,3 或 4,5,6 或 7,8,9.png
const AVATAR_URLS_BY_LEVEL = (function () {
  const o = { 22: ['/public/avatars/23/avatar_1.png', '/public/avatars/23/avatar_2.png', '/public/avatars/23/avatar_3.png'] };
  for (let L = 53; L <= 97; L++) {
    const folder = L + 1;
    const r = (L - 53) % 3;
    const base = r === 0 ? 1 : r === 1 ? 4 : 7;
    o[L] = ['/public/avatars/' + folder + '/' + base + '.png', '/public/avatars/' + folder + '/' + (base + 1) + '.png', '/public/avatars/' + folder + '/' + (base + 2) + '.png'];
  }
  return o;
})();
let avatarImagesByLevel = {};  // 已載入的 PImage：avatarImagesByLevel[level][localIndex]
// awe1～awe30（第 24～53 關）：從 Font Awesome 隨機選 3 個圖示，已用過的記錄在 localStorage 不重複
const FONT_AWESOME_SLAB_ICONS = ['star', 'heart', 'bolt', 'fire', 'camera', 'music', 'gem', 'snowflake', 'sun', 'moon', 'cloud', 'leaf', 'tree', 'bug', 'cat', 'dog', 'fish', 'feather', 'football', 'basketball', 'baseball', 'chess-knight', 'chess-king', 'chess-queen', 'crown', 'gift', 'bell', 'key', 'lock', 'unlock', 'flag', 'bookmark', 'lightbulb', 'wand-magic-sparkles', 'star-half-stroke', 'thumbs-up', 'hand-point-right', 'circle', 'square', 'triangle', 'hexagon', 'certificate', 'medal', 'trophy', 'anchor', 'umbrella', 'snowman', 'star-of-life', 'magnet', 'flask', 'gear', 'wrench', 'hammer', 'screwdriver-wrench'];
const SLAB_LEVEL_FIRST = 23;   // awe1 的 level index
const SLAB_LEVEL_LAST = 52;   // awe30 的 level index
const LOCAL_STORAGE_KEY_USED_SLAB = 'shelfGame_usedSlabIcons';
// awe1～awe30 關卡圖示清單：存 localStorage，重整後不變、利於快取。版本變更時會重新產生清單
const AWE_LEVEL_ICONS_STORAGE_KEY = 'shelfGame_aweLevelIcons';
const AWE_LEVEL_ICONS_VERSION = 1;
const FONT_AWESOME_SVG_BASE = 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.1/svgs/solid/';
// Font Awesome 圖示填色：預設為多層灰階漸層（黑與白之間）；亦可使用雙色漸層
const SLAB_ICON_GRADIENT_START = '#a500ff';
const SLAB_ICON_GRADIENT_END = '#00ffa5';
// 多層灰階漸層（linear 角度隨機）：白→灰→淺灰→白→淺灰→深灰→灰
const SLAB_ICON_GRADIENT_STOPS = [
  { offset: '0%', color: 'rgb(245,245,245)' },
  { offset: '17%', color: 'rgb(181,181,181)' },
  { offset: '29%', color: 'rgb(168,168,168)' },
  { offset: '45%', color: 'rgb(255,255,255)' },
  { offset: '68%', color: 'rgb(209,209,209)' },
  { offset: '85%', color: 'rgb(115,115,115)' },
  { offset: '100%', color: 'rgb(194,194,194)' }
];
// Platinum 按鈕風格漸層（參考 .button-platinum）：#dedeff / #ffffff / #555564 多層，角度 -72deg
const SLAB_ICON_GRADIENT_STOPS_PLATINUM = [
  { offset: '0%', color: '#dedeff' },
  { offset: '16%', color: '#ffffff' },
  { offset: '21%', color: '#dedeff' },
  { offset: '24%', color: '#ffffff' },
  { offset: '27%', color: '#555564' },
  { offset: '36%', color: '#dedeff' },
  { offset: '45%', color: '#ffffff' },
  { offset: '60%', color: '#ffffff' },
  { offset: '72%', color: '#dedeff' },
  { offset: '80%', color: '#ffffff' },
  { offset: '84%', color: '#dedeff' },
  { offset: '100%', color: '#555564' }
];
const SLAB_ICON_GRADIENT_ANGLE_PLATINUM = -72;  // 參考 .button-platinum；實際使用改為每關隨機角度
// 隨機產生多層灰階漸層 stops（5～7 個色階，在黑與白之間）
function getRandomGrayscaleStops() {
  var count = 5 + Math.floor(Math.random() * 3);
  var stops = [];
  var used = {};
  for (var i = 0; i < count; i++) {
    var offset = Math.floor(Math.random() * 101);
    if (used[offset] !== undefined) continue;
    used[offset] = true;
    stops.push({ offset: offset + '%', gray: Math.floor(Math.random() * 256) });
  }
  stops.sort(function (a, b) { return parseInt(a.offset, 10) - parseInt(b.offset, 10); });
  return stops.map(function (s) { var g = s.gray; return { offset: s.offset, color: 'rgb(' + g + ',' + g + ',' + g + ')' }; });
}
// 隨機產生一組雙色漸層 { start: '#xxx', end: '#xxx' }（HSL 隨機色相）
function getRandomGradient() {
  function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;
    var c = (1 - Math.abs(2 * l - 1)) * s;
    var x = c * (1 - Math.abs((h / 60) % 2 - 1));
    var m = l - c / 2;
    var r = 0, g = 0, b = 0;
    if (h < 60) { r = c; g = x; b = 0; } else if (h < 120) { r = x; g = c; b = 0; } else if (h < 180) { r = 0; g = c; b = x; } else if (h < 240) { r = 0; g = x; b = c; } else if (h < 300) { r = x; g = 0; b = c; } else { r = c; g = 0; b = x; }
    function toHex(n) { var v = Math.round((n + m) * 255); v = Math.max(0, Math.min(255, v)); return (v < 16 ? '0' : '') + v.toString(16); }
    return '#' + toHex(r) + toHex(g) + toHex(b);
  }
  var h1 = Math.floor(Math.random() * 360);
  var h2 = (h1 + 80 + Math.floor(Math.random() * 100)) % 360;
  return { start: hslToHex(h1, 85, 55), end: hslToHex(h2, 85, 55) };
}
// 將 CSS 角度 deg（0=上、90=右、順時針）轉成 SVG linearGradient 的 x1,y1,x2,y2（0～100%）
function linearGradientAngleToSvg(angleDeg) {
  var rad = (angleDeg != null ? angleDeg : 180) * Math.PI / 180;
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var x1 = 50 * (1 - s);
  var y1 = 50 * (1 + c);
  var x2 = 50 * (1 + s);
  var y2 = 50 * (1 - c);
  return { x1: x1 + '%', y1: y1 + '%', x2: x2 + '%', y2: y2 + '%' };
}
// 將 SVG 字串改為使用漸層填色。gradOpt 可為：{ stops, angleDeg } 多層＋角度，或 { start, end } 雙色；或傳 startColor, endColor 雙色。angleDeg 為 CSS 角度（0=上、90=右），省略則 180deg（上到下）
function applySvgLinearGradient(svgText, gradId, startColorOrStops, endColor, angleDeg) {
  if (!gradId) gradId = 'iconGrad';
  var defs;
  var stops = Array.isArray(startColorOrStops) && startColorOrStops.length > 0 && startColorOrStops[0].offset != null && startColorOrStops[0].color != null
    ? startColorOrStops
    : (startColorOrStops && typeof startColorOrStops === 'object' && startColorOrStops.stops) ? startColorOrStops.stops : null;
  var angle = (startColorOrStops && typeof startColorOrStops === 'object' && startColorOrStops.angleDeg != null) ? startColorOrStops.angleDeg : angleDeg;
  var xy = linearGradientAngleToSvg(angle);
  if (stops && stops.length > 0) {
    var stopStr = stops.map(function (s) { return '<stop offset="' + s.offset + '" stop-color="' + s.color + '"/>'; }).join('');
    defs = '<defs><linearGradient id="' + gradId + '" x1="' + xy.x1 + '" y1="' + xy.y1 + '" x2="' + xy.x2 + '" y2="' + xy.y2 + '">' + stopStr + '</linearGradient></defs>';
  } else {
    var start = (startColorOrStops != null && typeof startColorOrStops === 'string' && startColorOrStops !== '') ? startColorOrStops : SLAB_ICON_GRADIENT_START;
    var end = (endColor != null && endColor !== '') ? endColor : SLAB_ICON_GRADIENT_END;
    defs = '<defs><linearGradient id="' + gradId + '" x1="' + xy.x1 + '" y1="' + xy.y1 + '" x2="' + xy.x2 + '" y2="' + xy.y2 + '"><stop offset="0%" stop-color="' + start + '"/><stop offset="100%" stop-color="' + end + '"/></linearGradient></defs>';
  }
  var inserted = svgText.replace(/<svg([^>]*)>/i, '<svg$1>' + defs);
  var filled = inserted.replace(/\bfill="[^"]*"/gi, 'fill="url(#' + gradId + ')"').replace(/\bfill:\s*currentColor\b/gi, 'fill:url(#' + gradId + ')');
  if (filled === inserted) filled = inserted.replace(/<path /i, '<path fill="url(#' + gradId + ')" ');
  return filled;
}
// CDN 載入失敗時用的內嵌 SVG（star、heart、bolt），載入時會套用線性漸層
var SLAB_FALLBACK_SVG_STRINGS;
(function () {
  var star = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.6 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>';
  var heart = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c31.9-29.7 31.9-79.1 0-108.9c-30.9-28.9-80.8-28.9-111.7 0L256 265.2 159.1 191.5c-30.9-28.9-80.8-28.9-111.7 0c-31.9 29.7-31.9 79.1 0 108.9z"/></svg>';
  var bolt = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M349.4 44.6c5.9-13.7 1.5-29.7-10.6-38.5s-28.6-8-39.9-1.8l-128 64C141.2 76.6 128 97.1 128 120v192c0 13.3 10.7 24 24 24h128v96c0 17.7 14.3 32 32 32s32-14.3 32-32V352 120c0-22.9-13.2-43.4-31.5-53.2l128-64c11.3-5.6 24.2-5.4 35.3 .6s16.5 24.8 10.6 38.5z"/></svg>';
  SLAB_FALLBACK_SVG_STRINGS = [star, heart, bolt];
})();
let slabIconNamesByLevel = {};   // key = level index 23..32，value = [name0, name1, name2]（已用圖示會記錄在 localStorage）
let slabImagesByLevel = {};     // key = level index 23..32，value = [img0, img1, img2]
let slabGradientByLevel = {};   // key = level index 23..32，value = { stops: [{offset, color}, ...] } 多層灰階 或 { start, end } 雙色
let slabFallbackTimeoutId = null;
// Font Awesome / 頭像卡片圖示大小倍率（0.92 = 92%）
let slabIconSizeScale = 0.92;
let currentLevel = 0;   // 當前關卡 0–32；過關後換成下一關的卡片
let conveyorZone;       // { x, y, w, h, pad, segmentW } 輸送帶區塊
// 輸送帶「非下一關」的模糊格：依 currentLevel 快取，只在換關時做一次 blur，避免每幀 6 次 filter 傷效能
let conveyorCachedBlur = { level: -1, pg: null };

// 回傳當前關卡使用的 3 個 typeIndex（0=0,1,2；1=3,4,5；2=6,7,8）
function getLevelTypeIndices(level) {
  const base = level * TYPES_PER_LEVEL;
  return [base, base + 1, base + 2];
}

// 依關卡與類型回傳頭像 URL，無則回傳 null（接口：之後可改為從 API 或別處讀取）
function getAvatarUrlForType(level, typeIndex) {
  const levelIndices = getLevelTypeIndices(level);
  const localIndex = levelIndices.indexOf(typeIndex);
  if (localIndex === -1 || !AVATAR_URLS_BY_LEVEL[level] || !AVATAR_URLS_BY_LEVEL[level][localIndex]) return null;
  return AVATAR_URLS_BY_LEVEL[level][localIndex];
}

// 依關卡與類型回傳已載入的頭像 PImage，無或未載入則回傳 null
function getAvatarImageForType(level, typeIndex) {
  const levelIndices = getLevelTypeIndices(level);
  const localIndex = levelIndices.indexOf(typeIndex);
  if (localIndex === -1 || !avatarImagesByLevel[level] || !avatarImagesByLevel[level][localIndex]) return null;
  const img = avatarImagesByLevel[level][localIndex];
  if (img && img.width && img.width > 0) return img;
  return null;
}

// --- 第 24 關 Slab 圖示：從 Font Awesome 隨機選 3 個，已用過的記錄不重複 ---
function getUsedSlabIcons() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_USED_SLAB);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch (e) {
    return [];
  }
}

function addUsedSlabIcons(names) {
  const used = getUsedSlabIcons();
  for (let i = 0; i < names.length; i++) {
    if (used.indexOf(names[i]) === -1) used.push(names[i]);
  }
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_USED_SLAB, JSON.stringify(used));
  } catch (e) {}
}

function clearUsedSlabIcons() {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY_USED_SLAB);
  } catch (e) {}
}

// 從 localStorage 讀取 awe1～awe30 的圖示清單；格式 { version, levels: { "23": ["star","heart","bolt"], ... } }，缺漏或版本不符回傳 null
function getAweLevelIconsFromStorage() {
  try {
    var raw = localStorage.getItem(AWE_LEVEL_ICONS_STORAGE_KEY);
    if (!raw) return null;
    var data = JSON.parse(raw);
    if (!data || data.version !== AWE_LEVEL_ICONS_VERSION || !data.levels) return null;
    var levels = data.levels;
    for (var L = SLAB_LEVEL_FIRST; L <= SLAB_LEVEL_LAST; L++) {
      var arr = levels[String(L)];
      if (!Array.isArray(arr) || arr.length !== 3) return null;
      for (var i = 0; i < 3; i++) {
        if (typeof arr[i] !== 'string' || FONT_AWESOME_SLAB_ICONS.indexOf(arr[i]) === -1) return null;
      }
    }
    return levels;
  } catch (e) {
    return null;
  }
}

// 將 slabIconNamesByLevel（23..52）寫入 localStorage，含版本
function saveAweLevelIconsToStorage() {
  try {
    var levels = {};
    for (var L = SLAB_LEVEL_FIRST; L <= SLAB_LEVEL_LAST; L++) {
      if (slabIconNamesByLevel[L] && Array.isArray(slabIconNamesByLevel[L]) && slabIconNamesByLevel[L].length === 3) {
        levels[String(L)] = slabIconNamesByLevel[L].slice();
      }
    }
    if (Object.keys(levels).length !== SLAB_LEVEL_LAST - SLAB_LEVEL_FIRST + 1) return;
    localStorage.setItem(AWE_LEVEL_ICONS_STORAGE_KEY, JSON.stringify({ version: AWE_LEVEL_ICONS_VERSION, levels: levels }));
  } catch (e) {}
}

// 從 FONT_AWESOME_SLAB_ICONS 中隨機選 3 個不同且尚未用過的圖示；若不足 3 個則清空已用記錄後再選
function pickThreeSlabIcons() {
  const used = getUsedSlabIcons();
  const available = FONT_AWESOME_SLAB_ICONS.filter(function (name) { return used.indexOf(name) === -1; });
  if (available.length < 3) {
    clearUsedSlabIcons();
    return pickThreeSlabIcons();
  }
  shuffle(available, true);
  const chosen = available.slice(0, 3);
  addUsedSlabIcons(chosen);
  return chosen;
}

// 確保單一 awe 關卡（levelIndex 23..52）已開始載入圖示；圖示名稱由 ensureAllSlabLevelsReady 從清單填入，此處只負責載入 SVG
function ensureSlabIconsForLevel(levelIndex) {
  if (slabIconNamesByLevel[levelIndex] == null) return;
  if (slabGradientByLevel[levelIndex] == null) {
    slabGradientByLevel[levelIndex] = { stops: SLAB_ICON_GRADIENT_STOPS_PLATINUM, angleDeg: Math.floor(Math.random() * 360) };
  }
  if (slabImagesByLevel[levelIndex] == null) {
    slabImagesByLevel[levelIndex] = [null, null, null];
  }
  var grad = slabGradientByLevel[levelIndex];
  for (let i = 0; i < 3; i++) {
    (function (j) {
      const name = slabIconNamesByLevel[levelIndex][j];
      const url = FONT_AWESOME_SVG_BASE + name + '.svg';
      const gradId = 'iconGrad_' + levelIndex + '_' + j;
      fetch(url, { mode: 'cors' })
        .then(function (r) { return r.ok ? r.text() : Promise.reject(); })
        .then(function (svgText) {
          var withGradient = grad.stops
            ? applySvgLinearGradient(svgText, gradId, grad)
            : applySvgLinearGradient(svgText, gradId, grad.start, grad.end);
          var blob = new Blob([withGradient], { type: 'image/svg+xml;charset=utf-8' });
          var blobUrl = URL.createObjectURL(blob);
          loadImage(blobUrl, function (img) {
            if (img && slabImagesByLevel[levelIndex] && j >= 0 && j <= 2) slabImagesByLevel[levelIndex][j] = img;
            URL.revokeObjectURL(blobUrl);
          });
        })
        .catch(function () {});
    })(i);
  }
}

// 確保 awe1～awe30 共 30 關都選好圖示並開始載入；清單存 localStorage，重整後不變、利於快取
function ensureAllSlabLevelsReady() {
  var stored = getAweLevelIconsFromStorage();
  if (stored) {
    for (var L = SLAB_LEVEL_FIRST; L <= SLAB_LEVEL_LAST; L++) {
      slabIconNamesByLevel[L] = stored[String(L)].slice();
    }
  } else {
    for (var L = SLAB_LEVEL_FIRST; L <= SLAB_LEVEL_LAST; L++) {
      slabIconNamesByLevel[L] = pickThreeSlabIcons();
    }
    saveAweLevelIconsToStorage();
  }
  for (var L = SLAB_LEVEL_FIRST; L <= SLAB_LEVEL_LAST; L++) {
    ensureSlabIconsForLevel(L);
  }
  if (slabFallbackTimeoutId) clearTimeout(slabFallbackTimeoutId);
  slabFallbackTimeoutId = setTimeout(function () {
    slabFallbackTimeoutId = null;
    for (let L = SLAB_LEVEL_FIRST; L <= SLAB_LEVEL_LAST; L++) {
      if (!slabImagesByLevel[L]) continue;
      for (let k = 0; k < 3; k++) {
        (function (lev, j) {
          const current = slabImagesByLevel[lev][j];
          if (!current || (typeof current.width === 'number' && current.width <= 0)) {
            const rawSvg = SLAB_FALLBACK_SVG_STRINGS[j];
            var grad = slabGradientByLevel[lev] || { stops: SLAB_ICON_GRADIENT_STOPS_PLATINUM, angleDeg: Math.floor(Math.random() * 360) };
            var withGradient = grad.stops
              ? applySvgLinearGradient(rawSvg, 'fallbackGrad_' + lev + '_' + j, grad)
              : applySvgLinearGradient(rawSvg, 'fallbackGrad_' + lev + '_' + j, grad.start, grad.end);
            const dataUri = 'data:image/svg+xml,' + encodeURIComponent(withGradient);
            loadImage(dataUri, function (img) {
              if (img && slabImagesByLevel[lev] && j >= 0 && j <= 2) slabImagesByLevel[lev][j] = img;
            });
          }
        })(L, k);
      }
    }
  }, 2500);
}

// 依類型回傳當前 awe 關卡的圖示 PImage，無或未載入則回傳 null
function getSlabImageForType(typeIndex) {
  if (currentLevel < SLAB_LEVEL_FIRST || currentLevel > SLAB_LEVEL_LAST || !slabIconNamesByLevel[currentLevel]) return null;
  const levelIndices = getLevelTypeIndices(currentLevel);
  const localIndex = levelIndices.indexOf(typeIndex);
  if (localIndex < 0 || localIndex > 2 || !slabImagesByLevel[currentLevel][localIndex]) return null;
  const img = slabImagesByLevel[currentLevel][localIndex];
  if (img && (typeof img.width !== 'number' || img.width > 0)) return img;
  return null;
}

// --- 拖放音效（Web Audio 合成，無需音檔）---
function getAudioContext() {
  if (audioCtx === null) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

// 依關卡回傳 pitch 倍率（每關略不同，同關內一致）
function getLevelPitchMultiplier(level) {
  if (level == null) level = typeof currentLevel !== 'undefined' ? currentLevel : 0;
  return 0.96 + ((level * 31 + 7) % 9) / 100;
}

function pitchFreq(baseFreq, level) {
  return Math.round(baseFreq * getLevelPitchMultiplier(level));
}

function playTone(freq, durationSeconds, type, volume) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    function playNow() {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = type || 'sine';
      gain.gain.setValueAtTime(volume != null ? volume : 0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationSeconds);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + durationSeconds);
    }
    if (ctx.state === 'suspended') {
      ctx.resume().then(playNow).catch(function () { playNow(); });
    } else {
      playNow();
    }
  } catch (e) {
    if (typeof console !== 'undefined' && console.warn) console.warn('playTone:', e);
  }
}

function playPadChord(freq, durationSeconds, volume) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    function playNow() {
      const t0 = ctx.currentTime;
      const decay = durationSeconds;
      function addVoice(f, vol, type) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = f;
        osc.type = type || 'sine';
        gain.gain.setValueAtTime(vol, t0);
        gain.gain.exponentialRampToValueAtTime(0.001, t0 + decay);
        osc.start(t0);
        osc.stop(t0 + decay);
      }
      const v = volume != null ? volume : 0.08;
      addVoice(freq, v * 0.5, 'sine');
      addVoice(freq * 1.498, v * 0.35, 'sine');
      addVoice(freq * 2, v * 0.25, 'sine');
      addVoice(freq * 2.003, v * 0.2, 'sine');
    }
    if (ctx.state === 'suspended') ctx.resume().then(playNow).catch(function () { playNow(); });
    else playNow();
  } catch (e) {
    if (typeof console !== 'undefined' && console.warn) console.warn('playPadChord:', e);
  }
}

function playDragStartSound() {
  const f = pitchFreq(520);
  playTone(f, 0.07, 'sine', 0.12);
  playPadChord(f, 0.12, 0.07);
}

function playDropSuccessSound() {
  const f = pitchFreq(280);
  playTone(f, 0.12, 'sine', 0.15);
  playPadChord(f, 0.2, 0.09);
}

function playDropCancelSound() {
  const f = pitchFreq(180);
  playTone(f, 0.06, 'sine', 0.08);
  playPadChord(f, 0.1, 0.05);
}

// 拖曳時滑過其他卡片（思考是否要 drop）— 可愛療癒、略帶「選過」的輕柔音效
function playDragHoverSound() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    const f0 = pitchFreq(255);   // 低頻基音，稍微低一點
    const f1 = pitchFreq(370);   // 主音（溫暖中音）
    const f2 = pitchFreq(480);   // 高一點的和音
    function playNow() {
      const t0 = ctx.currentTime;
      const dur = 0.07;
      const vol = 0.068;
      const attack = 0.012;   // 稍長起音，更圓潤
      const osc0 = ctx.createOscillator();
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain0 = ctx.createGain();
      const gain1 = ctx.createGain();
      const gain2 = ctx.createGain();
      osc0.type = 'triangle';  // 三角形波較圓潤
      osc1.type = 'triangle';  // 主音也用 triangle，更圓潤
      osc2.type = 'sine';
      osc0.frequency.value = f0;
      osc1.frequency.value = f1;
      osc2.frequency.value = f2;
      gain0.gain.setValueAtTime(0.001, t0);
      gain0.gain.linearRampToValueAtTime(vol * 0.65, t0 + attack);
      gain0.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
      gain1.gain.setValueAtTime(0.001, t0);
      gain1.gain.linearRampToValueAtTime(vol, t0 + attack);
      gain1.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
      gain2.gain.setValueAtTime(0.001, t0 + 0.012);
      gain2.gain.linearRampToValueAtTime(vol * 0.4, t0 + 0.012 + attack);
      gain2.gain.exponentialRampToValueAtTime(0.001, t0 + dur * 0.88);
      osc0.connect(gain0);
      gain0.connect(ctx.destination);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc0.start(t0);
      osc1.start(t0);
      osc2.start(t0 + 0.012);
      osc0.stop(t0 + dur);
      osc1.stop(t0 + dur);
      osc2.stop(t0 + dur);
    }
    if (ctx.state === 'suspended') ctx.resume().then(playNow).catch(function () { playNow(); });
    else playNow();
  } catch (e) {
    if (typeof console !== 'undefined' && console.warn) console.warn('playDragHoverSound:', e);
  }
}

function playLevelCompleteSound() {
  if (!soundEnabled) return;
  const L = typeof currentLevel !== 'undefined' ? currentLevel : 0;
  const c5 = pitchFreq(523, L);
  const e5 = pitchFreq(659, L);
  const g5 = pitchFreq(784, L);
  const c6 = pitchFreq(1047, L);
  playTone(c5, 0.14, 'sine', 0.14);
  playPadChord(c5, 0.22, 0.08);
  setTimeout(function () {
    playTone(e5, 0.14, 'sine', 0.14);
    playPadChord(e5, 0.22, 0.08);
  }, 100);
  setTimeout(function () {
    playTone(g5, 0.16, 'sine', 0.15);
    playPadChord(g5, 0.26, 0.09);
  }, 220);
  setTimeout(function () {
    playTone(c6, 0.35, 'sine', 0.16);
    playPadChord(c6, 0.4, 0.1);
  }, 360);
  setTimeout(function () {
    playTone(c6, 0.08, 'sine', 0.12);
    playTone(pitchFreq(1319, L), 0.08, 'sine', 0.1);
  }, 520);
  playFirecrackerSound();
}

function playFirecrackerPop(vol, durationSec) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    const dur = durationSec != null ? durationSec : 0.035 + Math.random() * 0.02;
    function playNow() {
      const sampleRate = ctx.sampleRate;
      const frameCount = Math.round(sampleRate * dur);
      const buffer = ctx.createBuffer(1, frameCount, sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < frameCount; i++) {
        const decay = 1 - (i / frameCount) * (i / frameCount);
        data[i] = (Math.random() * 2 - 1) * decay;
      }
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(vol != null ? vol : 0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      src.connect(gain);
      gain.connect(ctx.destination);
      src.start(ctx.currentTime);
      src.stop(ctx.currentTime + dur);
    }
    if (ctx.state === 'suspended') ctx.resume().then(playNow).catch(function () { playNow(); });
    else playNow();
  } catch (e) {
    if (typeof console !== 'undefined' && console.warn) console.warn('playFirecrackerPop:', e);
  }
}

function playFirecrackerSound() {
  if (!soundEnabled) return;
  let t = 0;
  for (let i = 0; i < 7; i++) {
    t += 28 + Math.random() * 22;
    (function (tt, v) {
      setTimeout(function () { playFirecrackerPop(v, 0.028 + Math.random() * 0.018); }, tt);
    })(t, 0.18 + Math.random() * 0.12);
  }
  t += 90 + Math.random() * 40;
  for (let j = 0; j < 10; j++) {
    t += 38 + Math.random() * 45;
    (function (tt, v) {
      setTimeout(function () { playFirecrackerPop(v, 0.032 + Math.random() * 0.02); }, tt);
    })(t, 0.12 + Math.random() * 0.15);
  }
}

// --- Debug ---
let DEBUG = true;     // 按 D 鍵切換
let lastReleaseLog = null;  // { targetCell, placed, px, py, cellCounts }
// 拖曳時滑過哪個物品（該格會亮外框）
let hoverTargetItem = null;  // { cellIndex, slotIndex } | null
let prevHoverTargetItem = null;  // 上一 frame 的 hover，用來偵測變化

// 27 格狀態歷史：每格 = cell*ITEMS_PER_CELL+slot，值 = typeIndex(0A1B2C) 或 -1 空
const SLOTS_TOTAL = NUM_CELLS * ITEMS_PER_CELL;  // 27
let stateHistory = [];   // [ { step, label, state: [9] } ]
let historyStep = 0;     // 每次 init 或 成功放置 會 +1
let highlightLog = [];   // [ { step, millis, cellIndex, slotIndex, reason } ]
const STATE_HISTORY_MAX = 30;
const HIGHLIGHT_LOG_MAX = 50;
const SWAP_HISTORY_MAX = 12;   // 已交換區顯示筆數
let swapHistory = [];          // [ { from: { cell, slot }, to: { cell, slot } } ]
// 過關恭喜特效（彩帶＋貓走過）：過場時顯示約 3 秒，結束後才切下一關
const CELEBRATION_DURATION_MS = 3000;
const CONFETTI_COUNT = 80;
let levelCompleteCelebration = null;  // { active, startedAt, duration, completedLevel, particles[] } | null

// --- 拖曳／放置動畫（主機遊戲感）---
let dragOrbitPhase = 0;   // 拖曳時軌道星球旋轉相位（每幀累加）
const DRAG_ORBIT_SPEED = 0.08;
const DROP_ANIMATION_DURATION_MS = 420;  // 放下時旋轉一圈＋飛行的時長
let dropAnimation = null; // { startTime, startX, startY, endX, endY, typeIndex, placed, srcCell, srcSlot, targetCell, swapSlot, doSwap } 放開後飛行＋旋轉，結束時再執行實際放置
// 效能：手機／低階裝置可設 true，減少粒子與 shadowBlur 以換取流暢度
const ANIMATION_LITE = typeof navigator !== 'undefined' && (navigator.maxTouchPoints > 0 || (typeof window !== 'undefined' && window.innerWidth < 640));
const DEBUG_PANEL_WIDTH = 280;
let debugPanelEl = null;
let gameCanvasWrapper = null;
let erikaCelebrationWrap = null;  // 過場時顯示的えりか風格 CSS 角色（走路動畫）

// 彩帶粒子：從畫面上方噴出、落下，帶旋轉與隨機顏色
function createConfettiParticles() {
  const particles = [];
  const colors = [
    [255, 220, 200], [200, 235, 220], [255, 235, 210], [220, 240, 200],
    [255, 215, 180], [230, 245, 230], [255, 230, 220], [240, 220, 200],
    [210, 230, 220], [255, 225, 195], [220, 235, 210], [250, 235, 215]
  ];
  const cx = width / 2;
  const topY = height * 0.15;
  for (let i = 0; i < CONFETTI_COUNT; i++) {
    const angle = -PI / 2 + random(-0.6, 0.6);
    const speed = random(4, 12);
    particles.push({
      x: cx + random(-width * 0.4, width * 0.4),
      y: topY + random(-20, 40),
      vx: cos(angle) * speed + random(-2, 2),
      vy: sin(angle) * speed + random(0, 4),
      color: colors[floor(random(colors.length))],
      size: random(6, 14),
      rotation: random(TWO_PI),
      rotationSpeed: random(-0.15, 0.15),
      shape: random() < 0.7 ? 'rect' : 'circle'
    });
  }
  return particles;
}

function updateAndDrawConfetti() {
  if (!levelCompleteCelebration || !levelCompleteCelebration.particles) return;
  const t = millis() - levelCompleteCelebration.startedAt;
  const duration = levelCompleteCelebration.duration;
  const progress = t / duration;
  const gravity = 0.35;
  const particles = levelCompleteCelebration.particles;

  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += gravity;
    p.rotation += p.rotationSpeed;
    p.vx *= 0.99;
    p.vy *= 0.99;
    push();
    fill(p.color[0], p.color[1], p.color[2], 255 * (1 - progress * 0.7));
    noStroke();
    translate(p.x, p.y);
    rotate(p.rotation);
    if (p.shape === 'rect') {
      rect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
    } else {
      circle(0, 0, p.size);
    }
    pop();
  }
}

// 貓走過的動畫（Nyan Cat 風格）：彩虹尾＋吐司身體＋貓臉，自左向右移動並輕微上下晃動
function drawNyanCatCelebration(progress) {
  const catW = Math.min(120, width * 0.28);
  const catH = catW * (167 / 283);
  const trailW = catW * 1.8;
  const baseY = height * 0.52 + sin(progress * PI * 6) * 6;
  const startX = -trailW - catW * 0.25;  // 再早一點跑：起點往右，貓更早進畫面
  const endX = width + catW * 0.6;
  const x = lerp(startX, endX, easeInOutQuad(progress));
  const wx = catW / 34.3;
  const hx = catH / 20;

  push();
  translate(x, baseY);

  // 彩虹尾（在貓身體左側，橫條紋）
  const rainbowColors = [
    [231, 76, 60], [230, 126, 34], [241, 196, 15],
    [46, 204, 113], [52, 152, 219], [142, 68, 173]
  ];
  const stripeH = (catH * 0.35) / 6;
  noStroke();
  for (let i = 0; i < 6; i++) {
    fill(rainbowColors[i][0], rainbowColors[i][1], rainbowColors[i][2]);
    rect(-trailW - catW * 0.5, -catH / 2 + i * stripeH, trailW + catW * 0.5, stripeH + 1);
  }

  // 吐司身體（圓角矩形、粉紅糖霜）
  fill(255, 105, 180);  // hotpink
  rect(-catW * 0.32, -catH * 0.45, catW * 0.65, catH * 0.75, 6);
  // 糖霜上的小點（sprinkles）
  fill(200, 60, 130);
  const sprinkles = [
    [2 * wx, 3 * hx], [8 * wx, 2 * hx], [11 * wx, 2 * hx], [15 * wx, 4 * hx],
    [6 * wx, 5 * hx], [4 * wx, 6.5 * hx], [2 * wx, 9 * hx], [8 * wx, 8 * hx],
    [6 * wx, 11 * hx], [3 * wx, 13 * hx], [9 * wx, 12 * hx]
  ];
  for (const [sx, sy] of sprinkles) {
    rect(-catW * 0.32 + sx, -catH * 0.45 + sy, 4, 4);
  }

  // 貓頭（右側）：臉橢圓＋耳朵＋眼睛＋鬍鬚
  translate(catW * 0.22, 0);
  fill(255, 220, 180);
  noStroke();
  ellipse(0, -catH * 0.08, catW * 0.35, catH * 0.5);
  fill(255, 105, 180);
  triangle(-catW * 0.08, -catH * 0.45, -catW * 0.02, -catH * 0.7, catW * 0.04, -catH * 0.45);
  triangle(catW * 0.08, -catH * 0.45, catW * 0.02, -catH * 0.7, -catW * 0.04, -catH * 0.45);
  fill(40, 30, 20);
  ellipse(-catW * 0.06, -catH * 0.12, 5, 6);
  ellipse(catW * 0.06, -catH * 0.12, 5, 6);
  fill(255);
  ellipse(-catW * 0.055, -catH * 0.14, 2, 2);
  ellipse(catW * 0.065, -catH * 0.14, 2, 2);
  stroke(80, 60, 50);
  strokeWeight(1);
  line(catW * 0.12, -catH * 0.05, catW * 0.22, -catH * 0.08);
  line(catW * 0.12, -catH * 0.02, catW * 0.22, -catH * 0.02);
  line(catW * 0.12, catH * 0.01, catW * 0.22, catH * 0.04);
  noStroke();

  pop();
}

function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function drawLevelCompleteCelebrationOverlay() {
  if (!levelCompleteCelebration || !levelCompleteCelebration.active) return;
  const t = millis() - levelCompleteCelebration.startedAt;
  const duration = levelCompleteCelebration.duration;
  const progress = Math.min(1, t / duration);

  push();
  fill(THEME_CELEBRATION_OVERLAY[0], THEME_CELEBRATION_OVERLAY[1], THEME_CELEBRATION_OVERLAY[2], 140);
  noStroke();
  rect(0, 0, width, height);
  fill(255, 248, 235);
  textAlign(CENTER, CENTER);
  textSize(Math.min(42, width * 0.1));
  text('恭喜過關！', width / 2, height * 0.28);
  const groupName = LEVEL_GROUPS[levelCompleteCelebration.completedLevel] || '—';
  textSize(Math.min(24, width * 0.055));
  fill(255, 230, 200);
  text(groupName + ' 完成', width / 2, height * 0.36);
  pop();

  updateAndDrawConfetti();
  drawNyanCatCelebration(progress);
}

function getGameCanvasSize() {
  return { w: windowWidth, h: windowHeight };
}

function enableSound() {
  soundEnabled = true;
  try {
    const ctx = getAudioContext();
    const onReady = function () {
      playTone(440, 0.1, 'sine', 0.12);
      if (soundBarDiv && soundBarDiv.elt) {
        const btn = soundBarDiv.elt.querySelector('button');
        if (btn) {
          btn.textContent = '🔊';
          btn.disabled = false;
          btn.style.opacity = '1';
        }
      }
    };
    if (ctx.state === 'suspended') {
      ctx.resume().then(onReady).catch(function (e) {
        if (typeof console !== 'undefined' && console.warn) console.warn('enableSound resume:', e);
        onReady();
      });
    } else {
      onReady();
    }
  } catch (e) {
    if (typeof console !== 'undefined' && console.warn) console.warn('enableSound:', e);
  }
}

function preload() {
  for (const level in AVATAR_URLS_BY_LEVEL) {
    const urls = AVATAR_URLS_BY_LEVEL[level];
    avatarImagesByLevel[level] = [];
    for (let i = 0; i < urls.length; i++) {
      avatarImagesByLevel[level][i] = loadImage(urls[i]);
    }
  }
  bgImage = loadImage('public/background-theme.png');
}

function setup() {
  const size = getGameCanvasSize();
  const soundAndCanvas = createDiv('');
  soundAndCanvas.class('sound-and-canvas-wrapper');
  soundAndCanvas.parent('game-container');

  soundBarDiv = createDiv('');
  soundBarDiv.class('sound-bar');
  soundBarDiv.parent(soundAndCanvas);

  const btn = createButton('🔇');
  btn.class('sound-toggle-btn');
  btn.parent(soundBarDiv);
  btn.elt.addEventListener('click', function () {
    if (soundEnabled) {
      soundEnabled = false;
      btn.elt.textContent = '🔇';
      btn.elt.style.opacity = '1';
      btn.elt.disabled = false;
    } else {
      enableSound();
    }
  });

  // 邊框參數 UI（weave 風格，可即時調整 #game-container 邊框）- 已關閉
  // (function () {
  //   const gc = document.getElementById('game-container');
  //   if (!gc) return;
  //   const wrap = createDiv('');
  //   wrap.class('border-params-wrap');
  //   wrap.parent(soundBarDiv);

  //   function addParamRow(label, key, min, max, initial, unit, step) {
  //     const row = createDiv('');
  //     row.class('param-row');
  //     row.parent(wrap);
  //     const labelSpan = createSpan(label);
  //     labelSpan.parent(row);
  //     const slider = createSlider(min, max, initial, step || 1);
  //     slider.parent(row);
  //     const valueSpan = createSpan(String(initial) + (unit || ''));
  //     valueSpan.class('param-value');
  //     valueSpan.parent(row);
  //     function apply() {
  //       const v = slider.value();
  //       valueSpan.elt.textContent = String(typeof v === 'number' ? (step === 1 ? Math.round(v) : v) : v) + (unit || '');
  //       if (key === 'line') gc.style.setProperty('--game-border-line', v + 'px');
  //       else if (key === 'size') gc.style.setProperty('--game-border-size', v + 'px');
  //       else if (key === 'rotateBefore') gc.style.setProperty('--game-border-rotate-before', String(v));
  //       else if (key === 'rotateAfter') gc.style.setProperty('--game-border-rotate-after', String(v));
  //       else if (key === 'radiusDivisor') gc.style.setProperty('--game-border-radius-divisor', String(v));
  //     }
  //     slider.elt.addEventListener('input', apply);
  //     return { slider, valueSpan, apply };
  //   }

  //   addParamRow('線粗', 'line', 2, 12, 5, 'px', 1);
  //   addParamRow('星形', 'size', 12, 48, 27, 'px', 1);
  //   addParamRow('旋轉前', 'rotateBefore', 0, 360, 180, '°', 1);
  //   addParamRow('旋轉後', 'rotateAfter', 0, 360, 270, '°', 1);
  //   addParamRow('圓角', 'radiusDivisor', 2, 6, 2, '', 1);
  // })();

  // 54～98 關卡片底色灰階測試 UI（已關閉，改為固定 23% 灰階）
  // const grayWrap = createDiv('');
  // grayWrap.class('avatar-bg-gray-wrap');
  // grayWrap.parent(soundBarDiv);
  // const grayLabel = createSpan('灰階 0~100%');
  // grayLabel.parent(grayWrap);
  // const graySlider = createSlider(0, 100, 0, 1);
  // graySlider.class('avatar-bg-gray-slider');
  // graySlider.parent(grayWrap);
  // const grayValue = createSpan('0%');
  // grayValue.class('avatar-bg-gray-value');
  // grayValue.parent(grayWrap);
  // graySlider.elt.addEventListener('input', function () {
  //   avatar5498BgGray = parseFloat(graySlider.value());
  //   grayValue.elt.textContent = Math.round(avatar5498BgGray) + '%';
  // });

  // 圖示大小 UI 暫時不需要，先 comment 掉
  // (function () {
  //   try {
  //     var v = localStorage.getItem(SLAB_ICON_SIZE_STORAGE_KEY);
  //     if (v != null) { var n = parseFloat(v); if (!isNaN(n) && n >= 0.3 && n <= 2) slabIconSizeScale = n; }
  //   } catch (e) {}
  // })();
  // const iconSizeWrap = createDiv('');
  // iconSizeWrap.class('icon-size-wrap');
  // iconSizeWrap.parent(soundBarDiv);
  // const iconSizeLabel = createSpan('圖示大小');
  // iconSizeLabel.parent(iconSizeWrap);
  // const iconSizeSlider = createSlider(0.3, 2, slabIconSizeScale, 0.05);
  // iconSizeSlider.class('icon-size-slider');
  // iconSizeSlider.parent(iconSizeWrap);
  // const iconSizeValue = createSpan(Math.round(slabIconSizeScale * 100) + '%');
  // iconSizeValue.class('icon-size-value');
  // iconSizeValue.parent(iconSizeWrap);
  // iconSizeSlider.elt.addEventListener('input', function () {
  //   slabIconSizeScale = parseFloat(iconSizeSlider.value());
  //   iconSizeValue.elt.textContent = Math.round(slabIconSizeScale * 100) + '%';
  //   try { localStorage.setItem(SLAB_ICON_SIZE_STORAGE_KEY, String(slabIconSizeScale)); } catch (e) {}
  // });

  gameCanvasWrapper = createDiv('');
  gameCanvasWrapper.class('game-canvas-wrapper');
  gameCanvasWrapper.parent(soundAndCanvas);

  const cnv = createCanvas(size.w, size.h);
  cnv.parent(gameCanvasWrapper);
  cnv.style('display', 'block');
  cnv.elt.setAttribute('touch-action', 'none');

  computeLayout();
  initGame();
  ensureAllSlabLevelsReady();

  // Debug 改為 console 輸出，不再顯示右側黑屏
  debugPanelEl = createDiv('');
  debugPanelEl.id('debug-panel');
  debugPanelEl.parent('game-container');
  debugPanelEl.hide();

  // 在 canvas 外放開時也要觸發 release（轉成 canvas 座標）
  document.addEventListener('mouseup', onGlobalMouseUp);
  document.addEventListener('touchend', onGlobalTouchEnd, { passive: false });
}

function canvasCoordsFromEvent(e) {
  const cnv = document.querySelector('canvas');
  if (!cnv) return [mouseX, mouseY];
  const r = cnv.getBoundingClientRect();
  const scaleX = cnv.width / r.width;
  const scaleY = cnv.height / r.height;
  const clientX = e.clientX != null ? e.clientX : (e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientX : 0);
  const clientY = e.clientY != null ? e.clientY : (e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientY : 0);
  const x = (clientX - r.left) * scaleX;
  const y = (clientY - r.top) * scaleY;
  return [x, y];
}

function onGlobalMouseUp(e) {
  if (draggedItem === null) return;
  // 用拖曳時最後的 pointer 位置當放開點，避免 document 事件座標與 canvas 不一致
  pointerReleased(dragX + draggedItem.offsetX, dragY + draggedItem.offsetY);
}

function onGlobalTouchEnd(e) {
  if (draggedItem === null) return;
  pointerReleased(dragX + draggedItem.offsetX, dragY + draggedItem.offsetY);
  e.preventDefault();
}

function windowResized() {
  const size = getGameCanvasSize();
  resizeCanvas(size.w, size.h);
  computeLayout();
  updateItemPositions();
}

function computeLayout() {
  // 9 櫃排成 3×3：每櫃寬、每櫃高
  cellW = width / GRID_COLS;
  shelfH = height * 0.55;
  shelfY = height * 0.22;
  cellH = shelfH / GRID_ROWS;
  // 右上角交換區：寬約 26% 畫布，高約 18%，內有兩格 —— 已註解
  const margin = Math.min(width * 0.02, 12);
  // const zoneW = width * 0.26;
  // const zoneH = height * 0.18;
  // swapZone = {
  //   x: width - zoneW - margin,
  //   y: margin,
  //   w: zoneW,
  //   h: zoneH,
  //   gap: Math.min(10, zoneW * 0.08),
  //   pad: Math.min(12, zoneW * 0.06)
  // };
  // const innerW = swapZone.w - 2 * swapZone.pad;
  // swapZone.slotW = (innerW - swapZone.gap) / SWAP_ZONE_SLOTS;
  // swapZone.slotH = swapZone.h - 2 * swapZone.pad;

  // 最下面：已交換區（顯示實際發生過的交換）—— 已註解
  // const historyZoneH = Math.min(height * 0.14, 80);
  const conveyorGap = 8;
  const conveyorH = Math.min(height * 0.1, 56);
  // swapHistoryZone = {
  //   x: margin,
  //   y: height - historyZoneH - margin,
  //   w: width - 2 * margin,
  //   h: historyZoneH,
  //   pad: 8,
  //   lineHeight: 18
  // };
  // 輸送帶：在已交換區上方，顯示接下來的關卡組（含 JKL, MNO, PQR, STU, VWX）
  const conveyorLabelW = 52;
  const conveyorSegmentCount = 7;  // 一次顯示接下來 7 關
  conveyorZone = {
    x: margin,
    y: height - conveyorH - margin - conveyorGap,  // 已交換區註解後，輸送帶貼底
    w: width - 2 * margin,
    h: conveyorH,
    pad: 10,
    labelWidth: conveyorLabelW,
    segmentCount: conveyorSegmentCount,
    gap: 8
  };
  conveyorZone.segmentW = (conveyorZone.w - 2 * conveyorZone.pad - conveyorZone.labelWidth - (conveyorZone.segmentCount - 1) * conveyorZone.gap) / conveyorZone.segmentCount;
}

function getSwapZoneSlotCenter(slotIndex) {
  if (!swapZone || slotIndex < 0 || slotIndex >= SWAP_ZONE_SLOTS) return null;
  const cx = swapZone.x + swapZone.pad + slotIndex * (swapZone.slotW + swapZone.gap) + swapZone.slotW / 2;
  const cy = swapZone.y + swapZone.pad + swapZone.slotH / 2;
  return { x: cx, y: cy };
}

// 載入指定關卡：該關的 3 種卡片（ABC / DEF / GHI）各 9 個，隨機分到 9 櫃
function initLevel(level) {
  draggedItem = null;
  dropAnimation = null;
  stateHistory = [];
  highlightLog = [];
  swapHistory = [];
  historyStep = 0;
  prevHoverTargetItem = null;

  const levelIndices = getLevelTypeIndices(level);
  const allItems = [];
  for (let i = 0; i < levelIndices.length; i++) {
    const t = levelIndices[i];
    for (let j = 0; j < ITEMS_PER_TYPE; j++) {
      allItems.push({ typeIndex: t });
    }
  }
  shuffle(allItems, true);

  cells = [];
  for (let i = 0; i < NUM_CELLS; i++) cells.push([]);
  for (let i = 0; i < allItems.length; i++) {
    const cellIndex = i % NUM_CELLS;
    cells[cellIndex].push({ typeIndex: allItems[i].typeIndex, displayX: 0, displayY: 0 });
  }
  updateItemPositions();
  pushStateToHistory('init');
}

function initGame() {
  gameState = 'idle';
  startTime = null;
  endTime = null;
  currentLevel = 0;  // 新局從第一關 ABC 開始
  initLevel(currentLevel);
  setReplayButtonRect();
}

// 把目前 cells 壓成 27 格狀態：slot = cell*ITEMS_PER_CELL + slotInCell，值 = typeIndex 或 -1
function getCurrentState() {
  const state = [];
  for (let c = 0; c < NUM_CELLS; c++) {
    for (let s = 0; s < ITEMS_PER_CELL; s++) {
      state.push(s < cells[c].length ? cells[c][s].typeIndex : -1);
    }
  }
  return state;
}

function pushStateToHistory(label) {
  const state = getCurrentState();
  stateHistory.push({ step: historyStep, label: label, state: state.slice() });
  if (stateHistory.length > STATE_HISTORY_MAX) stateHistory.shift();
  if (DEBUG) console.log('[stateHistory] step=' + historyStep + ' label=' + label + ' state=' + JSON.stringify(state));
  historyStep++;
}

function pushHighlightLog(cellIndex, slotIndex, reason) {
  const slot = cellIndex * ITEMS_PER_CELL + slotIndex;
  highlightLog.push({
    step: historyStep,
    millis: millis(),
    cellIndex: cellIndex,
    slotIndex: slotIndex,
    slot: slot,
    reason: reason
  });
  if (highlightLog.length > HIGHLIGHT_LOG_MAX) highlightLog.shift();
  if (DEBUG) console.log('[highlightLog] slot=' + slot + ' C' + cellIndex + 'S' + slotIndex + ' reason=' + reason);
}

function updateItemPositions() {
  const pad = 10;
  const gap = 6;
  const slotW = (cellW - 2 * pad - (SLOTS_GRID_COLS - 1) * gap) / SLOTS_GRID_COLS;
  const slotH = (cellH - 2 * pad - (SLOTS_GRID_ROWS - 1) * gap) / SLOTS_GRID_ROWS;
  for (let c = 0; c < NUM_CELLS; c++) {
    const list = cells[c];
    const cellCol = c % GRID_COLS;
    const cellRow = floor(c / GRID_COLS);
    const baseX = cellCol * cellW + pad;
    const baseY = shelfY + cellRow * cellH + pad;
    for (let s = 0; s < list.length; s++) {
      const col = s % SLOTS_GRID_COLS;
      const row = floor(s / SLOTS_GRID_COLS);
      list[s].displayX = baseX + col * (slotW + gap) + slotW / 2;
      list[s].displayY = baseY + row * (slotH + gap) + slotH / 2;
    }
  }
}

function setReplayButtonRect() {
  const btnW = width * 0.35;
  const btnH = height * 0.08;
  replayBtn = {
    x: (width - btnW) / 2,
    y: height * 0.62,
    w: btnW,
    h: btnH
  };
}

function drawThemeBackground() {
  if (bgImage && bgImage.width > 0) {
    // 背景圖 cover：等比例縮放填滿畫布，置中
    const imgW = bgImage.width;
    const imgH = bgImage.height;
    const scale = max(width / imgW, height / imgH);
    const drawW = imgW * scale;
    const drawH = imgH * scale;
    image(bgImage, (width - drawW) / 2, (height - drawH) / 2, drawW, drawH);
    // overlay：半透明暖米色，讓背景圖不要那麼明顯
    noStroke();
    fill(THEME_BG[0], THEME_BG[1], THEME_BG[2], THEME_BG_OVERLAY_ALPHA);
    rect(0, 0, width, height);
  } else {
    const ctx = drawingContext;
    const g = ctx.createLinearGradient(0, 0, 0, height);
    g.addColorStop(0, 'rgb(' + THEME_BG[0] + ',' + THEME_BG[1] + ',' + THEME_BG[2] + ')');
    g.addColorStop(1, 'rgb(' + THEME_BG_BOTTOM[0] + ',' + THEME_BG_BOTTOM[1] + ',' + THEME_BG_BOTTOM[2] + ')');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height);
  }
}

// 小動物療癒風：角落輕量爪印裝飾（不影響點擊）
function drawPawPrint(px, py, size, alpha, flip) {
  push();
  noStroke();
  fill(THEME_TEXT_SOFT[0], THEME_TEXT_SOFT[1], THEME_TEXT_SOFT[2], alpha);
  translate(px, py);
  if (flip) scale(-1, 1);
  const r = size * 0.5;
  ellipse(0, size * 0.35, r * 1.4, r * 1.1);
  ellipse(-size * 0.28, -size * 0.05, r * 0.5, r * 0.65);
  ellipse(size * 0.28, -size * 0.05, r * 0.5, r * 0.65);
  ellipse(-size * 0.35, -size * 0.35, r * 0.45, r * 0.6);
  ellipse(size * 0.35, -size * 0.35, r * 0.45, r * 0.6);
  pop();
}

function drawThemeDecorations() {
  const pad = 28;
  const sz = 22;
  const alpha = 55;
  drawPawPrint(pad, pad, sz, alpha, false);
  drawPawPrint(width - pad, pad, sz, alpha, true);
  drawPawPrint(pad, height - pad, sz, alpha, true);
  drawPawPrint(width - pad, height - pad, sz, alpha, false);
}

function draw() {
  // 每幀都檢查過關（9 櫃每櫃 3 格全部同一種才過關），避免漏判
  if (cells) checkWin();

  drawThemeBackground();
  drawThemeDecorations();

  // 拖動時每 frame 用當前 pointer 更新位置，並算出滑過哪個物品（亮外框用）
  if (draggedItem !== null) {
    const xy = getPointerXY();
    dragX = xy[0] - draggedItem.offsetX;
    dragY = xy[1] - draggedItem.offsetY;
    const pointerX = xy[0];
    const pointerY = xy[1];
    hoverTargetItem = hitTestItemExcluding(pointerX, pointerY, draggedItem.cellIndex, draggedItem.slotIndex);
    // 不允許櫃內交換：若滑鼠在「同一櫃」的其他格上，不亮起（讓使用者知道不能櫃內交換）
    if (hoverTargetItem && hoverTargetItem.cellIndex === draggedItem.cellIndex) hoverTargetItem = null;
    // 亮起來變化時記錄：從無→有 或 從 A→B，並播放「滑過此格」的輕柔選取音效
    if (hoverTargetItem && (!prevHoverTargetItem || prevHoverTargetItem.cellIndex !== hoverTargetItem.cellIndex || prevHoverTargetItem.slotIndex !== hoverTargetItem.slotIndex)) {
      pushHighlightLog(hoverTargetItem.cellIndex, hoverTargetItem.slotIndex, '拖曳滑過此格 (pointer 在物品上)');
      playDragHoverSound();
    }
    prevHoverTargetItem = hoverTargetItem;
  } else {
    hoverTargetItem = null;
    prevHoverTargetItem = null;
  }
  drawShelves();
  drawShelfSeparators();
  // drawSwapZone();  // 右上角交換區已註解
  drawConveyorBelt();
  // drawSwapHistoryZone();  // 已交換區已註解
  // 拖動時畫出可放置的格子範圍（方便除錯）
  if (DEBUG && draggedItem !== null) {
    drawDropZones();
  }
  drawItems();
  if (dropAnimation) {
    drawDropAnimation();
  } else if (draggedItem !== null) {
    drawDragOrbitPlanets(dragX, dragY);
    drawOneItem(dragX, dragY, draggedItem.typeIndex, true, false);
  }
  drawTimer();
  if (gameState === 'idle' || gameState === 'playing') {
    drawWinConditionHint();
    // drawShelfCompletionOnScreen();  // 每櫃完成與否顯示區已註解
  }
  if (gameState === 'completed') {
    drawResultOverlay();
  }
  if (levelCompleteCelebration && levelCompleteCelebration.active) {
    const overlayEl = document.getElementById('celebration-overlay');
    if (overlayEl) overlayEl.classList.add('visible');
    drawLevelCompleteCelebrationOverlay();
    const t = millis() - levelCompleteCelebration.startedAt;
    if (t >= levelCompleteCelebration.duration) {
      const overlayEl = document.getElementById('celebration-overlay');
      if (overlayEl) overlayEl.classList.remove('visible');
      currentLevel++;
      initLevel(currentLevel);
      startTime = millis();
      levelCompleteCelebration = null;
      console.log('[draw] 恭喜特效結束，進入第 ' + (currentLevel + 1) + ' 關 ' + LEVEL_GROUPS[currentLevel]);
    }
  }
  if (DEBUG) {
    logDebugToConsole();
  }
}

function drawSwapZone() {
  if (!swapZone) return;
  // 薄荷綠背景（圓角矩形）
  fill(THEME_SWAP_ZONE[0], THEME_SWAP_ZONE[1], THEME_SWAP_ZONE[2]);
  noStroke();
  rect(swapZone.x, swapZone.y, swapZone.w, swapZone.h, 10);
  // 兩格：較深邊框區分
  fill(255, 255, 255, 40);
  stroke(THEME_SWAP_ZONE_BORDER[0], THEME_SWAP_ZONE_BORDER[1], THEME_SWAP_ZONE_BORDER[2]);
  strokeWeight(2);
  for (let i = 0; i < SWAP_ZONE_SLOTS; i++) {
    const cen = getSwapZoneSlotCenter(i);
    if (!cen) continue;
    const rx = swapZone.x + swapZone.pad + i * (swapZone.slotW + swapZone.gap);
    const ry = swapZone.y + swapZone.pad;
    rect(rx, ry, swapZone.slotW, swapZone.slotH, 6);
  }
  noStroke();
  // 標籤「交換區」在區域上方
  fill(THEME_SWAP_ZONE_TEXT[0], THEME_SWAP_ZONE_TEXT[1], THEME_SWAP_ZONE_TEXT[2]);
  textAlign(CENTER, BOTTOM);
  textSize(Math.min(15, swapZone.w * 0.11));
  text('交換區', swapZone.x + swapZone.w / 2, swapZone.y + swapZone.pad - 2);

  // 左槽：目前要 drop 的目標位置（滑鼠懸停的那格）；右槽：正在拖曳的物品的原始位置
  const labelSize = Math.min(12, swapZone.slotW * 0.22);
  textSize(labelSize);
  textAlign(CENTER, CENTER);
  for (let i = 0; i < SWAP_ZONE_SLOTS; i++) {
    const cen = getSwapZoneSlotCenter(i);
    if (!cen) continue;
    let str = '';
    if (i === 0) {
      // 左：目標格
      if (hoverTargetItem && draggedItem) {
        str = '櫃' + hoverTargetItem.cellIndex + ' 格' + hoverTargetItem.slotIndex;
      }
    } else {
      // 右：拖曳來源
      if (draggedItem) {
        str = '櫃' + draggedItem.cellIndex + ' 格' + draggedItem.slotIndex;
      }
    }
    if (str) {
      fill(THEME_SWAP_ZONE_TEXT[0], THEME_SWAP_ZONE_TEXT[1], THEME_SWAP_ZONE_TEXT[2]);
      text(str, cen.x, cen.y);
    }
  }
}

function drawConveyorBelt() {
  if (!conveyorZone) return;
  const pad = conveyorZone.pad;
  const gap = conveyorZone.gap;
  const segW = conveyorZone.segmentW;
  const segH = conveyorZone.h - 2 * pad;
  const segX0 = conveyorZone.x + pad + conveyorZone.labelWidth;
  const segY0 = conveyorZone.y + pad;
  const segY = conveyorZone.y + conveyorZone.h / 2;
  const nextLevelSegmentIndex = 0;  // 只顯示「下一關」為清晰，其餘打馬賽克（模糊）

  // 輸送帶背景（奶油燕麥色）
  fill(THEME_CONVEYOR[0], THEME_CONVEYOR[1], THEME_CONVEYOR[2]);
  noStroke();
  rect(conveyorZone.x, conveyorZone.y, conveyorZone.w, conveyorZone.h, 8);
  // 標題「輸送帶」
  fill(THEME_CONVEYOR_TEXT[0], THEME_CONVEYOR_TEXT[1], THEME_CONVEYOR_TEXT[2]);
  textAlign(LEFT, CENTER);
  textSize(Math.min(14, conveyorZone.w * 0.032));
  text('輸送帶', conveyorZone.x + pad, conveyorZone.y + conveyorZone.h / 2);

  // 「非下一關」的格子：依 currentLevel 快取，只在換關時做一次 blur（避免每幀 6 次 filter 傷效能）
  const numBlurredSegments = conveyorZone.segmentCount - 1;
  const expectedBufW = Math.ceil(numBlurredSegments * (segW + gap) - gap);
  const expectedBufH = Math.ceil(segH);
  const cacheInvalid = conveyorCachedBlur.pg === null ||
    conveyorCachedBlur.level !== currentLevel ||
    conveyorCachedBlur.pg.width !== expectedBufW ||
    conveyorCachedBlur.pg.height !== expectedBufH;

  if (numBlurredSegments > 0) {
    if (cacheInvalid) {
      if (conveyorCachedBlur.pg) conveyorCachedBlur.pg.remove();
      const pg = createGraphics(expectedBufW, expectedBufH);
      pg.background(THEME_CONVEYOR[0], THEME_CONVEYOR[1], THEME_CONVEYOR[2]);
      pg.noStroke();
      const blurAmount = 4;
      for (let i = 1; i < conveyorZone.segmentCount; i++) {
        const idx = currentLevel + 1 + i;
        const label = idx < LEVEL_GROUPS.length ? LEVEL_GROUPS[idx] : '—';
        const rx = (i - 1) * (segW + gap);
        pg.fill(255, 255, 255, 55);
        pg.stroke(THEME_CONVEYOR_BORDER[0], THEME_CONVEYOR_BORDER[1], THEME_CONVEYOR_BORDER[2]);
        pg.strokeWeight(2);
        pg.rect(rx, 0, segW, segH, 6);
        pg.noStroke();
        pg.fill(THEME_CONVEYOR_TEXT[0], THEME_CONVEYOR_TEXT[1], THEME_CONVEYOR_TEXT[2]);
        pg.textAlign(CENTER, CENTER);
        pg.textSize(Math.min(16, segW * 0.2));
        pg.text(label, rx + segW / 2, segH / 2);
      }
      pg.filter(BLUR, blurAmount);  // 只做一次 blur
      conveyorCachedBlur.pg = pg;
      conveyorCachedBlur.level = currentLevel;
    }
    if (conveyorCachedBlur.pg) {
      image(conveyorCachedBlur.pg, segX0 + (segW + gap), segY0, conveyorCachedBlur.pg.width, conveyorCachedBlur.pg.height);
    }
  }

  // 只畫「下一關」那一格清晰（無模糊）
  const i = nextLevelSegmentIndex;
  const idx = currentLevel + 1 + i;
  const label = idx < LEVEL_GROUPS.length ? LEVEL_GROUPS[idx] : '—';
  const rx = segX0 + i * (segW + gap);
  fill(255, 255, 255, 55);
  stroke(THEME_CONVEYOR_BORDER[0], THEME_CONVEYOR_BORDER[1], THEME_CONVEYOR_BORDER[2]);
  strokeWeight(2);
  rect(rx, segY0, segW, segH, 6);
  noStroke();
  fill(THEME_CONVEYOR_TEXT[0], THEME_CONVEYOR_TEXT[1], THEME_CONVEYOR_TEXT[2]);
  textAlign(CENTER, CENTER);
  textSize(Math.min(16, segW * 0.2));
  text(label, rx + segW / 2, segY);
}

function drawSwapHistoryZone() {
  if (!swapHistoryZone) return;
  // 背景（暖灰褐區分）
  fill(THEME_HISTORY_BG[0], THEME_HISTORY_BG[1], THEME_HISTORY_BG[2]);
  noStroke();
  rect(swapHistoryZone.x, swapHistoryZone.y, swapHistoryZone.w, swapHistoryZone.h, 8);
  // 標題
  fill(THEME_HISTORY_TEXT[0], THEME_HISTORY_TEXT[1], THEME_HISTORY_TEXT[2]);
  textAlign(LEFT, TOP);
  textSize(Math.min(14, swapHistoryZone.w * 0.035));
  text('已交換區', swapHistoryZone.x + swapHistoryZone.pad, swapHistoryZone.y + swapHistoryZone.pad);
  // 列出實際交換：櫃X 格Y ↔ 櫃X 格Y（由舊到新，每行一筆）
  if (swapHistory.length === 0) {
    fill(THEME_HISTORY_TEXT_SOFT[0], THEME_HISTORY_TEXT_SOFT[1], THEME_HISTORY_TEXT_SOFT[2]);
    textSize(Math.min(11, swapHistoryZone.w * 0.028));
    text('（尚無交換）', swapHistoryZone.x + swapHistoryZone.pad, swapHistoryZone.y + swapHistoryZone.pad + swapHistoryZone.lineHeight);
  } else {
    fill(THEME_HISTORY_TEXT[0], THEME_HISTORY_TEXT[1], THEME_HISTORY_TEXT[2]);
    textSize(Math.min(11, swapHistoryZone.w * 0.028));
    const startY = swapHistoryZone.y + swapHistoryZone.pad + swapHistoryZone.lineHeight;
    for (let i = 0; i < swapHistory.length; i++) {
      const e = swapHistory[i];
      const str = '櫃' + e.from.cell + ' 格' + e.from.slot + ' ↔ 櫃' + e.to.cell + ' 格' + e.to.slot;
      text(str, swapHistoryZone.x + swapHistoryZone.pad, startY + i * swapHistoryZone.lineHeight);
    }
  }
}

function drawDropZones() {
  for (let c = 0; c < NUM_CELLS; c++) {
    const full = cells[c].length >= ITEMS_PER_CELL;
    const cellCol = c % GRID_COLS;
    const cellRow = floor(c / GRID_COLS);
    fill(255, 255, 255, full ? 15 : 45);
    stroke(255, 200, 0, 180);
    strokeWeight(2);
    rect(cellCol * cellW + 4, shelfY + cellRow * cellH, cellW - 8, cellH - 4, 8);
    noStroke();
  }
}

function stateToString(state) {
  if (!state || state.length !== SLOTS_TOTAL) return '[]';
  const parts = state.map(function (v) {
    return v === -1 ? '-' : (ITEM_TYPES[v] ? ITEM_TYPES[v].name : '?');
  });
  // 3 行 × 9 格，方便閱讀
  let s = '';
  for (let r = 0; r < 3; r++) {
    if (r > 0) s += '\n';
    s += '[' + parts.slice(r * 9, (r + 1) * 9).join(',') + ']';
  }
  return s;
}

function getDebugPanelText() {
  const px = mouseX;
  const py = mouseY;
  const cellUnder = getCellAt(px, py);
  const hit = hitTestItem(px, py);
  const currentState = getCurrentState();
  let s = '';
  s += 'mouse: ' + px.toFixed(0) + ', ' + py.toFixed(0) + '  |  cellUnder: ' + cellUnder + '  |  hitItem: ' + (hit ? 'C' + hit.cellIndex + 'S' + hit.slotIndex : 'null') + '\n';
  s += 'dragged: ' + (draggedItem ? 'C' + draggedItem.cellIndex + ' S' + draggedItem.slotIndex + ' @ ' + dragX.toFixed(0) + ',' + dragY.toFixed(0) : 'null') + '\n';
  s += 'shelfY=' + shelfY.toFixed(0) + ' shelfH=' + shelfH.toFixed(0) + ' cellW=' + cellW.toFixed(0) + ' cellH=' + cellH.toFixed(0) + '\n';
  s += 'cells: [' + cells.map(function (list) { return list.length; }).join(',') + ']\n';
  if (lastReleaseLog) {
    s += 'lastRelease: targetCell=' + lastReleaseLog.targetCell + ' placed=' + lastReleaseLog.placed + ' at ' + lastReleaseLog.px.toFixed(0) + ',' + lastReleaseLog.py.toFixed(0) + '\n';
  }
  s += '\n27格狀態: ' + stateToString(currentState) + '\n\n';
  const levelIndices = getLevelTypeIndices(currentLevel);
  const n0 = ITEM_TYPES[levelIndices[0]].name;
  const n1 = ITEM_TYPES[levelIndices[1]].name;
  const n2 = ITEM_TYPES[levelIndices[2]].name;
  s += '每櫃完成狀態（過關需每櫃 3 格同類 ' + n0 + n1 + n2 + '）:\n';
  for (let c = 0; c < NUM_CELLS; c++) {
    const list = cells[c];
    const counts = [0, 0, 0];
    for (let i = 0; i < list.length; i++) {
      const idx = levelIndices.indexOf(list[i].typeIndex);
      if (idx >= 0) counts[idx]++;
    }
    const same = (counts[0] === ITEMS_PER_CELL || counts[1] === ITEMS_PER_CELL || counts[2] === ITEMS_PER_CELL);
    s += '  櫃' + c + ': ' + n0 + counts[0] + ' ' + n1 + counts[1] + ' ' + n2 + counts[2] + (same ? ' ✓ 完成' : ' 未完成') + '\n';
  }
  s += '\nstateHistory (最近):\n';
  const histShow = stateHistory.slice(-8);
  for (let i = 0; i < histShow.length; i++) {
    const h = histShow[i];
    s += '  step' + h.step + ' ' + h.label + ' ' + stateToString(h.state) + '\n';
  }
  s += '\nhighlightLog (亮起來):\n';
  const highShow = highlightLog.slice(-12);
  for (let j = 0; j < highShow.length; j++) {
    const g = highShow[j];
    s += '  slot' + g.slot + ' C' + g.cellIndex + 'S' + g.slotIndex + ' ' + g.reason + '\n';
  }
  s += '\n按 D 切換 Debug';
  return s;
}

// 每約 0.5 秒輸出一次到 console，避免刷屏
let debugLogFrame = 0;
const DEBUG_LOG_INTERVAL = 30;

function logDebugToConsole() {
  debugLogFrame++;
  if (debugLogFrame % DEBUG_LOG_INTERVAL !== 0) return;
  console.log('[Debug]\n' + getDebugPanelText());
}

// 柔和分隔線：3×3 書櫃網格（水平 4 條、垂直 2 條）
function drawShelfSeparators() {
  stroke(THEME_SEPARATOR[0], THEME_SEPARATOR[1], THEME_SEPARATOR[2]);
  strokeWeight(2);
  noFill();
  // 水平線：每列上緣 + 最底
  for (let r = 0; r <= GRID_ROWS; r++) {
    const y = shelfY + r * cellH;
    line(0, y, width, y);
  }
  // 垂直線：櫃與櫃之間
  for (let col = 1; col < GRID_COLS; col++) {
    const x = col * cellW;
    line(x, shelfY, x, shelfY + shelfH);
  }
  noStroke();
}

function drawShelves() {
  const pad = 10;
  const gap = 6;
  const slotW = (cellW - 2 * pad - (SLOTS_GRID_COLS - 1) * gap) / SLOTS_GRID_COLS;
  const slotH = (cellH - 2 * pad - (SLOTS_GRID_ROWS - 1) * gap) / SLOTS_GRID_ROWS;
  const L = THEME_SHELF_LAVENDER_BORDER;
  const G_OUT = THEME_SHELF_GLASS_OUTER;
  const G_IN = THEME_SHELF_GLASS_INNER;
  const H = THEME_SHELF_GLASS_HIGHLIGHT;
  // 對應 CSS --lg-bg-color: rgba(255,255,255,0.25)，加強透明感
  const ALPHA_OUTER = 64;   // ~0.25
  const ALPHA_INNER = 51;   // ~0.2，內層更透
  const ALPHA_SPECULAR = 191; // ~0.75 高光
  for (let c = 0; c < NUM_CELLS; c++) {
    const cellCol = c % GRID_COLS;
    const cellRow = floor(c / GRID_COLS);
    const x = cellCol * cellW;
    const y = shelfY + cellRow * cellH;
    // 外層：淡淡紫羅蘭邊框 ＋ 高透明紫白（玻璃 overlay 感）
    fill(G_OUT[0], G_OUT[1], G_OUT[2], ALPHA_OUTER);
    stroke(L[0], L[1], L[2]);
    strokeWeight(2);
    rect(x + 4, y, cellW - 8, cellH - 4, 10);
    // 內層：淡淡紫羅蘭邊框 ＋ 更高透明粉白（玻璃感）
    fill(G_IN[0], G_IN[1], G_IN[2], ALPHA_INNER);
    stroke(L[0], L[1], L[2]);
    strokeWeight(2);
    rect(x + 8, y + 6, cellW - 16, cellH - 16, 6);
    // glass-specular：內緣高光（inset 1px 1px 0 highlight）
    noFill();
    stroke(H[0], H[1], H[2], ALPHA_SPECULAR);
    strokeWeight(1);
    const ix = x + 9;
    const iy = y + 7;
    const iw = cellW - 18;
    const ih = cellH - 18;
    line(ix, iy, ix + iw, iy);
    line(ix, iy, ix, iy + ih);
    noStroke();
    fill(THEME_SHELF_SLOT[0], THEME_SHELF_SLOT[1], THEME_SHELF_SLOT[2]);
    const baseX = x + pad;
    const baseY = y + pad;
    for (let s = 0; s < ITEMS_PER_CELL; s++) {
      const col = s % SLOTS_GRID_COLS;
      const row = floor(s / SLOTS_GRID_COLS);
      const sx = baseX + col * (slotW + gap) + slotW / 2;
      const sy = baseY + row * (slotH + gap) + slotH / 2;
      ellipse(sx, sy, slotW * 0.85, slotH * 0.85);
    }
    // 櫃0～櫃8 字樣已註解
    // fill(THEME_TEXT_DARK[0], THEME_TEXT_DARK[1], THEME_TEXT_DARK[2]);
    // textAlign(CENTER, BOTTOM);
    // textSize(Math.min(14, cellW * 0.12));
    // text('櫃' + c, x + cellW / 2, y - 2);
  }
  noStroke();
}

function drawItems() {
  for (let c = 0; c < NUM_CELLS; c++) {
    for (let s = 0; s < cells[c].length; s++) {
      if (draggedItem && draggedItem.cellIndex === c && draggedItem.slotIndex === s) continue;
      if (dropAnimation && dropAnimation.srcCell === c && dropAnimation.srcSlot === s) continue;
      const item = cells[c][s];
      const isHighlight = hoverTargetItem && hoverTargetItem.cellIndex === c && hoverTargetItem.slotIndex === s;
      drawOneItem(item.displayX, item.displayY, item.typeIndex, false, isHighlight);
    }
  }
}

// 畫一顆小星星（4 尖或 5 尖，中心在 0,0，半徑 r，旋轉 rot）
function drawLittleStar(r, rot, points) {
  points = points || 5;
  const step = TWO_PI / points;
  beginShape();
  for (let i = 0; i < points * 2; i++) {
    const rad = (i % 2 === 0) ? r : r * 0.4;
    const a = rot + i * step * 0.5;
    vertex(cos(a) * rad, sin(a) * rad);
  }
  endShape(CLOSE);
}

// 有機亂數：用相位與索引產生不規則但平滑的 0~1（不閃爍）
function organicNoise(phase, index) {
  return (sin(phase * 1.37 + index * 2.1) * 0.5 + 0.5) * (0.6 + 0.4 * cos(phase * 0.83 + index));
}

// 拖曳時：星星環繞 + 光暈綻放（有機、帶亂數感）。ANIMATION_LITE 時減少層數且不用 shadowBlur 以保流暢。
function drawDragOrbitPlanets(cx, cy) {
  dragOrbitPhase += DRAG_ORBIT_SPEED;
  const phase = dragOrbitPhase;
  const t = millis() * 0.002;
  const lite = ANIMATION_LITE;
  const bloomCount = lite ? 4 : 6;
  const useShadow = !lite;

  // ---- 光暈綻放：多層橢圓（不用 shadowBlur，手機上非常耗效能）----
  noStroke();
  for (let i = 0; i < bloomCount; i++) {
    const breath = 0.75 + 0.35 * sin(t + i * 0.7) + (lite ? 0 : 0.15 * organicNoise(phase, i));
    const radius = (35 + i * (lite ? 18 : 12) + (lite ? 4 : 8) * sin(t * 1.2 + i * 0.5)) * breath;
    const alpha = (12 + 14 * sin(t * 0.9 + i * 0.4) + (lite ? 0 : 6 * organicNoise(phase, i + 10))) | 0;
    fill(255, 255, 255, Math.max(2, alpha));
    if (useShadow) {
      drawingContext.shadowBlur = 18 + 12 * sin(t + i * 0.3);
      drawingContext.shadowColor = 'rgba(255, 240, 220, 0.3)';
    }
    ellipse(cx, cy, radius * 2, radius * 2);
    if (useShadow) drawingContext.shadowBlur = 0;
  }
  if (useShadow) drawingContext.shadowBlur = 0;

  // ---- 軌道線 + 小星球 ----
  const orbits = lite
    ? [{ radius: 42, speed: 1, n: 2 }, { radius: 62, speed: -0.7, n: 3 }]
    : [{ radius: 38, speed: 1, n: 3 }, { radius: 54, speed: -0.72, n: 4 }, { radius: 72, speed: 0.48, n: 2 }];
  const planetColors = [
    [255, 220, 200],
    [200, 235, 220],
    [255, 230, 210],
    [220, 240, 200],
    [255, 215, 180]
  ];
  noFill();
  for (let o = 0; o < orbits.length; o++) {
    const orb = orbits[o];
    const wobble = 1 + 0.06 * sin(phase * 1.1 + o * 2) + (lite ? 0 : 0.04 * organicNoise(phase, o + 5));
    const r = orb.radius * wobble;
    const angle = phase * orb.speed;
    stroke(255, 255, 255, 35 + 28 * sin(phase + o * 0.8));
    strokeWeight(1.5);
    ellipse(cx, cy, r * 2, r * 2);
    for (let p = 0; p < orb.n; p++) {
      const a = angle + (TWO_PI * p) / orb.n;
      const px = cx + r * cos(a);
      const py = cy + r * sin(a);
      const col = planetColors[(o + p) % planetColors.length];
      const twinkle = lite ? 1 : 0.7 + 0.3 * organicNoise(phase, p + o * 3);
      noStroke();
      fill(col[0], col[1], col[2], 200 + (lite ? 40 : 55 * twinkle));
      if (useShadow) {
        drawingContext.shadowBlur = 6 + 4 * twinkle;
        drawingContext.shadowColor = 'rgba(255,255,255,0.5)';
      }
      circle(px, py, lite ? 8 : 9);
      if (useShadow) drawingContext.shadowBlur = 0;
    }
  }

  // ---- 星星：lite 時少一圈、少顆數 ----
  const starOrbits = lite
    ? [{ radius: 48, speed: 0.6, count: 4 }, { radius: 70, speed: -0.45, count: 4 }]
    : [{ radius: 44, speed: 0.6, count: 5 }, { radius: 62, speed: -0.5, count: 6 }, { radius: 80, speed: 0.35, count: 4 }];
  noStroke();
  for (let s = 0; s < starOrbits.length; s++) {
    const so = starOrbits[s];
    const starAngle = phase * so.speed;
    for (let k = 0; k < so.count; k++) {
      const a = starAngle + (TWO_PI * k) / so.count + (lite ? 0 : 0.2 * sin(phase + k));
      const sx = cx + so.radius * cos(a);
      const sy = cy + so.radius * sin(a);
      const starSize = lite ? 4 : 4 + 3 * organicNoise(phase, s + k * 7);
      const starRot = phase * 0.5 + k * 0.6;
      const starAlpha = lite ? 220 : 180 + 75 * organicNoise(phase * 1.2, k + s * 4);
      fill(255, 255, 230, starAlpha);
      if (useShadow) {
        drawingContext.shadowBlur = 5;
        drawingContext.shadowColor = 'rgba(255, 250, 200, 0.5)';
      }
      push();
      translate(sx, sy);
      rotate(starRot);
      drawLittleStar(starSize, 0, 4);
      pop();
      if (useShadow) drawingContext.shadowBlur = 0;
    }
  }

  noFill();
}

// 放置動畫：飛行＋旋轉一圈的進度曲線（easeOutBack 讓落地更有彈性）
function easeOutBack(t) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

// 拋物線＋遠近感：回傳 { x, y, scale }，progress 0~1。弧高（像素）、終點略縮
const DROP_ARC_HEIGHT = 55;
const DROP_SCALE_MIN = 0.38;
const DROP_TRAIL_STEPS = ANIMATION_LITE ? 6 : 10;

function getDropPosition(da, progress) {
  const eased = easeOutBack(progress);
  if (!da.placed) {
    const x = da.startX + (da.endX - da.startX) * eased;
    const y = da.startY + (da.endY - da.startY) * eased;
    return { x, y, scale: 1 };
  }
  const linearX = da.startX + (da.endX - da.startX) * eased;
  const linearY = da.startY + (da.endY - da.startY) * eased;
  const arc = 4 * progress * (1 - progress);
  const arcY = -DROP_ARC_HEIGHT * arc;
  const x = linearX;
  const y = linearY + arcY;
  const scaleAmt = 1 - (1 - DROP_SCALE_MIN) * arc;
  const landProgress = Math.max(0, (progress - 0.82) / 0.18);
  const landScale = 0.88 + 0.12 * (1 - (1 - landProgress) * (1 - landProgress));
  const scale = progress >= 0.82 ? landScale : scaleAmt;
  return { x, y, scale };
}

// 有機曲線軌跡：用 progress 取樣路徑上的點，畫一條漸隱的曲線（從舊到新，越後面越亮）
function drawDropOrganicTrail(da, currentProgress) {
  const steps = DROP_TRAIL_STEPS;
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const p = Math.max(0, currentProgress - 0.4 * (1 - i / steps));
    pts.push(getDropPosition(da, p));
  }
  noFill();
  const n = pts.length;
  for (let i = 1; i < n; i++) {
    const ratio = i / n;
    const alpha = (70 + (ANIMATION_LITE ? 30 : 50) * (ANIMATION_LITE ? 1 : organicNoise(currentProgress * 10, i))) * ratio * ratio;
    stroke(255, 248, 230, alpha);
    strokeWeight(2.5 - 1.2 * ratio);
    line(pts[i - 1].x, pts[i - 1].y, pts[i].x, pts[i].y);
  }
  noStroke();
}

// 咖啡豆／錢幣「轉進深處」的有機線條：從飛行物後方拉出的弧線。lite 時少畫幾條。
function drawDropOrganicLines(da, x, y, progress) {
  const dx = da.endX - da.startX;
  const dy = da.endY - da.startY;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const ux = -dx / len;
  const uy = -dy / len;
  const phase = progress * TWO_PI * 2 + millis() * 0.003;
  const lineCount = ANIMATION_LITE ? 3 : 5;
  noFill();
  for (let i = 0; i < lineCount; i++) {
    const t = i / lineCount;
    const angle = t * PI * 0.8 - PI * 0.4 + 0.15 * sin(phase + i * 2);
    const dirX = ux * cos(angle) - uy * sin(angle);
    const dirY = ux * sin(angle) + uy * cos(angle);
    const segLen = 18 + (ANIMATION_LITE ? 8 : 14 * organicNoise(progress * 12, i)) + 8 * sin(phase + i);
    const cpx = x + dirX * segLen * 0.5 + 6 * sin(phase + i * 1.7);
    const cpy = y + dirY * segLen * 0.5 + 5 * cos(phase + i * 1.3);
    const ex = x + dirX * segLen + (ANIMATION_LITE ? 0 : 4 * organicNoise(phase, i + 10));
    const ey = y + dirY * segLen + (ANIMATION_LITE ? 0 : 4 * organicNoise(phase, i + 20));
    const alpha = (1 - progress) * (70 + (ANIMATION_LITE ? 20 : 40 * organicNoise(phase, i)));
    stroke(255, 245, 220, alpha);
    strokeWeight(1.5 + (ANIMATION_LITE ? 0 : 0.5 * organicNoise(phase, i + 5)));
    bezier(x, y, cpx, cpy, cpx + 3 * sin(phase * 2), cpy + 3 * cos(phase * 2), ex, ey);
  }
  noStroke();
}

// 成功放到別的格子的洞時：在目標格中心畫「水流動」動畫。lite 時減少流線／漣漪／水滴數。
const WATER_FLOW_RADIUS = 28;

function drawDropWaterFlow(da, progress) {
  const cx = da.endX;
  const cy = da.endY;
  const phase = millis() * 0.004 + progress * TWO_PI;
  const lite = ANIMATION_LITE;
  const streamCount = lite ? 4 : 6;
  const waveCount = lite ? 2 : 3;
  const dropCount = lite ? 4 : 8;
  noFill();

  for (let i = 0; i < streamCount; i++) {
    const angle = (TWO_PI * i) / streamCount + phase * 0.3 + sin(phase + i) * 0.2;
    const r0 = 4 + (lite ? 4 : 6 * organicNoise(phase, i));
    const r1 = WATER_FLOW_RADIUS + 8 * sin(phase * 1.2 + i * 0.7);
    const ax = cx + cos(angle) * r0;
    const ay = cy + sin(angle) * r0;
    const bx = cx + cos(angle) * r1;
    const by = cy + sin(angle) * r1;
    const cpx = (ax + bx) / 2 + 12 * cos(phase + i * 1.5);
    const cpy = (ay + by) / 2 + 10 * sin(phase * 1.1 + i);
    const alpha = (40 + 35 * sin(phase + i * 0.8)) * (0.4 + 0.6 * progress);
    stroke(180, 220, 255, alpha);
    strokeWeight(lite ? 2 : 2 + 0.8 * sin(phase * 2 + i));
    bezier(ax, ay, cpx, cpy, cpx + 4 * cos(phase), cpy + 4 * sin(phase), bx, by);
  }
  noStroke();

  for (let w = 0; w < waveCount; w++) {
    const wavePhase = phase + w * 2.1;
    const r = WATER_FLOW_RADIUS * (0.5 + 0.5 * progress) + 5 * sin(wavePhase);
    fill(200, 230, 255, 12 + 8 * sin(wavePhase * 1.3));
    noStroke();
    ellipse(cx, cy, r * 2, r * 2);
  }
  noFill();

  for (let d = 0; d < dropCount; d++) {
    const a = (TWO_PI * d) / dropCount + phase * 0.5;
    const dist = 6 + (lite ? 10 + 4 * sin(phase + d) : 14 * organicNoise(phase * 0.8, d + 30) + 4 * sin(phase + d));
    const px = cx + cos(a) * dist;
    const py = cy + sin(a) * dist;
    const dropR = 2 + 1.5 * sin(phase * 2 + d);
    fill(220, 240, 255, 80 + 60 * sin(phase + d * 0.7));
    noStroke();
    ellipse(px, py, dropR * 2, dropR * 2);
  }
  noFill();
}

function drawDropAnimation() {
  if (!dropAnimation) return;
  const da = dropAnimation;
  const t = millis() - da.startTime;
  const dur = DROP_ANIMATION_DURATION_MS;
  let progress = t / dur;
  if (progress >= 1) {
    finishDropAnimation();
    return;
  }
  const pos = getDropPosition(da, progress);
  let rotation, drawX, drawY, drawScale;
  if (da.placed) {
    rotation = PI * progress;
    drawX = pos.x;
    drawY = pos.y;
    drawScale = pos.scale;
  } else {
    const wiggle = sin(progress * PI * 2);
    rotation = 0.03 * wiggle;
    drawX = pos.x + 2.5 * wiggle;
    drawY = pos.y;
    drawScale = 1;
  }
  if (da.placed) {
    drawDropWaterFlow(da, progress);
    drawDropOrganicTrail(da, progress);
    drawDropOrganicLines(da, pos.x, pos.y, progress);
  }
  push();
  translate(drawX, drawY);
  rotate(rotation);
  scale(drawScale);
  drawOneItem(0, 0, da.typeIndex, false, false);
  pop();
}

function finishDropAnimation() {
  if (!dropAnimation) return;
  const da = dropAnimation;
  if (da.placed) {
    if (da.doSwap) {
      const myItem = cells[da.srcCell].splice(da.srcSlot, 1)[0];
      const theirItem = cells[da.targetCell].splice(da.swapSlot, 1)[0];
      cells[da.targetCell].splice(da.swapSlot, 0, myItem);
      cells[da.srcCell].splice(da.srcSlot, 0, theirItem);
      swapHistory.push({
        from: { cell: da.srcCell, slot: da.srcSlot },
        to: { cell: da.targetCell, slot: da.swapSlot }
      });
      if (swapHistory.length > SWAP_HISTORY_MAX) swapHistory.shift();
    } else {
      const item = cells[da.srcCell].splice(da.srcSlot, 1)[0];
      cells[da.targetCell].push(item);
    }
    const label = da.doSwap
      ? 'swap C' + da.srcCell + '↔C' + da.targetCell
      : 'drop C' + da.srcCell + '→C' + da.targetCell;
    pushStateToHistory(label);
    playDropSuccessSound();
  } else {
    playDropCancelSound();
  }
  updateItemPositions();
  if (da.placed) checkWin();
  dropAnimation = null;
}

function drawOneItem(x, y, typeIndex, isDragging, isHighlight) {
  if (isHighlight === undefined) isHighlight = false;
  if (typeIndex < 0 || typeIndex >= ITEM_TYPES.length) return;
  const t = ITEM_TYPES[typeIndex];
  const pad = 10;
  const gap = 6;
  const slotW = (cellW - 2 * pad - (SLOTS_GRID_COLS - 1) * gap) / SLOTS_GRID_COLS;
  const slotH = (cellH - 2 * pad - (SLOTS_GRID_ROWS - 1) * gap) / SLOTS_GRID_ROWS;
  const baseSize = Math.min(slotW, slotH) * 0.82;
  const size = isDragging ? baseSize * 1.15 : baseSize;
  const avatarImg = getAvatarImageForType(currentLevel, typeIndex);
  const slabImg = (currentLevel >= SLAB_LEVEL_FIRST && currentLevel <= SLAB_LEVEL_LAST) ? getSlabImageForType(typeIndex) : null;
  const cardImg = avatarImg || slabImg;
  push();
  if (isDragging && !ANIMATION_LITE) {
    drawingContext.shadowOffsetX = 4;
    drawingContext.shadowOffsetY = 4;
    drawingContext.shadowBlur = 12;
    drawingContext.shadowColor = 'rgba(0,0,0,0.4)';
  }
  // 54～98 關 Avatars 底色固定 23% 灰階
  if (currentLevel >= 53 && currentLevel <= 97) {
    const g = Math.round(255 * (1 - AVATAR_54_98_BG_GRAY / 100));
    fill(g, g, g);
  } else {
    fill(t.color[0], t.color[1], t.color[2]);
  }
  if (isHighlight) {
    stroke(THEME_ACCENT[0], THEME_ACCENT[1], THEME_ACCENT[2]);
    strokeWeight(4);
  } else {
    stroke(THEME_TEXT_DARK[0], THEME_TEXT_DARK[1], THEME_TEXT_DARK[2]);
    strokeWeight(isDragging ? 3 : 1.5);
  }
  rectMode(CENTER);
  rect(x, y, size * 1.4, size, 6);
  noStroke();
  if (cardImg) {
    imageMode(CENTER);
    const maxW = size * 1.4;
    const maxH = size;
    const imgW = cardImg.width;
    const imgH = cardImg.height;
    const scale = Math.min(maxW / imgW, maxH / imgH, 1);
    const drawW = imgW * scale * slabIconSizeScale;
    const drawH = imgH * scale * slabIconSizeScale;
    image(cardImg, x, y, drawW, drawH);
  } else {
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(Math.max(12, size * 0.45));
  text(t.name, x, y);
  }
  if (isDragging && !ANIMATION_LITE) {
    drawingContext.shadowBlur = 0;
    drawingContext.shadowOffsetX = 0;
    drawingContext.shadowOffsetY = 0;
  }
  pop();
}

function drawTimer() {
  if (gameState !== 'playing' && gameState !== 'completed') return;
  const elapsed = gameState === 'completed'
    ? (endTime - startTime) / 1000
    : (millis() - startTime) / 1000;
  fill(THEME_TEXT_DARK[0], THEME_TEXT_DARK[1], THEME_TEXT_DARK[2]);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(Math.min(28, width * 0.06));
  text('時間: ' + elapsed.toFixed(1) + ' 秒', 20, 18);
}

function drawWinConditionHint() {
  const levelIndices = getLevelTypeIndices(currentLevel);
  const names = levelIndices.map(function (i) { return ITEM_TYPES[i].name; }).join('、');
  fill(THEME_TEXT_DARK[0], THEME_TEXT_DARK[1], THEME_TEXT_DARK[2]);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(Math.min(14, width * 0.03));
  text('過關：9 櫃（3×3）每櫃 3 格需「全部同一種」（' + names + '）', 20, 52);
}

// 在畫面上直接顯示每櫃完成狀態，方便看出「為什麼還沒過關」—— 已註解
// function drawShelfCompletionOnScreen() {
//   if (gameState !== 'playing') return;
//   const levelIndices = getLevelTypeIndices(currentLevel);
//   const ts = Math.min(12, width * 0.022);
//   textSize(ts);
//   textAlign(LEFT, TOP);
//   let y = 72;
//   for (let c = 0; c < NUM_CELLS; c++) {
//     const list = cells[c];
//     const counts = [0, 0, 0];
//     for (let i = 0; i < list.length; i++) {
//       const idx = levelIndices.indexOf(list[i].typeIndex);
//       if (idx >= 0) counts[idx]++;
//     }
//     const same = (counts[0] === ITEMS_PER_CELL || counts[1] === ITEMS_PER_CELL || counts[2] === ITEMS_PER_CELL);
//     fill(same ? 100 : THEME_TEXT_DARK[0], same ? 180 : THEME_TEXT_DARK[1], same ? 140 : THEME_TEXT_DARK[2]);
//     const n0 = ITEM_TYPES[levelIndices[0]].name;
//     const n1 = ITEM_TYPES[levelIndices[1]].name;
//     const n2 = ITEM_TYPES[levelIndices[2]].name;
//     const line = '櫃' + c + ': ' + n0 + counts[0] + ' ' + n1 + counts[1] + ' ' + n2 + counts[2] + (same ? ' ✓' : ' 未完成');
//     text(line, 20, y);
//     y += ts + 2;
//   }
// }

function drawResultOverlay() {
  fill(THEME_OVERLAY[0], THEME_OVERLAY[1], THEME_OVERLAY[2], 160);
  rect(0, 0, width, height);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(Math.min(36, width * 0.08));
  text('過關！', width / 2, height * 0.42);
  textSize(Math.min(28, width * 0.06));
  const sec = ((endTime - startTime) / 1000).toFixed(1);
  text('耗時 ' + sec + ' 秒', width / 2, height * 0.5);

  fill(THEME_ACCENT[0], THEME_ACCENT[1], THEME_ACCENT[2]);
  stroke(THEME_ACCENT_BORDER[0], THEME_ACCENT_BORDER[1], THEME_ACCENT_BORDER[2]);
  strokeWeight(2);
  rect(replayBtn.x, replayBtn.y, replayBtn.w, replayBtn.h, 8);
  noStroke();
  fill(255);
  textSize(Math.min(22, width * 0.05));
  text('再玩一次', width / 2, replayBtn.y + replayBtn.h / 2);
}

function getPointerXY() {
  if (touches.length > 0) {
    return [touches[0].x, touches[0].y];
  }
  return [mouseX, mouseY];
}

function hitTestItem(px, py) {
  return hitTestItemExcluding(px, py, -1, -1);
}

// 拖曳時用：排除正在拖的那個，找出「滑過」哪個物品（用來亮外框）
function hitTestItemExcluding(px, py, excludeCell, excludeSlot) {
  const pad = 10;
  const gap = 6;
  const slotW = (cellW - 2 * pad - (SLOTS_GRID_COLS - 1) * gap) / SLOTS_GRID_COLS;
  const slotH = (cellH - 2 * pad - (SLOTS_GRID_ROWS - 1) * gap) / SLOTS_GRID_ROWS;
  const baseSize = Math.min(slotW, slotH) * 0.82;
  const w = baseSize * 1.4;
  const h = baseSize;
  const hitW = w * 1.15;
  const hitH = h * 1.15;
  for (let c = 0; c < NUM_CELLS; c++) {
    for (let s = 0; s < cells[c].length; s++) {
      if (c === excludeCell && s === excludeSlot) continue;
      const item = cells[c][s];
      if (abs(px - item.displayX) < hitW / 2 && abs(py - item.displayY) < hitH / 2) {
        return { cellIndex: c, slotIndex: s, typeIndex: item.typeIndex };
      }
    }
  }
  return null;
}

// 回傳某櫃某槽的格子中心座標（與 updateItemPositions 一致）
function getSlotCenter(cellIndex, slotIndex) {
  const pad = 10;
  const gap = 6;
  const slotW = (cellW - 2 * pad - (SLOTS_GRID_COLS - 1) * gap) / SLOTS_GRID_COLS;
  const slotH = (cellH - 2 * pad - (SLOTS_GRID_ROWS - 1) * gap) / SLOTS_GRID_ROWS;
  const cellCol = cellIndex % GRID_COLS;
  const cellRow = floor(cellIndex / GRID_COLS);
  const baseX = cellCol * cellW + pad;
  const baseY = shelfY + cellRow * cellH + pad;
  const col = slotIndex % SLOTS_GRID_COLS;
  const row = floor(slotIndex / SLOTS_GRID_COLS);
  const x = baseX + col * (slotW + gap) + slotW / 2;
  const y = baseY + row * (slotH + gap) + slotH / 2;
  return [x, y];
}

// 在指定櫃內找離 (px, py) 最近的槽位（放開時沒壓到物品時用）
function getClosestSlotInCell(px, py, cellIndex) {
  let bestSlot = 0;
  let bestDist = Infinity;
  for (let slot = 0; slot < ITEMS_PER_CELL; slot++) {
    const [sx, sy] = getSlotCenter(cellIndex, slot);
    const d = (px - sx) * (px - sx) + (py - sy) * (py - sy);
    if (d < bestDist) {
      bestDist = d;
      bestSlot = slot;
    }
  }
  return bestSlot;
}

// 點擊輸送帶：回傳被點到的「格索引」0..segmentCount-1（該格對應關卡 currentLevel+1+i）；若沒點到或該格是「—」則回傳 -1
function getConveyorSegmentAt(px, py) {
  if (!conveyorZone) return -1;
  const pad = conveyorZone.pad;
  const segW = conveyorZone.segmentW;
  const segX0 = conveyorZone.x + pad + conveyorZone.labelWidth;
  const segY0 = conveyorZone.y + pad;
  const segH = conveyorZone.h - 2 * pad;
  if (py < segY0 || py >= segY0 + segH) return -1;
  for (let i = 0; i < conveyorZone.segmentCount; i++) {
    const rx = segX0 + i * (segW + conveyorZone.gap);
    if (px >= rx && px < rx + segW) {
      const levelIndex = currentLevel + 1 + i;
      if (levelIndex >= LEVEL_GROUPS.length) return -1;  // 該格是「—」不給切
      return i;
    }
  }
  return -1;
}

function getCellAt(px, py) {
  if (px < 0 || px > width || py < 0 || py > height) return -1;
  if (py < shelfY || py >= shelfY + shelfH) return -1;
  const col = floor(px / cellW);
  const row = floor((py - shelfY) / cellH);
  if (col < 0 || col >= GRID_COLS || row < 0 || row >= GRID_ROWS) return -1;
  return row * GRID_COLS + col;
}

// 拖曳時用：若釋放點在「來源櫃」內，依該櫃四邊改判為上／下／左／右鄰櫃
function getTargetCellWithBoundarySnap(px, py, srcCell) {
  let target = getCellAt(px, py);
  if (target < 0) return target;
  const srcCol = srcCell % GRID_COLS;
  const srcRow = floor(srcCell / GRID_COLS);
  const cellLeft = srcCol * cellW;
  const cellTop = shelfY + srcRow * cellH;
  const centerX = cellLeft + cellW * 0.5;
  const centerY = cellTop + cellH * 0.5;
  if (target === srcCell) {
    // 同一櫃：依最近邊緣 snap 到鄰櫃（上／下／左／右）
    const distLeft = px - cellLeft;
    const distRight = (cellLeft + cellW) - px;
    const distUp = py - cellTop;
    const distDown = (cellTop + cellH) - py;
    const minDist = Math.min(distLeft, distRight, distUp, distDown);
    if (minDist === distLeft && srcCol > 0) return srcCell - 1;
    if (minDist === distRight && srcCol < GRID_COLS - 1) return srcCell + 1;
    if (minDist === distUp && srcRow > 0) return srcCell - GRID_COLS;
    if (minDist === distDown && srcRow < GRID_ROWS - 1) return srcCell + GRID_COLS;
  }
  return target;
}

function pointerPressed(px, py) {
  if (DEBUG) console.log('[pointerPressed] px=' + px + ' py=' + py + ' hit=' + (hitTestItem(px, py) ? 'yes' : 'no'));
  if (gameState === 'completed') {
    if (px >= replayBtn.x && px <= replayBtn.x + replayBtn.w &&
        py >= replayBtn.y && py <= replayBtn.y + replayBtn.h) {
      initGame();
    }
    return;
  }
  // 點擊輸送帶某一格：切換到該關（換牌）
  const conveyorSeg = getConveyorSegmentAt(px, py);
  if (conveyorSeg >= 0) {
    const targetLevel = currentLevel + 1 + conveyorSeg;
    if (targetLevel >= 0 && targetLevel < NUM_LEVELS) {
      currentLevel = targetLevel;
      initLevel(currentLevel);
      gameState = 'playing';
      if (startTime == null) startTime = millis();
      if (DEBUG) console.log('[pointerPressed] 切換到第 ' + (currentLevel + 1) + ' 關 ' + LEVEL_GROUPS[currentLevel]);
    }
    return;
  }
  const hit = hitTestItem(px, py);
  if (hit) {
    if (gameState === 'idle') {
      gameState = 'playing';
      startTime = millis();
    }
    draggedItem = {
      cellIndex: hit.cellIndex,
      slotIndex: hit.slotIndex,
      typeIndex: hit.typeIndex,
      offsetX: px - cells[hit.cellIndex][hit.slotIndex].displayX,
      offsetY: py - cells[hit.cellIndex][hit.slotIndex].displayY
    };
    dragX = px - draggedItem.offsetX;
    dragY = py - draggedItem.offsetY;
    playDragStartSound();
    if (DEBUG) console.log('[pointerPressed] drag started cell=' + hit.cellIndex + ' slot=' + hit.slotIndex);
  }
}

function pointerMoved(px, py) {
  if (draggedItem === null) return;
  dragX = px - draggedItem.offsetX;
  dragY = py - draggedItem.offsetY;
}

function pointerReleased(px, py) {
  if (draggedItem === null) return;
  const targetCell = getTargetCellWithBoundarySnap(px, py, draggedItem.cellIndex);
  let placed = false;
  let swapSlot = -1;
  let doSwap = false;
  if (targetCell >= 0 && targetCell !== draggedItem.cellIndex) {
    if (cells[targetCell].length < ITEMS_PER_CELL) {
      placed = true;
    } else {
      const hit = hitTestItemExcluding(px, py, draggedItem.cellIndex, draggedItem.slotIndex);
      if (hit && hit.cellIndex === targetCell) {
        swapSlot = hit.slotIndex;
        doSwap = true;
        placed = true;
      }
    }
  }
  const srcCell = draggedItem.cellIndex;
  const srcSlot = draggedItem.slotIndex;
  let endX, endY;
  if (!placed) {
    const cen = getSlotCenter(srcCell, srcSlot);
    endX = cen[0];
    endY = cen[1];
  } else if (doSwap) {
    const cen = getSlotCenter(targetCell, swapSlot);
    endX = cen[0];
    endY = cen[1];
  } else {
    const newSlot = cells[targetCell].length;
    const cen = getSlotCenter(targetCell, newSlot);
    endX = cen[0];
    endY = cen[1];
  }
  dropAnimation = {
    startTime: millis(),
    startX: dragX,
    startY: dragY,
    endX: endX,
    endY: endY,
    typeIndex: draggedItem.typeIndex,
    placed: placed,
    srcCell: srcCell,
    srcSlot: srcSlot,
    targetCell: targetCell,
    swapSlot: doSwap ? swapSlot : undefined,
    doSwap: doSwap
  };
  draggedItem = null;
  lastReleaseLog = {
    targetCell: targetCell,
    placed: placed,
    px: px,
    py: py,
    cellCounts: cells.map(function (list) { return list.length; })
  };
  if (DEBUG) console.log('[pointerReleased] 啟動放置動畫 px=' + px + ' py=' + py + ' targetCell=' + targetCell + ' placed=' + placed);
}

function checkWin() {
  if (gameState === 'completed' || !cells) return;
  if (levelCompleteCelebration && levelCompleteCelebration.active) return;
  const levelIndices = getLevelTypeIndices(currentLevel);
  // 過關條件：9 櫃 × 每櫃 3 格，且每櫃 3 格全部同一種（當前關的 3 種之一）
  for (let c = 0; c < NUM_CELLS; c++) {
    const list = cells[c];
    if (!list || list.length !== ITEMS_PER_CELL) return;
    const t = Number(list[0].typeIndex);
    if (levelIndices.indexOf(t) < 0) return;
    for (let s = 1; s < list.length; s++) {
      if (Number(list[s].typeIndex) !== t) return;
    }
  }
  if (startTime == null) startTime = millis();
  const elapsed = (millis() - startTime) / 1000;
  playLevelCompleteSound();
  if (currentLevel < NUM_LEVELS - 1) {
    // 還有下一關：先播恭喜彩帶特效，結束後再切下一關
    levelCompleteCelebration = {
      active: true,
      startedAt: millis(),
      duration: CELEBRATION_DURATION_MS,
      completedLevel: currentLevel,
      particles: createConfettiParticles()
    };
    console.log('[checkWin] 過關！耗時 ' + elapsed.toFixed(1) + ' 秒，播放恭喜特效後進入下一關');
    return;
  } else {
    // 最後一關也過了：顯示過關
    gameState = 'completed';
    endTime = millis();
    console.log('[checkWin] 全破！耗時 ' + elapsed.toFixed(1) + ' 秒');
  }
}

function mousePressed() {
  pointerPressed(mouseX, mouseY);
}

function mouseDragged() {
  pointerMoved(mouseX, mouseY);
}

function mouseReleased() {
  if (draggedItem === null) return;
  // 若在畫布外放開（例如放到 Debug 面板上），改用「最後在畫布上的拖曳位置」當釋放點
  const inCanvas = (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height);
  const releaseX = inCanvas ? mouseX : (dragX + draggedItem.offsetX);
  const releaseY = inCanvas ? mouseY : (dragY + draggedItem.offsetY);
  pointerReleased(releaseX, releaseY);
}

function touchStarted() {
  if (touches.length > 0) {
    pointerPressed(touches[0].x, touches[0].y);
  }
  return false; // 阻止捲動、縮放
}

function touchMoved() {
  if (touches.length > 0 && draggedItem !== null) {
    pointerMoved(touches[0].x, touches[0].y);
  }
  if (draggedItem !== null) return false; // 拖曳時阻止捲動
  return false;
}

function touchEnded(e) {
  if (draggedItem !== null) {
    // 用觸控「放開」當下的座標（轉成畫布座標），沒有的話才用最後拖曳位置
    if (e && e.changedTouches && e.changedTouches[0]) {
      const [x, y] = canvasCoordsFromEvent(e);
      pointerReleased(x, y);
    } else {
      pointerReleased(dragX + draggedItem.offsetX, dragY + draggedItem.offsetY);
    }
  }
  return false;
}

function keyPressed() {
  if (key === 'd' || key === 'D') {
    DEBUG = !DEBUG;
    const size = getGameCanvasSize();
    resizeCanvas(size.w, size.h);
    computeLayout();
    updateItemPositions();
    return false;
  }
}
