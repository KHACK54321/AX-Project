// ════════════════════════════════════════════
// ACHIEVEMENTS TAB HTML INJECTION
// ════════════════════════════════════════════
function renderAchievementsTabHTML() {
    document.getElementById('tab-achievements').innerHTML = `
        <div class="card">
            <div class="card-header"><h2>🏆 Thành Tựu</h2><span id="ach-count" style="font-size:12px;color:var(--gold);font-weight:700;">0/18</span></div>
            <p>Chỉ số cộng dồn (Additive) bảo vệ nền kinh tế game.</p>
        </div>

        <div class="card"><h3>📅 Chuỗi Ký Danh</h3><div class="ach-grid" id="ach-ci-grid"></div></div>
        <div class="card"><h3>📋 Nhiệm Vụ Ngày</h3><div class="ach-grid" id="ach-daily-grid"></div></div>
        <div class="card"><h3>🏆 Nhiệm Vụ Tuần</h3><div class="ach-grid" id="ach-weekly-grid"></div></div>
        <div class="card"><h3>🌾 Nông Dân</h3><div class="ach-grid" id="ach-farm-grid"></div></div>
        <div class="card"><h3>💊 Luyện Đan</h3><div class="ach-grid" id="ach-alchemy-grid"></div></div>
        <div class="card"><h3>💤 Treo Máy</h3><div class="ach-grid" id="ach-med-grid"></div></div>`;
}

// ════════════════════════════════════════════
// ACHIEVEMENTS RENDER
// ════════════════════════════════════════════
function renderAchievements(){
    function renderGrid(achs, elId){
        var el=document.getElementById(elId);if(!el)return;
        el.innerHTML=achs.map(function(a){
            var unlocked=userData.achievements&&userData.achievements[a.id];
            var statusHtml = unlocked ? '<div style="font-size:10px;color:var(--success);margin-top:4px;">✅ Hoàn thành</div>' : '<div style="font-size:10px;color:var(--text-muted);margin-top:4px;">Chưa đạt</div>';
            return '<div class="ach-card'+(unlocked?' unlocked':' ach-locked')+'"><span class="ach-icon">'+a.icon+'</span><div class="ach-name">'+a.name+'</div><div class="ach-desc">'+a.desc+'</div><div class="ach-buff">Buff: +'+(a.bonus*100).toFixed(0)+'%</div>'+statusHtml + '</div>';
        }).join('');
    }
    renderGrid(ACHIEVEMENTS.filter(a=>a.buff==='checkin'),'ach-ci-grid'); renderGrid(ACHIEVEMENTS.filter(a=>a.buff==='daily'),'ach-daily-grid');
    renderGrid(ACHIEVEMENTS.filter(a=>a.buff==='weekly'),'ach-weekly-grid'); renderGrid(ACHIEVEMENTS.filter(a=>a.buff==='farmSell'),'ach-farm-grid');
    renderGrid(ACHIEVEMENTS.filter(a=>a.buff==='alchemy'),'ach-alchemy-grid'); renderGrid(ACHIEVEMENTS.filter(a=>a.buff==='meditation'),'ach-med-grid');
    var el=document.getElementById('ach-count');if(el)el.textContent=ACHIEVEMENTS.filter(a=>userData.achievements&&userData.achievements[a.id]).length+'/'+ACHIEVEMENTS.length;
}
