// ════════════════════════════════════════════
// GOOGLE DRIVE SYNC (GSI + GAPI)
// ════════════════════════════════════════════
var gapiInited = false;
var gsiInited = false;
var currentGDriveUser = "";
var tokenClient;
var gaccessToken = null;

function gapiLoaded() {
    gapi.load('client', function() {
        gapi.client.init({}).then(function() {
            gapi.client.load('drive', 'v3');
            gapiInited = true;
            renderGDriveSection();
        });
    });
}

function gsiLoaded() {
    gsiInited = true;
    renderGDriveSection();
}

function renderGDriveSection() {
    var el = document.getElementById('gdrive-section');
    if(!el) return;
    
    if (!GOOGLE_CLIENT_ID) {
        el.innerHTML = "<div style='text-align:center;padding:15px;background:rgba(255,0,0,0.1);border-radius:8px;border:1px solid rgba(255,0,0,0.3);'><p style='color:var(--text-muted);font-size:12px;margin:0;'>Thiếu GOOGLE_CLIENT_ID trong file data.js</p></div>";
        return;
    }
    
    if (!gapiInited || !gsiInited) {
        el.innerHTML = "<p style='color:var(--text-muted);font-size:12px;text-align:center;'>Đang tải dịch vụ đám mây Google...</p>";
        return;
    }

    if (gaccessToken) {
        el.innerHTML = `
            <div class="task-row" style="margin-top:14px;">
                <span style="font-size:13px;color:var(--green);">✅ Đã kết nối: <br><small style="color:var(--cyan);">${currentGDriveUser}</small></span>
                <button class="action-btn" onclick="gdriveLogout()">Đăng xuất</button>
            </div>
            <div style="display:flex;gap:12px;margin-top:14px;">
                <button class="action-btn main-btn" style="margin-top:0;" onclick="gdriveUpload()">☁️ Lưu lên Cloud</button>
                <button class="action-btn main-btn danger-btn" style="margin-top:0;" onclick="gdriveDownload()">☁️ Tải về từ Cloud</button>
            </div>
            <div id="gdrive-status" style="font-size:11px;color:var(--text-muted);margin-top:10px;text-align:center;">Sẵn sàng đồng bộ.</div>
        `;
    } else {
        el.innerHTML = `
            <div style="margin-top:14px;text-align:center;">
                <button class="action-btn main-btn" onclick="gdriveLogin()" style="background:var(--cyan);color:#000;border:none;">🔗 Đăng nhập Google Drive</button>
                <p style="font-size:11px;color:var(--text-muted);margin-top:8px;">(Sử dụng AppData, chỉ lưu file game, bảo mật tuyệt đối)</p>
            </div>
        `;
    }
}

function gdriveLogin() {
    if (!tokenClient) {
        tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: GOOGLE_CLIENT_ID,
            scope: 'https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/userinfo.email',
            callback: function(tokenResponse) {
                if (tokenResponse && tokenResponse.access_token) {
                    gaccessToken = tokenResponse.access_token;
                    gapi.client.setToken({access_token: gaccessToken});
                    
                    fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                        headers: { Authorization: 'Bearer ' + gaccessToken }
                    }).then(r => r.json()).then(data => {
                        currentGDriveUser = data.email || "Tài khoản ẩn danh";
                        renderGDriveSection();
                        showToast("Đăng nhập Cloud thành công", "success");
                    }).catch(e => {
                        currentGDriveUser = "Đã kết nối (Lỗi lấy email)";
                        renderGDriveSection();
                    });
                }
            }
        });
    }
    tokenClient.requestAccessToken();
}

function gdriveLogout() {
    if (gaccessToken) {
        google.accounts.oauth2.revoke(gaccessToken, function() {
            gaccessToken = null;
            currentGDriveUser = "";
            renderGDriveSection();
            showToast("Đã đăng xuất Cloud", "info");
        });
    }
}

function gdriveUpload() {
    if (!gaccessToken) return;
    
    var statusEl = document.getElementById('gdrive-status');
    statusEl.innerText = "Đang kiểm tra Cloud...";
    
    gapi.client.drive.files.list({
        spaces: 'appDataFolder',
        q: "name='hesotam_save.json'",
        fields: 'files(id)'
    }).then(function(res) {
        var files = res.result.files;
        var fileId = files && files.length > 0 ? files[0].id : null;
        var payload = JSON.stringify(userData);

        var metadata = { name: 'hesotam_save.json', parents: ['appDataFolder'] };
        var form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
        form.append('file', new Blob([payload], { type: 'application/json' }));

        var url = fileId
            ? 'https://www.googleapis.com/upload/drive/v3/files/' + fileId + '?uploadType=multipart'
            : 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
        var method = fileId ? 'PATCH' : 'POST';

        statusEl.innerText = "Đang lưu dữ liệu...";
        
        fetch(url, {
            method: method,
            headers: { 'Authorization': 'Bearer ' + gaccessToken },
            body: form
        }).then(r => r.json()).then(data => {
            statusEl.innerText = "✓ Đã lưu lúc " + new Date().toLocaleTimeString();
            showToast("Đã lưu lên Cloud thành công!", "success");
        }).catch(e => {
            statusEl.innerText = "Lỗi khi lưu file lên Cloud.";
            showToast("Lỗi lưu Cloud!", "error");
        });
    }).catch(function(err) {
        statusEl.innerText = "Lỗi kết nối Drive API.";
        showToast("Không thể thao tác Cloud!", "error");
    });
}

function gdriveDownload() {
    if (!gaccessToken) return;
    
    if(!confirm("Dữ liệu trên thiết bị sẽ bị ghi đè bởi Cloud. Bạn có chắc chắn?")) return;
    
    var statusEl = document.getElementById('gdrive-status');
    statusEl.innerText = "Đang tìm file trên Cloud...";
    
    gapi.client.drive.files.list({
        spaces: 'appDataFolder',
        q: "name='hesotam_save.json'",
        fields: 'files(id)'
    }).then(function(res) {
        var files = res.result.files;
        if (files && files.length > 0) {
            var fileId = files[0].id;
            statusEl.innerText = "Đang tải dữ liệu...";
            
            fetch('https://www.googleapis.com/drive/v3/files/' + fileId + '?alt=media', {
                headers: { 'Authorization': 'Bearer ' + gaccessToken }
            }).then(r => r.json()).then(data => {
                try {
                    var decoded = migrateData(data);
                    userData = Object.assign({}, userData, decoded, {weeklyTasks: Object.assign({}, userData.weeklyTasks, decoded.weeklyTasks)});
                    initFarmData(); 
                    saveData(); 
                    updateUI();
                    
                    if(activeDrawerTab==='tab-journal' && typeof renderJournalTab === 'function') renderJournalTab();
                    if(activeDrawerTab==='tab-expense' && typeof renderExpenseTab === 'function') renderExpenseTab();
                    
                    statusEl.innerText = "✓ Đã tải lúc " + new Date().toLocaleTimeString();
                    showToast("Phục hồi từ Cloud thành công!", "success");
                } catch(e) {
                    statusEl.innerText = "Dữ liệu Cloud bị lỗi định dạng.";
                    showToast("Lỗi giải mã dữ liệu", "error");
                }
            }).catch(e => {
                statusEl.innerText = "Lỗi khi tải file.";
                showToast("Lỗi tải Cloud!", "error");
            });
        } else {
            statusEl.innerText = "Không tìm thấy file hesotam_save.json";
            showToast("Chưa có bản sao lưu nào trên Cloud", "info");
        }
    }).catch(function(err) {
        statusEl.innerText = "Lỗi kết nối Drive API.";
        showToast("Không thể thao tác Cloud!", "error");
    });
}