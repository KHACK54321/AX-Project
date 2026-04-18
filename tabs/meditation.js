// ════════════════════════════════════════════
// AFK SYSTEM WITH SUMMON UI CHEST & DROP RATES
// ════════════════════════════════════════════

function renderMeditationTabHTML() {
    document.getElementById('tab-meditation').innerHTML = `
        <div class="card afk-collect-card" style="border-color:var(--gold); box-shadow:0 0 15px rgba(251,191,36,0.2);">
            <h3>🤖 Càn Quét AFK Tự Động</h3>
            <p style="font-size:11px;color:var(--text-muted);margin-bottom:15px;">Hệ thống tự động chiến đấu tại Ải cao nhất đã vượt qua.</p>
            
            <div style="display:flex; justify-content:space-around; align-items:center; background:rgba(0,0,0,0.4); padding:15px; border-radius:8px; margin-bottom:15px;">
                <div style="text-align:center;">
                    <div style="font-size:24px;color:var(--cyan);" id="afk-pending-lt">0</div>
                    <div style="font-size:10px;color:var(--text-muted);">Linh Thạch</div>
                </div>
                <div style="text-align:center;">
                    <div style="font-size:24px;color:#10B981;" id="afk-pending-exp">0</div>
                    <div style="font-size:10px;color:var(--text-muted);">Tu Vi Bản Tôn</div>
                </div>
            </div>

            <div style="font-size:12px;color:var(--text-muted);margin-bottom:15px;">
                Thời gian đã treo: <span id="afk-time-display" style="color:#fff;font-weight:700;">00:00:00</span> / <span id="afk-max-display" style="color:var(--gold);">8h</span>
            </div>
            <button class="action-btn main-btn gold-btn" id="btn-collect-afk" onclick="collectAFKReward()">Thu Hoạch</button>
        </div>

        <div class="card" style="background:rgba(0,0,0,0.6); text-align:center; position:relative;">
            <button class="gacha-info-btn" style="position:absolute; top:10px; right:10px; border:none; background:rgba(255,255,255,0.1); padding:5px 10px;" onclick="openChestRateModal()">ℹ️ Tỉ Lệ Mở</button>
            <h3 style="color:var(--gold);">📦 Rương Chiến Thắng</h3>
            <p style="font-size:11px;color:var(--text-muted);margin-bottom:10px;">Rớt ngẫu nhiên khi AFK. Có thể mở ra Tu Vi Bản Tôn hoặc Pháp Bảo.</p>
            <div style="font-size:40px; margin:10px 0; filter:drop-shadow(0 0 10px rgba(251,191,36,0.5));">📦</div>
            <div style="font-size:14px;font-weight:bold;color:#fff;">Bạn đang có: <span id="afk-chest-count" style="color:var(--gold);font-size:20px;">0</span> Rương</div>
            <button class="action-btn" style="margin-top:15px; background:var(--gold); color:#000; border:none;" onclick="openAfkChest()">Mở 1 Rương</button>
        </div>

        <div class="gacha-modal" id="afk-chest-modal">
            <h2 style="color:#fff; text-shadow:0 0 10px var(--gold); font-size:20px; text-transform:uppercase; margin-bottom:10px;" id="afk-chest-title">KẾT QUẢ MỞ RƯƠNG</h2>
            <div class="gacha-results-grid" style="display:flex; justify-content:center;" id="afk-chest-grid"></div>
            <button class="gacha-close-btn" onclick="closeAfkChestModal()">Xác Nhận</button>
        </div>

        <div class="gacha-modal" id="chest-rate-modal" style="z-index: 2000;">
            <div class="soul-detail-container" style="width: 80%; background: #111; border: 1px solid var(--gold); padding: 20px; border-radius: 12px; text-align: center;">
                <h3 style="color: var(--gold); margin-bottom: 15px; font-size: 16px;">📊 TỈ LỆ RƯƠNG CHIẾN THẮNG</h3>
                <div style="text-align: left; font-size: 13px; color: #fff; line-height: 2;">
                    <div style="display:flex; justify-content: space-between; border-bottom: 1px dashed rgba(255,255,255,0.1); padding-bottom: 5px; margin-bottom: 5px;">
                        <span>⚡ 5,000 Tu Vi Bản Tôn</span><span style="color: var(--cyan); font-weight:bold;">94.0%</span>
                    </div>
                    <div style="display:flex; justify-content: space-between; border-bottom: 1px dashed rgba(255,255,255,0.1); padding-bottom: 5px; margin-bottom: 5px;">
                        <span>🛡️/🗡️ Pháp Bảo Bất Kỳ</span><span style="color: var(--gold); font-weight:bold;">5.0%</span>
                    </div>
                    <div style="display:flex; justify-content: space-between;">
                        <span>🌟 Thần Nhân Giáng Thế (Cực Phẩm 6⭐)</span><span style="color: var(--red); font-weight:bold;">1.0%</span>
                    </div>
                </div>
                <button class="action-btn main-btn gold-btn" style="margin-top: 20px; width: 100%;" onclick="closeChestRateModal()">Đã Hiểu</button>
            </div>
        </div>
    `;
}

function openChestRateModal() {
    let modal = document.getElementById('chest-rate-modal');
    // Lấy container bên trong để nạp giao diện mới
    let container = modal.querySelector('.soul-detail-container');
    
    // Phân loại các món có thể rớt
    let tiers = [
        { name: "THẦN NHÂN (6⭐)", rate: "0.1%", color: "var(--red)", items: ANIME_SOULS.filter(s => s.id === 'megumin' || s.id === 'frieren') },
        { name: "PHÁP BẢO (5⭐)", rate: "1.0%", color: "var(--gold)", items: PHAP_BAO_DATA.filter(p => p.type === 'dmg' || p.type === 'hp') },
        { name: "TÀI NGUYÊN", rate: "98.9%", color: "var(--cyan)", items: [{ name: "5,000 Tu Vi", emoji: "⚡", color: "var(--cyan)" }] }
    ];

    let html = `
        <h2 style="color:#fff;text-shadow:0 0 10px var(--gold);font-size:20px;text-transform:uppercase;margin-bottom:15px;text-align:center;">📊 Tỉ Lệ Rương Chiến Thắng</h2>
        <div style="flex:1; overflow-y:auto; padding-right:5px;">
    `;

    tiers.forEach(t => {
        let itemsHtml = t.items.map(item => `
            <div style="background:#111; border:1px solid ${t.color}; border-radius:8px; padding:8px 4px; text-align:center;">
                <div style="font-size:24px; margin-bottom:5px;">${item.emoji || "❓"}</div>
                <div style="font-size:9px; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; color:${item.color || '#fff'};">${item.name}</div>
            </div>
        `).join('');

        html += `
            <div style="margin-bottom:20px;">
                <div style="display:flex; justify-content:space-between; align-items:center; font-size:13px; font-weight:700; padding-bottom:5px; margin-bottom:10px; color:${t.color}; border-bottom:2px solid ${t.color};">
                    <span>${t.name}</span><span style="background:rgba(255,255,255,0.1); padding:2px 8px; border-radius:10px;">${t.rate}</span>
                </div>
                <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(75px, 1fr)); gap:10px;">${itemsHtml}</div>
            </div>
        `;
    });

    html += `</div><button class="action-btn main-btn gold-btn" style="margin-top:15px;" onclick="closeChestRateModal()">Đã Hiểu</button>`;
    
    container.innerHTML = html;
    modal.classList.add('active');
}
function closeChestRateModal() { document.getElementById('chest-rate-modal').classList.remove('active'); }

function collectAFKReward() {
    syncAFK();
    var pendingLt = Math.floor(userData.afkPendingLt || 0);
    var pendingExp = Math.floor(userData.afkPendingExp || 0);

    if (pendingLt <= 0 && pendingExp <= 0) { showToast("Chưa có gì để thu hoạch!", "error"); return; }

    userData.linhThach = (userData.linhThach || 0) + pendingLt;
    addExp(pendingExp);
    
    userData.afkPendingLt = 0; userData.afkPendingExp = 0;
    userData.afkStartTime = Date.now(); userData.afkLastCheck = Date.now();

    saveData(); updateGlobalLT(); updateUI(); renderMeditation();
    showToast(`💤 Thu hoạch ${pendingLt.toLocaleString()} 💎 và ${pendingExp.toLocaleString()} ⚡!`, "success");
}

function openAfkChest() {
    if((userData.afkChests || 0) <= 0) { showToast("Không có rương nào!", "error"); return; }
    userData.afkChests--;
    
    let rand = Math.random();
    let grid = document.getElementById('afk-chest-grid');
    let title = document.getElementById('afk-chest-title');
    let modal = document.getElementById('afk-chest-modal');
    
    grid.innerHTML = '';
    
    if(rand < 0.001) {
        let pool = ANIME_SOULS.filter(s => s.id === 'megumin' || s.id === 'frieren');
        let drop = pool[Math.floor(Math.random() * pool.length)];
        if(!userData.souls[drop.id]) userData.souls[drop.id] = { level: 1, exp: 0, count: 1 };
        else userData.souls[drop.id].count++;
        
        title.style.color = "var(--red)"; title.innerText = "✦ THẦN NHÂN GIÁNG THẾ ✦";
        grid.innerHTML = `
            <div class="gacha-card star-6" style="width:120px; animation-delay: 0s;">
                <div class="g-card-img-container"><img src="${drop.img}" style="width:50px;border-radius:5px;" onerror="this.outerHTML='<div style=\\'font-size:40px;\\\\'>${drop.emoji}</div>'"></div>
                <div class="g-card-name" style="color:${drop.color}; font-size:14px;">${drop.name}</div>
                <div class="g-card-stars">⭐⭐⭐⭐⭐⭐</div>
            </div>`;
    } else if(rand < 0.01) {
        let pbs = PHAP_BAO_DATA.filter(p => p.type==='dmg' || p.type==='hp');
        let drop = pbs[Math.floor(Math.random()*pbs.length)];
        if(!userData.pbInv) userData.pbInv = []; userData.pbInv.push(drop.id);
        
        title.style.color = "var(--gold)"; title.innerText = "✦ TUYỆT ĐỈNH BẢO VẬT ✦";
        grid.innerHTML = `
            <div class="gacha-card star-5" style="width:110px; animation-delay: 0s;">
                <div class="g-card-img-container"><img src="${drop.img}" style="width:40px;object-fit:contain;" onerror="this.outerHTML='<div class=\\'g-card-emoji\\' style=\\'font-size:40px;\\\\'>${drop.emoji}</div>'"></div>
                <div class="g-card-name" style="color:var(--gold); font-size:12px; white-space:normal;">${drop.name}</div>
                <div class="g-card-stars">Pháp Bảo</div>
            </div>`;
    } else { 
        let expDrop = 5000; addExp(expDrop);
        title.style.color = "var(--cyan)"; title.innerText = "NHẬN ĐƯỢC TU VI";
        grid.innerHTML = `
            <div class="gacha-card star-3" style="width:110px; animation-delay: 0s; border-color:var(--cyan);">
                <div class="g-card-img-container"><div class="g-card-emoji" style="font-size:40px;">⚡</div></div>
                <div class="g-card-name" style="color:var(--cyan); font-size:14px; font-weight:900;">+5,000</div>
                <div class="g-card-stars">Tu Vi Bản Tôn</div>
            </div>`;
    }
    saveData(); updateUI(); renderMeditation(); modal.classList.add('active');
}

function closeAfkChestModal() { document.getElementById('afk-chest-modal').classList.remove('active'); }

function renderMeditation() {
    var elapsedMs = Math.min(Date.now() - userData.afkStartTime, getAfkLimitMs());
    var elPendingLt = document.getElementById("afk-pending-lt"); if(elPendingLt) elPendingLt.innerText = Math.floor(userData.afkPendingLt || 0).toLocaleString();
    var elPendingExp = document.getElementById("afk-pending-exp"); if(elPendingExp) elPendingExp.innerText = Math.floor(userData.afkPendingExp || 0).toLocaleString();
    var elTime = document.getElementById("afk-time-display"); if(elTime) elTime.innerText = fmt(elapsedMs / 1000);
    var elMax = document.getElementById("afk-max-display"); if(elMax) elMax.innerText = (getAfkLimitMs() / 3600000) + "h";
    var elChest = document.getElementById("afk-chest-count"); if(elChest) elChest.innerText = (userData.afkChests || 0).toLocaleString();
}