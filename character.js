// ════════════════════════════════════════════
// CHARACTER TAB HTML INJECTION
// ════════════════════════════════════════════
function renderCharacterTabHTML() {
    document.getElementById('tab-checkin').innerHTML = `
        <div class="card">
            <div class="card-header">
                <h2>Ký Danh Mỗi Ngày</h2><span id="streak-icon"></span>
            </div>
            <p>Reset vào 00:00 hàng ngày. Bỏ lỡ 1 ngày sẽ mất chuỗi và xóa Buff.</p>
            <div class="flex-row" style="margin:18px 0;">
                <div class="stat-box"><span class="num" id="consecutive-days">0</span><span class="lbl">Chuỗi Ngày</span></div>
                <div class="stat-box"><span class="num" id="buff-checkin-display">+0%</span><span class="lbl">Buff Chuỗi</span></div>
            </div>
            <button id="btn-checkin" class="action-btn main-btn" onclick="dailyCheckIn()">Ký danh nhận thưởng</button>
        </div>
        <div class="card">
            <h3>Thống Kê Đạo Hạnh</h3>
            <div class="flex-row">
                <div class="stat-box"><span class="num" id="stat-total-daily">0</span><span class="lbl">Tổng NV Ngày</span></div>
                <div class="stat-box"><span class="num" id="stat-total-weekly">0</span><span class="lbl">Tổng Mốc Tuần</span></div>
            </div>
        </div>`;

    document.getElementById('tab-tasks').innerHTML = `
        <div class="card">
            <h3>Nhiệm vụ Ngày (Random)</h3>
            <p>5 nhiệm vụ mới xuất hiện lúc 00:00 mỗi ngày.</p>
            <div id="daily-tasks-container" style="margin-top:14px;"></div>
        </div>
        <div class="card">
            <h3>Mục tiêu Tuần</h3>
            <p>Reset vào 00:00 Chủ Nhật.</p>
            <div class="task-row" style="margin-top:14px;">
                <div class="task-info">
                    <span class="task-title">Chăm chỉ (25 NV Ngày)</span>
                    <span class="task-prog">Tiến độ: <span id="prog-wt1">0</span>/25</span>
                </div>
                <span id="status-wt1" class="task-status-text">Chưa đạt</span>
            </div>
            <div class="task-row">
                <div class="task-info">
                    <span class="task-title">Bền bỉ (Điểm danh 7 ngày)</span>
                    <span class="task-prog">Tiến độ: <span id="prog-wt2">0</span>/7</span>
                </div>
                <span id="status-wt2" class="task-status-text">Chưa đạt</span>
            </div>
        </div>`;

    document.getElementById('tab-realm').innerHTML = `
        <div class="card">
            <div class="card-header">
                <h2>Bản Tôn</h2>
                <span style="font-size:12px;color:var(--cyan);font-weight:600;">Danh vọng: <span id="points">0</span></span>
            </div>
            <p class="realm-name-big" id="realm-name">Ngưng Khí Tầng 1</p>
            <div style="display:flex;justify-content:space-between;font-size:12px;margin-top:14px;color:#fff;font-weight:500;">
                <span>Tiến độ:</span><span><span id="exp">0</span> / <span id="max-exp">100</span></span>
            </div>
            <div class="progress-bar"><div class="progress" id="exp-bar"></div></div>
        </div>
        <div class="card">
            <div class="card-header" style="margin-bottom:6px;">
                <h3 style="margin:0;color:#fff;">HIỆU ỨNG TRỢ CÔNG (BUFFS)</h3>
            </div>
            <p style="font-size:11px; margin-bottom:12px;">Hệ số cộng dồn (Additive) để chống lạm phát.</p>
            <div class="task-row"><span style="font-size:13px;font-weight:500;">Buff Chuỗi Điểm Danh</span><span id="buff-checkin" class="buff-text buff-val">+0%</span></div>
            <div class="task-row"><span style="font-size:13px;font-weight:500;">Buff Thành Tích Ngày</span><span id="buff-daily" class="buff-text buff-val">+0%</span></div>
            <div class="task-row"><span style="font-size:13px;font-weight:500;">Buff Thành Tích Tuần</span><span id="buff-weekly" class="buff-text buff-val">+0%</span></div>
            <div class="task-row"><span style="font-size:13px;font-weight:500;">Buff Luyện Đan (Thành Tựu)</span><span id="buff-alchemy-ach" class="buff-text buff-val">+0%</span></div>
            <div class="task-row"><span style="font-size:13px;font-weight:500;">Buff Bán Cây (Thành Tựu)</span><span id="buff-sell-ach" class="buff-text buff-val">+0%</span></div>
            <div class="task-row"><span style="font-size:13px;font-weight:500;color:var(--purple);">Buff Pháp Bảo Tu Vi</span><span id="buff-phaobao" class="buff-text" style="color:var(--purple);">+0%</span></div>
            <div class="card-header" style="margin-top:14px;padding-bottom:0;border:none;">
                <h2 style="color:var(--cyan);">TỔNG HỆ SỐ</h2><span id="buff-total" style="color:var(--green);font-size:22px;font-weight:700;">1.00x</span>
            </div>
        </div>`;

    document.getElementById('tab-shop-pb').innerHTML = `
        <div class="card">
            <div class="card-header"><h2>🏪 Cửa Hàng Pháp Bảo</h2><span style="color:var(--cyan);">💎 <span id="shop-pb-lt">0</span></span></div>
            <p>Mua Pháp bảo tăng cực mạnh chỉ số. Mua xong hãy vào Linh Túi để trang bị.</p>
            <div id="shop-pb-list"></div>
        </div>`;

    document.getElementById('tab-inventory-pb').innerHTML = `
        <div class="card">
            <div class="card-header"><h2>🎒 Linh Túi (Trang Bị)</h2><span id="pb-equip-count" style="color:var(--gold);font-weight:700;">0/5</span></div>
            <p>Tối đa trang bị <strong>5 pháp bảo</strong>. Các chỉ số được cộng dồn (Additive) để tránh lạm phát.</p>
            <div id="equipped-pb-list" style="margin-bottom:15px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:10px;"></div>
            <h3>Kho chứa</h3>
            <div id="inventory-pb-list"></div>
        </div>`;

    document.getElementById('tab-system').innerHTML = `
        <div class="card">
            <div class="card-header"><h2>Nhật ký cập nhật</h2><button class="action-btn" onclick="fetchUpdateLog()" style="padding:8px 12px;font-size:11px;min-height:36px;">Làm Mới</button></div>
            <div class="log-box" id="update-log-box">Đang kết nối tới máy chủ đám mây...</div>
        </div>
        <div class="card">
            <h2>Bảo Mật Dữ Liệu</h2>
            <p>Copy mã dưới đây cất đi để không bao giờ mất Tu Vi.</p>
            <textarea id="backup-code" class="backup-area" placeholder="Dán mã phục hồi vào đây..."></textarea>
            <div style="display:flex;gap:12px;margin-top:14px;">
                <button class="action-btn main-btn" style="margin-top:0;" onclick="exportData()">Tạo Mã</button>
                <button class="action-btn main-btn danger-btn" style="margin-top:0;" onclick="importData()">Phục Hồi</button>
            </div>
        </div>
        <div class="card">
            <h2>Đồng Bộ Cloud</h2>
            <p>Đồng bộ dữ liệu của bạn an toàn với Google Drive cá nhân.</p>
            <div id="gdrive-section"></div>
        </div>`;
}

// ════════════════════════════════════════════
// CHECK RESETS & RANDOM TASKS
// ════════════════════════════════════════════
function checkResets() {
    var tm=getMidnight(new Date()); var ls=getLastSundayMidnight();
    if(userData.lastCheckinMidnight>0&&(tm-userData.lastCheckinMidnight>86400000))userData.checkinStreak=0;
    if(userData.lastLoginMidnight!==tm){userData.currentDailyTasks=generateRandomTasks();userData.lastLoginMidnight=tm;}
    if(userData.lastWeeklyReset!==ls){userData.weeklyTasks={dailyDone:0,checkins:0,rw1:false,rw2:false,fullCompleted:false};userData.lastWeeklyReset=ls;}
    saveData();
}
function generateRandomTasks() {
    var pool=[
        function(){var hw=Math.floor(Math.random()*10)+1;return{desc:'Hoàn thành '+hw+' bài tập',max:hw,exp:100*hw};},
        function(){var sub=Math.floor(Math.random()*3)+1;return{desc:'Học '+sub+' môn học',max:sub,exp:300*sub};},
        function(){return{desc:'Không ăn đồ ngọt',max:1,exp:1000};},
        function(){return{desc:'Dọn dẹp góc học tập',max:1,exp:700};},
        function(){return{desc:'Đọc 10 trang sách',max:10,exp:800};},
        function(){return{desc:'Giải 1 đề trắc nghiệm',max:1,exp:1500};},
        function(){return{desc:'Uống đủ 2 lít nước',max:4,exp:600};}
    ];
    pool=pool.sort(function(){return 0.5-Math.random();}).slice(0,5);
    return pool.map(function(gen){var t=gen();return{desc:t.desc,max:t.max,current:0,exp:t.exp,completed:false};});
}

// ════════════════════════════════════════════
// ADD EXP / TASKS
// ════════════════════════════════════════════
function addExp(amount) {
    if(userData.realmIndex>=realms.length-1)return;
    userData.exp += Math.floor(amount * getTuViMult().total);
    var cr = realms[userData.realmIndex];
    while(userData.exp >= cr.maxExp && userData.realmIndex < realms.length - 1) {
        userData.exp -= cr.maxExp; userData.realmIndex++;
        cr = realms[userData.realmIndex];
        showToast("✦ Đột phá! → " + realms[userData.realmIndex].name, 'success');
    }
}
function dailyCheckIn() {
    var tm = getMidnight(new Date()); userData.lastCheckinMidnight = tm;
    userData.points += 1; userData.checkinStreak += 1; userData.weeklyTasks.checkins += 1;
    addExp(500); checkWeeklyRewards(); checkAchievements(); saveData();
    showToast("✦ Ký danh thành công! +1 Danh Vọng", 'success');
}
function doDynamicTask(idx) {
    var t=userData.currentDailyTasks[idx]; if(t.completed)return;
    t.current+=1;
    if(t.current>=t.max){
        t.completed=true; userData.totalDailyTasksDone+=1; userData.weeklyTasks.dailyDone+=1;
        addExp(t.exp); checkWeeklyRewards(); checkAchievements();
        showToast("✓ Hoàn thành nhiệm vụ!",'success');
    }
    saveData();
}
function checkWeeklyRewards() {
    if(userData.weeklyTasks.dailyDone>=25&&!userData.weeklyTasks.rw1){userData.weeklyTasks.rw1=true;addExp(3500);showToast("Mốc tuần: Chăm chỉ!",'success');}
    if(userData.weeklyTasks.checkins>=7&&!userData.weeklyTasks.rw2){userData.weeklyTasks.rw2=true;addExp(2100);showToast("Mốc tuần: Bền bỉ!",'success');}
    if(userData.weeklyTasks.rw1&&userData.weeklyTasks.rw2&&!userData.weeklyTasks.fullCompleted){userData.weeklyTasks.fullCompleted=true;userData.totalWeeklyTasksDone+=1;}
}

// ════════════════════════════════════════════
// BACKUP / RESTORE
// ════════════════════════════════════════════
function exportData() {
    try{var code=btoa(encodeURIComponent(JSON.stringify(userData)));document.getElementById("backup-code").value=code;
        if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(code).then(function(){showToast("✓ Đã copy mã sao lưu!",'success');}).catch(function(){try{document.getElementById("backup-code").select();document.execCommand('copy');showToast("✓ Đã copy!",'success');}catch(e2){showToast("Mã đã tạo! Copy thủ công.",'info');}});}
        else{try{document.getElementById("backup-code").select();document.execCommand('copy');showToast("✓ Đã copy!",'success');}catch(e){showToast("Mã đã tạo! Copy thủ công.",'info');}}}
    catch(e){showToast("❌ Lỗi tạo sao lưu",'error');}
}
function importData() {
    var code=document.getElementById("backup-code").value.trim();if(!code)return;
    if(!confirm("Phục hồi sẽ ghi đè dữ liệu hiện tại. Xác nhận?"))return;
    try{var decoded=JSON.parse(decodeURIComponent(atob(code)));
        if(typeof decoded.exp==='undefined'||typeof decoded.realmIndex==='undefined'){showToast("❌ Mã không hợp lệ",'error');return;}
        decoded=migrateData(decoded);userData=Object.assign({},userData,decoded,{weeklyTasks:Object.assign({},userData.weeklyTasks,decoded.weeklyTasks)});
        initFarmData();saveData();updateUI();showToast("✓ Phục hồi thành công!",'success');document.getElementById("backup-code").value="";}
    catch(e){showToast("❌ Mã không hợp lệ",'error');}
}
function fetchUpdateLog() {
    fetch("https://raw.githubusercontent.com/KHACK54321/AX-Project/refs/heads/main/updatelog.txt?v="+new Date().getTime())
        .then(function(r){return r.text();}).then(function(t){document.getElementById("update-log-box").innerText=t;}).catch(function(){});
}

// ════════════════════════════════════════════
// VERSION CHECK
// ════════════════════════════════════════════
function checkForUpdate() {
    fetch("https://raw.githubusercontent.com/KHACK54321/AX-Project/refs/heads/main/version.txt?v="+Date.now())
        .then(function(r){return r.text();}).then(function(t){
            var remote=t.trim();
            if(isNewerVersion(remote,APP_VERSION)) showToast("🔄 Có bản cập nhật mới! Tải lại để nhận.",'info','Tải lại',function(){location.reload(true);});
        }).catch(function(){});
}
function isNewerVersion(remote,local) {
    var r=remote.split('.').map(Number),l=local.split('.').map(Number);
    for(var i=0;i<Math.max(r.length,l.length);i++){var rv=r[i]||0,lv=l[i]||0;if(rv>lv)return true;if(rv<lv)return false;}
    return false;
}

// ════════════════════════════════════════════
// PHÁP BẢO RENDER
// ════════════════════════════════════════════
function buyPhapBao(id) {
    let item = PHAP_BAO_DATA.find(p => p.id === id);
    if(userData.pbInv.includes(id) || (userData.linhThach || 0) < item.price) return;
    userData.linhThach -= item.price; userData.pbInv.push(id);
    saveData(); renderShopPB(); updateGlobalLT(); updateUI(); renderMeditation(); showToast("Đã mua " + item.name, "success");
}
function toggleEquipPB(id) {
    let idx = userData.pbEquipped.indexOf(id);
    if(idx > -1) { userData.pbEquipped.splice(idx, 1); }
    else { if(userData.pbEquipped.length >= 5) { showToast("Tối đa 5 pháp bảo!", "error"); return; } userData.pbEquipped.push(id); }
    saveData(); renderInventoryPB(); updateUI(); renderMeditation();
}
function renderShopPB() {
    let el = document.getElementById('shop-pb-list'); if(!el) return;
    document.getElementById('shop-pb-lt').innerText = Math.floor(userData.linhThach || 0);
    el.innerHTML = PHAP_BAO_DATA.map(pb => {
        let owned = userData.pbInv.includes(pb.id);
        return `<div class="upgrade-row ${owned ? 'owned-card' : ''}"><div class="upgrade-info" style="display:flex;gap:10px;align-items:center;"><div style="font-size:32px;">${pb.emoji}</div><div><div class="upgrade-name">${pb.name}</div><div class="upgrade-desc" style="color:var(--cyan);font-weight:600;">${pb.desc}</div></div></div><button class="upg-btn lt-upg-btn" ${owned?'disabled':''} onclick="buyPhapBao('${pb.id}')">${owned?'✅ Sở Hữu':pb.price+'💎'}</button></div>`;
    }).join('');
}
function renderInventoryPB() {
    let invEl = document.getElementById('inventory-pb-list'); let eqEl = document.getElementById('equipped-pb-list'); if(!invEl || !eqEl) return;
    document.getElementById('pb-equip-count').innerText = userData.pbEquipped.length + "/5";
    invEl.innerHTML = userData.pbInv.map(id => { let pb = PHAP_BAO_DATA.find(p => p.id === id); if(userData.pbEquipped.includes(id)) return '';
        return `<div class="inv-row"><span style="font-size:28px;flex-shrink:0;text-align:center;width:40px;">${pb.emoji}</span><div class="inv-info"><div class="inv-name">${pb.name}</div><div class="inv-count">${pb.desc}</div></div><button class="inv-btn use-btn" onclick="toggleEquipPB('${pb.id}')">Trang bị</button></div>`;
    }).join('');
    eqEl.innerHTML = userData.pbEquipped.map(id => { let pb = PHAP_BAO_DATA.find(p => p.id === id);
        return `<div class="inv-row" style="background:rgba(0,210,255,0.05); border-color:var(--cyan);"><span style="font-size:28px;flex-shrink:0;text-align:center;width:40px;">${pb.emoji}</span><div class="inv-info"><div class="inv-name" style="color:var(--cyan);">${pb.name} (Đang dùng)</div><div class="inv-count" style="color:var(--cyan);">${pb.desc}</div></div><button class="inv-btn sell-btn" onclick="toggleEquipPB('${pb.id}')">Tháo</button></div>`;
    }).join('');
}