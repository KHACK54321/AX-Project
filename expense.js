// ════════════════════════════════════════════
// EXPENSE TRACKER HTML INJECTION & LOGIC
// ════════════════════════════════════════════
var expenseExpandedState = {};

function formatVND(num) {
    return num.toLocaleString('vi-VN') + ' đ';
}

function getLocalTimeStr() {
    var d = new Date();
    return String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0');
}

function renderExpenseTabHTML() {
    document.getElementById('tab-expense').innerHTML = `
        <div class="card">
            <div class="card-header"><h2>💰 Chi Tiêu Hôm Nay</h2><span style="color:var(--text-muted);font-size:12px;" id="expense-today-date"></span></div>
            <div class="expense-total-display" id="expense-today-total">0 đ</div>
            
            <div class="expense-input-group">
                <input type="number" id="expense-amount-input" class="expense-input" placeholder="Số tiền (VNĐ)..." style="flex: 1.2;">
                <input type="text" id="expense-label-input" class="expense-input" placeholder="Ghi chú...">
            </div>
            <button class="action-btn main-btn" style="background:var(--green);color:#000;border:none;" onclick="addExpense()">Thêm Chi Tiêu</button>
            
            <div id="expense-today-list" style="margin-top:20px;"></div>
        </div>
        <div class="card">
            <h3>Lịch Sử Chi Tiêu</h3>
            <div id="expense-history-container" style="margin-top:14px;"></div>
        </div>
    `;
}

function addExpense() {
    var amountEl = document.getElementById('expense-amount-input');
    var labelEl = document.getElementById('expense-label-input');
    var amount = parseInt(amountEl.value);
    var label = labelEl.value.trim() || "Không tên";
    
    if(isNaN(amount) || amount <= 0) {
        showToast("Vui lòng nhập số tiền hợp lệ", "error");
        return;
    }
    
    var dateStr = getLocalDateStr(); // From journal.js
    if(!userData.expense) userData.expense = {};
    if(!userData.expense[dateStr]) userData.expense[dateStr] = { total: 0, entries: [] };
    
    userData.expense[dateStr].entries.unshift({ time: getLocalTimeStr(), label: label, amount: amount });
    userData.expense[dateStr].total += amount;
    
    amountEl.value = '';
    labelEl.value = '';
    
    saveData();
    renderExpenseTab();
    showToast("Đã thêm chi tiêu!", "success");
}

function toggleExpenseHistory(dateStr) {
    expenseExpandedState[dateStr] = !expenseExpandedState[dateStr];
    renderExpenseTab();
}

function renderExpenseTab() {
    var dateStr = getLocalDateStr(); // From journal.js
    var d = new Date();
    var todayDisplay = String(d.getDate()).padStart(2,'0') + '/' + String(d.getMonth()+1).padStart(2,'0') + '/' + d.getFullYear();
    
    var todayEl = document.getElementById('expense-today-date');
    if(todayEl) todayEl.innerText = todayDisplay;
    
    var todayTotal = 0;
    var todayEntries = [];
    if(userData.expense && userData.expense[dateStr]) {
        todayTotal = userData.expense[dateStr].total || 0;
        todayEntries = userData.expense[dateStr].entries || [];
    }
    
    var totalEl = document.getElementById('expense-today-total');
    if(totalEl) totalEl.innerText = formatVND(todayTotal);
    
    var listEl = document.getElementById('expense-today-list');
    if(listEl) {
        if(todayEntries.length === 0) {
            listEl.innerHTML = '<div style="text-align:center;color:var(--text-muted);font-size:13px;">Chưa có chi tiêu nào hôm nay.</div>';
        } else {
            listEl.innerHTML = todayEntries.map(function(e) {
                return `
                    <div class="expense-row">
                        <div class="expense-row-info">
                            <span class="expense-row-label">${e.label}</span>
                            <span class="expense-row-time">${e.time}</span>
                        </div>
                        <span class="expense-row-amount">-${formatVND(e.amount)}</span>
                    </div>
                `;
            }).join('');
        }
    }
    
    var historyEl = document.getElementById('expense-history-container');
    if(!historyEl) return;
    
    if(!userData.expense || Object.keys(userData.expense).length === 0) {
        historyEl.innerHTML = '<div style="text-align:center;color:var(--text-muted);padding:20px 0;">Chưa có lịch sử.</div>';
        return;
    }
    
    var dates = Object.keys(userData.expense).sort().reverse();
    var html = '';
    
    dates.forEach(function(dKey) {
        if(dKey === dateStr) return; // Skip today in history
        
        var dayData = userData.expense[dKey];
        var isExpanded = expenseExpandedState[dKey];
        
        var parts = dKey.split('-');
        var displayDate = parts.length === 3 ? (parts[2] + '/' + parts[1] + '/' + parts[0]) : dKey;
        
        var entriesHtml = (dayData.entries || []).map(function(e) {
            return `
                <div class="expense-row" style="padding:6px 0;">
                    <div class="expense-row-info">
                        <span class="expense-row-label" style="font-size:13px;">${e.label}</span>
                        <span class="expense-row-time">${e.time}</span>
                    </div>
                    <span class="expense-row-amount" style="font-size:13px;">-${formatVND(e.amount)}</span>
                </div>
            `;
        }).join('');
        
        html += `
            <div class="expense-history-card">
                <div class="expense-history-header" onclick="toggleExpenseHistory('${dKey}')">
                    <span class="expense-history-date">${displayDate}</span>
                    <span class="expense-history-total">-${formatVND(dayData.total || 0)}</span>
                </div>
                <div class="expense-history-body ${isExpanded ? 'expanded' : ''}">
                    ${entriesHtml || '<div style="color:var(--text-muted);font-size:12px;">Không có chi tiết</div>'}
                </div>
            </div>
        `;
    });
    
    historyEl.innerHTML = html || '<div style="text-align:center;color:var(--text-muted);padding:20px 0;">Chưa có lịch sử cũ.</div>';
}