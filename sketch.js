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
const ITEM_TYPES = [
  { id: 'pen', name: 'A', color: [52, 152, 219] },
  { id: 'eraser', name: 'B', color: [241, 196, 15] },
  { id: 'book', name: 'C', color: [231, 76, 60] }
];

let cells;           // [ [], [], ... ] 共 9 櫃，每櫃 3 格為 { typeIndex, displayX, displayY }[]
let draggedItem;     // { cellIndex, slotIndex, typeIndex, offsetX, offsetY } | null
let dragX, dragY;     // 當前拖動時物品繪製位置（pointer - offset）
let gameState;       // 'idle' | 'playing' | 'completed'
let startTime;
let endTime;
let replayBtn;       // 再玩一次按鈕區域 { x, y, w, h }

// 書櫃佈局：9 櫃排成 3×3，每櫃寬 cellW、高 cellH
let shelfY, shelfH;   // 書櫃區域上緣與總高度（3 列）
let cellW, cellH;    // 每櫃寬度、每櫃高度

// 右上角交換區（兩格、青綠色背景）
const SWAP_ZONE_SLOTS = 2;
let swapZone;         // { x, y, w, h, slotW, slotH, gap } 每格中心由 getSwapZoneSlotCenter 算
let swapHistoryZone;  // 最下面已交換區 { x, y, w, h, pad, lineHeight }

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
const DEBUG_PANEL_WIDTH = 280;
let debugPanelEl = null;
let gameCanvasWrapper = null;

function getGameCanvasSize() {
  return { w: windowWidth, h: windowHeight };
}

function setup() {
  const size = getGameCanvasSize();
  const cnv = createCanvas(size.w, size.h);
  gameCanvasWrapper = createDiv('');
  gameCanvasWrapper.class('game-canvas-wrapper');
  gameCanvasWrapper.parent('game-container');
  cnv.parent(gameCanvasWrapper);
  cnv.style('display', 'block');
  cnv.elt.setAttribute('touch-action', 'none');

  computeLayout();
  initGame();

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
  // 右上角交換區：寬約 26% 畫布，高約 18%，內有兩格
  const margin = Math.min(width * 0.02, 12);
  const zoneW = width * 0.26;
  const zoneH = height * 0.18;
  swapZone = {
    x: width - zoneW - margin,
    y: margin,
    w: zoneW,
    h: zoneH,
    gap: Math.min(10, zoneW * 0.08),
    pad: Math.min(12, zoneW * 0.06)
  };
  const innerW = swapZone.w - 2 * swapZone.pad;
  swapZone.slotW = (innerW - swapZone.gap) / SWAP_ZONE_SLOTS;
  swapZone.slotH = swapZone.h - 2 * swapZone.pad;

  // 最下面：已交換區（顯示實際發生過的交換）
  const historyZoneH = Math.min(height * 0.14, 80);
  swapHistoryZone = {
    x: margin,
    y: height - historyZoneH - margin,
    w: width - 2 * margin,
    h: historyZoneH,
    pad: 8,
    lineHeight: 18
  };
}

function getSwapZoneSlotCenter(slotIndex) {
  if (!swapZone || slotIndex < 0 || slotIndex >= SWAP_ZONE_SLOTS) return null;
  const cx = swapZone.x + swapZone.pad + slotIndex * (swapZone.slotW + swapZone.gap) + swapZone.slotW / 2;
  const cy = swapZone.y + swapZone.pad + swapZone.slotH / 2;
  return { x: cx, y: cy };
}

function initGame() {
  gameState = 'idle';
  startTime = null;
  endTime = null;
  draggedItem = null;
  stateHistory = [];
  highlightLog = [];
  swapHistory = [];
  historyStep = 0;
  prevHoverTargetItem = null;

  // 27 個物品：每種類型 9 個（A、B、C 各 9 份）
  const allItems = [];
  for (let t = 0; t < ITEM_TYPES.length; t++) {
    for (let i = 0; i < ITEMS_PER_TYPE; i++) {
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
  setReplayButtonRect();
  pushStateToHistory('init');
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

function draw() {
  // 每幀都檢查過關（9 櫃每櫃 3 格全部同一種才過關），避免漏判
  if (cells) checkWin();

  background(26, 26, 46);

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
    // 亮起來變化時記錄：從無→有 或 從 A→B
    if (hoverTargetItem && (!prevHoverTargetItem || prevHoverTargetItem.cellIndex !== hoverTargetItem.cellIndex || prevHoverTargetItem.slotIndex !== hoverTargetItem.slotIndex)) {
      pushHighlightLog(hoverTargetItem.cellIndex, hoverTargetItem.slotIndex, '拖曳滑過此格 (pointer 在物品上)');
    }
    prevHoverTargetItem = hoverTargetItem;
  } else {
    hoverTargetItem = null;
    prevHoverTargetItem = null;
  }
  drawShelves();
  drawShelfSeparators();
  drawSwapZone();
  drawSwapHistoryZone();
  // 拖動時畫出可放置的格子範圍（方便除錯）
  if (DEBUG && draggedItem !== null) {
    drawDropZones();
  }
  drawItems();
  if (draggedItem !== null) {
    drawOneItem(dragX, dragY, draggedItem.typeIndex, true, false);
  }
  drawTimer();
  if (gameState === 'idle' || gameState === 'playing') {
    drawWinConditionHint();
    drawShelfCompletionOnScreen();
  }
  if (gameState === 'completed') {
    drawResultOverlay();
  }
  if (DEBUG) {
    logDebugToConsole();
  }
}

function drawSwapZone() {
  if (!swapZone) return;
  // 青綠色背景（圓角矩形）
  fill(72, 209, 204);  // 青綠色 medium turquoise
  noStroke();
  rect(swapZone.x, swapZone.y, swapZone.w, swapZone.h, 10);
  // 兩格：較深邊框區分
  fill(255, 255, 255, 35);
  stroke(52, 160, 155);
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
  fill(30, 50, 50);
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
      fill(20, 40, 45);
      text(str, cen.x, cen.y);
    }
  }
}

function drawSwapHistoryZone() {
  if (!swapHistoryZone) return;
  // 背景（較深色區分）
  fill(45, 55, 75);
  noStroke();
  rect(swapHistoryZone.x, swapHistoryZone.y, swapHistoryZone.w, swapHistoryZone.h, 8);
  // 標題
  fill(200, 210, 220);
  textAlign(LEFT, TOP);
  textSize(Math.min(14, swapHistoryZone.w * 0.035));
  text('已交換區', swapHistoryZone.x + swapHistoryZone.pad, swapHistoryZone.y + swapHistoryZone.pad);
  // 列出實際交換：櫃X 格Y ↔ 櫃X 格Y（由舊到新，每行一筆）
  if (swapHistory.length === 0) {
    fill(120, 130, 140);
    textSize(Math.min(11, swapHistoryZone.w * 0.028));
    text('（尚無交換）', swapHistoryZone.x + swapHistoryZone.pad, swapHistoryZone.y + swapHistoryZone.pad + swapHistoryZone.lineHeight);
  } else {
    fill(180, 190, 200);
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
  const names = ['A', 'B', 'C'];
  const parts = state.map(function (v) { return v === -1 ? '-' : names[v]; });
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
  s += '\n27格狀態(A/B/C): ' + stateToString(currentState) + '\n\n';
  s += '每櫃完成狀態（過關需每櫃 3 格同類）:\n';
  const names = ['A', 'B', 'C'];
  for (let c = 0; c < NUM_CELLS; c++) {
    const list = cells[c];
    const counts = [0, 0, 0];
    for (let i = 0; i < list.length; i++) counts[list[i].typeIndex]++;
    const same = (counts[0] === ITEMS_PER_CELL || counts[1] === ITEMS_PER_CELL || counts[2] === ITEMS_PER_CELL);
    s += '  櫃' + c + ': A' + counts[0] + ' B' + counts[1] + ' C' + counts[2] + (same ? ' ✓ 完成' : ' 未完成') + '\n';
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

// 白色分隔線：3×3 書櫃網格（水平 4 條、垂直 2 條）
function drawShelfSeparators() {
  stroke(255, 255, 255);
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
  noStroke();
  for (let c = 0; c < NUM_CELLS; c++) {
    const cellCol = c % GRID_COLS;
    const cellRow = floor(c / GRID_COLS);
    const x = cellCol * cellW;
    const y = shelfY + cellRow * cellH;
    fill(94, 69, 52);
    rect(x + 4, y, cellW - 8, cellH - 4, 8);
    fill(139, 90, 43);
    rect(x + 8, y + 6, cellW - 16, cellH - 16, 4);
    fill(60, 45, 35);
    const baseX = x + pad;
    const baseY = y + pad;
    for (let s = 0; s < ITEMS_PER_CELL; s++) {
      const col = s % SLOTS_GRID_COLS;
      const row = floor(s / SLOTS_GRID_COLS);
      const sx = baseX + col * (slotW + gap) + slotW / 2;
      const sy = baseY + row * (slotH + gap) + slotH / 2;
      ellipse(sx, sy, slotW * 0.85, slotH * 0.85);
    }
    fill(255);
    textAlign(CENTER, BOTTOM);
    textSize(Math.min(14, cellW * 0.12));
    text('櫃' + c, x + cellW / 2, y - 2);
  }
}

function drawItems() {
  for (let c = 0; c < NUM_CELLS; c++) {
    for (let s = 0; s < cells[c].length; s++) {
      if (draggedItem && draggedItem.cellIndex === c && draggedItem.slotIndex === s) continue;
      const item = cells[c][s];
      const isHighlight = hoverTargetItem && hoverTargetItem.cellIndex === c && hoverTargetItem.slotIndex === s;
      drawOneItem(item.displayX, item.displayY, item.typeIndex, false, isHighlight);
    }
  }
}

function drawOneItem(x, y, typeIndex, isDragging, isHighlight) {
  if (isHighlight === undefined) isHighlight = false;
  const t = ITEM_TYPES[typeIndex];
  const pad = 10;
  const gap = 6;
  const slotW = (cellW - 2 * pad - (SLOTS_GRID_COLS - 1) * gap) / SLOTS_GRID_COLS;
  const slotH = (cellH - 2 * pad - (SLOTS_GRID_ROWS - 1) * gap) / SLOTS_GRID_ROWS;
  const baseSize = Math.min(slotW, slotH) * 0.82;
  const size = isDragging ? baseSize * 1.15 : baseSize;
  push();
  if (isDragging) {
    drawingContext.shadowOffsetX = 4;
    drawingContext.shadowOffsetY = 4;
    drawingContext.shadowBlur = 12;
    drawingContext.shadowColor = 'rgba(0,0,0,0.4)';
  }
  fill(t.color[0], t.color[1], t.color[2]);
  if (isHighlight) {
    stroke(255, 220, 80);
    strokeWeight(4);
  } else {
    stroke(40);
    strokeWeight(isDragging ? 3 : 1.5);
  }
  rectMode(CENTER);
  rect(x, y, size * 1.4, size, 6);
  noStroke();
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(Math.max(12, size * 0.45));
  text(t.name, x, y);
  pop();
}

function drawTimer() {
  if (gameState !== 'playing' && gameState !== 'completed') return;
  const elapsed = gameState === 'completed'
    ? (endTime - startTime) / 1000
    : (millis() - startTime) / 1000;
  fill(255);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(Math.min(28, width * 0.06));
  text('時間: ' + elapsed.toFixed(1) + ' 秒', 20, 18);
}

function drawWinConditionHint() {
  fill(200, 220, 255);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(Math.min(14, width * 0.03));
  text('過關：9 櫃（3×3）每櫃 3 格需「全部同一種」（A、B 或 C）', 20, 52);
}

// 在畫面上直接顯示每櫃完成狀態，方便看出「為什麼還沒過關」
function drawShelfCompletionOnScreen() {
  if (gameState !== 'playing') return;
  const ts = Math.min(12, width * 0.022);
  textSize(ts);
  textAlign(LEFT, TOP);
  let y = 72;
  for (let c = 0; c < NUM_CELLS; c++) {
    const list = cells[c];
    const counts = [0, 0, 0];
    for (let i = 0; i < list.length; i++) counts[list[i].typeIndex]++;
    const same = (counts[0] === ITEMS_PER_CELL || counts[1] === ITEMS_PER_CELL || counts[2] === ITEMS_PER_CELL);
    fill(same ? 120 : 255, same ? 255 : 200, same ? 120 : 200);
    const line = '櫃' + c + ': A' + counts[0] + ' B' + counts[1] + ' C' + counts[2] + (same ? ' ✓' : ' 未完成');
    text(line, 20, y);
    y += ts + 2;
  }
}

function drawResultOverlay() {
  fill(0, 0, 0, 180);
  rect(0, 0, width, height);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(Math.min(36, width * 0.08));
  text('過關！', width / 2, height * 0.42);
  textSize(Math.min(28, width * 0.06));
  const sec = ((endTime - startTime) / 1000).toFixed(1);
  text('耗時 ' + sec + ' 秒', width / 2, height * 0.5);

  fill(52, 152, 219);
  stroke(255);
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
  if (targetCell >= 0 && targetCell !== draggedItem.cellIndex) {
    if (cells[targetCell].length < ITEMS_PER_CELL) {
      // 目標格未滿：直接移入
      const item = cells[draggedItem.cellIndex].splice(draggedItem.slotIndex, 1)[0];
      cells[targetCell].push(item);
      placed = true;
    } else {
      // 目標格已滿：必須放開在「該櫃的某一個具體格（物品）」上才交換，不能只在櫃邊界就交換
      const hit = hitTestItemExcluding(px, py, draggedItem.cellIndex, draggedItem.slotIndex);
      if (hit && hit.cellIndex === targetCell) {
        const swapSlot = hit.slotIndex;
        const srcCell = draggedItem.cellIndex;
        const srcSlot = draggedItem.slotIndex;
        const myItem = cells[srcCell].splice(srcSlot, 1)[0];
        const theirItem = cells[targetCell].splice(swapSlot, 1)[0];
        cells[targetCell].splice(swapSlot, 0, myItem);   // 我的放到目標格的那一槽
        cells[srcCell].splice(srcSlot, 0, theirItem);    // 他的放到來源格的那一槽
        placed = true;
        swapHistory.push({
          from: { cell: srcCell, slot: srcSlot },
          to: { cell: targetCell, slot: swapSlot }
        });
        if (swapHistory.length > SWAP_HISTORY_MAX) swapHistory.shift();
      }
      // 若沒壓到目標櫃的任一物品（只在櫃邊界／空白），不交換，物品彈回
    }
  }
  const srcCell = draggedItem.cellIndex;
  if (!placed) {
    // 彈回原格（updateItemPositions 會重算位置）
    const item = cells[draggedItem.cellIndex][draggedItem.slotIndex];
    item.displayX = dragX;
    item.displayY = dragY;
  }
  draggedItem = null;
  lastReleaseLog = {
    targetCell: targetCell,
    placed: placed,
    px: px,
    py: py,
    cellCounts: cells.map(function (list) { return list.length; })
  };
  if (placed) {
    const label = (cells[targetCell].length === ITEMS_PER_CELL && targetCell !== srcCell)
      ? 'swap C' + srcCell + '↔C' + targetCell
      : 'drop C' + srcCell + '→C' + targetCell;
    pushStateToHistory(label);
  }
  if (DEBUG) console.log('[pointerReleased] px=' + px + ' py=' + py + ' targetCell=' + targetCell + ' placed=' + placed + ' cells=' + JSON.stringify(lastReleaseLog.cellCounts));
  updateItemPositions();
  if (placed) checkWin();
}

function checkWin() {
  if (gameState === 'completed' || !cells) return;
  // 過關條件：9 櫃 × 每櫃 3 格，且每櫃 3 格全部同一種（A／B／C）
  for (let c = 0; c < NUM_CELLS; c++) {
    const list = cells[c];
    if (!list || list.length !== ITEMS_PER_CELL) return;
    const t = Number(list[0].typeIndex);
    if (Number.isNaN(t) || t < 0 || t > 2) return;
    for (let s = 1; s < list.length; s++) {
      if (Number(list[s].typeIndex) !== t) return;
    }
  }
  gameState = 'completed';
  if (startTime == null) startTime = millis();
  endTime = millis();
  console.log('[checkWin] 過關！耗時 ' + ((endTime - startTime) / 1000).toFixed(1) + ' 秒');
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
