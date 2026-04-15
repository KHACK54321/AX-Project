// ════════════════════════════════════════════
// GLOBAL STATE (window-scoped)
// ════════════════════════════════════════════
var farmInterval  = null;
var stbVisible    = true;
var activeDrawerTab = 'tab-checkin';

// ════════════════════════════════════════════
// BOOT / LOADER
// ════════════════════════════════════════════
const logs = ["> Booting Pro System v0.5.5...", "> Loading Full Feature Set...", "> Initializing Offline AFK Mastery...", "> System Ready"];
var logIdx = 0;

window.onload = function() {
    document.getElementById("loader-img").src = loadingAvatars[Math.floor(Math.random()*loadingAvatars.length)];
    var loader = document.getElementById("loader");
    loader.style.backgroundImage = "url('"+waifuImages[Math.floor(Math.random()*waifuImages.length)]+"')";
    function showLogs() {
        if (logIdx < logs.length) {
            var line = document.createElement('div'); line.className='log-line'; line.textContent = logs[logIdx];
            document.getElementById("hacker-log").appendChild(line); logIdx++; setTimeout(showLogs, 350);
        } else {
            setTimeout(function(){ loader.style.opacity="0"; setTimeout(function(){ loader.style.display="none"; initApp(); },600); },600);
        }
    }
    showLogs();
};

function initApp() {
    // Inject all tab HTML first
    renderCharacterTabHTML();
    renderMeditationTabHTML();
    renderFarmTabHTML();
    renderAchievementsTabHTML();
    renderJournalTabHTML();
    renderExpenseTabHTML();

    document.getElementById("main-app").style.display="flex";
    document.getElementById("main-app").style.backgroundImage="url('"+waifuImages[Math.floor(Math.random()*waifuImages.length)]+"')";
    loadData(); initFarmData(); offlineFarmCatchup(); checkResets(); syncAFK();
    updateUI(); fetchUpdateLog(); startFarmTimer(); checkForUpdate();
    renderNewUpgrades();

    if(typeof renderGDriveSection === 'function') renderGDriveSection();
}

// ════════════════════════════════════════════
// DRAWER NAVIGATION
// ════════════════════════════════════════════
function toggleDrawer() {
    var d=document.getElementById('side-drawer'), o=document.getElementById('drawer-overlay');
    if(d.classList.contains('open')){d.classList.remove('open');o.classList.remove('open');}
    else{d.classList.add('open');o.classList.add('open');}
}
function closeDrawer() {
    document.getElementById('side-drawer').classList.remove('open');
    document.getElementById('drawer-overlay').classList.remove('open');
}
function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(function(c){c.classList.remove('active');});
    document.querySelectorAll('.drawer-item').forEach(function(b){b.classList.remove('active');});
    document.getElementById(tabId).classList.add('active');
    var dnav = document.getElementById('dnav-'+tabId);
    if(dnav) dnav.classList.add('active');
    activeDrawerTab = tabId;
    if(tabId==='tab-farm') renderFarmAll();
    if(tabId==='tab-achievements') renderAchievements();
    if(tabId==='tab-meditation') { syncAFK(); renderMeditation(); }
    if(tabId==='tab-shop-pb') renderShopPB();
    if(tabId==='tab-inventory-pb') renderInventoryPB();
    if(tabId==='tab-journal') renderJournalTab();
    if(tabId==='tab-expense') renderExpenseTab();
    var sc=document.getElementById('main-scroll');
    if(sc) sc.scrollTop=0;
    closeDrawer();
}

// ════════════════════════════════════════════
// SCROLL TOOLBAR
// ════════════════════════════════════════════
function scrollToTop() {
    var sc=document.getElementById('main-scroll');
    if(sc) sc.scrollTo({top:0,behavior:'smooth'});
}
function toggleScrollTb() {
    stbVisible=!stbVisible;
    var tb=document.getElementById('scroll-toolbar');
    if(stbVisible){tb.classList.remove('hidden');}
    else{tb.classList.add('hidden');}
    if(!stbVisible) setTimeout(function(){tb.style.opacity='0.3';tb.style.pointerEvents='all';},100);
}

// ════════════════════════════════════════════
// AFK SYNC
// ════════════════════════════════════════════
function syncAFK() {
    var now = Date.now();
    if(!userData.afkLastCheck) userData.afkLastCheck = now;
    if(!userData.afkStartTime) userData.afkStartTime = now;

    var limitMs = getAfkLimitMs();
    var timeSinceStart = now - userData.afkStartTime;
    var timeSinceLastCheck = now - userData.afkLastCheck;

    if (timeSinceStart <= limitMs) {
        var mins = timeSinceLastCheck / 60000;
        userData.afkPendingLt = (userData.afkPendingLt || 0) + (mins * getAfkRate());
    } else if (userData.afkLastCheck - userData.afkStartTime < limitMs) {
        var validTimeMs = limitMs - (userData.afkLastCheck - userData.afkStartTime);
        if(validTimeMs > 0) userData.afkPendingLt = (userData.afkPendingLt || 0) + ((validTimeMs / 60000) * getAfkRate());
    }
    userData.afkLastCheck = now;
}