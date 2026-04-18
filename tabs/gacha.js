// ════════════════════════════════════════════
// GACHA SYSTEM - BULLETPROOF VERSION
// ════════════════════════════════════════════

function renderGachaTabHTML() {
    document.getElementById('tab-gacha').innerHTML = `
        <div class="gacha-banner">
            <button class="gacha-info-btn" onclick="openGachaIndexModal()">ℹ️ Tỉ Lệ & Tướng</button>
            <div class="gacha-content">
                <div class="gacha-title">CẦU NGUYỆN ĐỘC TÔN</div>
                <div class="gacha-desc">Giao ước linh hồn, triệu hồi Cực Phẩm Anime.</div>
                <div class="gacha-pity" id="gacha-pity-display">Pity 6⭐: 0/1000 | Pity 5⭐: 0/50</div>
                
                <div style="display:flex; justify-content:center; align-items:center; gap:10px; margin-bottom:15px;">
                    <button class="action-btn" style="width:40px;height:40px;border-radius:50%;font-size:20px;padding:0;" onclick="adjustRollAmount(-1)">-</button>
                    <input type="number" id="roll-amount" value="10" min="1" max="50" onchange="updateRollButton()" oninput="updateRollButton()" style="width:70px; height:40px; text-align:center; background:rgba(0,0,0,0.6); color:#fff; border:2px solid var(--cyan); border-radius:8px; font-size:18px; font-weight:700; outline:none;">
                    <button class="action-btn" style="width:40px;height:40px;border-radius:50%;font-size:20px;padding:0;" onclick="adjustRollAmount(1)">+</button>
                </div>

                <button class="gacha-btn" id="btn-roll-custom" onclick="rollCustom()">Quay 10x (10,000 💎)</button>
            </div>
        </div>

        <div class="card">
            <div class="card-header"><h2>🎒 Kho Linh Hồn Của Bạn</h2><span style="color:var(--cyan);font-size:12px;" id="gacha-soul-count">0 Nhân vật</span></div>
            <div id="gacha-inventory-list" style="margin-top:15px; display:grid; grid-template-columns:repeat(auto-fill, minmax(100px, 1fr)); gap:10px;"></div>
        </div>

        <div class="gacha-modal" id="gacha-result-modal" style="z-index:9999;">
            <h2 style="color:#fff; text-shadow:0 0 10px var(--gold); font-size:24px; text-transform:uppercase; margin-bottom:10px; text-align:center;" id="gacha-result-title">Kết quả Cầu Nguyện</h2>
            <div class="gacha-results-grid" id="gacha-results-grid"></div>
            <button class="gacha-close-btn" onclick="closeGachaModal()" style="opacity:1; animation:none; margin-top:20px;">Xác Nhận</button>
        </div>
        
        <div class="gacha-modal" id="gacha-index-modal" style="z-index:9999;">
            <div class="gacha-index-container" style="width:90%;max-width:600px;max-height:85vh;background:#1a1a1a;border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:20px;display:flex;flex-direction:column;">
                <h2 style="color:#fff;text-shadow:0 0 10px var(--cyan);font-size:20px;text-transform:uppercase;margin-bottom:15px;text-align:center;">Chi Tiết Tỉ Lệ Gacha</h2>
                <div id="gacha-index-list" style="flex:1;overflow-y:auto;"></div>
                <button class="action-btn main-btn danger-btn" onclick="closeGachaIndexModal()" style="margin-top:15px;">Đóng</button>
            </div>
        </div>
    `;
}

function adjustRollAmount(delta) {
    try {
        let input = document.getElementById('roll-amount'); if(!input) return;
        let val = parseInt(input.value) || 1; val += delta;
        if(val < 1) val = 1; if(val > 50) val = 50; input.value = val; updateRollButton();
    } catch(e) { console.error(e); }
}

function updateRollButton() {
    try {
        let input = document.getElementById('roll-amount'); let btn = document.getElementById('btn-roll-custom');
        if(!input || !btn) return;
        let amount = parseInt(input.value) || 1;
        if(amount < 1) { amount = 1; input.value = 1; } if(amount > 50) { amount = 50; input.value = 50; }
        let cost = amount * 1000;
        if((userData.linhThach || 0) < cost) { btn.disabled = true; btn.innerText = `Thiếu Linh Thạch (${cost.toLocaleString()} 💎)`; } 
        else { btn.disabled = false; btn.innerText = `Quay ${amount}x (${cost.toLocaleString()} 💎)`; }
    } catch(e) { console.error(e); }
}

function renderGachaTab() {
    try {
        if(!userData.gacha) userData.gacha = { pity5: 0, pity6: 0, totalRolls: 0 };
        let p6 = userData.gacha.pity6 || 0; let p5 = userData.gacha.pity5 || 0;
        let display = document.getElementById('gacha-pity-display');
        if(display) display.innerText = `Pity 6⭐: ${p6}/1000 | Pity 5⭐: ${p5}/50`;
        updateRollButton();
        renderGachaInventory();
    } catch(e) { console.error(e); }
}

function renderGachaInventory() {
    try {
        let container = document.getElementById('gacha-inventory-list');
        let countEl = document.getElementById('gacha-soul-count');
        if(!container || !userData.souls) return;

        let soulKeys = Object.keys(userData.souls).filter(key => ANIME_SOULS.find(s => s.id === key));
        if(countEl) countEl.innerText = `${soulKeys.length} / ${ANIME_SOULS.length} Nhân vật`;

        if (soulKeys.length === 0) {
            container.innerHTML = '<div style="color:var(--text-muted);font-size:13px;grid-column:1/-1;text-align:center;">Kho trống. Hãy quay Gacha!</div>';
            return;
        }

        let sortedSouls = soulKeys.map(key => {
            return { db: ANIME_SOULS.find(s => s.id === key), data: userData.souls[key] };
        }).sort((a, b) => b.db.star - a.db.star || a.db.name.localeCompare(b.db.name));

        container.innerHTML = sortedSouls.map(item => {
            let db = item.db; let d = item.data;
            return `
                <div style="background:rgba(0,0,0,0.5);border:1px solid ${db.color};border-radius:8px;padding:10px;text-align:center;display:flex;flex-direction:column;align-items:center;">
                    <img src="${db.img}" style="width:40px;height:40px;object-fit:cover;border-radius:50%;margin-bottom:5px;border:2px solid ${db.color};" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"><div style="display:none;font-size:28px;margin-bottom:5px;">${db.emoji}</div>
                    <div style="font-size:11px;font-weight:700;color:${db.color};margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:100%;">${db.name}</div>
                    <div style="font-size:10px;color:var(--text-muted);margin-bottom:5px;">${'⭐'.repeat(db.star)}</div>
                    <div style="font-size:10px;background:rgba(255,255,255,0.1);padding:2px 8px;border-radius:10px;color:var(--gold);font-weight:bold;">Số lượng: ${d.count}</div>
                </div>
            `;
        }).join('');
    } catch(e) { console.error("Lỗi vẽ Kho Gacha:", e); }
}

function getRandomSoul(starRank) {
    let pool = ANIME_SOULS.filter(s => s.star === starRank);
    return pool[Math.floor(Math.random() * pool.length)];
}

function rollOnce() {
    if(!userData.gacha) userData.gacha = { pity5: 0, pity6: 0, totalRolls: 0 };
    userData.gacha.pity6++; userData.gacha.pity5++; userData.gacha.totalRolls++;
    let is6Star = false, is5Star = false;

    if (userData.gacha.pity6 >= 1000) { is6Star = true; } else if (userData.gacha.pity5 >= 50) { is5Star = true; }
    let rand = Math.random(); 
    if (!is6Star && !is5Star) {
        if (rand < 0.001) is6Star = true; else if (rand < 0.006) is5Star = true; 
        else if (rand < 0.25) return getRandomSoul(4); else return getRandomSoul(3); 
    }
    if (is6Star) { userData.gacha.pity6 = 0; return getRandomSoul(6); }
    if (is5Star) { userData.gacha.pity5 = 0; return getRandomSoul(5); }
}

function rollCustom() {
    try {
        let input = document.getElementById('roll-amount');
        let amount = parseInt(input.value) || 1; if(amount < 1 || amount > 50) return;
        let cost = amount * 1000;
        if ((userData.linhThach || 0) < cost) { showToast("Không đủ Linh Thạch!", "error"); return; }
        
        // Trừ tiền
        userData.linhThach -= cost; 
        let results = []; let hasHighTier = false;
        
        // Bảo vệ dữ liệu
        if(!userData.souls) userData.souls = {};

        for (let i = 0; i < amount; i++) {
            let soul = rollOnce(); 
            if(!soul) continue; // Chống lỗi rỗng
            
            let isNew = false;
            if (!userData.souls[soul.id]) { 
                userData.souls[soul.id] = { level: 1, exp: 0, count: 1 }; isNew = true; 
            } else { 
                userData.souls[soul.id].count++; 
            }
            if (soul.star >= 5) hasHighTier = true;
            results.push({ soul: soul, isNew: isNew });
        }

        saveData(); 
        updateGlobalLT(); 
        renderGachaTab();
        showGachaResults(results, hasHighTier); // Hiển thị Modal ngay sau khi trừ tiền
        
    } catch(e) {
        alert("Bắt được lỗi lúc Quay: " + e.message); // In lỗi thẳng ra mặt luôn
    }
}

function showGachaResults(results, hasHighTier) {
    try {
        let modal = document.getElementById('gacha-result-modal');
        let grid = document.getElementById('gacha-results-grid');
        let title = document.getElementById('gacha-result-title');
        
        if(!modal || !grid || !title) {
            alert("Lỗi: Không tìm thấy cái bảng Modal trong HTML!"); return;
        }

        grid.innerHTML = '';
        title.style.color = hasHighTier ? 'var(--red)' : '#fff';
        title.innerText = hasHighTier ? "✦ THẦN QUANG GIÁNG THẾ ✦" : "KẾT QUẢ CẦU NGUYỆN";

        results.forEach((res, index) => {
            let soul = res.soul;
            let starStr = '⭐'.repeat(soul.star);
            let delay = Math.min(index * 0.05, 1.5); 
            let newTag = res.isNew ? '<div class="g-card-new">NEW</div>' : '';
            
            let avatarHtml = `<img src="${soul.img}" class="g-card-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"><div class="g-card-emoji" style="display:none; font-size:32px;">${soul.emoji}</div>`;
            
            grid.innerHTML += `
                <div class="gacha-card star-${soul.star}" style="animation-delay: ${delay}s;">
                    ${newTag}
                    <div class="g-card-img-container">${avatarHtml}</div>
                    <div class="g-card-name" style="color:${soul.color}">${soul.name}</div>
                    <div class="g-card-stars">${starStr}</div>
                </div>
            `;
        });

        modal.style.display = 'flex'; // Dùng thẳng lệnh display:flex thay vì classList để ép nó phải hiện
        modal.classList.add('active');
        
    } catch(e) {
        alert("Bắt được lỗi lúc Hiện Kết Quả: " + e.message);
    }
}

function closeGachaModal() { 
    let modal = document.getElementById('gacha-result-modal');
    if(modal) {
        modal.style.display = 'none'; // Ép nó tắt đi
        modal.classList.remove('active'); 
    }
}

function openGachaIndexModal() {
    let list = document.getElementById('gacha-index-list');
    let tiers = [
        { star: 6, name: "CỰC PHẨM (6⭐)", rate: "0.1%", color: "var(--red)" },
        { star: 5, name: "HUYỀN THOẠI (5⭐)", rate: "0.5%", color: "var(--gold)" },
        { star: 4, name: "SỬ THI (4⭐)", rate: "24.4%", color: "var(--purple)" },
        { star: 3, name: "HIẾM (3⭐)", rate: "75%", color: "#3B82F6" }
    ];
    let html = '';
    tiers.forEach(t => {
        let souls = ANIME_SOULS.filter(s => s.star === t.star);
        let soulsHtml = souls.map(s => {
            let avatarHtml = `<img src="${s.img}" style="width:100%;height:40px;object-fit:contain;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"><div style="display:none; width:100%; height:40px; justify-content:center; align-items:center; font-size:24px;">${s.emoji}</div>`;
            return `<div style="background:#111; border:1px solid ${t.color}; border-radius:6px; padding:8px 4px; text-align:center;">
                        <div style="width:100%;height:40px;display:flex;justify-content:center;align-items:center;margin-bottom:5px;">${avatarHtml}</div>
                        <div style="font-size:10px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:${s.color};">${s.name}</div>
                    </div>`;
        }).join('');
        html += `<div style="margin-bottom:20px;"><div style="display:flex;justify-content:space-between;align-items:center;font-size:16px;font-weight:700;padding-bottom:5px;margin-bottom:10px;color:${t.color};border-bottom:2px solid ${t.color};"><span>${t.name}</span><span style="background:rgba(255,255,255,0.1);padding:2px 8px;border-radius:10px;">Tỉ lệ: ${t.rate}</span></div><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(70px,1fr));gap:10px;">${soulsHtml}</div></div>`;
    });
    list.innerHTML = html; 
    let modal = document.getElementById('gacha-index-modal');
    modal.style.display = 'flex';
    modal.classList.add('active');
}

function closeGachaIndexModal() { 
    let modal = document.getElementById('gacha-index-modal');
    modal.style.display = 'none';
    modal.classList.remove('active'); 
}