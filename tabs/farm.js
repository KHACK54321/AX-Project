// ════════════════════════════════════════════
// FARM TAB — VIP PRO REDESIGN
// ════════════════════════════════════════════
var plotSelecting    = [];
var currentFarmTab   = 'ruong';
var _seedModalTarget = -1;

// ── HTML Skeleton ──────────────────────────
function renderFarmTabHTML() {
    document.getElementById('tab-farm').innerHTML = `

    <!-- Seed Modal -->
    <div id="seed-modal-overlay" onclick="_seedOverlayClick(event)">
        <div id="seed-modal">
            <div class="sm-handle"></div>
            <div class="sm-header">
                <span class="sm-title">🌱 Chọn Hạt Giống</span>
                <button class="sm-close" onclick="closeSeedModal()">×</button>
            </div>
            <div class="sm-grid" id="sm-grid"></div>
        </div>
    </div>

    <!-- Resource strip -->
    <div class="farm-hdr">
        <div class="farm-res-strip">
            <div class="farm-res-pill">
                <div class="r-icon">🌿</div>
                <div>
                    <span class="r-lbl">Thảo Dược</span>
                    <span class="r-val" id="farm-linhthao">0</span>
                </div>
            </div>
            <div class="farm-res-pill gold-pill">
                <div class="r-icon">
                    <img src="img/linhthach.png" alt="💎"
                         onerror="this.outerHTML='<span style=\\'font-size:22px;\\'>💎</span>'">
                </div>
                <div>
                    <span class="r-lbl">Linh Thạch</span>
                    <span class="r-val" id="farm-linhthach">0</span>
                </div>
            </div>
        </div>
    </div>

    <!-- Sub nav -->
    <nav class="farm-nav">
        <button class="farm-nav-btn active" id="fnav-ruong" onclick="showFarmTab('ruong', event)">
            <span class="nav-icon">🌾</span>Vườn Thuốc
        </button>
        <button class="farm-nav-btn" id="fnav-lo" onclick="showFarmTab('lo', event)">
            <span class="nav-icon">⚗️</span>Luyện Đan
        </button>
        <button class="farm-nav-btn" id="fnav-upg" onclick="showFarmTab('upg', event)">
            <span class="nav-icon">⚙️</span>Nâng Cấp
        </button>
    </nav>

    <!-- ═══ PANE: Vườn Thuốc ═══ -->
    <div id="farm-ruong-content" class="farm-pane active">
        <!-- Quick actions -->
        <div class="farm-actions-bar">
            <button class="farm-act-btn fab-harvest" id="btn-harvest-all" onclick="harvestAll()">
                🌟 Thu Tất
            </button>
            <button class="farm-act-btn fab-plant" onclick="plantAllEmpty()">
                🌱 Trồng Tất
            </button>
            <button class="farm-act-btn fab-sell" id="btn-sell-all" onclick="sellAllInventory()">
                💰 Bán Hết
            </button>
        </div>

        <!-- Plot grid -->
        <div class="farm-grid" id="farm-plots-grid"></div>

        <!-- Inventory -->
        <div class="f-card inv-section">
            <div class="f-card-hdr">
                <span class="f-card-title">🎒 Kho Thảo Dược</span>
                <span class="inv-count" id="inv-total-count"></span>
            </div>
            <div class="inv-grid" id="crop-inventory-list"></div>
        </div>
    </div>

    <!-- ═══ PANE: Luyện Đan ═══ -->
    <div id="farm-lo-content" class="farm-pane">

        <!-- Active furnace hero -->
        <div class="furnace-hero" id="furnace-hero-card">
            <div class="furnace-fire-wrap" id="furnace-hero-icon">⚗️</div>
            <div class="furnace-info">
                <div class="furnace-name" id="furnace-hero-name">Lò Cơ Bản</div>
                <div class="furnace-desc" id="furnace-hero-desc">Không có lò đang dùng</div>
                <div class="furnace-bonuses" id="furnace-hero-bonuses"></div>
            </div>
        </div>

        <!-- Pill selector -->
        <div class="f-card">
            <div class="f-card-hdr">
                <span class="f-card-title">📖 Chọn Đan Dược</span>
            </div>
            <div class="pill-pick-grid" id="pill-selector"></div>
        </div>

        <!-- Selected pill detail + craft -->
        <div class="f-card">
            <div id="selected-pill-info"></div>
            <button class="btn-craft" id="btn-start-craft" onclick="startCraft()">
                🔥 Bắt Đầu Luyện
            </button>
        </div>

        <!-- Queue -->
        <div class="f-card queue-section">
            <div class="f-card-hdr">
                <span class="f-card-title">⏳ Hàng Luyện</span>
                <span class="queue-slots" id="queue-count">0/1</span>
            </div>
            <div id="factory-queue"></div>
        </div>

        <!-- Pill inventory -->
        <div class="f-card">
            <div class="f-card-hdr">
                <span class="f-card-title">💊 Kho Đan Dược</span>
            </div>
            <div class="pill-inv-grid" id="completed-pills-list"></div>
        </div>
    </div>

    <!-- ═══ PANE: Nâng Cấp ═══ -->
    <div id="farm-upg-content" class="farm-pane">

        <!-- Stats summary -->
        <div class="farm-stat-card">
            <div class="farm-stat-grid" id="farm-stat-grid"></div>
        </div>

        <div id="upgrades-list"></div>
    </div>
    `;
}

// ── Init ───────────────────────────────────
function initFarmData() {
    if(!userData.farm) userData.farm = {
        lastSave:Date.now(), linhthao:0,
        plots:[{cropType:null},{cropType:null},{cropType:null}],
        factory:{queue:[], selectedPill:0, completedPills:{0:0,1:0,2:0,3:0,4:0}},
        upgrades:{speedUp:false, furnaceUp:false},
        upgrades2:{plotSlot:0, queueSlot:0, craftAll:false, cropSpeed:0, sellBonus:0, waterSys:0},
        furnaces:{owned:[], active:-1}, inventory:{}, pillInv:{}
    };
    if(!userData.farm.pillInv)    userData.farm.pillInv = {};
    if(!userData.farm.inventory)  userData.farm.inventory = {};
    if(!userData.farm.furnaces)   userData.farm.furnaces = {owned:[], active:-1};
    if(!userData.farm.upgrades2)  userData.farm.upgrades2 = {plotSlot:0, queueSlot:0, craftAll:false, cropSpeed:0, sellBonus:0, waterSys:0};
    if(userData.farm.upgrades2.rareSeed      === undefined) userData.farm.upgrades2.rareSeed      = 0;
    if(userData.farm.upgrades2.alchemyMastery=== undefined) userData.farm.upgrades2.alchemyMastery= 0;
    if(userData.farm.upgrades2.furnaceSpeed  === undefined) userData.farm.upgrades2.furnaceSpeed  = 0;
    if(userData.farm.factory && userData.farm.factory.queue) {
        userData.farm.factory.queue = userData.farm.factory.queue.filter(q => q && PILLS[q.pillType]);
    }
    let needed = 3 + (userData.farm.upgrades2.plotSlot||0);
    while(userData.farm.plots.length < needed) userData.farm.plots.push({cropType:null});
}

// ── Tab switch ─────────────────────────────
function showFarmTab(id, ev) {
    document.querySelectorAll('.farm-pane').forEach(c=>c.classList.remove('active'));
    document.querySelectorAll('.farm-nav-btn').forEach(b=>b.classList.remove('active'));
    document.getElementById('farm-'+id+'-content').classList.add('active');
    document.getElementById('fnav-'+id).classList.add('active');
    currentFarmTab = id;
    renderFarmAll();
}

function renderFarmAll() {
    if(currentFarmTab==='ruong') { renderFarmGrid(); renderCropInventory(); _updateFarmActionBtns(); }
    if(currentFarmTab==='lo')    { renderAlchemy(); }
    if(currentFarmTab==='upg')   { renderFarmUpgrades(); }
}

function updateFarmResourceDisplay() {
    let sumThao = 0;
    if(userData.farm && userData.farm.inventory) Object.values(userData.farm.inventory).forEach(v => sumThao += (v||0));
    let elT = document.getElementById('farm-linhthao');
    let elL = document.getElementById('farm-linhthach');
    if(elT) elT.textContent = sumThao.toLocaleString();
    if(elL) elL.textContent = Math.floor(userData.linhThach||0).toLocaleString();
}

function _updateFarmActionBtns() {
    let hBtn = document.getElementById('btn-harvest-all');
    let sBtn = document.getElementById('btn-sell-all');
    if(hBtn) {
        let hasReady = userData.farm.plots.some(p => p.done);
        hBtn.disabled = !hasReady;
    }
    if(sBtn) {
        let hasItems = Object.values(userData.farm.inventory).some(v => v > 0);
        sBtn.disabled = !hasItems;
    }
}

// ════════════════════════════════════════════
// FARM GRID — PLOTS
// ════════════════════════════════════════════
function getCropDuration(idx) { return Math.max(1, Math.floor(CROPS[idx].duration * getCropSpeedMult())); }

function renderFarmGrid() {
    let container = document.getElementById('farm-plots-grid'); if(!container) return;
    let now = Date.now();
    let maxPlots = 3 + (userData.farm.upgrades2.plotSlot||0);
    let html = '';

    for(let i=0; i<maxPlots; i++) {
        let plot = userData.farm.plots[i];
        if(!plot) { plot = {cropType:null}; userData.farm.plots[i] = plot; }
        html += _buildPlotCard(plot, i, now);
    }
    container.innerHTML = html;
}

function _buildPlotCard(plot, i, now) {
    // Empty
    if(plot.cropType === null) {
        return `<div class="plot-card pc-empty" onclick="openSeedModal(${i})">
            <div class="pc-empty-icon">＋</div>
            <div class="pc-empty-lbl">Trồng</div>
        </div>`;
    }
    let crop = CROPS[plot.cropType];
    // Ready
    if(plot.done) {
        return `<div class="plot-card pc-ready" onclick="harvestPlot(${i})">
            <div class="plot-ring-wrap">
                <div class="plot-emoji-inner">${crop.emoji}</div>
            </div>
            <div class="plot-ready-lbl">Thu Hoạch!</div>
            <div class="pc-crop-name">${crop.name}</div>
        </div>`;
    }
    // Growing — compute ring
    let durMs    = getCropDuration(plot.cropType) * 1000;
    let elapsed  = now - plot.plantedAt;
    let remSec   = Math.max(0, Math.ceil((durMs - elapsed) / 1000));
    let pct      = Math.min(1, elapsed / durMs);
    let R=24, C=2*Math.PI*R, dash=C*pct, gap=C*(1-pct);
    return `<div class="plot-card pc-growing">
        <div class="plot-ring-wrap">
            <svg class="plot-ring-svg" viewBox="0 0 58 58">
                <circle class="plot-ring-bg" cx="29" cy="29" r="${R}"/>
                <circle class="plot-ring-fg" cx="29" cy="29" r="${R}"
                    stroke-dasharray="${dash.toFixed(2)} ${gap.toFixed(2)}"
                    id="pring-${i}"/>
            </svg>
            <div class="plot-emoji-inner">${crop.emoji}</div>
        </div>
        <div class="plot-timer-lbl" id="pt-${i}">${fmt(remSec)}</div>
        <div class="pc-crop-name">${crop.name}</div>
    </div>`;
}

// ── Seed Modal ─────────────────────────────
function openSeedModal(plotIdx) {
    _seedModalTarget = plotIdx;
    let grid = document.getElementById('sm-grid'); if(!grid) return;
    grid.innerHTML = CROPS.map((c, idx) => {
        let dur = getCropDuration(idx);
        let sell = getSellPrice(idx);
        return `<div class="sm-seed-card" onclick="plantSeed(${plotIdx},${idx})">
            <span class="ss-emoji">${c.emoji}</span>
            <span class="ss-name">${c.name}</span>
            <span class="ss-time">⏱ ${fmtHuman(dur)}</span>
            <span class="ss-yield">+${c.yield} 🌿</span>
            <span class="ss-sell">${sell}💎/bán</span>
        </div>`;
    }).join('');
    let ov = document.getElementById('seed-modal-overlay');
    ov.classList.add('open');
}
function closeSeedModal() {
    document.getElementById('seed-modal-overlay').classList.remove('open');
    _seedModalTarget = -1;
}
function _seedOverlayClick(e) {
    if(e.target.id === 'seed-modal-overlay') closeSeedModal();
}
// Keep old compat refs
function openSeedSelector(i) { openSeedModal(i); }
function cancelPlant(i)      { closeSeedModal(); }

function plantSeed(plotIdx, cropType) {
    userData.farm.plots[plotIdx] = { cropType, plantedAt: Date.now(), done: false };
    closeSeedModal();
    saveData(); renderFarmGrid(); _updateFarmActionBtns();
}

// ── Harvest ────────────────────────────────
function harvestPlot(plotIdx) {
    let p = userData.farm.plots[plotIdx]; if(!p.done) return;
    let baseYield = CROPS[p.cropType].yield;
    let finalYield = Math.floor(baseYield * (1 + (userData.farm.upgrades2.sellBonus||0)*0.15));
    let rareLvl = userData.farm.upgrades2.rareSeed || 0;
    if(rareLvl > 0 && Math.random() < rareLvl*0.05) {
        finalYield *= 2;
        showToast("✨ Đột Biến! Nhân đôi thu hoạch.", "success");
    }
    userData.farm.inventory[p.cropType] = (userData.farm.inventory[p.cropType]||0) + finalYield;
    userData.totalCropsHarvested = (userData.totalCropsHarvested||0) + 1;
    userData.farm.plots[plotIdx] = {cropType:null};
    checkAchievements(); saveData(); renderFarmGrid(); renderCropInventory();
    updateFarmResourceDisplay(); _updateFarmActionBtns();
    showToast(`+${finalYield} ${CROPS[p.cropType].name} 🌿`, "success");
}

function harvestAll() {
    let count = 0;
    userData.farm.plots.forEach((p, i) => {
        if(!p.done) return;
        let baseYield = CROPS[p.cropType].yield;
        let fy = Math.floor(baseYield * (1 + (userData.farm.upgrades2.sellBonus||0)*0.15));
        let rareLvl = userData.farm.upgrades2.rareSeed || 0;
        if(rareLvl > 0 && Math.random() < rareLvl*0.05) fy *= 2;
        userData.farm.inventory[p.cropType] = (userData.farm.inventory[p.cropType]||0) + fy;
        userData.farm.plots[i] = {cropType:null};
        userData.totalCropsHarvested = (userData.totalCropsHarvested||0) + 1;
        count++;
    });
    if(count > 0) {
        checkAchievements(); saveData(); renderFarmGrid(); renderCropInventory();
        updateFarmResourceDisplay(); _updateFarmActionBtns();
        showToast(`Thu hoạch ${count} ô thành công! 🌟`, "success");
    }
}

function plantAllEmpty() {
    // Plant empty slots with CROPS[0] (fastest)
    let planted = 0;
    userData.farm.plots.forEach((p, i) => {
        if(p.cropType === null) {
            userData.farm.plots[i] = { cropType: 0, plantedAt: Date.now(), done: false };
            planted++;
        }
    });
    if(planted > 0) { saveData(); renderFarmGrid(); _updateFarmActionBtns(); showToast(`Đã trồng ${planted} ô Tụ Linh Thảo! 🌱`, "info"); }
    else showToast("Không có ô trống!", "error");
}

function sellAllInventory() {
    let total = 0;
    for(let i=0; i<CROPS.length; i++) {
        let cnt = userData.farm.inventory[i] || 0;
        if(cnt > 0) {
            total += cnt * getSellPrice(i);
            userData.farm.inventory[i] = 0;
        }
    }
    if(total > 0) {
        userData.linhThach = (userData.linhThach||0) + total;
        saveData(); updateGlobalLT(); renderCropInventory(); updateFarmResourceDisplay(); _updateFarmActionBtns();
        showToast(`Bán hết! Nhận ${total.toLocaleString()} 💎`, "success");
    } else showToast("Kho trống!", "error");
}

function sellCrop(cropIdx) {
    let cnt = userData.farm.inventory[cropIdx] || 0;
    if(cnt <= 0) return;
    let gain = cnt * getSellPrice(cropIdx);
    userData.farm.inventory[cropIdx] = 0;
    userData.linhThach = (userData.linhThach||0) + gain;
    saveData(); updateGlobalLT(); renderCropInventory(); updateFarmResourceDisplay(); _updateFarmActionBtns();
    showToast(`Bán ${cnt} ${CROPS[cropIdx].name} → +${gain}💎`, "success");
}

// ── Inventory ──────────────────────────────
function renderCropInventory() {
    let list = document.getElementById('crop-inventory-list'); if(!list) return;
    let totalCount = 0;
    let html = '';
    for(let i=0; i<CROPS.length; i++) {
        let cnt = userData.farm.inventory[i] || 0;
        if(cnt > 0) {
            totalCount += cnt;
            html += `<div class="inv-item">
                <span class="ii-emoji">${CROPS[i].emoji}</span>
                <span class="ii-name">${CROPS[i].name}</span>
                <span class="ii-count">×${cnt.toLocaleString()}</span>
                <button class="ii-sell" onclick="sellCrop(${i})">
                    Bán +${(cnt*getSellPrice(i)).toLocaleString()}💎
                </button>
            </div>`;
        }
    }
    list.innerHTML = html || `<div class="inv-empty">Kho trống. Hãy gieo hạt và thu hoạch! 🌱</div>`;
    let tc = document.getElementById('inv-total-count');
    if(tc) tc.textContent = totalCount > 0 ? `${totalCount.toLocaleString()} cây` : '';
}

// ── Offline catchup ────────────────────────
function offlineFarmCatchup() {
    let now = Date.now();
    userData.farm.plots.forEach(p => {
        if(p.cropType !== null && !p.done && p.plantedAt) {
            if(now - p.plantedAt >= getCropDuration(p.cropType)*1000) p.done = true;
        }
    });
    if(userData.farm.factory && userData.farm.factory.queue) {
        userData.farm.factory.queue.forEach(item => {
            if(item && item.startedAt && !item.done) {
                let dur = getFactoryDuration(item.pillType)*1000;
                if(Date.now() - item.startedAt >= dur) { item.done=true; item.startedAt=0; }
            }
        });
    }
}

// ════════════════════════════════════════════
// ALCHEMY — LUYỆN ĐAN
// ════════════════════════════════════════════
function getFactoryDuration(idx) {
    let mult = typeof getFactorySpeedMult === 'function' ? getFactorySpeedMult() : 1.0;
    let fsLvl = userData.farm.upgrades2 && userData.farm.upgrades2.furnaceSpeed ? userData.farm.upgrades2.furnaceSpeed : 0;
    mult *= Math.max(0.1, 1 - fsLvl*0.05);
    return Math.max(1, Math.floor(PILLS[idx].craftDuration * mult));
}

function selectPill(idx) {
    userData.farm.factory.selectedPill = idx;
    saveData(); renderAlchemy();
}

function renderAlchemy() {
    _renderFurnaceHero();
    _renderPillSelector();
    _renderPillDetail();
    renderQueue();
    renderCompletedPills();
}

function _renderFurnaceHero() {
    let af = userData.farm.furnaces.active >= 0 ? FURNACES[userData.farm.furnaces.active] : null;
    let card = document.getElementById('furnace-hero-card');
    let iconEl = document.getElementById('furnace-hero-icon');
    let nameEl = document.getElementById('furnace-hero-name');
    let descEl = document.getElementById('furnace-hero-desc');
    let bonEl  = document.getElementById('furnace-hero-bonuses');
    if(!card) return;
    if(af) {
        card.classList.add('active-furnace');
        if(iconEl) iconEl.innerHTML = `<img src="${af.img}" alt="🏺" onerror="this.outerHTML='<span style=\\'font-size:28px;\\'>🏺</span>'">`;
        if(nameEl) nameEl.textContent = af.name;
        if(descEl) descEl.textContent = af.desc;
        if(bonEl) bonEl.innerHTML = `
            <span class="f-bonus-chip spd">⚡ -${Math.round(af.timeRed*100)}% Thời gian</span>
            ${af.expBonus > 1 ? `<span class="f-bonus-chip exp">⭐ +${Math.round((af.expBonus-1)*100)}% EXP</span>` : ''}
        `;
    } else {
        card.classList.remove('active-furnace');
        if(iconEl) iconEl.textContent = '⚗️';
        if(nameEl) nameEl.textContent = 'Không có lò hoạt động';
        if(descEl) descEl.textContent = 'Mua lò ở tab Nâng Cấp để tăng hiệu suất';
        if(bonEl) bonEl.innerHTML = '';
    }
}

function _renderPillSelector() {
    let el = document.getElementById('pill-selector'); if(!el) return;
    el.innerHTML = PILLS.map((p, idx) => {
        let sel = userData.farm.factory.selectedPill === idx;
        let perm = p.isPerm ? 'perm-pill' : '';
        let selCls = sel ? 'selected' : '';
        let badge = p.isPerm ? '<span class="pc-perm-badge">★</span>' : '';
        return `<div class="pill-card ${perm} ${selCls}" onclick="selectPill(${idx})">
            ${badge}
            <span class="pc-emoji">${p.emoji}</span>
            <span class="pc-name">${p.name}</span>
        </div>`;
    }).join('');
}

function _renderPillDetail() {
    let pIdx = userData.farm.factory.selectedPill || 0;
    let p    = PILLS[pIdx];
    let infoEl  = document.getElementById('selected-pill-info');
    let craftBtn = document.getElementById('btn-start-craft');
    if(!infoEl || !craftBtn || !p) return;

    let canCraft = true;
    let recipeHtml = '';

    if(p.recipe) {
        recipeHtml = `<div class="recipe-label">Nguyên Liệu</div>
            <div class="recipe-grid">
            ${p.recipe.map(r => {
                let owned = userData.farm.inventory[r.id] || 0;
                let ok    = owned >= r.qty;
                if(!ok) canCraft = false;
                return `<div class="recipe-item ${ok?'ri-ok':'ri-fail'}">
                    <span class="ri-emoji">${CROPS[r.id].emoji}</span>
                    <span class="ri-name">${CROPS[r.id].name}</span>
                    <span class="ri-count">${owned}/${r.qty}</span>
                </div>`;
            }).join('')}
            </div>`;
    } else {
        let lt    = userData.linhThach || 0;
        let ok    = lt >= p.cost;
        if(!ok) canCraft = false;
        let cls   = ok ? 'can-afford' : 'cant-afford';
        recipeHtml = `<div class="recipe-label">Chi Phí</div>
            <div class="pill-lt-cost ${cls}">
                <span style="font-size:20px;">💎</span>
                <span style="font-size:14px;font-weight:800;">${p.cost.toLocaleString()}</span>
                <span style="font-size:11px;color:var(--text-muted);">/ ${Math.floor(lt).toLocaleString()} sở hữu</span>
            </div>`;
    }

    let titleColor = p.isPerm ? 'var(--red)' : 'var(--cyan)';
    let expText    = p.isPerm ? `✦ ${p.desc}` : `+${getPillExp(pIdx).toLocaleString()} ⚡ Tu Vi`;
    infoEl.innerHTML = `
        <div class="pill-detail-top">
            <div class="pill-detail-emoji">${p.emoji}</div>
            <div class="pill-detail-meta">
                <div class="pill-detail-name" style="color:${titleColor};">${p.name}</div>
                <div class="pill-detail-sub">
                    <span class="pill-sub-chip">⏱ ${fmtHuman(getFactoryDuration(pIdx))}</span>
                    <span class="pill-sub-chip" style="color:${p.isPerm?'var(--red)':'var(--green)'};">${expText}</span>
                </div>
            </div>
        </div>
        ${recipeHtml}
    `;
    craftBtn.disabled = !canCraft;
}

function startCraft() {
    let pIdx = userData.farm.factory.selectedPill || 0;
    let f    = userData.farm.factory;
    let maxSlot = 1 + (userData.farm.upgrades2.queueSlot||0);
    if(f.queue.length >= maxSlot) { showToast("Hàng chờ đã đầy!", "error"); return; }
    let pill = PILLS[pIdx];
    if(pill.recipe) {
        for(let r of pill.recipe) { if((userData.farm.inventory[r.id]||0) < r.qty) { showToast("Không đủ thảo dược!", "error"); return; } }
        for(let r of pill.recipe) { userData.farm.inventory[r.id] -= r.qty; }
    } else {
        if((userData.linhThach||0) < pill.cost) { showToast("Không đủ Linh Thạch!", "error"); return; }
        userData.linhThach -= pill.cost;
    }
    let isRunning  = f.queue.some(x => x.startedAt > 0);
    let canAll     = userData.farm.upgrades2.craftAll;
    let startT     = (isRunning && !canAll) ? 0 : Date.now();
    f.queue.push({ pillType: pIdx, startedAt: startT, done: false });
    saveData(); updateGlobalLT(); updateFarmResourceDisplay(); renderAlchemy();
    showToast("Đưa vào lò thành công! 🔥", "success");
}

function renderQueue() {
    let f = userData.farm.factory;
    let maxSlot = 1 + (userData.farm.upgrades2.queueSlot||0);
    let qc = document.getElementById('queue-count');
    if(qc) qc.textContent = `${f.queue.length}/${maxSlot}`;
    let qEl = document.getElementById('factory-queue'); if(!qEl) return;
    if(f.queue.length === 0) {
        qEl.innerHTML = `<div class="queue-empty">🪄 Hàng chờ trống. Hãy chọn đan dược và luyện!</div>`;
        return;
    }
    let now = Date.now();
    qEl.innerHTML = f.queue.map((item, i) => {
        if(!item || !PILLS[item.pillType]) return '';
        let p = PILLS[item.pillType];
        if(item.done) {
            return `<div class="queue-item qi-done">
                <div class="qi-top">
                    <div class="qi-emoji">${p.emoji}</div>
                    <div class="qi-info">
                        <div class="qi-name">${p.name}</div>
                        <div class="qi-status qs-done">✅ Hoàn Thành!</div>
                    </div>
                    <div class="qi-btn">
                        <button class="farm-act-btn fab-harvest" style="width:auto;padding:8px 16px;font-size:11px;" onclick="collectPill(${i})">NHẬN</button>
                    </div>
                </div>
                <div class="qi-bar-wrap"><div class="qi-bar" style="width:100%;"></div></div>
            </div>`;
        }
        if(item.startedAt) {
            let durMs = getFactoryDuration(item.pillType)*1000;
            let rem   = Math.max(0, Math.ceil((durMs-(now-item.startedAt))/1000));
            let pct   = Math.min(100, ((now-item.startedAt)/durMs*100)).toFixed(1);
            return `<div class="queue-item qi-running">
                <div class="qi-top">
                    <div class="qi-emoji">${p.emoji}</div>
                    <div class="qi-info">
                        <div class="qi-name">${p.name}</div>
                        <div class="qi-status qs-running" id="fq-timer-${i}">🔥 Còn ${fmt(rem)}</div>
                    </div>
                    <div class="qi-btn">
                        <button class="farm-act-btn fab-sell" style="width:auto;padding:6px 12px;font-size:10px;" onclick="cancelPillCraft(${i})">Hủy</button>
                    </div>
                </div>
                <div class="qi-bar-wrap"><div class="qi-bar" style="width:${pct}%;" id="fq-bar-${i}"></div></div>
            </div>`;
        }
        return `<div class="queue-item qi-waiting">
            <div class="qi-top">
                <div class="qi-emoji" style="opacity:0.5;">${p.emoji}</div>
                <div class="qi-info">
                    <div class="qi-name" style="opacity:0.7;">${p.name}</div>
                    <div class="qi-status qs-wait">⏳ Đang xếp hàng...</div>
                </div>
                <div class="qi-btn">
                    <button class="farm-act-btn fab-sell" style="width:auto;padding:6px 12px;font-size:10px;" onclick="cancelPillCraft(${i})">Hủy</button>
                </div>
            </div>
        </div>`;
    }).join('');
}

function cancelPillCraft(qIdx) {
    let item = userData.farm.factory.queue[qIdx]; let p = PILLS[item.pillType];
    if(p.recipe) { for(let r of p.recipe) userData.farm.inventory[r.id] = (userData.farm.inventory[r.id]||0)+r.qty; }
    else { userData.linhThach = (userData.linhThach||0) + p.cost; }
    userData.farm.factory.queue.splice(qIdx, 1);
    let canAll = userData.farm.upgrades2.craftAll;
    if(!canAll && userData.farm.factory.queue.length > 0) {
        let hasRun = userData.farm.factory.queue.some(x => x.startedAt > 0);
        if(!hasRun) userData.farm.factory.queue[0].startedAt = Date.now();
    }
    saveData(); updateGlobalLT(); renderFarmAll(); showToast("Đã hủy & hoàn trả nguyên liệu.", "info");
}

function collectPill(qIdx) {
    let item = userData.farm.factory.queue[qIdx]; let p = PILLS[item.pillType];
    userData.farm.factory.queue.splice(qIdx, 1);
    let amount = 1;
    let mastery = userData.farm.upgrades2.alchemyMastery || 0;
    if(mastery > 0 && Math.random() < mastery*0.02) { amount=2; showToast("✨ Đan Thần Kích Hoạt! Nhân đôi.", "success"); }
    if(p.isPerm) {
        userData.farm.pillInv[item.pillType] = (userData.farm.pillInv[item.pillType]||0)+amount;
        showToast(`Nhận ${amount}× ${p.name}! ✦`, "success");
    } else {
        userData.farm.factory.completedPills[item.pillType] = (userData.farm.factory.completedPills[item.pillType]||0)+amount;
        showToast(`Thu được ${amount}× ${p.name}! 💊`, "success");
    }
    userData.totalAlchemyDone = (userData.totalAlchemyDone||0)+amount;
    let canAll = userData.farm.upgrades2.craftAll;
    if(!canAll && userData.farm.factory.queue.length > 0) {
        let hasRun = userData.farm.factory.queue.some(x => x.startedAt > 0);
        if(!hasRun) userData.farm.factory.queue[0].startedAt = Date.now();
    }
    checkAchievements(); saveData(); renderAlchemy();
}

function renderCompletedPills() {
    let list = document.getElementById('completed-pills-list'); if(!list) return;
    let html = '';
    for(let i=0; i<PILLS.length; i++) {
        let p = PILLS[i];
        if(!p.isPerm) {
            let cnt = userData.farm.factory.completedPills[i] || 0;
            if(cnt > 0) {
                let pExp = typeof getPillExp==='function' ? getPillExp(i) : (PILLS[i].exp||0);
                html += `<div class="pill-inv-item">
                    <span class="pii-emoji">${p.emoji}</span>
                    <span class="pii-name">${p.name}</span>
                    <span class="pii-count">×${cnt.toLocaleString()}</span>
                    <button class="pii-use-btn" onclick="usePill(${i})">
                        Dùng<br>+${pExp.toLocaleString()}⚡
                    </button>
                </div>`;
            }
        } else {
            let cnt = userData.farm.pillInv[i] || 0;
            if(cnt > 0) {
                html += `<div class="pill-inv-item perm-item">
                    <span class="pii-emoji">${p.emoji}</span>
                    <span class="pii-name" style="color:var(--gold);">${p.name}</span>
                    <span class="pii-count" style="color:var(--red);">×${cnt.toLocaleString()}</span>
                    <span class="pii-note">Dùng ở Tab Linh Hồn</span>
                </div>`;
            }
        }
    }
    list.innerHTML = html || `<div class="inv-empty">Kho đan dược trống. Hãy luyện đan! 💊</div>`;
}

function usePill(idx) {
    if((userData.farm.factory.completedPills[idx]||0) > 0) {
        userData.farm.factory.completedPills[idx]--;
        let expGain = typeof getPillExp==='function' ? getPillExp(idx) : (PILLS[idx].exp||0);
        addExp(expGain); saveData(); renderAlchemy(); updateUI();
        showToast(`Dùng đan → +${expGain.toLocaleString()} Tu Vi ⚡`, "success");
    }
}

// ════════════════════════════════════════════
// TIMERS
// ════════════════════════════════════════════
function farmTick() {
    let now = Date.now();
    if(currentFarmTab === 'ruong') {
        let changed = false;
        userData.farm.plots.forEach((plot, i) => {
            if(plot.cropType!==null && !plot.done && plot.plantedAt) {
                let durMs = getCropDuration(plot.cropType)*1000;
                let rem   = Math.ceil((durMs-(now-plot.plantedAt))/1000);
                if(rem <= 0) { plot.done=true; changed=true; }
                else {
                    let timerEl = document.getElementById("pt-"+i);
                    if(timerEl) timerEl.textContent = fmt(rem);
                    // Update ring
                    let ringEl = document.getElementById("pring-"+i);
                    if(ringEl) {
                        let pct = Math.min(1,(now-plot.plantedAt)/durMs);
                        let R=24, C=2*Math.PI*R;
                        ringEl.setAttribute('stroke-dasharray', `${(C*pct).toFixed(2)} ${(C*(1-pct)).toFixed(2)}`);
                    }
                }
            }
        });
        if(changed) { renderFarmGrid(); saveData(); _updateFarmActionBtns(); }
    }
    if(currentFarmTab === 'lo') {
        let f = userData.farm.factory; let changed = false;
        f.queue.forEach((item, i) => {
            if(!item.done && item.startedAt) {
                let durMs = getFactoryDuration(item.pillType)*1000;
                let rem   = Math.ceil((durMs-(now-item.startedAt))/1000);
                if(rem <= 0) { item.done=true; item.startedAt=0; changed=true; }
                else {
                    let tEl = document.getElementById("fq-timer-"+i);
                    if(tEl) tEl.textContent = "🔥 Còn " + fmt(rem);
                    let bEl = document.getElementById("fq-bar-"+i);
                    if(bEl) bEl.style.width = Math.min(100,((now-item.startedAt)/durMs*100)).toFixed(1)+'%';
                }
            }
        });
        if(changed) { saveData(); renderAlchemy(); }
    }
}

function startFarmTimer() {
    if(farmInterval) clearInterval(farmInterval);
    farmInterval = setInterval(farmTick, 1000);
}

// ════════════════════════════════════════════
// UPGRADES
// ════════════════════════════════════════════
function renderFarmUpgrades() {
    if(currentFarmTab !== 'upg') return;
    let list = document.getElementById('upgrades-list'); if(!list) return;

    // ── Stats card ──
    let cs = getCropSpeedMult();
    let sell = getSellPrice(0);
    let afkH = 8 + ((userData.farm.upgrades2.afkCap||0)*2);
    let qSlot = 1 + (userData.farm.upgrades2.queueSlot||0);
    let sg = document.getElementById('farm-stat-grid');
    if(sg) sg.innerHTML = `
        <div class="farm-stat-item"><span class="fsi-val">${((1-cs)*100).toFixed(0)}%</span><span class="fsi-lbl">⚡ Tốc Trồng</span></div>
        <div class="farm-stat-item"><span class="fsi-val">${userData.farm.plots.length}</span><span class="fsi-lbl">🌾 Số Ô</span></div>
        <div class="farm-stat-item"><span class="fsi-val">${qSlot}</span><span class="fsi-lbl">🔥 Hàng Luyện</span></div>
        <div class="farm-stat-item"><span class="fsi-val">${afkH}h</span><span class="fsi-lbl">💤 AFK Tối Đa</span></div>
    `;

    // ── Furnaces ──
    let html = `<div class="upg-section-label">🔥 Lò Luyện Khí</div>`;
    FURNACES.forEach((f, i) => {
        let owned  = userData.farm.furnaces.owned.includes(i);
        let active = userData.farm.furnaces.active === i;
        let cls    = active ? 'fc-active' : (owned ? 'fc-owned' : '');
        let badge  = active ? `<div class="fc-active-badge">✦ Đang Dùng</div>` : '';
        let btn    = '';
        if(active) btn = `<button class="fc-btn fc-btn-active" disabled>Đang Dùng</button>`;
        else if(owned) btn = `<button class="fc-btn fc-btn-equip" onclick="equipFurnace(${i})">Trang Bị</button>`;
        else btn = `<button class="fc-btn fc-btn-buy" onclick="buyFurnace(${i})">${f.price.toLocaleString()} 💎</button>`;
        html += `<div class="furnace-card ${cls}">
            <div class="fc-icon-wrap">
                <img src="${f.img}" alt="🏺" onerror="this.outerHTML='<span style=\\'font-size:24px;\\'>🏺</span>'">
            </div>
            <div class="fc-info">
                <div class="fc-name">${f.name}</div>
                <div class="fc-desc">${f.desc}</div>
                ${badge}
            </div>
            ${btn}
        </div>`;
    });

    // ── Upgrades ──
    const upgIcons = { plotSlot:'🌾', queueSlot:'🔥', craftAll:'⚗️', cropSpeed:'⚡', sellBonus:'💰', waterSys:'💧', afkCap:'💤', rareSeed:'🌟', alchemyMastery:'✨', furnaceSpeed:'🌀' };
    html += `<div class="upg-section-label">⚙️ Nâng Cấp Tổng Hợp</div>`;
    FARM_UPGRADES2.forEach(u => {
        let curlv  = userData.farm.upgrades2[u.id] || 0;
        let cost   = Math.floor(u.baseCost * Math.pow(u.costMult, curlv));
        let maxed  = curlv >= u.maxLevel;
        let pct    = maxed ? 100 : (curlv / u.maxLevel * 100).toFixed(0);
        let cls    = maxed ? 'uc-maxed' : '';
        let btn    = maxed
            ? `<button class="upg-btn upg-btn-max" disabled>TỐI ĐA ✓</button>`
            : `<button class="upg-btn upg-btn-buy" onclick="buyUpg2('${u.id}',${cost},${u.maxLevel})">${cost.toLocaleString()} 💎</button>`;
        html += `<div class="upg-card ${cls}">
            <div class="upg-top">
                <div class="upg-icon">${upgIcons[u.id]||'⚙️'}</div>
                <div class="upg-meta">
                    <div class="upg-name">${u.name}</div>
                    <div class="upg-desc">${u.desc}</div>
                </div>
            </div>
            <div class="upg-bottom">
                <div class="upg-lvl-wrap">
                    <div class="upg-lvl-lbl"><span>Cấp ${curlv}/${u.maxLevel}</span><span>${pct}%</span></div>
                    <div class="upg-lvl-bar"><div class="upg-lvl-fill" style="width:${pct}%;"></div></div>
                </div>
                ${btn}
            </div>
        </div>`;
    });
    list.innerHTML = html;
}

function buyFurnace(idx) {
    if((userData.linhThach||0) >= FURNACES[idx].price) {
        userData.linhThach -= FURNACES[idx].price;
        userData.farm.furnaces.owned.push(idx);
        saveData(); updateGlobalLT(); renderFarmUpgrades();
        showToast(`Mua ${FURNACES[idx].name} thành công! 🏺`, "success");
    } else showToast("Không đủ Linh Thạch!", "error");
}

function equipFurnace(idx) {
    userData.farm.furnaces.active = idx;
    saveData(); renderFarmUpgrades();
    showToast(`Trang bị ${FURNACES[idx].name}! 🔥`, "success");
}

function buyUpg2(id, cost, max) {
    let curlv = userData.farm.upgrades2[id] || 0; if(curlv >= max) return;
    if((userData.linhThach||0) >= cost) {
        userData.linhThach -= cost;
        userData.farm.upgrades2[id] = curlv + 1;
        if(id==='plotSlot') userData.farm.plots.push({cropType:null});
        saveData(); updateGlobalLT(); updateUI(); renderFarmUpgrades();
        showToast("Nâng cấp thành công! ✦", "success");
    } else showToast("Không đủ Linh Thạch!", "error");
}
