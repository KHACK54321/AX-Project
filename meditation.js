// ════════════════════════════════════════════
// MEDITATION TAB HTML INJECTION
// ════════════════════════════════════════════
function renderMeditationTabHTML() {
    document.getElementById('tab-meditation').innerHTML = `
        <div class="card afk-collect-card">
            <h3>💎 Đang Tích Lũy AFK</h3>
            <div class="meditation-timer-display" id="afk-pending-lt">0</div>
            <div style="font-size:12px;color:var(--text-muted);margin-bottom:15px;">
                Thời gian đã treo: <span id="afk-time-display" style="color:#fff;font-weight:700;">00:00:00</span> / <span id="afk-max-display" style="color:var(--gold);">8h</span>
            </div>
            <button class="action-btn main-btn gold-btn" id="btn-collect-afk" onclick="collectAFKReward()">Thu Hoạch Linh Thạch</button>
        </div>

        <div class="card">
            <h3>Trạng Thái Tốc Độ</h3>
            <div class="flex-row" style="margin-top:10px;">
                <div class="stat-box"><span class="num" id="afk-rate">1.0</span><span class="lbl">Tốc độ (💎/phút)</span></div>
                <div class="stat-box"><span class="num" id="afk-limit-h" style="color:var(--gold);">8h</span><span class="lbl">Giới hạn Max</span></div>
            </div>
        </div>
        <div class="card">
            <h3>Bonus Treo Máy (Cộng Dồn)</h3>
            <div class="task-row"><span style="font-size:13px;">Buff Thành Tựu AFK</span><span id="buff-med-ach" style="color:var(--cyan);font-weight:700;">+0%</span></div>
            <div class="task-row"><span style="font-size:13px;color:var(--purple);">Buff Pháp Bảo AFK</span><span id="buff-med-phaobao" style="color:var(--purple);font-weight:700;">+0%</span></div>
        </div>`;
}

// ════════════════════════════════════════════
// AFK COLLECT & RENDER
// ════════════════════════════════════════════
function collectAFKReward() {
    syncAFK();
    var earned = Math.floor(userData.afkPendingLt || 0);
    if(earned < 1) { showToast("Chưa có đủ Linh Thạch để thu hoạch!", "info"); return; }

    userData.linhThach = (userData.linhThach || 0) + earned;
    userData.afkPendingLt = 0;
    userData.afkStartTime = Date.now();
    userData.afkLastCheck = Date.now();

    var todayStr=new Date().toDateString();
    if(!userData.meditation) userData.meditation={today:0,date:'',streak:0,lastFullDate:''};
    if(userData.meditation.date!==todayStr){userData.meditation.today=0;userData.meditation.date=todayStr;}
    userData.meditation.today=(userData.meditation.today||0)+1;
    if(userData.meditation.today>=3) userData.meditation.lastFullDate=todayStr;
    var yestStr=new Date(Date.now()-86400000).toDateString();
    if(userData.meditation.streak===0&&userData.meditation.lastFullDate===yestStr){userData.meditation.streak=1;}
    else if(userData.meditation.lastFullDate===yestStr&&userData.meditation.date!==yestStr){userData.meditation.streak=(userData.meditation.streak||0)+1;}

    checkAchievements(); saveData(); updateUI(); renderMeditation();
    showToast("💤 Thu hoạch " + earned + " 💎 Linh Thạch!", "success");
}

function renderMeditation() {
    var pending = Math.floor(userData.afkPendingLt || 0);
    var elapsedMs = Math.min(Date.now() - userData.afkStartTime, getAfkLimitMs());

    var elPending = document.getElementById("afk-pending-lt"); if(elPending) elPending.innerText = pending;
    var elTime = document.getElementById("afk-time-display"); if(elTime) elTime.innerText = fmt(elapsedMs / 1000);
    var elMax = document.getElementById("afk-max-display"); if(elMax) elMax.innerText = (getAfkLimitMs() / 3600000) + "h";

    var rateEl = document.getElementById('afk-rate'); if(rateEl) rateEl.textContent = getAfkRate().toFixed(1);
    var limitEl = document.getElementById('afk-limit-h'); if(limitEl) limitEl.textContent = (getAfkLimitMs() / 3600000) + "h";

    var achBuffEl = document.getElementById('buff-med-ach'); if(achBuffEl) achBuffEl.textContent = '+' + (getAchBonus('meditation')*100).toFixed(0) + '%';
    var pbBuffEl = document.getElementById('buff-med-phaobao'); if(pbBuffEl) pbBuffEl.textContent = '+' + (getPBBonus('afk')*100).toFixed(0) + '%';
}
