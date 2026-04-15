// ════════════════════════════════════════════
// JOURNAL TAB HTML INJECTION & LOGIC
// ════════════════════════════════════════════
var currentJournalStars = 5;
var journalExpandedState = {};

function getLocalDateStr() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}

function renderJournalTabHTML() {
    document.getElementById('tab-journal').innerHTML = `
        <div class="card">
            <div class="card-header"><h2>📔 Nhật Ký Hôm Nay</h2><span style="color:var(--cyan);font-size:12px;" id="journal-today-date"></span></div>
            <p style="margin-bottom:12px;">Ghi lại quá trình tu luyện và cảm ngộ của bản tôn.</p>
            <div class="star-rating" id="journal-stars">
                <button class="star-btn active" onclick="setJournalStar(1)">★</button>
                <button class="star-btn active" onclick="setJournalStar(2)">★</button>
                <button class="star-btn active" onclick="setJournalStar(3)">★</button>
                <button class="star-btn active" onclick="setJournalStar(4)">★</button>
                <button class="star-btn active" onclick="setJournalStar(5)">★</button>
            </div>
            <textarea class="journal-textarea" id="journal-text-input" placeholder="Hôm nay bạn cảm thấy thế nào?..."></textarea>
            <button class="action-btn main-btn" onclick="saveJournalEntry()">Lưu Nhật Ký</button>
        </div>
        <div class="card">
            <h3>Lịch Sử Cảm Ngộ</h3>
            <div id="journal-history-container" style="margin-top:14px;"></div>
        </div>
    `;
}

function setJournalStar(stars) {
    currentJournalStars = stars;
    var btns = document.getElementById('journal-stars').querySelectorAll('.star-btn');
    btns.forEach(function(btn, idx) {
        if(idx < stars) btn.classList.add('active');
        else btn.classList.remove('active');
    });
}

function saveJournalEntry() {
    var text = document.getElementById('journal-text-input').value.trim();
    var dateStr = getLocalDateStr();
    
    if(!userData.journal) userData.journal = {};
    userData.journal[dateStr] = { stars: currentJournalStars, text: text };
    
    saveData();
    showToast("Đã lưu nhật ký hôm nay!", "success");
    renderJournalTab();
}

function toggleJournalHistory(dateStr) {
    journalExpandedState[dateStr] = !journalExpandedState[dateStr];
    renderJournalTab();
}

function renderJournalTab() {
    var dateStr = getLocalDateStr();
    var todayEl = document.getElementById('journal-today-date');
    if(todayEl) {
        var d = new Date();
        todayEl.innerText = String(d.getDate()).padStart(2,'0') + '/' + String(d.getMonth()+1).padStart(2,'0') + '/' + d.getFullYear();
    }
    
    if(userData.journal && userData.journal[dateStr]) {
        setJournalStar(userData.journal[dateStr].stars);
        var inputEl = document.getElementById('journal-text-input');
        if(inputEl && document.activeElement !== inputEl) {
            inputEl.value = userData.journal[dateStr].text;
        }
    } else {
        setJournalStar(5);
        var inputEl2 = document.getElementById('journal-text-input');
        if(inputEl2 && document.activeElement !== inputEl2) inputEl2.value = "";
    }
    
    var container = document.getElementById('journal-history-container');
    if(!container) return;
    
    if(!userData.journal || Object.keys(userData.journal).length === 0) {
        container.innerHTML = '<div style="text-align:center;color:var(--text-muted);padding:20px 0;">Chưa có lịch sử.</div>';
        return;
    }
    
    var dates = Object.keys(userData.journal).sort().reverse();
    var html = '';
    
    dates.forEach(function(dKey) {
        var entry = userData.journal[dKey];
        var isExpanded = journalExpandedState[dKey];
        var starStr = '★'.repeat(entry.stars) + '☆'.repeat(5 - entry.stars);
        
        // Format date string for display
        var parts = dKey.split('-');
        var displayDate = parts.length === 3 ? (parts[2] + '/' + parts[1] + '/' + parts[0]) : dKey;
        
        html += `
            <div class="journal-history-item" onclick="toggleJournalHistory('${dKey}')">
                <div class="journal-history-header">
                    <span class="journal-history-date">${displayDate}</span>
                    <span class="journal-history-stars">${starStr}</span>
                </div>
                <div class="journal-history-text ${isExpanded ? '' : 'collapsed'}">${entry.text || '(Không có nội dung)'}</div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}