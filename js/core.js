// ════════════════════════════════════════════
// GLOBAL STATE & INITS (PHASE 4 - EQUIP TAB)
// ════════════════════════════════════════════
var farmInterval  = null;
var stbVisible    = true;
var activeDrawerTab = 'tab-checkin';

const logs = ["> Booting v1.0.0...", "> Loading Gacha Engine...", "> Fetching Auto Battle Systems...", "> Loading Equipment UI...", "> System Ready"];
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
    renderCharacterTabHTML();
    renderMeditationTabHTML();
    renderFarmTabHTML();
    renderAchievementsTabHTML();
    renderJournalTabHTML();
    renderExpenseTabHTML();
    
    if(typeof renderGachaTabHTML === 'function') renderGachaTabHTML();
    if(typeof renderSoulsTabHTML === 'function') renderSoulsTabHTML(); 
    if(typeof renderCombatTabHTML === 'function') renderCombatTabHTML(); 
    if(typeof renderEquipmentTabHTML === 'function') renderEquipmentTabHTML(); // Inject Trang Bị 

    document.getElementById("main-app").style.display="flex";
    document.getElementById("main-app").style.backgroundImage="url('"+waifuImages[Math.floor(Math.random()*waifuImages.length)]+"')";
    loadData(); initFarmData(); offlineFarmCatchup(); checkResets();
    updateUI(); fetchUpdateLog(); startFarmTimer(); checkForUpdate();

    if(typeof renderGDriveSection === 'function') renderGDriveSection();
    
    // Background AFK Sync loop
    setInterval(function(){
        syncAFK(); 
        if(activeDrawerTab==='tab-meditation') renderMeditation();
    }, 60000); // Check AFK every 1 min
}

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
    if(tabId==='tab-meditation') renderMeditation(); 
    if(tabId==='tab-equipment') renderEquipmentTab(); 
    if(tabId==='tab-journal') renderJournalTab();
    if(tabId==='tab-expense') renderExpenseTab();
    if(tabId==='tab-gacha') renderGachaTab(); 
    if(tabId==='tab-souls') renderSoulsTab(); 
    if(tabId==='tab-combat') renderCombatTab(); 
    
    var sc=document.getElementById('main-scroll');
    if(sc) sc.scrollTop=0;
    closeDrawer();
}

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
// GLOBAL AFK LOGIC (Updated Phase 4)
// ════════════════════════════════════════════
function syncAFK() {
    var now = Date.now();
    if(!userData.afkLastCheck) userData.afkLastCheck = now;
    var limitMs = getAfkLimitMs();
    var timeSinceCheck = now - userData.afkLastCheck;
    var timeSinceStart = now - userData.afkStartTime;
    
    if(timeSinceStart > limitMs) {
        timeSinceCheck = Math.max(0, limitMs - (userData.afkLastCheck - userData.afkStartTime));
    }

    // 5 mins = 300,000 ms
    var ticks = Math.floor(timeSinceCheck / 300000); 
    if(ticks > 0) {
        let actIdx = userData.combat.maxActCleared || 0;
        if(actIdx >= STORY_CHAPTER_1.length) actIdx = STORY_CHAPTER_1.length - 1;
        let act = STORY_CHAPTER_1[actIdx];

        userData.afkPendingLt = (userData.afkPendingLt || 0) + (act.rwLt * 0.05 * ticks);
        userData.afkPendingExp = (userData.afkPendingExp || 0) + (act.rwExp * 0.05 * ticks);

        // 20% drop chest every 5 minutes
        for(let i=0; i<ticks; i++) {
            if(Math.random() < 0.20) userData.afkChests = (userData.afkChests || 0) + 1;
        }

        userData.afkLastCheck += ticks * 300000;
        saveData();
    }
}