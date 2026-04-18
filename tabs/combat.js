// ════════════════════════════════════════════
// COMBAT ENGINE WITH SOUL EXP DISTRIBUTION (VIP UPDATE)
// ════════════════════════════════════════════
let battle = { active: false, act: null, stage: 1, pTeam: [], enemies: [], logs: [], tickInterval: null };

function renderCombatTabHTML() {
    document.getElementById('tab-combat').innerHTML = `
        <div id="story-map-view">
            <div class="card">
                <div class="card-header"><h2>🗺️ Chinh Phạt (Cốt Truyện)</h2></div>
                <p style="font-size:12px;color:var(--text-muted);">Vượt ải nhận Linh Thạch và Tu vi. Có thể farm lại vô hạn.</p>
                <div class="act-grid" id="story-act-list"></div>
            </div>
        </div>
        <div id="battle-arena">
            <div class="battle-stage-header" id="b-stage-title">ACT 1 - ẢI 1/6</div>
            <div class="combat-row" id="b-enemy-row"></div>
            <div class="combat-row" id="b-player-row"></div>
            <div class="battle-logger" id="b-logger"></div>
            <div class="combat-controls">
                <button class="action-btn main-btn danger-btn" onclick="fleeBattle()" style="flex:1;">🏳️ Rút Lui</button>
            </div>
        </div>
        <div class="gacha-modal" id="combat-chest-modal">
            <h2 style="color:var(--gold); margin-bottom:20px; text-shadow:0 0 10px var(--gold);">CHINH PHẠT THÀNH CÔNG</h2>
            <div class="chest-icon" id="combat-chest-icon" style="font-size:100px; cursor:pointer; animation:chestBounce 1s infinite; user-select:none;">📦</div>
            <p id="combat-chest-hint" style="color:var(--text-muted); margin-top:15px; font-size:12px;">Chạm vào rương để mở</p>
            <div class="gacha-results-grid" style="display:none; justify-content:center; width:90%;" id="combat-chest-rewards"></div>
            <button class="gacha-close-btn" id="combat-chest-btn" style="display:none; margin-top:20px; opacity:1; animation:none;" onclick="closeChestAndEnd()">Nhận Thưởng</button>
        </div>
    `;
}

function renderCombatTab() {
    if(battle.active) return; 
    document.getElementById('story-map-view').style.display = 'block';
    document.getElementById('battle-arena').style.display = 'none';

    let maxCleared = userData.combat.maxActCleared || 0;
    let html = '';
    
    STORY_CHAPTER_1.forEach((act, idx) => {
        let isLocked = idx > maxCleared;
        let btnText = isLocked ? "🔒 Đã Khóa" : (idx < maxCleared ? "🔄 Càn Quét Lại" : "⚔️ Khiêu Chiến");
        html += `
            <div class="act-card ${isLocked ? 'locked' : ''}" style="border-color:${act.color};">
                <div class="act-info">
                    <h3 style="color:${act.color}">${act.name}</h3>
                    <p>Thưởng: ${act.rwLt.toLocaleString()} 💎 | ${act.rwExp.toLocaleString()} ⚡</p>
                </div>
                <button class="action-btn" onclick="startCombat(${idx})" ${isLocked?'disabled':''}>${btnText}</button>
            </div>`;
    });
    document.getElementById('story-act-list').innerHTML = html;
}

function startCombat(actIndex) {
    let validTeam = userData.team.filter(id => id !== null);
    if(validTeam.length === 0) { showToast("Đội hình trống! Hãy vào Tab Linh Hồn thiết lập.", "error"); return; }

    battle.act = STORY_CHAPTER_1[actIndex]; battle.actIdx = actIndex; battle.stage = 1; battle.active = true; battle.logs = [];

    battle.pTeam = validTeam.map((soulId, pos) => {
        let db = ANIME_SOULS.find(s => s.id === soulId);
        let sData = userData.souls[soulId];
        let stats = getSoulStats(db, sData); 
        return {
            uid: 'p_'+pos, isPlayer: true, name: db.name, color: db.color, img: db.img, emoji: db.emoji,
            hp: stats.hp, maxHp: stats.hp, atk: stats.atk, spd: stats.spd, ct: 0, dbId: db.id, passives: {}, isDead: false
        };
    });

    document.getElementById('story-map-view').style.display = 'none'; document.getElementById('battle-arena').style.display = 'flex';
    initStage();
}

function initStage() {
    let act = battle.act; let isBoss = (battle.stage === 6);
    let hpBase = 1000 * act.hpMul * (isBoss ? 5 : 1); let atkBase = 100 * act.atkMul * (isBoss ? 2 : 1); let spdBase = act.spd * (isBoss ? 1.2 : 1);
    let imgPath = isBoss ? CHAPTER_1_BOSS_IMG : CHAPTER_1_MOB_IMG;

    battle.enemies = [{
        uid: 'e_0', isPlayer: false, name: isBoss ? `BOSS: Bạo Chúa ${act.name}` : `Quái ${act.name}`, 
        color: isBoss ? "#EF4444" : "#9CA3AF", img: imgPath, emoji: isBoss ? "👹" : "👾",
        hp: hpBase, maxHp: hpBase, atk: atkBase, spd: spdBase, ct: 0, isBoss: isBoss, passives: {}, isDead: false
    }];

    document.getElementById('b-stage-title').innerText = `${act.name} - ẢI ${battle.stage}/6`;
    document.getElementById('b-stage-title').style.color = isBoss ? "var(--red)" : "#fff";
    logMsg(`--- Bắt đầu Ải ${battle.stage} ---`, "#60A5FA");
    
    battle.pTeam.forEach(p => {
        if(p.dbId === 'raiden') p.passives.resolve = 0;
        if(p.dbId === 'tatsumaki') { p.passives.shield = p.maxHp * 0.3; logMsg(`${p.name} tạo khiên bảo vệ!`, p.color); }
        if(p.dbId === 'gojo_sukuna') { p.passives.form = 0; }
        if(p.dbId === 'zerotwo') { p.passives.zt_stacks = 0; p.passives.zt_nuke = false; }
        if(p.dbId === 'cid') { p.passives.shadows = 0; }
        if(p.dbId === 'makima') { p.passives.survived = false; }
        if(p.dbId === 'megumin') { p.passives.energy = 0; p.passives.canAttack = true; }
        if(p.dbId === 'frieren') { p.passives.turnCount = 0; p.passives.teamBuff = 0; }
        if(p.dbId === 'shieldhero') { p.passives.shieldStacks = 0; p.maxHp *= 2; p.hp = p.maxHp; logMsg(`${p.name} cường hóa lượng máu tối đa!`, p.color); }
    });

    renderBattleArena(); clearInterval(battle.tickInterval); battle.tickInterval = setInterval(battleTick, 600); 
}

function battleTick() {
    if(!battle.active) return clearInterval(battle.tickInterval);
    let allFighters = [...battle.pTeam, ...battle.enemies].filter(f => !f.isDead);
    if(allFighters.length === 0) return;

    allFighters.forEach(f => { f.ct += f.spd; });
    let actors = allFighters.filter(f => f.ct >= 1000).sort((a,b) => b.ct - a.ct);
    if(actors.length > 0) { let actor = actors[0]; actor.ct -= 1000; executeTurn(actor); }
    
    renderBattleArena(); checkWinLoss();
}

function executeTurn(actor) {
    if(actor.isDead) return;
    let target = null;
    
    // TÍNH TOÁN TARGET & TAUNT LURE
    if(actor.isPlayer) { 
        let aliveEnemies = battle.enemies.filter(e => !e.isDead); 
        if(aliveEnemies.length===0) return; 
        target = aliveEnemies[0]; 
    } else { 
        let alivePlayers = battle.pTeam.filter(p => !p.isDead); 
        if(alivePlayers.length===0) return; 
        let shieldHero = alivePlayers.find(p => p.dbId === 'shieldhero');
        target = shieldHero ? shieldHero : alivePlayers[Math.floor(Math.random() * alivePlayers.length)]; 
    }

    animateAttack(actor.uid); 
    let finalAtk = actor.atk;

    // FRIEREN BUFF TOÀN ĐỘI
    if(actor.isPlayer) {
        let frieren = battle.pTeam.find(p => p.dbId === 'frieren' && !p.isDead);
        if(frieren && actor.dbId === 'frieren') frieren.passives.teamBuff += 0.1; 
        if(frieren) finalAtk *= (1 + frieren.passives.teamBuff);
    }

    // NỘI TẠI TẤN CÔNG
    if(actor.isPlayer) {
        if(actor.dbId === 'megumin') {
            if(!actor.passives.canAttack) { logMsg(`${actor.name} đã kiệt sức...`, "gray"); return; }
            actor.passives.energy += 50;
            if(actor.passives.energy >= 100) {
                finalAtk *= (5.0 + Math.random() * 3.0);
                target.passives.bleed = finalAtk * 0.5; target.passives.bleedTurn = 2;
                actor.passives.canAttack = false;
                logMsg(`💥 EXPLOSION!!! Bầu trời chao đảo!`, "var(--red)");
            } else {
                logMsg(`${actor.name} đang niệm chú (${actor.passives.energy}%)...`, actor.color);
                finalAtk = 0; 
            }
        }
        else if(actor.dbId === 'frieren') {
            actor.passives.turnCount++; target.passives.frierenMark = true;
            if(actor.passives.turnCount % 3 === 0) { finalAtk *= (3.0 + Math.random()); logMsg(`🌌 Black Hole!`, actor.color); }
            if(actor.hp / actor.maxHp < 0.4 && !actor.passives.shield) { actor.passives.shield = actor.maxHp * 0.3; logMsg(`🛡️ Frieren tạo khiên!`, actor.color); }
        }
        else if(actor.dbId === 'shieldhero' && actor.hp / actor.maxHp < 0.5) {
            actor.hp = Math.min(actor.maxHp, actor.hp + actor.maxHp * 0.1);
            logMsg(`💚 ${actor.name} tự phục hồi HP!`, "var(--green)");
        }
        else if(actor.dbId === 'zerotwo') { let hpLoss = actor.maxHp * 0.1; actor.hp -= hpLoss; logMsg(`${actor.name} hiến tế máu để cuồng nộ!`, actor.color); if(actor.hp <= 0) actor.hp = 1; actor.passives.zt_stacks = Math.min(3, (actor.passives.zt_stacks||0) + 1); if(actor.passives.zt_stacks >= 3) { finalAtk *= 1.5; actor.spd = actor.spd * 1.3; } else { finalAtk *= (1 + 0.1*actor.passives.zt_stacks); actor.spd += 5; } if(actor.hp / actor.maxHp <= 0.3 && !actor.passives.zt_nuke) { actor.passives.zt_nuke = true; finalAtk *= 5.0; actor.spd += 200; logMsg(`🔥 DARLING BOND KÍCH HOẠT! ZERO TWO SIÊU BẠO TẨU!`, "var(--red)"); } }
        else if(actor.dbId === 'gojo_sukuna') { actor.passives.form = actor.passives.form === 0 ? 1 : 0; if(actor.passives.form === 0) { finalAtk *= 1.2; logMsg(`🤞 Bành Trướng Lãnh Địa!`, "var(--cyan)"); } else { finalAtk *= 1.8; logMsg(`🔪 Miếu Toán Trảm!`, "var(--red)"); target.passives.bleed = finalAtk * 0.5; target.passives.bleedTurn = 2; } }
        else if(actor.dbId === 'rem') { let missingPct = 1 - (actor.hp/actor.maxHp); let dmgBuff = missingPct * 10 * 0.08; finalAtk *= (1 + dmgBuff); if(actor.hp/actor.maxHp < 0.1) { finalAtk *= 2.2; logMsg(`${actor.name} nổi điên tột độ!`, actor.color); } else if(actor.hp/actor.maxHp < 0.5) { finalAtk *= 1.75; logMsg(`${actor.name} hóa quỷ!`, actor.color); } else if(actor.hp/actor.maxHp < 0.75) { finalAtk *= 1.5; } }
        else if(actor.dbId === 'cid') { if(actor.passives.shadows >= 3) { finalAtk *= 5.0; target.spd *= 0.8; actor.passives.shadows = 0; logMsg(`🌑 I AM ATOMIC!!!`, "var(--gold)"); } else { finalAtk *= 0.5; } }
        else if(actor.dbId === 'tatsumaki') { if((actor.passives.shield || 0) > 0) finalAtk *= 1.5; target.atk *= 0.7; if(Math.random() < 0.0000000000001) { finalAtk = 999999999; logMsg(`👊 SAITAMA ĐI NGANG QUA ĐẤM KÉ!!!`, "yellow"); } }
        else if(actor.dbId === 'raiden') { if((actor.passives.resolve||0) >= 10) { finalAtk *= 2.0; target.ct = -2000; actor.passives.resolve = 0; logMsg(`⚡ MỘNG TƯỞNG CHÂN THUYẾT!`, "var(--purple)"); } }
        else if(actor.dbId === 'power') { target.passives.power_mark = (target.passives.power_mark||0) + 1; target.passives.bleed = finalAtk * 0.5; target.passives.bleedTurn = 2; if(target.passives.power_mark >= 3) { finalAtk += actor.maxHp; target.passives.power_mark = 0; logMsg(`🩸 Nổ Huyết Ấn!`, "var(--red)"); } else { actor.maxHp *= 1.1; actor.hp += actor.maxHp*0.1; } }
        else if(actor.dbId === 'makima' && Math.random() < 0.5) { actor.spd += target.spd * 0.1; target.spd *= 0.9; actor.atk += target.atk * 0.1; target.atk *= 0.9; logMsg(`🔗 ${actor.name} cướp chỉ số!`, actor.color); }
    }

    if(actor.isPlayer) { let raiden = battle.pTeam.find(p => p.dbId === 'raiden'); if(raiden && raiden.uid !== actor.uid) raiden.passives.resolve = (raiden.passives.resolve||0) + 1; }

    let finalDmg = Math.floor(finalAtk);

    // NỘI TẠI NHẬN SÁT THƯƠNG
    if(!target.isPlayer) { 
        if(target.passives.frierenMark) finalDmg = Math.floor(finalDmg * 1.25);
        target.hp -= finalDmg; 
        if(finalDmg > 0) logMsg(`${actor.name} đánh ${target.name} gây ${finalDmg} DMG!`, "log-e-dmg"); 
    } else {
        let isDodged = false;
        if(target.dbId === 'cid' && Math.random() < 0.5) { isDodged = true; target.passives.shadows++; logMsg(`${target.name} né thành công!`, "var(--gold)"); }
        
        if(!isDodged) {
            if(target.dbId === 'gojo_sukuna' && target.passives.form === 0) { finalDmg *= 0.4; } 
            if(target.dbId === 'tatsumaki' || target.dbId === 'frieren') { 
                if((target.passives.shield || 0) > 0) { 
                    if(finalDmg > target.passives.shield) { finalDmg -= target.passives.shield; target.passives.shield = 0; } 
                    else { target.passives.shield -= finalDmg; finalDmg = 0; } 
                } 
            }
            if(target.dbId === 'shieldhero') {
                if(target.hp / target.maxHp < 0.5) finalDmg = Math.floor(finalDmg * 0.7);
                target.passives.shieldStacks++;
                logMsg(`🛡️ ${target.name} tích tụ Căm Phẫn (${target.passives.shieldStacks}/10)!`, "var(--green)");
            }

            target.hp -= Math.floor(finalDmg);
            if(finalDmg > 0) logMsg(`${actor.name} đấm ${target.name} mất ${Math.floor(finalDmg)} HP!`, "log-p-dmg");
            
            if(target.hp <= 0 && target.dbId === 'makima' && !target.passives.survived) { target.hp = 1; target.passives.survived = true; logMsg(`Khế ước cứu Makima 1 mạng!`, "var(--gold)"); }
            
            // SHIELD HERO PHẢN ĐÒN
            if(target.dbId === 'shieldhero' && target.passives.shieldStacks >= 10 && !target.isDead) {
                let counterDmg = target.maxHp * 2.0;
                actor.hp -= counterDmg; target.passives.shieldStacks = 0;
                logMsg(`🔥 IRON MAIDEN! ${target.name} phản đòn ${Math.floor(counterDmg)} DMG!`, "var(--red)");
                if(actor.hp <= 0) actor.hp = 0;
            }
        }
    }

    if(actor.dbId === 'zerotwo') { actor.hp = Math.min(actor.maxHp, actor.hp + (finalDmg * 0.05)); }
    if(actor.passives.bleedTurn > 0) { actor.hp -= actor.passives.bleed; actor.passives.bleedTurn--; logMsg(`${actor.name} mất ${Math.floor(actor.passives.bleed)} máu do rỉ máu!`, "log-p-dmg"); }
    if(target.hp <= 0) { target.hp = 0; target.isDead = true; logMsg(`💀 ${target.name} đã ngã xuống!`, "log-death"); if(actor.dbId === 'zerotwo') { actor.hp = Math.min(actor.maxHp, actor.hp + actor.maxHp*0.2); } }
}

function animateAttack(uid) { let el = document.getElementById(uid); if(el) { el.classList.add(uid.startsWith('e') ? 'acting-enemy' : 'acting'); setTimeout(() => el.classList.remove('acting', 'acting-enemy'), 300); } }
function checkWinLoss() { let alivePlayers = battle.pTeam.filter(p => !p.isDead).length; let aliveEnemies = battle.enemies.filter(e => !e.isDead).length; if(aliveEnemies === 0) { clearInterval(battle.tickInterval); setTimeout(nextStage, 1000); } else if(alivePlayers === 0) { clearInterval(battle.tickInterval); logMsg(`❌ THẤT BẠI! Toàn quân tiêu diệt.`, "var(--red)"); setTimeout(() => processEndBattle(false), 2000); } }
function nextStage() { battle.stage++; if(battle.stage > 6) { logMsg(`🎉 ĐÃ HẠ GỤC BOSS! RƯƠNG THƯỞNG XUẤT HIỆN!`, "var(--gold)"); setTimeout(showRewardChest, 1000); } else { initStage(); } }
function showRewardChest() { document.getElementById('combat-chest-modal').classList.add('active'); document.getElementById('combat-chest-icon').style.animation = 'chestBounce 1s infinite'; document.getElementById('combat-chest-icon').style.transform = 'scale(1)'; document.getElementById('combat-chest-rewards').style.display = 'none'; document.getElementById('combat-chest-btn').style.display = 'none'; document.getElementById('combat-chest-hint').style.display = 'block'; document.getElementById('combat-chest-icon').onclick = openChest; }
function openChest() { let icon = document.getElementById('combat-chest-icon'); icon.style.animation = 'none'; icon.style.transform = 'scale(1.2)'; icon.onclick = null; document.getElementById('combat-chest-hint').style.display = 'none'; let act = battle.act; let rewardsGrid = document.getElementById('combat-chest-rewards'); rewardsGrid.innerHTML = ` <div class="gacha-card star-4" style="width:110px; animation-delay: 0s; border-color:var(--cyan);"> <div class="g-card-img-container"><div class="g-card-emoji" style="font-size:36px;">💎</div></div> <div class="g-card-name" style="color:var(--cyan); font-size:13px;">+${act.rwLt.toLocaleString()}</div> <div class="g-card-stars">Linh Thạch</div> </div> <div class="gacha-card star-5" style="width:110px; animation-delay: 0.2s; border-color:#10B981;"> <div class="g-card-img-container"><div class="g-card-emoji" style="font-size:36px;">⚡</div></div> <div class="g-card-name" style="color:#10B981; font-size:13px;">+${act.rwExp.toLocaleString()}</div> <div class="g-card-stars">Tu Vi (Cho Linh Hồn)</div> </div> `; setTimeout(() => { rewardsGrid.style.display = 'flex'; document.getElementById('combat-chest-btn').style.display = 'block'; }, 500); }
function closeChestAndEnd() { document.getElementById('combat-chest-modal').classList.remove('active'); processEndBattle(true); }
function processEndBattle(isWin) { battle.active = false; let act = battle.act; let percentCleared = (battle.stage - 1) / 6; if(isWin) percentCleared = 1.0; let earnedLt = Math.floor(act.rwLt * percentCleared); let earnedExp = Math.floor(act.rwExp * percentCleared); userData.linhThach = (userData.linhThach||0) + earnedLt; let validTeamIds = userData.team.filter(id => id !== null); if(validTeamIds.length > 0 && earnedExp > 0) { let expPerSoul = Math.floor(earnedExp / validTeamIds.length); validTeamIds.forEach(id => { let s = userData.souls[id]; s.exp += expPerSoul; while(s.level < 15 && s.exp >= SOUL_EXP_REQ[s.level]) { s.exp -= SOUL_EXP_REQ[s.level]; s.level++; } if(s.level >= 15) s.exp = 0; }); } if(isWin && battle.actIdx === userData.combat.maxActCleared) { userData.combat.maxActCleared++; checkAchievements(); } saveData(); updateGlobalLT(); if(isWin) showToast(`Chiến thắng! Cảnh giới Linh hồn được gia tăng!`, "success"); else showToast(`Bại trận! Rớt ${earnedLt.toLocaleString()} 💎 và ${earnedExp.toLocaleString()} ⚡ cho Đội hình`, "info"); renderCombatTab(); }
function fleeBattle() { if(confirm("Rút lui? Phần thưởng sẽ tính theo tiến độ hiện tại.")) { clearInterval(battle.tickInterval); processEndBattle(false); } }
function renderBattleArena() { function createEntityHTML(ent) { let hpPct = (ent.hp / ent.maxHp) * 100; let hpClass = hpPct < 30 ? 'low' : ''; let icons = ''; if(ent.passives.shield) icons += '<div class="status-icon" style="background:#3B82F6" title="Khiên">🛡️</div>'; if(ent.passives.bleedTurn>0) icons += '<div class="status-icon" style="background:#EF4444" title="Rỉ máu">🩸</div>'; if(ent.passives.form === 1) icons += '<div class="status-icon" style="background:#EF4444" title="Sukuna">🔪</div>'; if(ent.passives.shadows > 0) icons += `<div class="status-icon" style="background:#000" title="Shadows">${ent.passives.shadows}</div>`; if(ent.passives.shieldStacks > 0) icons += `<div class="status-icon" style="background:var(--green)" title="Khiên Căm Phẫn">${ent.passives.shieldStacks}</div>`; return ` <div class="combat-entity ${ent.isDead?'dead':''}" id="${ent.uid}"> <div class="c-avatar-wrapper"> <img src="${ent.img}" class="c-avatar ${ent.isBoss?'boss-avatar':''}" style="border-color:${ent.color}" onerror="this.outerHTML='<div class=\\'c-avatar ${ent.isBoss?'boss-avatar':''}\\' style=\\'border-color:${ent.color}; display:flex; justify-content:center; align-items:center; font-size:30px;\\'>${ent.emoji}</div>'"> <div class="c-status-icons">${icons}</div> </div> <div class="c-hp-bar-bg"><div class="c-hp-bar-fill ${hpClass}" style="width:${hpPct}%"></div></div> <div class="c-name" style="color:${ent.color}">${ent.name}</div> </div> `; } document.getElementById('b-enemy-row').innerHTML = battle.enemies.map(createEntityHTML).join(''); document.getElementById('b-player-row').innerHTML = battle.pTeam.map(createEntityHTML).join(''); }
function logMsg(msg, colorClass) { let logger = document.getElementById('b-logger'); let styleTag = (colorClass && (colorClass.startsWith('var(') || colorClass.startsWith('#') || colorClass === 'yellow')) ? `style="color:${colorClass};"` : `class="${colorClass||''}"`; logger.innerHTML += `<div class="log-line" ${styleTag}>[Turn] ${msg}</div>`; logger.scrollTop = logger.scrollHeight; }