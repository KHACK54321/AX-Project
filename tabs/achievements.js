// ════════════════════════════════════════════
// ACHIEVEMENTS TAB LOGIC
// ════════════════════════════════════════════

function renderAchievementsTabHTML() {
    document.getElementById('tab-achievements').innerHTML = `
        <div class="card">
            <div class="card-header"><h2>🏆 Thành Tựu Khổ Tu</h2></div>
            <p style="font-size:12px; color:var(--text-muted); margin-bottom:15px;">Hoàn thành các cột mốc để nhận vĩnh viễn các Hệ số Buff cực mạnh.</p>
            <div id="achievements-list"></div>
        </div>
    `;
}

function renderAchievements() {
    let list = document.getElementById('achievements-list');
    if(!list) return;
    
    let html = '';
    ACHIEVEMENTS.forEach(a => {
        let unlocked = userData.achievements && userData.achievements[a.id];
        let color = unlocked ? 'var(--gold)' : 'var(--text-muted)';
        let bg = unlocked ? 'rgba(251,191,36,0.1)' : 'rgba(0,0,0,0.4)';
        let border = unlocked ? 'var(--gold)' : 'rgba(255,255,255,0.1)';
        let iconFilter = unlocked ? 'drop-shadow(0 0 5px var(--gold))' : 'grayscale(1) opacity(0.5)';
        
        html += `
        <div style="background:${bg}; border:1px solid ${border}; border-radius:8px; padding:12px; margin-bottom:10px; display:flex; align-items:center; gap:15px; transition:0.3s;">
            <div style="font-size:32px; filter:${iconFilter};">${a.icon}</div>
            <div style="flex:1;">
                <div style="font-size:14px; font-weight:bold; color:${color};">${a.name}</div>
                <div style="font-size:11px; color:var(--text-muted); margin-top:3px;">${a.desc}</div>
                <div style="font-size:10px; color:var(--cyan); margin-top:3px; font-weight:bold;">Phần thưởng: +${(a.bonus * 100)}% Buff ${a.buff.toUpperCase()}</div>
            </div>
            <div style="font-size:12px; font-weight:bold; color:${unlocked ? 'var(--green)' : '#555'}; text-align:right;">
                ${unlocked ? '✓ Đã Mở' : '🔒 Chưa Mở'}
            </div>
        </div>`;
    });
    
    list.innerHTML = html;
}