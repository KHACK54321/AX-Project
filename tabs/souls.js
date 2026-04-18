// ════════════════════════════════════════════
// ANIME SOULS & DUPLICATES FIX
// ════════════════════════════════════════════
let currentViewingSoul = null;

function renderSoulsTabHTML() {
    document.getElementById('tab-souls').innerHTML = `
        <div class="card">
            <div class="card-header"><h2>⚔️ Đội Hình Chiến Đấu</h2></div>
            <p style="font-size:11px;color:var(--text-muted);">Sắp xếp tối đa 3 Linh Hồn cực phẩm để chuẩn bị Vượt Ải. (Có thể mang tướng trùng nhau)</p>
            <div class="team-grid" id="team-slots-container"></div>
        </div>

        <div class="card">
            <div class="card-header"><h2>🔮 Kho Linh Hồn & Tu Luyện</h2></div>
            <div id="souls-cultivation-list" style="margin-top:15px; display:grid; grid-template-columns:repeat(auto-fill, minmax(100px, 1fr)); gap:10px;"></div>
        </div>

        <div class="gacha-modal" id="soul-detail-modal">
            <div class="soul-detail-container" id="soul-detail-content" style="max-height:90vh; overflow-y:auto;"></div>
        </div>
    `;
}

function renderSoulsTab() {
    let teamContainer = document.getElementById('team-slots-container');
    let listContainer = document.getElementById('souls-cultivation-list');
    if(!teamContainer || !listContainer) return;

    let teamHtml = '';
    for(let i=0; i<3; i++) {
        let soulId = userData.team[i];
        if(!soulId || !userData.souls[soulId]) {
            teamHtml += `<div class="team-slot" onclick="showToast('Hãy chọn linh hồn từ Kho bên dưới để trang bị!','info')"><span style="font-size:24px; color:rgba(255,255,255,0.3);">+</span><div style="font-size:11px; color:var(--text-muted); margin-top:5px;">Trống</div></div>`;
        } else {
            let db = ANIME_SOULS.find(s => s.id === soulId);
            let sData = userData.souls[soulId];
            teamHtml += `
                <div class="team-slot filled" style="border-color:${db.color};" onclick="openSoulDetail('${soulId}')">
                    <button class="t-slot-remove" onclick="event.stopPropagation(); unequipSoul(${i})">X</button>
                    <img src="${db.img}" class="t-slot-img" onerror="this.outerHTML='<div style=\\'font-size:32px;margin-bottom:5px;\\'>${db.emoji}</div>'">
                    <div class="t-slot-name">${db.name}</div>
                    <div class="t-slot-level">Tầng ${sData.level}</div>
                </div>`;
        }
    }
    teamContainer.innerHTML = teamHtml;

    let soulKeys = Object.keys(userData.souls).filter(key => ANIME_SOULS.find(s => s.id === key));
    if (soulKeys.length === 0) { listContainer.innerHTML = '<div style="color:var(--text-muted);font-size:13px;grid-column:1/-1;text-align:center;">Kho Linh Hồn trống. Hãy Cầu Nguyện!</div>'; return; }

    let sortedSouls = soulKeys.map(key => { return { db: ANIME_SOULS.find(s => s.id === key), data: userData.souls[key] }; }).sort((a, b) => b.db.star - a.db.star || b.data.level - a.data.level);

    listContainer.innerHTML = sortedSouls.map(item => {
        let db = item.db; let d = item.data;
        let equippedCount = userData.team.filter(t => t === db.id).length;
        let equipTag = equippedCount > 0 ? `<div style="position:absolute; top:5px; left:5px; background:var(--green); color:#000; font-size:9px; padding:2px 5px; border-radius:4px; font-weight:bold;">Đang dùng x${equippedCount}</div>` : '';
        
        return `
            <div class="upgrade-row" style="flex-direction:column; position:relative; align-items:center; text-align:center; padding:10px; cursor:pointer; border-color:${equippedCount>0 ? 'var(--green)' : 'rgba(255,255,255,0.1)'};" onclick="openSoulDetail('${db.id}')">
                ${equipTag}
                <img src="${db.img}" style="width:40px;height:40px;object-fit:cover;border-radius:50%;margin-bottom:5px;border:2px solid ${db.color};" onerror="this.outerHTML='<div style=\\'font-size:28px;margin-bottom:5px;\\'>${db.emoji}</div>'">
                <div style="font-size:11px;font-weight:700;color:${db.color};margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:100%;">${db.name}</div>
                <div style="font-size:10px;color:var(--gold);font-weight:bold;">Tầng ${d.level}</div>
            </div>`;
    }).join('');
}

function openSoulDetail(soulId) {
    let db = ANIME_SOULS.find(s => s.id === soulId); let sData = userData.souls[soulId];
    if(!db || !sData) return;
    currentViewingSoul = soulId;
    let stats = getSoulStats(db, sData); 
    
    let isMaxLevel = sData.level >= 15; let expReq = isMaxLevel ? "MAX" : SOUL_EXP_REQ[sData.level];
    let expPercent = isMaxLevel ? 100 : (sData.exp / expReq) * 100;
    
    // Kiểm tra số lượng bản sao có đủ để trang bị tiếp không
    let equippedCount = userData.team.filter(t => t === soulId).length;
    let canEquipMore = equippedCount < sData.count;

    let equipBtnHtml = `<button class="soul-equip-btn" style="background:${canEquipMore?'var(--green)':'#555'};color:#000;" ${canEquipMore?'':'disabled'} onclick="equipSoul('${soulId}')">${canEquipMore?'Cho vào Đội hình':'Hết Bản Sao'}</button>`;

    let feedHtml = isMaxLevel ? `<div style="color:var(--gold); font-weight:bold; padding:10px 0;">Đã đạt Cảnh Giới Tối Đa (Tầng 15)</div>` : `
        <div class="feed-lt-container" style="margin-bottom:10px; background:transparent; border:none; padding:0;">
            <input type="number" id="lt-feed-amount" class="feed-lt-input" style="background:rgba(0,0,0,0.5); border:1px solid var(--cyan); border-radius:6px; padding:10px;" placeholder="Nhập số 💎...">
            <button class="feed-lt-btn" style="padding:10px 15px;" onclick="feedSoul('${soulId}', 'lt')">Nâng (1💎 = 5 EXP)</button>
        </div>
    `;

    let pillHtml = '';
    if((userData.farm.pillInv[5]||0) > 0) pillHtml += `<button class="action-btn" style="background:var(--red);color:#fff;border:none;margin-bottom:5px;font-size:11px;" onclick="feedPermPill('${soulId}', 5, 'permHp', 500)">Dùng Huyết Ma Đan (${userData.farm.pillInv[5]})</button>`;
    if((userData.farm.pillInv[6]||0) > 0) pillHtml += `<button class="action-btn" style="background:var(--gold);color:#000;border:none;margin-bottom:5px;font-size:11px;" onclick="feedPermPill('${soulId}', 6, 'permAtk', 100)">Dùng Băng Hỏa Đan (${userData.farm.pillInv[6]})</button>`;
    if((userData.farm.pillInv[7]||0) > 0) pillHtml += `<button class="action-btn" style="background:var(--cyan);color:#000;border:none;margin-bottom:5px;font-size:11px;" onclick="feedPermPill('${soulId}', 7, 'permSpd', 10)">Dùng Thiên Cương Đan (${userData.farm.pillInv[7]})</button>`;
    if((userData.farm.pillInv[10]||0) > 0) pillHtml += `<button class="action-btn" style="background:var(--red);color:#fff;border:none;margin-bottom:5px;font-size:11px;box-shadow:0 0 5px var(--red);" onclick="feedPermPill('${soulId}', 10, 'permHp', 2000)">Dùng Cửu Chuyển Đan (${userData.farm.pillInv[10]})</button>`;
    if((userData.farm.pillInv[11]||0) > 0) pillHtml += `<button class="action-btn" style="background:var(--purple);color:#fff;border:none;margin-bottom:5px;font-size:11px;box-shadow:0 0 5px var(--purple);" onclick="feedPermPill('${soulId}', 11, 'permAtk', 500)">Dùng Hỗn Độn Đan (${userData.farm.pillInv[11]})</button>`;
    if((userData.farm.pillInv[12]||0) > 0) pillHtml += `<button class="action-btn" style="background:var(--cyan);color:#000;border:none;margin-bottom:5px;font-size:11px;box-shadow:0 0 5px var(--cyan);" onclick="feedPermPill('${soulId}', 12, 'permSpd', 50)">Dùng Tạo Hóa Thần Đan (${userData.farm.pillInv[12]})</button>`;

    let typeHtml = db.dmgType === 'magic' ? '<span style="color:#A855F7; font-weight:bold;">✨ Pháp Thuật</span>' : '<span style="color:#EF4444; font-weight:bold;">⚔️ Vật Lý</span>';

    // CHỈ HIỆN NỘI TẠI NẾU LÀ TƯỚNG TỪ 5 SAO TRỞ LÊN
    let passiveBox = '';
    if(db.star >= 5) {
        passiveBox = `
            <div style="background:rgba(0,0,0,0.6); border:1px solid ${db.color}; border-radius:8px; padding:12px; margin-top:15px; text-align:left;">
                <div style="color:${db.color}; font-weight:bold; font-size:13px; margin-bottom:5px; text-transform:uppercase;">🔥 Nội Tại Độc Tôn</div>
                <div style="color:#fff; font-size:11px; line-height:1.5;">${db.desc}</div>
            </div>
        `;
    }

    document.getElementById('soul-detail-content').innerHTML = `
        <button style="position:absolute;top:10px;right:15px;background:none;border:none;color:var(--text-muted);font-size:18px;cursor:pointer;" onclick="closeSoulDetail()">✖</button>
        <img src="${db.img}" class="soul-d-avatar" style="border-color:${db.color}" onerror="this.outerHTML='<div style=\\'font-size:60px;margin-bottom:10px;\\'>${db.emoji}</div>'">
        <div class="soul-d-name" style="color:${db.color}">${db.name}</div>
        <div style="font-size:12px; margin-bottom:5px;">Hệ: ${typeHtml} | Sở hữu: ${sData.count} bản sao</div>
        <div class="soul-d-stars">${'⭐'.repeat(db.star)}</div>
        
        <div class="soul-d-stats">
            <div class="soul-d-stat-item"><span class="soul-d-stat-val" style="color:#10B981">${stats.hp.toLocaleString()}</span><span class="soul-d-stat-lbl">Máu (HP)</span></div>
            <div class="soul-d-stat-item"><span class="soul-d-stat-val" style="color:#EF4444">${stats.atk.toLocaleString()}</span><span class="soul-d-stat-lbl">Công (DMG)</span></div>
            <div class="soul-d-stat-item"><span class="soul-d-stat-val" style="color:#3B82F6">${stats.spd.toLocaleString()}</span><span class="soul-d-stat-lbl">Tốc (SPD)</span></div>
        </div>

        <div class="soul-d-level-bar">
            <div class="soul-d-level-txt"><span>Cảnh Giới: Tầng ${sData.level}</span><span>${sData.exp.toLocaleString()} / ${expReq.toLocaleString()}</span></div>
            <div class="soul-d-prog-bg"><div class="soul-d-prog-fill" style="width:${expPercent}%"></div></div>
        </div>

        <div class="soul-d-actions">${feedHtml}</div>
        <div style="display:flex; flex-direction:column; margin-bottom:15px;">${pillHtml}</div>
        
        ${equipBtnHtml}
        ${passiveBox}
    `;
    document.getElementById('soul-detail-modal').classList.add('active');
}

function feedPermPill(soulId, pillId, statKey, val) {
    if(!userData.farm.pillInv[pillId] || userData.farm.pillInv[pillId] <= 0) return;
    userData.farm.pillInv[pillId]--; let sData = userData.souls[soulId];
    sData[statKey] = (sData[statKey] || 0) + val; saveData(); updateUI(); renderSoulsTab(); openSoulDetail(soulId);
    showToast(`Dược Lực Thấm Nhuần! Tăng ${val} Chỉ số vĩnh viễn.`, "success");
}

function closeSoulDetail() { document.getElementById('soul-detail-modal').classList.remove('active'); currentViewingSoul = null; }

function feedSoul(soulId, type) {
    let sData = userData.souls[soulId]; if(sData.level >= 15) return;
    let cost = 0; let expGain = 0;
    if (type === 'lt') {
        let inputEl = document.getElementById('lt-feed-amount'); if(!inputEl) return;
        cost = parseInt(inputEl.value) || 0;
        if(cost <= 0) { showToast("Vui lòng nhập số Linh thạch hợp lệ!", "error"); return; }
        if((userData.linhThach||0) < cost) { showToast("Không đủ Linh Thạch!", "error"); return; }
        expGain = cost * 5; userData.linhThach -= cost;
    }
    sData.exp += expGain; let leveledUp = false;
    while (sData.level < 15 && sData.exp >= SOUL_EXP_REQ[sData.level]) { sData.exp -= SOUL_EXP_REQ[sData.level]; sData.level++; leveledUp = true; }
    if(sData.level >= 15) sData.exp = 0; 
    saveData(); updateUI(); openSoulDetail(soulId); renderSoulsTab(); 
    if(leveledUp) showToast("✨ Đột phá Cảnh giới thành công!", "success");
}

function equipSoul(soulId) {
    let sData = userData.souls[soulId];
    let equippedCount = userData.team.filter(t => t === soulId).length;
    
    // Nếu số lượng tướng đang trang bị đã bằng số lượng bản sao sở hữu
    if (equippedCount >= sData.count) { 
        showToast("Không đủ Bản sao để trang bị thêm!", "error"); 
        return; 
    }
    
    let emptyIdx = userData.team.indexOf(null);
    if (emptyIdx === -1) { 
        showToast("Đội hình đã đầy! Vui lòng tháo bớt tướng ra trước.", "error"); 
        return; 
    }
    
    userData.team[emptyIdx] = soulId;
    saveData(); renderSoulsTab(); openSoulDetail(soulId); 
    showToast("Đã thêm vào Đội hình!", "success");
}

function unequipSoul(slotIdx) { 
    userData.team[slotIdx] = null; saveData(); renderSoulsTab(); 
    showToast("Đã tháo linh hồn", "info"); 
}