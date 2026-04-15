// ════════════════════════════════════════════
// FARM STATE
// ════════════════════════════════════════════
var plotSelecting = [];
var currentFarmTab = 'ruong';

// ════════════════════════════════════════════
// FARM TAB HTML INJECTION
// ════════════════════════════════════════════
function renderFarmTabHTML() {
    document.getElementById('tab-farm').innerHTML = `
        <div class="farm-resource-bar">
            <div class="farm-res"><span class="ricon">🌿</span><div style="min-width:0;"><span class="rlbl">Linh Thảo</span><span class="rval" id="farm-linhthao">0</span></div></div>
            <div class="farm-res lt-r"><img src="img/linhthach.png" class="ricon-img" alt="💎" onerror="this.outerHTML='<span class=\\'ricon\\'>💎</span>'"><div style="min-width:0;"><span class="rlbl">Linh Thạch</span><span class="rval" id="farm-linhthach">0</span></div></div>
            <div class="farm-res pill-r"><span class="ricon">💊</span><div style="min-width:0;"><span class="rlbl">Đan Dược</span><span class="rval" id="farm-danduo">0</span></div></div>
        </div>
        <div class="farm-status" id="farm-status"></div>

        <div class="farm-sub-nav">
            <button class="farm-sub-btn active" onclick="showFarmTab('ruong',this)">🌾 Ruộng</button>
            <button class="farm-sub-btn" onclick="showFarmTab('lo',this)">⚗️ Lò Luyện</button>
            <button class="farm-sub-btn" onclick="showFarmTab('kho',this)">📦 Kho</button>
            <button class="farm-sub-btn" onclick="showFarmTab('shop',this)">🛒 Shop</button>
            <button class="farm-sub-btn" onclick="showFarmTab('nangcap',this)">⬆️ Nâng Cấp</button>
        </div>

        <div class="farm-sub-tab-content active" id="farm-sub-ruong">
            <div class="card">
                <div class="card-header"><h3 style="margin:0;">🌾 Ruộng Trồng Trọt</h3><span style="font-size:11px;color:var(--text-muted);" id="plot-count-lbl">3/3 ô</span></div>
                <p>Trồng cây để thu hoạch. Thu hoạch vào Kho để Bán hoặc Dùng luyện đan.</p>
                <div class="plot-grid" id="plots-container"></div>
            </div>
        </div>

        <div class="farm-sub-tab-content" id="farm-sub-lo">
            <div class="factory-section">
                <h3>⚗️ Lò Luyện Đan</h3>
                <div id="active-furnace-display"></div>
                <div class="pill-selector" id="pill-selector-row"></div>
                <div class="pill-info-bar" id="pill-info-display">Chọn đan để xem thông tin</div>
                <div style="display:flex;align-items:center;justify-content:space-between;margin-top:8px;">
                    <span style="font-size:12px;color:var(--text-muted);font-weight:500;">Hàng chờ (max <span id="max-queue-lbl">5</span>):</span>
                    <div class="factory-queue" id="factory-queue-display"></div>
                </div>
                <div class="factory-timer" id="factory-timer">--:--</div>
                <div class="factory-btns">
                    <button class="action-btn" id="btn-craft" style="background:rgba(157,78,221,0.15);border-color:rgba(157,78,221,0.4);" onclick="startCraft()">⚗️ Nạp Liệu</button>
                    <button class="action-btn" id="btn-craft-all" style="background:rgba(157,78,221,0.1);border-color:rgba(157,78,221,0.3);display:none;" onclick="startCraftAll()">🔄 Luyện Tất Cả</button>
                    <button class="action-btn" id="btn-claim" onclick="claimPills()" style="background:rgba(16,185,129,0.15);border-color:rgba(16,185,129,0.4);color:var(--green);">💊 Dùng Đan</button>
                </div>
                <div style="margin-top:10px;font-size:11px;color:var(--text-muted);text-align:center;" id="total-alchemy-lbl">Tổng đan đã luyện: 0</div>
            </div>
        </div>

        <div class="farm-sub-tab-content" id="farm-sub-kho">
            <div class="card">
                <div class="card-header"><h3 style="margin:0;">📦 Kho Chứa</h3></div>
                <p>Bán lấy 💎 Linh Thạch · Dùng chuyển thành 🌿 Linh Thảo để luyện đan.</p>
                <div id="inventory-container" style="margin-top:12px;"></div>
            </div>
        </div>

        <div class="farm-sub-tab-content" id="farm-sub-shop">
            <div class="card">
                <div class="card-header"><h3 style="margin:0;">🛒 Shop Lò Luyện</h3><span style="font-size:11px;color:var(--cyan);">💎 <span id="shop-lt-display">0</span></span></div>
                <p>Mua lò để tăng hiệu quả luyện đan. Chỉ 1 lò được dùng tại 1 thời điểm.</p>
                <div id="shop-furnace-container" style="margin-top:12px;"></div>
            </div>
        </div>

        <div class="farm-sub-tab-content" id="farm-sub-nangcap">
            <div class="card">
                <h3>⬆️ Nâng Cấp Cổ Xưa (Danh Vọng 🏆)</h3>
                <div class="upgrade-row" style="margin-top:14px;">
                    <div class="upgrade-info"><div class="upgrade-name">🌱 Tốc độ sinh trưởng</div><div class="upgrade-desc">Giảm 20% thời gian trồng cây</div></div>
                    <button class="upg-btn" id="btn-upg-speed" onclick="buyUpgrade('speedUp',5)">5 🏆</button>
                </div>
                <div class="upgrade-row">
                    <div class="upgrade-info"><div class="upgrade-name">🔥 Lò luyện nâng cấp</div><div class="upgrade-desc">Giảm 30% thời gian luyện đan</div></div>
                    <button class="upg-btn" id="btn-upg-furnace" onclick="buyUpgrade('furnaceUp',10)">10 🏆</button>
                </div>
            </div>
            <div class="card">
                <h3>✨ Nâng Cấp Hệ Thống (Linh Thạch 💎)</h3>
                <div id="new-upgrades-container"></div>
            </div>
        </div>`;
}

// ════════════════════════════════════════════
// FARM INIT & DATA
// ════════════════════════════════════════════
function initFarmData() {
    if(!userData.farm){
        userData.farm={lastSave:Date.now(),linhthao:0, plots:[{cropType:null},{cropType:null},{cropType:null}],
            factory:{queue:[],selectedPill:0,completedPills:{0:0,1:0,2:0,3:0,4:0}}, upgrades:{speedUp:false,furnaceUp:false},
            upgrades2:{plotSlot:0,queueSlot:0,craftAll:false,cropSpeed:0,sellBonus:0,waterSys:0,afkCap:0},
            furnaces:{owned:[],active:-1}, inventory:{0:0,1:0,2:0,3:0,4:0,5:0} };
    }
    var maxPlots=getMaxPlots(); while(userData.farm.plots.length<maxPlots) userData.farm.plots.push({cropType:null,plantedAt:null,done:false});
    plotSelecting=new Array(userData.farm.plots.length).fill(false);
}
function getMaxPlots(){return 3+(userData.farm.upgrades2?(userData.farm.upgrades2.plotSlot||0):0);}
function getMaxQueue(){return 5+(userData.farm.upgrades2?(userData.farm.upgrades2.queueSlot||0):0);}
function getCropDuration(ci){ return Math.max(60,Math.floor(CROPS[ci].duration*(userData.farm.upgrades.speedUp?0.8:1.0)*getCropSpeedMult())); }
function getFactoryDuration(pillIdx){ return Math.max(60,Math.floor(PILLS[(pillIdx||0)].craftDuration*(userData.farm.upgrades.furnaceUp?0.7:1.0)*getFactorySpeedMult())); }

function offlineFarmCatchup() {
    if(!userData.farm||!userData.farm.lastSave)return;
    var now=Date.now(),changed=false;
    userData.farm.plots.forEach(function(plot){
        if(plot.cropType!==null&&!plot.done&&plot.plantedAt){
            if(now-plot.plantedAt>=getCropDuration(plot.cropType)*1000){plot.done=true;changed=true;}
        }
    });

    var q = userData.farm.factory.queue;
    var isParallel = userData.farm.upgrades2 && userData.farm.upgrades2.craftAll;
    if (isParallel) {
        for(let i = q.length - 1; i >= 0; i--) {
            if(!q[i].startedAt) q[i].startedAt = userData.farm.lastSave;
            var factDurMs = getFactoryDuration(q[i].pillType||0) * 1000;
            if(now >= q[i].startedAt + factDurMs) {
                userData.farm.factory.completedPills[q[i].pillType||0] = (userData.farm.factory.completedPills[q[i].pillType||0] || 0) + 1;
                q.splice(i, 1); changed = true;
            }
        }
    } else {
        var keepGoing=true;
        while(keepGoing&&q.length>0){
            var craft=q[0]; var factDurMs=getFactoryDuration(craft.pillType||0)*1000;
            if(craft.startedAt&&now>=craft.startedAt+factDurMs){
                userData.farm.factory.completedPills[craft.pillType||0]=(userData.farm.factory.completedPills[craft.pillType||0]||0)+1;
                var nextStart=craft.startedAt+factDurMs;
                q.shift();
                if(q.length>0&&!q[0].startedAt)q[0].startedAt=nextStart;
                changed=true;
            }else{keepGoing=false;}
        }
    }
    userData.farm.lastSave=now;
    if(changed)localStorage.setItem(SAVE_KEY,JSON.stringify(userData));
}

// ════════════════════════════════════════════
// FARM ACTIONS
// ════════════════════════════════════════════
function plantCrop(pIdx,cIdx) {
    var plot=userData.farm.plots[pIdx];if(plot.cropType!==null)return;
    plot.cropType=cIdx;plot.plantedAt=Date.now();plot.done=false; plotSelecting[pIdx]=false;
    userData.farm.lastSave=Date.now(); saveData();renderFarmPlots();
    showFarmStatus("🌱 Đã trồng "+CROPS[cIdx].name+"!");
}
function harvestPlot(pIdx) {
    var plot=userData.farm.plots[pIdx];if(!plot.done)return;
    var finalYield = Math.floor(CROPS[plot.cropType].yield * (1.0 + getPBBonus('farm')));
    userData.farm.inventory[plot.cropType] = (userData.farm.inventory[plot.cropType]||0) + finalYield;
    userData.totalCropsHarvested = (userData.totalCropsHarvested||0) + 1;
    plot.cropType=null;plot.plantedAt=null;plot.done=false;
    userData.farm.lastSave=Date.now(); checkAchievements(); saveData();renderFarmPlots();updateFarmResourceDisplay();
    showFarmStatus("🌾 Thu hoạch thành công!");
}
function togglePlotSelect(idx){plotSelecting[idx]=!plotSelecting[idx];renderFarmPlots();}

function sellCrop(cropIdx, amount) {
    var inv=userData.farm.inventory[cropIdx]||0; if(inv<amount)return;
    var total=getSellPrice(cropIdx)*amount;
    userData.farm.inventory[cropIdx]=inv-amount; userData.linhThach=(userData.linhThach||0)+total;
    saveData();renderInventory();updateFarmResourceDisplay(); showFarmStatus("💎 Bán thành công!");
}
function useCrop(cropIdx, amount) {
    var inv=userData.farm.inventory[cropIdx]||0; if(inv<amount)return;
    userData.farm.inventory[cropIdx]=inv-amount; userData.farm.linhthao=(userData.farm.linhthao||0)+amount;
    saveData();renderInventory();updateFarmResourceDisplay(); showFarmStatus("🌿 Đổi Thảo thành công!");
}

function selectPill(idx){ userData.farm.factory.selectedPill=idx; saveData(); renderPillSelector(); }
function startCraft(){
    var selectedPill=userData.farm.factory.selectedPill||0; var pill=PILLS[selectedPill];
    var isParallel = userData.farm.upgrades2 && userData.farm.upgrades2.craftAll;
    if(userData.farm.factory.queue.length>=getMaxQueue()){showFarmStatus("❌ Hàng chờ đầy!");return;}
    if((userData.farm.linhthao||0)<pill.cost){showFarmStatus("❌ Thiếu 🌿!");return;}
    userData.farm.linhthao-=pill.cost;
    userData.farm.factory.queue.push({ pillType: selectedPill, startedAt: (userData.farm.factory.queue.length===0 || isParallel) ? Date.now() : null });
    saveData();updateFarmResourceDisplay();renderFactoryQueue();renderPillSelector(); showFarmStatus("⚗️ Bắt đầu luyện đan!");
}
function startCraftAll(){
    var selectedPill=userData.farm.factory.selectedPill||0; var pill=PILLS[selectedPill]; var added=0;
    while(userData.farm.factory.queue.length<getMaxQueue()&&(userData.farm.linhthao||0)>=pill.cost){
        userData.farm.linhthao-=pill.cost; userData.farm.factory.queue.push({pillType:selectedPill, startedAt: Date.now()}); added++;
    }
    if(added===0)return; saveData();updateFarmResourceDisplay();renderFactoryQueue();renderPillSelector();
}
function claimPills(){
    var cp=userData.farm.factory.completedPills;var total=0;
    PILLS.forEach(function(p,idx){ var count=cp[idx]||0; if(count>0){addExp(getPillExp(idx)*count);total+=count;cp[idx]=0;} });
    if(total===0)return; userData.totalAlchemyDone=(userData.totalAlchemyDone||0)+total;
    checkAchievements(); saveData();updateFarmResourceDisplay();updateUI(); showFarmStatus("💊 Dùng "+total+" Đan!");
}

// ════════════════════════════════════════════
// RENDER FARM TABS
// ════════════════════════════════════════════
function renderFarmAll(){
    renderFarmPlots();renderFactoryQueue();renderFarmUpgrades(); updateFarmResourceDisplay();
    renderPillSelector();renderActiveFurnace(); renderNewUpgrades();updatePlotCountLabel();updateMaxQueueLabel();
    if(currentFarmTab==='kho')renderInventory(); if(currentFarmTab==='shop')renderShop();
}

function renderFarmPlots(){
    var container=document.getElementById('plots-container');if(!container)return;
    var now=Date.now();container.innerHTML='';
    userData.farm.plots.forEach(function(plot,i){
        var card=document.createElement('div');
        if(plot.cropType===null){
            card.className='plot-card';
            var cropOpts=CROPS.map(function(c,ci){ return '<button class="crop-opt" onclick="plantCrop('+i+','+ci+')"><img src="'+c.img+'" class="crop-opt-img" alt="'+c.emoji+'" onerror="this.outerHTML=\'<span>'+c.emoji+'</span>\'"><div><span>'+c.name+'</span><small>'+c.desc+'</small></div></button>'; }).join('');
            card.innerHTML='<div class="plot-emoji">🟫</div><div class="plot-lbl">Ruộng trống</div><button class="plot-btn" onclick="togglePlotSelect('+i+')">🌱 Trồng</button><div class="crop-select'+(plotSelecting[i]?' visible':'')+'" id="cs-'+i+'">'+cropOpts+'</div>';
        }else{
            var cr=CROPS[plot.cropType]; var dur=getCropDuration(plot.cropType)*1000; var elp=now-plot.plantedAt;
            var done=plot.done||elp>=dur; if(!plot.done&&done)plot.done=true;
            if(done){
                card.className='plot-card ready';
                card.innerHTML='<img src="'+cr.img+'" class="plot-img" onerror="this.outerHTML=\'<div class=\\\'plot-emoji\\\'>'+cr.emoji+'</div>\'"><div class="plot-lbl">'+cr.name+'</div><div class="plot-timer" style="color:var(--gold)">✓ Xong!</div><button class="plot-btn harvest" onclick="harvestPlot('+i+')">🌾 Thu</button>';
            }else{
                var remaining=Math.ceil((dur-elp)/1000); var secLabel=cr.duration>=3600?'<div id="pt-lbl-'+i+'" style="font-size:9px;color:var(--text-muted);margin-top:1px;">'+fmtHuman(remaining)+'</div>':'';
                card.className='plot-card growing';
                card.innerHTML='<img src="'+cr.img+'" class="plot-img" onerror="this.outerHTML=\'<div class=\\\'plot-emoji\\\'>'+cr.emoji+'</div>\'"><div class="plot-lbl">'+cr.name+'</div><div class="plot-timer" id="pt-'+i+'">'+fmt(remaining)+'</div>'+secLabel+'<button class="plot-btn" disabled>Đang trồng</button>';
            }
        }
        container.appendChild(card);
    });
}

function renderInventory() {
    var el=document.getElementById('inventory-container');if(!el)return;
    var inv=userData.farm.inventory||{}; var hasItems=false; var html='';
    for(var i=0;i<CROPS.length;i++){
        var count=inv[i]||0;
        if(count>0){hasItems=true; var sp=getSellPrice(i);
            html+='<div class="inv-row"><img src="'+CROPS[i].img+'" class="inv-img" alt="'+CROPS[i].emoji+'" onerror="this.outerHTML=\'<span style=\\\'font-size:32px;flex-shrink:0;\\\'>'+CROPS[i].emoji+'</span>\'"><div class="inv-info"><div class="inv-name">'+CROPS[i].name+'</div><div class="inv-count">×'+count+' · Giá bán: '+sp+'💎</div></div><div class="inv-btns"><button class="inv-btn sell-btn" onclick="sellCrop('+i+','+count+')">Bán<br><small>+'+sp*count+'💎</small></button><button class="inv-btn use-btn" onclick="useCrop('+i+','+count+')">Dùng<br><small>+'+count+'🌿</small></button></div></div>';
        }
    }
    if(!hasItems)html='<div style="text-align:center;color:var(--text-muted);padding:30px 0;">Kho trống.</div>';
    el.innerHTML=html;
}

function renderPillSelector(){
    var el=document.getElementById('pill-selector-row');if(!el||!userData.farm||!userData.farm.factory)return;
    var selectedPill=userData.farm.factory.selectedPill||0;
    el.innerHTML=PILLS.map(function(pill,idx){
        return '<button class="pill-opt'+(idx===selectedPill?' active':'')+'" onclick="selectPill('+idx+')"><img src="'+pill.img+'" class="pill-opt-img" alt="'+pill.emoji+'" onerror="this.outerHTML=\'<span>'+pill.emoji+'</span>\'"><span>'+pill.name+'</span><small>'+pill.cost+'🌿</small></button>';
    }).join('');
    var infoEl=document.getElementById('pill-info-display');
    if(infoEl){infoEl.textContent="Cần: "+PILLS[selectedPill].cost+"🌿 | Luyện: "+fmt(getFactoryDuration(selectedPill))+" | Thưởng: +"+getPillExp(selectedPill)+" Tu Vi";}
    var caBtn=document.getElementById('btn-craft-all');
    if(caBtn)caBtn.style.display=userData.farm.upgrades2&&userData.farm.upgrades2.craftAll?'flex':'none';
}

function renderFactoryQueue(){
    var el=document.getElementById('factory-queue-display');if(!el)return;el.innerHTML='';
    var isParallel = userData.farm.upgrades2 && userData.farm.upgrades2.craftAll;
    for(var i=0;i<getMaxQueue();i++){
        var slot=document.createElement('div'); var craft=userData.farm.factory.queue[i];
        var isActive = craft && craft.startedAt && (isParallel || i === 0);
        slot.className = isActive ? 'q-slot active-q' : 'q-slot';
        if(craft){var img=document.createElement('img');img.src=PILLS[craft.pillType||0].img;img.style='width:18px;height:18px;object-fit:contain;'; slot.appendChild(img);}
        el.appendChild(slot);
    }
    var tlEl=document.getElementById('total-alchemy-lbl'); if(tlEl)tlEl.textContent="Tổng đan đã luyện: "+(userData.totalAlchemyDone||0);
}

function renderFarmUpgrades(){
    var bs=document.getElementById('btn-upg-speed');var bf=document.getElementById('btn-upg-furnace');
    if(!bs||!bf||!userData.farm)return;
    if(userData.farm.upgrades.speedUp){bs.textContent='✓ Mở khóa';bs.classList.add('owned');bs.disabled=true;}else{bs.textContent='5 🏆';bs.classList.remove('owned');bs.disabled=false;}
    if(userData.farm.upgrades.furnaceUp){bf.textContent='✓ Mở khóa';bf.classList.add('owned');bf.disabled=true;}else{bf.textContent='10 🏆';bf.classList.remove('owned');bf.disabled=false;}
}
function renderNewUpgrades(){
    var el=document.getElementById('new-upgrades-container');if(!el)return;
    var lt=Math.floor(userData.linhThach||0); var html='';
    FARM_UPGRADES2.forEach(function(upg){
        var isBool=upg.maxLevel===1; var currentLevel=userData.farm.upgrades2?(userData.farm.upgrades2[upg.id]||0):0;
        var isMaxed=(isBool&&currentLevel===true)||((!isBool)&&currentLevel>=upg.maxLevel);
        var cost=isMaxed?0:Math.round(upg.baseCost*Math.pow(upg.costMult,isBool?0:currentLevel));
        var levelText=isBool?(currentLevel===true?'✓ Đã mua':'Chưa mua'):('Cấp '+currentLevel+'/'+upg.maxLevel);
        html+='<div class="upgrade-row"><div class="upgrade-info"><div class="upgrade-name">'+upg.name+'</div><div class="upgrade-desc">'+upg.desc+'</div><div style="font-size:10px;color:var(--cyan);margin-top:3px;">'+levelText+'</div></div><button class="upg-btn lt-upg-btn" onclick="buyNewUpgrade(\''+upg.id+'\')" '+(isMaxed?'disabled':'')+'>'+(isMaxed?'✓ Tối đa':cost+'💎')+'</button></div>';
    });
    el.innerHTML=html;
}
function buyUpgrade(key,cost){
    if(userData.farm.upgrades[key] || userData.points<cost) return;
    userData.points-=cost;userData.farm.upgrades[key]=true; saveData();renderFarmUpgrades();updateUI();
}
function buyNewUpgrade(id){
    var upg=FARM_UPGRADES2.find(function(u){return u.id===id;});if(!upg)return;
    var currentLevel=userData.farm.upgrades2[id]||0; if(currentLevel>=upg.maxLevel)return;
    var isBool=upg.maxLevel===1;
    var cost=Math.round(upg.baseCost*Math.pow(upg.costMult,isBool?0:currentLevel));
    if((userData.linhThach||0)<cost){showFarmStatus("❌ Thiếu 💎!");return;}
    userData.linhThach-=cost;
    if(isBool){userData.farm.upgrades2[id]=true;}else{userData.farm.upgrades2[id]=currentLevel+1;}
    if(id==='plotSlot'){userData.farm.plots.push({cropType:null,plantedAt:null,done:false}); plotSelecting.push(false);}
    saveData();renderNewUpgrades();renderFarmAll();updateGlobalLT(); showFarmStatus("✅ Nâng cấp thành công!");
}

function buyFurnace(idx){
    var f=FURNACES[idx]; if(userData.farm.furnaces.owned.indexOf(idx)!==-1 || (userData.linhThach||0)<f.price) return;
    userData.linhThach-=f.price; userData.farm.furnaces.owned.push(idx); saveData();renderShop();updateGlobalLT();
}
function activateFurnace(idx){
    if(userData.farm.furnaces.owned.indexOf(idx)===-1) return;
    userData.farm.furnaces.active=idx; saveData();renderShop();renderActiveFurnace();renderPillSelector();
}
function renderShop(){
    var el=document.getElementById('shop-furnace-container');if(!el)return;
    var lt=Math.floor(userData.linhThach||0); var html='';
    FURNACES.forEach(function(f,i){
        var owned=userData.farm.furnaces.owned.indexOf(i)!==-1; var active=userData.farm.furnaces.active===i;
        html+='<div class="furnace-card'+(active?' active-card':owned?' owned-card':'')+'"><img src="'+f.img+'" class="furnace-img" onerror="this.style.opacity=\'0.4\'"><div class="furnace-info"><div class="furnace-name">'+f.name+'</div><div class="furnace-stats">'+f.desc+'</div></div><div class="furnace-btns">'+(owned?'':('<button class="furnace-btn buy-furnace-btn" onclick="buyFurnace('+i+')">Mua '+f.price+'💎</button>'))+(owned?('<button class="furnace-btn use-furnace-btn'+(active?' active-furnace':'')+'" onclick="activateFurnace('+i+')">'+(active?'✓ Đang dùng':'Kích hoạt')+'</button>'):'')+'</div></div>';
    });
    el.innerHTML=html;
}
function renderActiveFurnace(){
    var el=document.getElementById('active-furnace-display');if(!el)return;
    var active=userData.farm.furnaces?userData.farm.furnaces.active:-1;
    if(active<0){el.innerHTML='<div style="font-size:11px;color:var(--text-muted);text-align:center;padding:8px 0;">Không có lò</div>';return;}
    var f=FURNACES[active]; el.innerHTML='<div class="active-furnace-bar"><img src="'+f.img+'"><div><div class="fname">'+f.name+'</div><div class="fstats">'+f.desc+'</div></div></div>';
}

function updateFarmResourceDisplay(){
    if(!userData.farm)return;
    var ltEl=document.getElementById('farm-linhthao'); if(ltEl)ltEl.textContent=userData.farm.linhthao||0;
    var ltEl2=document.getElementById('farm-linhthach'); if(ltEl2)ltEl2.textContent=Math.floor(userData.linhThach||0);
    var total=0; if(userData.farm.factory&&userData.farm.factory.completedPills){for(var k=0;k<5;k++)total+=(userData.farm.factory.completedPills[k]||0);}
    var ddEl=document.getElementById('farm-danduo'); if(ddEl)ddEl.textContent=total;
    updateGlobalLT();
}
function showFarmTab(id, el) {
    document.querySelectorAll('.farm-sub-tab-content').forEach(function(c){c.classList.remove('active');});
    document.querySelectorAll('.farm-sub-btn').forEach(function(b){b.classList.remove('active');});
    document.getElementById('farm-sub-'+id).classList.add('active'); if(el)el.classList.add('active');
    currentFarmTab=id; renderFarmAll();
}
function updatePlotCountLabel(){ var el=document.getElementById('plot-count-lbl'); if(el)el.textContent=userData.farm.plots.length+"/"+getMaxPlots()+" ô"; }
function updateMaxQueueLabel(){ var el=document.getElementById('max-queue-lbl'); if(el)el.textContent=getMaxQueue(); }
function showFarmStatus(msg){
    var el=document.getElementById('farm-status');if(!el)return; el.textContent=msg;el.style.opacity='1';
    clearTimeout(el._t);el._t=setTimeout(function(){el.style.opacity='0';},2500);
}

// ════════════════════════════════════════════
// FARM TIMER
// ════════════════════════════════════════════
function startFarmTimer(){if(farmInterval)clearInterval(farmInterval);farmInterval=setInterval(farmTick,1000);}

function farmTick(){
    if(!userData.farm)return;
    var now=Date.now(); var needSave = false; var needRerender = false;

    syncAFK(); // Tích hợp AFK vào nhịp timer chính

    userData.farm.plots.forEach(function(plot){
        if(plot.cropType!==null&&!plot.done&&plot.plantedAt){
            if(now-plot.plantedAt>=getCropDuration(plot.cropType)*1000){ plot.done=true; needRerender=true; needSave=true; }
        }
    });

    var q = userData.farm.factory.queue;
    var isParallel = userData.farm.upgrades2 && userData.farm.upgrades2.craftAll;
    var initialLength = q.length;

    if (isParallel) { for(let i = 0; i < q.length; i++) { if (!q[i].startedAt) q[i].startedAt = Date.now(); } }

    for(let i = q.length - 1; i >= 0; i--) {
        if(q[i].startedAt) {
            var factDur = getFactoryDuration(q[i].pillType||0) * 1000;
            if(now >= q[i].startedAt + factDur) {
                userData.farm.factory.completedPills[q[i].pillType||0] = (userData.farm.factory.completedPills[q[i].pillType||0] || 0) + 1;
                q.splice(i, 1); needSave = true;
            }
        }
    }

    if (!isParallel && q.length > 0 && !q[0].startedAt && needSave) { q[0].startedAt = Date.now(); }
    if(q.length < initialLength) { if(activeDrawerTab==='tab-farm'){renderFactoryQueue();updateFarmResourceDisplay();} }

    if (needSave) { userData.farm.lastSave = Date.now(); localStorage.setItem(SAVE_KEY, JSON.stringify(userData)); }

    requestAnimationFrame(function(){
        if(activeDrawerTab==='tab-meditation') renderMeditation();
        if(activeDrawerTab==='tab-farm'){
            if(currentFarmTab==='ruong'){
                if(needRerender){renderFarmPlots();}else{
                    userData.farm.plots.forEach(function(plot,i){
                        if(plot.cropType!==null&&!plot.done&&plot.plantedAt){
                            var remaining=Math.ceil((getCropDuration(plot.cropType)*1000-(Date.now()-plot.plantedAt))/1000);
                            var tEl=document.getElementById("pt-"+i);if(tEl)tEl.textContent=fmt(remaining);
                        }
                    });
                }
            }
            if(currentFarmTab==='lo')updateFactoryTimerDisplay(Date.now());
        }
    });
}

function updateFactoryTimerDisplay(now){
    var el=document.getElementById('factory-timer');if(!el||!userData.farm)return;
    var q=userData.farm.factory.queue;
    if(q.length===0){el.textContent='--:--';el.style.color='var(--text-muted)';el.style.textShadow='none';return;}
    var minRem = -1; var displayIdx = 0;
    for(let i=0; i<q.length; i++) {
        if(q[i].startedAt) {
            var pIdx = q[i].pillType||0; var dur = getFactoryDuration(pIdx)*1000;
            var rem = Math.ceil((dur - (now - q[i].startedAt))/1000);
            if(minRem === -1 || rem < minRem) { minRem = rem; displayIdx = pIdx; }
        }
    }
    if(minRem === -1) { el.textContent='--:--'; return; }
    if(displayIdx<=1){el.style.color='var(--cyan)';el.style.textShadow='0 0 15px rgba(0,210,255,0.4)';}
    else if(displayIdx===2){el.style.color='var(--gold)';el.style.textShadow='0 0 15px rgba(251,191,36,0.4)';}
    else{el.style.color='var(--purple)';el.style.textShadow='0 0 20px rgba(157,78,221,0.6)';}
    el.textContent=minRem>0?fmt(minRem):'00:00';
}
