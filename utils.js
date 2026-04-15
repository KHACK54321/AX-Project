// ════════════════════════════════════════════
// FORMAT HELPERS
// ════════════════════════════════════════════
function fmt(s){
    if(s<=0)return"00:00"; s=Math.floor(s);
    if(s>=86400){var d=Math.floor(s/86400),h=Math.floor((s%86400)/3600),m=Math.floor((s%3600)/60);return d+"ngày "+h+"h "+m+"ph";}
    var h=Math.floor(s/3600),m=Math.floor((s%3600)/60),sec=s%60;
    if(h>0)return String(h).padStart(2,'0')+":"+String(m).padStart(2,'0')+":"+String(sec).padStart(2,'0');
    return String(m).padStart(2,'0')+":"+String(sec).padStart(2,'0');
}
function fmtHuman(s){
    s=Math.floor(s);if(s>=86400){var d=Math.floor(s/86400),h=Math.floor((s%86400)/3600);return"~"+d+"d "+h+"h";}
    var h=Math.floor(s/3600),m=Math.floor((s%3600)/60);if(h>0)return"~"+h+"h "+m+"m";return"~"+m+"m";
}

// ════════════════════════════════════════════
// TOAST / NOTIFICATIONS
// ════════════════════════════════════════════
function showToast(msg, type, btnLabel, btnAction) {
    var container=document.getElementById('toast-container');
    var existing=container.querySelectorAll('.toast');
    if(existing.length>=3){existing[0].classList.add('dismissing');setTimeout(function(){if(existing[0].parentNode)existing[0].remove();},280);}
    var toast=document.createElement('div');toast.className='toast '+(type||'info');
    var msgSpan=document.createElement('span');msgSpan.className='toast-msg';msgSpan.textContent=msg;toast.appendChild(msgSpan);
    if(btnLabel&&btnAction){var btn=document.createElement('button');btn.className='toast-btn';btn.textContent=btnLabel;btn.onclick=btnAction;toast.appendChild(btn);}
    container.appendChild(toast);
    var timer=setTimeout(function(){toast.classList.add('dismissing');setTimeout(function(){if(toast.parentNode)toast.remove();},280);},2500);
    toast.addEventListener('click',function(){clearTimeout(timer);toast.classList.add('dismissing');setTimeout(function(){if(toast.parentNode)toast.remove();},280);});
}
function showMcAchievement(icon, title, desc) {
    var el=document.getElementById('mc-achievement');
    document.getElementById('mc-icon').textContent=icon;
    document.getElementById('mc-title').textContent=title;
    document.getElementById('mc-desc').textContent=desc;
    el.classList.add('show');
    clearTimeout(el._t);
    el._t=setTimeout(function(){el.classList.remove('show');},3500);
}

// ════════════════════════════════════════════
// DATA MIGRATION
// ════════════════════════════════════════════
function migrateData(data) {
    var v=data.schemaVersion||0;
    if(v<1) {
        if(typeof data.checkinStreak==='undefined')data.checkinStreak=0;
        if(typeof data.exp==='undefined')data.exp=0;
        if(typeof data.realmIndex==='undefined')data.realmIndex=0;
        if(typeof data.points==='undefined')data.points=0;
        if(typeof data.totalDailyTasksDone==='undefined')data.totalDailyTasksDone=0;
        if(typeof data.totalWeeklyTasksDone==='undefined')data.totalWeeklyTasksDone=0;
        if(!data.farm) {
            data.farm={lastSave:Date.now(),linhthao:0,plots:[{cropType:null},{cropType:null},{cropType:null}],
                factory:{queue:[],selectedPill:0,completedPills:{0:0,1:0,2:0,3:0,4:0}},upgrades:{speedUp:false,furnaceUp:false}};
        }
    }
    if(v<2) {
        if(typeof data.linhThach==='undefined')data.linhThach=0;
        if(typeof data.totalCropsHarvested==='undefined')data.totalCropsHarvested=0;
        if(typeof data.totalAlchemyDone==='undefined')data.totalAlchemyDone=0;
        if(!data.achievements)data.achievements={};
        if(!data.meditation)data.meditation={today:0,date:'',streak:0,lastFullDate:''};
        if(!data.farm.upgrades2)data.farm.upgrades2={plotSlot:0,queueSlot:0,craftAll:false,cropSpeed:0,sellBonus:0,waterSys:0};
        if(!data.farm.furnaces)data.farm.furnaces={owned:[],active:-1};
        if(!data.farm.inventory)data.farm.inventory={0:0,1:0,2:0,3:0,4:0,5:0};
    }
    if(v<3) {
        if(typeof data.afkPendingLt === 'undefined') data.afkPendingLt = 0;
        if(typeof data.afkStartTime === 'undefined') data.afkStartTime = Date.now();
        if(typeof data.afkLastCheck === 'undefined') data.afkLastCheck = Date.now();
        if(data.farm && data.farm.upgrades2 && typeof data.farm.upgrades2.afkCap === 'undefined') data.farm.upgrades2.afkCap = 0;
    }
    if(v<4) {
        if(!data.journal) data.journal = {};
        if(!data.expense) data.expense = {};
    }

    if(!data.pbInv || !Array.isArray(data.pbInv)) { data.pbInv = []; data.pbEquipped = []; }
    data.schemaVersion=SCHEMA_VERSION;
    return data;
}

// ════════════════════════════════════════════
// LOAD / SAVE
// ════════════════════════════════════════════
function loadData() {
    var saved=localStorage.getItem(SAVE_KEY);
    if(saved){try{var parsed=JSON.parse(saved);parsed=migrateData(parsed);
        userData=Object.assign({},userData,parsed,{weeklyTasks:Object.assign({},userData.weeklyTasks,parsed.weeklyTasks)});}catch(e){}}
}
function saveData() { localStorage.setItem(SAVE_KEY,JSON.stringify(userData)); updateUI(); }
function getMidnight(d){return new Date(d).setHours(0,0,0,0);}
function getLastSundayMidnight(){var d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()-d.getDay());return d.getTime();}

// ════════════════════════════════════════════
// ACHIEVEMENTS CHECK
// ════════════════════════════════════════════
function checkAchievements() {
    if(!userData.achievements) userData.achievements={};
    ACHIEVEMENTS.forEach(function(a){
        if(!userData.achievements[a.id] && a.check(userData)){
            userData.achievements[a.id] = true;
            showMcAchievement(a.icon, a.name, "Mở khóa Thành Tựu Mới!");
            showToast("🏆 Thành tựu: "+a.name,'success');
        }
    });
}

// ════════════════════════════════════════════
// CENTRALIZED ADDITIVE BONUS SYSTEM
// ════════════════════════════════════════════
function getAchBonus(buffType) {
    let total = 0;
    ACHIEVEMENTS.forEach(a => { if(a.buff === buffType && userData.achievements && userData.achievements[a.id]) total += a.bonus; });
    return total;
}
function getPBBonus(type) {
    let total = 0;
    if(!userData.pbEquipped) return total;
    userData.pbEquipped.forEach(id => {
        let pb = PHAP_BAO_DATA.find(p => p.id === id);
        if(pb && pb.type === type) total += pb.bonus;
    });
    return total;
}
function getTuViMult() {
    let checkin = getAchBonus('checkin'); let daily = getAchBonus('daily');
    let weekly = getAchBonus('weekly'); let pb = getPBBonus('tuvi');
    return { checkin: checkin, daily: daily, weekly: weekly, pb: pb, total: 1.0 + checkin + daily + weekly + pb };
}
function getSellPrice(cropIdx) {
    var base = CROPS[cropIdx].sellPrice;
    var upgLevel = userData.farm.upgrades2 ? (userData.farm.upgrades2.sellBonus || 0) : 0;
    return Math.max(1, Math.floor(base * (1.0 + (upgLevel * 0.15) + getAchBonus('farmSell') + getPBBonus('farm'))));
}
function getCropSpeedMult() {
    var s1 = userData.farm.upgrades2 ? (userData.farm.upgrades2.cropSpeed || 0) : 0;
    var s2 = userData.farm.upgrades2 ? (userData.farm.upgrades2.waterSys || 0) : 0;
    var pbRed = userData.pbEquipped.includes('nuong') ? 0.20 : 0;
    return Math.max(0.1, 1.0 - (s1*0.05 + s2*0.05 + pbRed));
}
function getPillExp(pillIdx) {
    var base = PILLS[pillIdx].exp;
    var fBonus = (!userData.farm.furnaces || userData.farm.furnaces.active < 0) ? 0 : (FURNACES[userData.farm.furnaces.active].expBonus - 1);
    return Math.floor(base * (1.0 + fBonus + getAchBonus('alchemy') + getPBBonus('dan')));
}
function getFactorySpeedMult() {
    var fRed = (!userData.farm.furnaces || userData.farm.furnaces.active < 0) ? 0 : FURNACES[userData.farm.furnaces.active].timeRed;
    return Math.max(0.1, 1.0 - (fRed + getPBBonus('dan')));
}
function buffClass(val) { if(val>=0.3) return'buff-13p'; if(val>=0.2) return'buff-12'; if(val>=0.1) return'buff-11'; return'buff-10'; }

// ════════════════════════════════════════════
// AFK RATE HELPERS
// ════════════════════════════════════════════
function getAfkRate() { return 1.0 * (1.0 + getPBBonus('afk') + getAchBonus('meditation')); }
function getAfkLimitMs() { return (8 + ((userData.farm.upgrades2.afkCap || 0) * 2)) * 3600 * 1000; }

// ════════════════════════════════════════════
// UPDATE UI
// ════════════════════════════════════════════
function updateGlobalLT(){
    var lt = Math.floor(userData.linhThach||0);
    document.getElementById('global-lt').textContent=lt;
    var flt=document.getElementById('farm-linhthach');if(flt)flt.textContent=lt;
    var slt=document.getElementById('shop-lt-display');if(slt)slt.textContent=lt;
    var pbLt=document.getElementById('shop-pb-lt');if(pbLt)pbLt.textContent=lt;
}
function updateUI() {
    var btnCi=document.getElementById("btn-checkin");
    if(userData.lastCheckinMidnight===getMidnight(new Date())){btnCi.disabled=true;btnCi.innerText="Đã điểm danh";}else{btnCi.disabled=false;btnCi.innerText="Ký danh nhận thưởng";}
    var st=document.getElementById("consecutive-days");st.innerText=userData.checkinStreak;
    if(userData.checkinStreak>0)st.classList.add('streak-active');else st.classList.remove('streak-active');
    document.getElementById("stat-total-daily").innerText=userData.totalDailyTasksDone;
    document.getElementById("stat-total-weekly").innerText=userData.totalWeeklyTasksDone;

    var ih="";
    if(userData.checkinStreak>=356)ih='<img src="'+ICON_PURPLE_FIRE+'" class="achievement-icon" alt="">';
    else if(userData.checkinStreak>=100)ih='<img src="'+ICON_BLUE_FIRE+'" class="achievement-icon" alt="">';
    else if(userData.checkinStreak>=30)ih='<img src="'+ICON_FIRE+'" class="achievement-icon" alt="">';
    document.getElementById("streak-icon").innerHTML=ih;

    var tc=document.getElementById("daily-tasks-container");tc.innerHTML="";
    userData.currentDailyTasks.forEach(function(t,i){
        var txt=t.completed?"Đã xong":(t.max>1?"+1 ("+t.current+"/"+t.max+")":"Hoàn thành");
        tc.innerHTML+='<div class="task-row"><div class="task-info"><span class="task-title">'+t.desc+'</span><span class="task-prog">Cơ bản: '+t.exp+' Tu Vi</span></div><button class="action-btn" onclick="doDynamicTask('+i+')" '+(t.completed?'disabled':'')+'>'+txt+'</button></div>';
    });
    document.getElementById("prog-wt1").innerText=userData.weeklyTasks.dailyDone;
    document.getElementById("prog-wt2").innerText=userData.weeklyTasks.checkins;
    document.getElementById("status-wt1").innerText=userData.weeklyTasks.rw1?"Đã nhận":(userData.weeklyTasks.dailyDone>=25?"Đã đạt":"Chưa đạt");
    document.getElementById("status-wt2").innerText=userData.weeklyTasks.rw2?"Đã nhận":(userData.weeklyTasks.checkins>=7?"Đã đạt":"Chưa đạt");

    var r=realms[userData.realmIndex];
    document.getElementById("realm-name").innerText=r.name;
    document.getElementById("points").innerText=userData.points;
    if(userData.realmIndex>=realms.length-1){document.getElementById("exp").innerText="MAX";document.getElementById("max-exp").innerText="MAX";document.getElementById("exp-bar").style.width="100%";}
    else{document.getElementById("exp").innerText=userData.exp;document.getElementById("max-exp").innerText=r.maxExp;document.getElementById("exp-bar").style.width=((userData.exp/r.maxExp)*100)+"%";}

    let tuvi = getTuViMult();
    let setBuffUI = (id, val) => { let el = document.getElementById(id); if(!el) return; el.className = "buff-text " + buffClass(val); el.innerText = "+" + (val * 100).toFixed(0) + "%"; }
    setBuffUI("buff-checkin", tuvi.checkin); setBuffUI("buff-daily", tuvi.daily); setBuffUI("buff-weekly", tuvi.weekly);
    setBuffUI("buff-alchemy-ach", getAchBonus('alchemy')); setBuffUI("buff-sell-ach", getAchBonus('farmSell'));
    let pbEl = document.getElementById("buff-phaobao"); if(pbEl) pbEl.innerText = "+" + (tuvi.pb * 100).toFixed(0) + "%";
    document.getElementById("buff-total").innerText = tuvi.total.toFixed(2) + "x";
    document.getElementById("buff-checkin-display").innerText = "+" + (tuvi.checkin * 100).toFixed(0) + "%";

    document.getElementById("global-lt").innerText=Math.floor(userData.linhThach||0);
    document.getElementById("global-dv").innerText=userData.points||0;
    document.getElementById("global-exp").innerText=userData.exp||0;
    updateFarmResourceDisplay(); renderFarmUpgrades();
}