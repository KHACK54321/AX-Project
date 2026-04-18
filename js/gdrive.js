// ════════════════════════════════════════════
// GOOGLE DRIVE SYNC — Fixed (GSI + GAPI v3)
// ════════════════════════════════════════════
var _gapiReady   = false;   // gapi.client đã load discovery doc
var _gsiReady    = false;   // GSI lib đã load
var _tokenClient = null;    // GSI token client instance
var _accessToken = null;    // OAuth2 access token hiện tại
var _gUserEmail  = "";      // Email người dùng đang đăng nhập
var _DRIVE_FILE  = "hesotam_save.json";
var _DISCOVERY   = "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest";

// ── Callbacks từ script tags trong index.html ──────────────────
function gapiLoaded() {
    gapi.load('client', function() {
        gapi.client.init({}).then(function() {
            // Load Discovery doc cho Drive v3 (cách hiện đại thay cho gapi.client.load cũ)
            return gapi.client.load(_DISCOVERY);
        }).then(function() {
            _gapiReady = true;
            renderGDriveSection();
        }).catch(function(err) {
            console.error('[GDrive] gapi init lỗi:', err);
            _gapiReady = true; // vẫn mark ready để hiện UI, lỗi sẽ xử lý lúc dùng
            renderGDriveSection();
        });
    });
}

function gsiLoaded() {
    _gsiReady = true;
    renderGDriveSection();
}

// ── Render section (gọi bất cứ lúc nào state thay đổi) ────────
function renderGDriveSection() {
    var el = document.getElementById('gdrive-section');
    if (!el) return;

    // Chưa có CLIENT_ID
    if (!GOOGLE_CLIENT_ID) {
        el.innerHTML = `
            <div style="text-align:center;padding:14px;background:rgba(239,68,68,0.08);
                border:1px solid rgba(239,68,68,0.25);border-radius:12px;margin-top:10px;">
                <p style="color:var(--text-muted);font-size:12px;margin:0;">
                    ⚠️ Thiếu <code>GOOGLE_CLIENT_ID</code> trong <code>data.js</code>
                </p>
            </div>`;
        return;
    }

    // Đang load thư viện
    if (!_gapiReady || !_gsiReady) {
        el.innerHTML = `
            <p style="color:var(--text-muted);font-size:12px;text-align:center;
               margin-top:14px;opacity:0.7;">☁️ Đang tải dịch vụ Google...</p>`;
        return;
    }

    // Đã đăng nhập
    if (_accessToken) {
        el.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:space-between;
                background:rgba(16,185,129,0.07);border:1px solid rgba(16,185,129,0.25);
                border-radius:12px;padding:12px 14px;margin-top:10px;gap:10px;">
                <div style="min-width:0;">
                    <div style="font-size:11px;font-weight:700;color:var(--green);margin-bottom:2px;">
                        ✅ Đã kết nối
                    </div>
                    <div style="font-size:11px;color:var(--cyan);white-space:nowrap;
                        overflow:hidden;text-overflow:ellipsis;">${_gUserEmail}</div>
                </div>
                <button class="action-btn" style="flex-shrink:0;padding:8px 12px;font-size:11px;"
                    onclick="gdriveLogout()">Đăng xuất</button>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px;">
                <button class="action-btn main-btn" style="margin-top:0;font-size:12px;"
                    onclick="gdriveUpload()">☁️ Lưu Cloud</button>
                <button class="action-btn main-btn danger-btn" style="margin-top:0;font-size:12px;"
                    onclick="gdriveDownload()">☁️ Tải Cloud</button>
            </div>
            <div id="gdrive-status" style="font-size:11px;color:var(--text-muted);
                margin-top:10px;text-align:center;min-height:16px;">Sẵn sàng đồng bộ.</div>`;
    } else {
        // Chưa đăng nhập
        el.innerHTML = `
            <div style="text-align:center;margin-top:12px;">
                <button class="action-btn main-btn" onclick="gdriveLogin()"
                    style="background:linear-gradient(135deg,#4285f4,#1a73e8);
                        border:none;font-size:13px;letter-spacing:0.5px;">
                    🔗 Đăng nhập Google Drive
                </button>
                <p style="font-size:10px;color:var(--text-muted);margin-top:8px;line-height:1.5;">
                    Dữ liệu lưu trong AppData Drive,<br>chỉ ứng dụng này mới đọc được.
                </p>
            </div>`;
    }
}

// ── Đăng nhập ─────────────────────────────────────────────────
function gdriveLogin() {
    if (!_gsiReady) { showToast("Thư viện Google chưa sẵn sàng.", "error"); return; }

    // Tạo token client nếu chưa có (hoặc nếu cần làm mới)
    if (!_tokenClient) {
        try {
            _tokenClient = google.accounts.oauth2.initTokenClient({
                client_id: GOOGLE_CLIENT_ID,
                scope: [
                    'https://www.googleapis.com/auth/drive.appdata',
                    'https://www.googleapis.com/auth/userinfo.email'
                ].join(' '),
                callback: _onTokenResponse
            });
        } catch (err) {
            console.error('[GDrive] initTokenClient lỗi:', err);
            showToast("Không khởi tạo được Google OAuth!", "error");
            return;
        }
    }
    _tokenClient.requestAccessToken({ prompt: '' });
}

function _onTokenResponse(resp) {
    if (resp && resp.error) {
        console.error('[GDrive] Token error:', resp.error, resp.error_description);
        showToast("Đăng nhập thất bại: " + (resp.error_description || resp.error), "error");
        return;
    }
    if (!resp || !resp.access_token) {
        showToast("Không nhận được token từ Google.", "error");
        return;
    }
    _accessToken = resp.access_token;
    // Đặt token cho gapi.client để các request sau dùng
    gapi.client.setToken({ access_token: _accessToken });

    // Lấy email người dùng
    fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: 'Bearer ' + _accessToken }
    })
    .then(function(r) { return r.json(); })
    .then(function(info) {
        _gUserEmail = info.email || "Google Account";
        renderGDriveSection();
        showToast("Đăng nhập Google Drive thành công! ☁️", "success");
    })
    .catch(function() {
        _gUserEmail = "Google Account";
        renderGDriveSection();
        showToast("Đã kết nối (không lấy được email).", "info");
    });
}

// ── Đăng xuất ─────────────────────────────────────────────────
function gdriveLogout() {
    if (!_accessToken) return;
    try {
        google.accounts.oauth2.revoke(_accessToken, function() {});
    } catch(e) {}
    _accessToken  = null;
    _gUserEmail   = "";
    _tokenClient  = null;
    gapi.client.setToken(null);
    renderGDriveSection();
    showToast("Đã đăng xuất Google Drive.", "info");
}

// ── Helper: gọi Drive API với fetch thay vì gapi.client (tránh lỗi discovery) ──
function _driveRequest(method, path, params, body) {
    var url = new URL('https://www.googleapis.com/drive/v3' + path);
    if (params) Object.keys(params).forEach(function(k) { url.searchParams.set(k, params[k]); });
    var opts = {
        method: method,
        headers: { Authorization: 'Bearer ' + _accessToken }
    };
    if (body) {
        opts.headers['Content-Type'] = 'application/json';
        opts.body = JSON.stringify(body);
    }
    return fetch(url.toString(), opts).then(function(r) {
        if (!r.ok) return r.json().then(function(e) { throw e; });
        // 204 No Content không có body
        if (r.status === 204) return {};
        return r.json();
    });
}

// ── Helper: tìm file save trên Drive ──────────────────────────
function _findSaveFile() {
    return _driveRequest('GET', '/files', {
        spaces: 'appDataFolder',
        q: "name='" + _DRIVE_FILE + "'",
        fields: 'files(id,name,modifiedTime)',
        pageSize: '5'
    }).then(function(data) {
        return (data.files && data.files.length > 0) ? data.files[0] : null;
    });
}

// ── Helper: hiển thị trạng thái ───────────────────────────────
function _setStatus(msg) {
    var el = document.getElementById('gdrive-status');
    if (el) el.textContent = msg;
}

function _checkToken() {
    if (!_accessToken) {
        showToast("Chưa đăng nhập Google Drive!", "error");
        return false;
    }
    return true;
}

// ── Upload lên Cloud ──────────────────────────────────────────
function gdriveUpload() {
    if (!_checkToken()) return;
    _setStatus("⏳ Đang kiểm tra Cloud...");

    _findSaveFile()
    .then(function(file) {
        _setStatus("⏳ Đang lưu dữ liệu...");
        var payload = JSON.stringify(userData);
        var meta    = { name: _DRIVE_FILE, parents: file ? undefined : ['appDataFolder'] };
        if (file) delete meta.parents;

        // Dùng multipart upload
        var boundary = '-------MbOuNdArY' + Date.now();
        var body     = [
            '--' + boundary,
            'Content-Type: application/json; charset=UTF-8',
            '',
            JSON.stringify(file ? { name: _DRIVE_FILE } : { name: _DRIVE_FILE, parents: ['appDataFolder'] }),
            '--' + boundary,
            'Content-Type: application/json',
            '',
            payload,
            '--' + boundary + '--'
        ].join('\r\n');

        var uploadUrl = file
            ? 'https://www.googleapis.com/upload/drive/v3/files/' + file.id + '?uploadType=multipart'
            : 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';

        return fetch(uploadUrl, {
            method: file ? 'PATCH' : 'POST',
            headers: {
                Authorization: 'Bearer ' + _accessToken,
                'Content-Type': 'multipart/related; boundary=' + boundary
            },
            body: body
        }).then(function(r) {
            if (!r.ok) return r.json().then(function(e) { throw e; });
            return r.json();
        });
    })
    .then(function() {
        var t = new Date().toLocaleTimeString('vi-VN');
        _setStatus("✅ Đã lưu lúc " + t);
        showToast("Đã lưu lên Cloud thành công! ☁️", "success");
    })
    .catch(function(err) {
        console.error('[GDrive] Upload lỗi:', err);
        var msg = (err && err.error && err.error.message) ? err.error.message : 'Lỗi không xác định';
        _setStatus("❌ Lỗi: " + msg);
        showToast("Lưu Cloud thất bại!", "error");
        // Token có thể hết hạn — reset để user đăng nhập lại
        if (err && err.error && (err.error.code === 401 || err.error.status === 'UNAUTHENTICATED')) {
            _accessToken = null; gapi.client.setToken(null); renderGDriveSection();
        }
    });
}

// ── Download từ Cloud ─────────────────────────────────────────
function gdriveDownload() {
    if (!_checkToken()) return;
    if (!confirm("Dữ liệu thiết bị sẽ bị GHI ĐÈ bởi dữ liệu Cloud.\nBạn có chắc chắn?")) return;

    _setStatus("⏳ Đang tìm file trên Cloud...");

    _findSaveFile()
    .then(function(file) {
        if (!file) {
            _setStatus("ℹ️ Chưa có bản sao lưu nào trên Cloud.");
            showToast("Chưa có dữ liệu Cloud!", "info");
            return null;
        }
        _setStatus("⏳ Đang tải dữ liệu...");
        return fetch(
            'https://www.googleapis.com/drive/v3/files/' + file.id + '?alt=media',
            { headers: { Authorization: 'Bearer ' + _accessToken } }
        ).then(function(r) {
            if (!r.ok) return r.json().then(function(e) { throw e; });
            return r.json();
        });
    })
    .then(function(data) {
        if (!data) return;
        try {
            var decoded = migrateData(data);
            userData    = Object.assign({}, userData, decoded, {
                weeklyTasks: Object.assign({}, userData.weeklyTasks, decoded.weeklyTasks)
            });
            initFarmData();
            saveData();
            updateUI();
            offlineFarmCatchup();
            if (activeDrawerTab === 'tab-farm')       renderFarmAll();
            if (activeDrawerTab === 'tab-journal'  && typeof renderJournalTab === 'function')  renderJournalTab();
            if (activeDrawerTab === 'tab-expense'  && typeof renderExpenseTab === 'function')  renderExpenseTab();
            if (activeDrawerTab === 'tab-gacha'    && typeof renderGachaTab === 'function')    renderGachaTab();
            if (activeDrawerTab === 'tab-souls'    && typeof renderSoulsTab === 'function')    renderSoulsTab();
            if (activeDrawerTab === 'tab-combat'   && typeof renderCombatTab === 'function')   renderCombatTab();
            if (activeDrawerTab === 'tab-equipment'&& typeof renderEquipmentTab === 'function') renderEquipmentTab();

            var t = new Date().toLocaleTimeString('vi-VN');
            _setStatus("✅ Đã đồng bộ lúc " + t);
            showToast("Phục hồi từ Cloud thành công! ☁️", "success");
        } catch (parseErr) {
            console.error('[GDrive] Parse lỗi:', parseErr);
            _setStatus("❌ Dữ liệu Cloud bị lỗi định dạng.");
            showToast("Dữ liệu Cloud bị hỏng!", "error");
        }
    })
    .catch(function(err) {
        console.error('[GDrive] Download lỗi:', err);
        var msg = (err && err.error && err.error.message) ? err.error.message : 'Lỗi không xác định';
        _setStatus("❌ Lỗi: " + msg);
        showToast("Tải Cloud thất bại!", "error");
        if (err && err.error && (err.error.code === 401 || err.error.status === 'UNAUTHENTICATED')) {
            _accessToken = null; gapi.client.setToken(null); renderGDriveSection();
        }
    });
}
