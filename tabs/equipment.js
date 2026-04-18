// ════════════════════════════════════════════
// EQUIPMENT & RECYCLE SYSTEM & SHOP (FIXED GHOST ITEMS)
// ════════════════════════════════════════════
let currentEquipSlot = -1;

function renderEquipmentTabHTML() {
    document.getElementById('tab-equipment').innerHTML = `
        <div class="card">
            <div class="card-header"><h2>🏪 Tiệm Pháp Bảo (Dùng Linh Thạch)</h2></div>
            <div class="pb-shop-grid" id="normal-pb-shop" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(130px, 1fr)); gap:10px; margin-top:10px;"></div>
        </div>

        <div class="card">
            <div class="card-header"><h2>🛡️ Trang Bị Đạo Tôn</h2></div>
            <p style="font-size:11px;color:var(--text-muted);">Gắn Pháp bảo. Chỉ số cộng thẳng vào Thuộc tính Linh hồn xuất chiến.</p>
            <div class="equip-hero-wrapper">
                <img src="img/image_0.png" class="equip-hero-img" alt="Avatar">
                <div class="equip-slot eq-pos-1" id="eq-slot-0" onclick="openPbSelector(0)"></div>
                <div class="equip-slot eq-pos-2" id="eq-slot-1" onclick="openPbSelector(1)"></div>
                <div class="equip-slot eq-pos-3" id="eq-slot-2" onclick="openPbSelector(2)"></div>
                <div class="equip-slot eq-pos-4" id="eq-slot-3" onclick="openPbSelector(3)"></div>
                <div class="equip-slot eq-pos-5" id="eq-slot-4" onclick="openPbSelector(4)"></div>
                <div class="equip-slot eq-pos-6" id="eq-slot-5" onclick="openPbSelector(5)"></div>
            </div>
        </div>

        <div class="card">
            <div class="card-header"><h2>🔥 Lò Phân Rã & Shop Ẩn</h2></div>
            <div class="tinhhoa-display">🌟 <span id="tinhhoa-val">0</span> Tinh Hoa</div>
            
            <h3 style="margin-top:15px; color:var(--purple); display:flex; justify-content:space-between; align-items:center;">
                <span>Shop Ẩn (Dùng Tinh Hoa)</span>
                <button class="gacha-info-btn" style="position:static; border:none; background:rgba(255,255,255,0.1); padding:5px 10px; font-size:10px; border-radius:4px;" onclick="openEqChestRateModal()">ℹ️ Tỉ Lệ</button>
            </h3>
            <div class="recycle-grid" style="margin-bottom:20px;">
                <div class="recycle-card" style="border-color:var(--gold);">
                    <div style="font-size:30px;">📦</div>
                    <div style="font-size:11px;font-weight:bold;color:#fff;">Rương Pháp Bảo</div>
                    <button class="action-btn main-btn gold-btn" onclick="buyHiddenShop('pb')" style="margin-top:10px;font-size:11px;">Mở (1000🌟)</button>
                </div>
                <div class="recycle-card" style="border-color:var(--red);">
                    <div style="font-size:30px;">🩸</div>
                    <div style="font-size:11px;font-weight:bold;color:#fff;">Phôi 6⭐ Ngẫu nhiên</div>
                    <button class="action-btn main-btn gold-btn" onclick="buyHiddenShop('soul6')" style="margin-top:10px;font-size:11px;">Mở (5000🌟)</button>
                </div>
            </div>

            <h3 style="color:var(--red);">Phân Rã Vật Phẩm Thừa</h3>
            <p style="font-size:10px;color:var(--text-muted);margin-bottom:10px;">Linh hồn 3-4⭐, Pháp bảo và Thảo dược.</p>
            <div class="recycle-grid" id="recycle-list"></div>
        </div>

        <div class="pb-selector-modal" id="pb-selector-modal">
            <div style="flex:1; width:100%;" onclick="closePbSelector()"></div>
            <div class="pb-s-container">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;">
                    <h3 style="color:#fff;margin:0;">Kho Pháp Bảo Của Bạn</h3>
                    <button class="action-btn danger-btn" id="btn-unequip-pb" style="margin:0;display:none;" onclick="unequipPb()">Tháo Trang Bị</button>
                </div>
                <div class="pb-s-grid" id="pb-selector-list"></div>
            </div>
        </div>

    <div class="gacha-modal" id="eq-chest-rate-modal" style="z-index: 2000;">
        <div class="soul-detail-container" style="width: 80%; background: #111; border: 1px solid var(--purple); padding: 20px; border-radius: 12px; text-align: center;">
            <h3 style="color: var(--purple); margin-bottom: 15px; font-size: 16px;">📊 TỈ LỆ SHOP ẨN</h3>
            <div style="text-align: left; font-size: 13px; color: #fff; line-height: 2;">
                <div style="color:var(--gold); font-weight:bold; border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom:5px;">📦 Rương Pháp Bảo (1000🌟)</div>
                <div style="display:flex; justify-content: space-between; margin-bottom: 10px;">
                    <span>🛡️/🗡️ Pháp Bảo (Công/Máu) Bất Kỳ</span><span style="color: var(--cyan); font-weight:bold;">100%</span>
                </div>
                <div style="color:var(--red); font-weight:bold; border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom:5px;">🩸 Phôi 6⭐ Ngẫu nhiên (5000🌟)</div>
                <div style="display:flex; justify-content: space-between;">
                    <span>🩸 Linh Hồn Cực Phẩm (6⭐) Bất Kỳ</span><span style="color: var(--cyan); font-weight:bold;">100%</span>
                </div>
            </div>
            <button class="action-btn main-btn danger-btn" style="margin-top: 20px; width: 100%;" onclick="closeEqChestRateModal()">Đã Hiểu</button>
        </div>
    </div>
    `;
}

function renderEquipmentTab() {
    try {
        let shopHtml = '';
        PHAP_BAO_DATA.forEach(pb => {
            let owned = (userData.pbInv || []).filter(id => id === pb.id).length;
            shopHtml += `
                <div style="background:rgba(0,0,0,0.5);border:1px solid var(--cyan);border-radius:8px;padding:10px;text-align:center;">
                    <img src="${pb.img}" style="width:40px;height:40px;object-fit:contain;" onerror="this.outerHTML='<div style=\\'font-size:30px;\\'>${pb.emoji}</div>'">
                    <div style="font-size:11px;font-weight:bold;color:var(--cyan);margin:5px 0;">${pb.name}</div>
                    <div style="font-size:9px;color:var(--text-muted);margin-bottom:8px;">${pb.desc}</div>
                    <div style="font-size:10px;color:var(--green);margin-bottom:5px;">Sở hữu: ${owned}</div>
                    <button class="action-btn" style="width:100%;font-size:11px;padding:5px;" onclick="buyNormalPb('${pb.id}', ${pb.price})">Mua (${pb.price}💎)</button>
                </div>
            `;
        });
        document.getElementById('normal-pb-shop').innerHTML = shopHtml;

        let eqArr = userData.pbEquipped || [null, null, null, null, null, null];
        for(let i=0; i<6; i++) {
            let el = document.getElementById('eq-slot-'+i);
            if(!el) continue;
            
            if(eqArr[i]) {
                let pb = PHAP_BAO_DATA.find(p => p.id === eqArr[i]);
                if(!pb) {
                    // Nếu Pháp bảo bị xóa khỏi data, tự động tháo ra (Fix lỗi trắng màn hình)
                    userData.pbEquipped[i] = null;
                    el.className = `equip-slot eq-pos-${i+1}`;
                    el.innerHTML = `<span style="color:rgba(255,255,255,0.2); font-size:24px;">+</span>`;
                    el.style.borderColor = 'var(--cyan)';
                } else {
                    el.className = `equip-slot eq-pos-${i+1} filled`;
                    el.innerHTML = `<img src="${pb.img}" class="eq-pb-img" onerror="this.outerHTML='<span style=\\'font-size:30px;\\'>${pb.emoji}</span>'">`;
                    el.style.borderColor = (pb.type==='dmg'||pb.type==='hp') ? 'var(--red)' : 'var(--cyan)';
                }
            } else {
                el.className = `equip-slot eq-pos-${i+1}`;
                el.innerHTML = `<span style="color:rgba(255,255,255,0.2); font-size:24px;">+</span>`;
                el.style.borderColor = 'var(--cyan)';
            }
        }
        
        document.getElementById('tinhhoa-val').innerText = (userData.tinhHoa || 0).toLocaleString();
        renderRecycleList();
    } catch(e) { console.error("Lỗi vẽ Tab Equipment:", e); }
}

function buyNormalPb(id, price) {
    if((userData.linhThach||0) >= price) {
        userData.linhThach -= price;
        if(!userData.pbInv) userData.pbInv = [];
        userData.pbInv.push(id);
        saveData(); renderEquipmentTab(); updateUI();
        showToast("Đã mua thành công!", "success");
    } else { showToast("Không đủ Linh Thạch!", "error"); }
}

function openPbSelector(slotIdx) {
    if(!userData.pbInv) userData.pbInv = [];
    currentEquipSlot = slotIdx;
    let listEl = document.getElementById('pb-selector-list');
    let unequipBtn = document.getElementById('btn-unequip-pb');
    unequipBtn.style.display = userData.pbEquipped[slotIdx] ? 'block' : 'none';
    
    let html = ''; let availableCount = 0;
    
    // Tự động dọn kho nếu có item lỗi
    userData.pbInv = userData.pbInv.filter(id => PHAP_BAO_DATA.find(p => p.id === id));

    userData.pbInv.forEach(id => {
        let owned = userData.pbInv.filter(x => x === id).length;
        let equipped = userData.pbEquipped.filter(x => x === id).length;
        if(owned > equipped && html.indexOf(`equipPb('${id}')`) === -1) {
            let pb = PHAP_BAO_DATA.find(p => p.id === id);
            html += `
                <div class="pb-s-card" onclick="equipPb('${id}')">
                    <img src="${pb.img}" style="width:40px;height:40px;object-fit:contain;" onerror="this.outerHTML='<div style=\\'font-size:36px;\\'>${pb.emoji}</div>'">
                    <div style="font-size:11px;font-weight:bold;color:var(--cyan);margin:5px 0;">${pb.name}</div>
                    <div style="font-size:9px;color:var(--text-muted);">${pb.desc}</div>
                    <div style="font-size:10px;margin-top:5px;background:rgba(255,255,255,0.1);border-radius:10px;">Khả dụng: ${owned - equipped}</div>
                </div>`;
            availableCount++;
        }
    });

    listEl.innerHTML = availableCount > 0 ? html : '<div style="color:var(--text-muted);width:100%;text-align:center;padding:20px;">Không có Pháp bảo trống trong kho! Mua thêm đi!</div>';
    document.getElementById('pb-selector-modal').classList.add('active');
}

function closePbSelector() { document.getElementById('pb-selector-modal').classList.remove('active'); }

function equipPb(pbId) {
    if(currentEquipSlot >= 0 && currentEquipSlot < 6) {
        userData.pbEquipped[currentEquipSlot] = pbId;
        saveData(); renderEquipmentTab(); updateUI(); closePbSelector();
        showToast("Đã trang bị!", "success");
    }
}

function unequipPb() {
    if(currentEquipSlot >= 0 && currentEquipSlot < 6) {
        userData.pbEquipped[currentEquipSlot] = null;
        saveData(); renderEquipmentTab(); updateUI(); closePbSelector();
        showToast("Đã tháo trang bị!", "info");
    }
}

function openEqChestRateModal() {
    let modal = document.getElementById('eq-chest-rate-modal');
    let container = modal.querySelector('.soul-detail-container');
    
    let tiers = [
        { name: "RƯƠNG PHÁP BẢO (100%)", color: "var(--gold)", items: PHAP_BAO_DATA.filter(p => p.type === 'dmg' || p.type === 'hp') },
        { name: "PHÔI 6⭐ (100%)", color: "var(--red)", items: ANIME_SOULS.filter(s => s.star === 6) }
    ];

    let html = `
        <h2 style="color:#fff;text-shadow:0 0 10px var(--purple);font-size:20px;text-transform:uppercase;margin-bottom:15px;text-align:center;">📊 Chi Tiết Vật Phẩm Shop Ẩn</h2>
        <div style="flex:1; overflow-y:auto; padding-right:5px;">
    `;

    tiers.forEach(t => {
        let itemsHtml = t.items.map(item => `
            <div style="background:#111; border:1px solid ${t.color}; border-radius:8px; padding:8px 4px; text-align:center;">
                <div style="font-size:24px; margin-bottom:5px;">${item.emoji || "❓"}</div>
                <div style="font-size:9px; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; color:${item.color || '#fff'};">${item.name}</div>
            </div>
        `).join('');

        html += `
            <div style="margin-bottom:20px;">
                <div style="font-size:13px; font-weight:700; padding-bottom:5px; margin-bottom:10px; color:${t.color}; border-bottom:2px solid ${t.color};">
                    <span>${t.name}</span>
                </div>
                <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(75px, 1fr)); gap:10px;">${itemsHtml}</div>
            </div>
        `;
    });

    html += `</div><button class="action-btn main-btn danger-btn" style="margin-top:15px;" onclick="closeEqChestRateModal()">Đóng</button>`;
    
    container.innerHTML = html;
    modal.classList.add('active');
}
function closeEqChestRateModal() { document.getElementById('eq-chest-rate-modal').classList.remove('active'); }

function renderRecycleList() {
    let listEl = document.getElementById('recycle-list'); let html = '';

    if(userData.souls) {
        Object.keys(userData.souls).forEach(soulId => {
            let db = ANIME_SOULS.find(s => s.id === soulId);
            if(!db) { delete userData.souls[soulId]; return; } // Dọn rác
            
            let data = userData.souls[soulId];
            if((db.star === 3 || db.star === 4) && data.count > 0) {
                let equipped = userData.team.filter(t => t === soulId).length;
                let free = data.count - equipped;
                if(free > 0) {
                    let val = db.star === 3 ? 50 : 200;
                    html += `
                    <div class="recycle-card">
                        <img src="${db.img}" style="width:30px;height:30px;border-radius:50%;" onerror="this.outerHTML='<div style=\\'font-size:24px;\\'>${db.emoji}</div>'">
                        <div style="font-size:10px;color:#fff;margin-bottom:5px;white-space:nowrap;overflow:hidden;">${db.name} (x${free})</div>
                        <div style="display:flex;gap:5px;">
                            <button class="action-btn danger-btn" onclick="recycleItem('soul', '${soulId}', ${val}, 1)" style="flex:1;font-size:10px;padding:4px;margin:0;">Rã 1</button>
                            <button class="action-btn danger-btn" onclick="recycleItem('soul', '${soulId}', ${val}, ${free})" style="flex:1;font-size:10px;padding:4px;margin:0;background:#991B1B;">Rã Hết</button>
                        </div>
                    </div>`;
                }
            }
        });
    }

    if(userData.farm && userData.farm.inventory) {
        for(let i=0; i<CROPS.length; i++) {
            let count = userData.farm.inventory[i] || 0;
            if(count > 0) {
                html += `
                <div class="recycle-card">
                    <img src="${CROPS[i].img}" style="width:30px;height:30px;" onerror="this.outerHTML='<div style=\\'font-size:24px;\\'>${CROPS[i].emoji}</div>'">
                    <div style="font-size:10px;color:#fff;margin-bottom:5px;white-space:nowrap;overflow:hidden;">${CROPS[i].name} (x${count})</div>
                    <div style="display:flex;gap:5px;">
                        <button class="action-btn danger-btn" onclick="recycleItem('crop', ${i}, 1, 1)" style="flex:1;font-size:10px;padding:4px;margin:0;">Rã 1</button>
                        <button class="action-btn danger-btn" onclick="recycleItem('crop', ${i}, 1, ${count})" style="flex:1;font-size:10px;padding:4px;margin:0;background:#991B1B;">Rã Hết</button>
                    </div>
                </div>`;
            }
        }
    }

    if(userData.pbInv) {
        let uniquePBs = [...new Set(userData.pbInv)];
        uniquePBs.forEach(id => {
            let db = PHAP_BAO_DATA.find(p => p.id === id);
            if(!db) return; // Bỏ qua đồ rác
            
            let owned = userData.pbInv.filter(x => x === id).length;
            let equipped = userData.pbEquipped.filter(x => x === id).length;
            let free = owned - equipped;
            if(free > 0) {
                let val = 100;
                html += `
                <div class="recycle-card">
                    <img src="${db.img}" style="width:30px;height:30px;" onerror="this.outerHTML='<div style=\\'font-size:24px;\\'>${db.emoji}</div>'">
                    <div style="font-size:10px;color:#fff;margin-bottom:5px;white-space:nowrap;overflow:hidden;">${db.name} (x${free})</div>
                    <div style="display:flex;gap:5px;">
                        <button class="action-btn danger-btn" onclick="recycleItem('pb', '${id}', ${val}, 1)" style="flex:1;font-size:10px;padding:4px;margin:0;">Rã 1</button>
                        <button class="action-btn danger-btn" onclick="recycleItem('pb', '${id}', ${val}, ${free})" style="flex:1;font-size:10px;padding:4px;margin:0;background:#991B1B;">Rã Hết</button>
                    </div>
                </div>`;
            }
        });
    }

    listEl.innerHTML = html || '<div style="color:var(--text-muted);font-size:12px;grid-column:1/-1;">Không có đồ rảnh rỗi để phân rã.</div>';
}

function recycleItem(type, id, valPerUnit, amount) {
    if(type === 'soul') { userData.souls[id].count -= amount; if(userData.souls[id].count <= 0) delete userData.souls[id]; } 
    else if (type === 'crop') { userData.farm.inventory[id] -= amount; } 
    else if (type === 'pb') { for(let i=0; i<amount; i++) { let idx = userData.pbInv.indexOf(id); if(idx !== -1) userData.pbInv.splice(idx, 1); } }
    
    let totalTinhHoa = valPerUnit * amount;
    userData.tinhHoa = (userData.tinhHoa || 0) + totalTinhHoa;
    saveData(); renderEquipmentTab(); showToast(`Rã thành công! +${totalTinhHoa} Tinh Hoa`, "success");
}

// Thay thế đoạn này trong tabs/equipment.js
function buyHiddenShop(type) {
    if(type === 'pb') {
        if(userData.tinhHoa < 1000) { showToast("Không đủ Tinh Hoa", "error"); return; }
        userData.tinhHoa -= 1000;
        let pbs = PHAP_BAO_DATA.filter(p => p.type==='dmg' || p.type==='hp');
        let drop = pbs[Math.floor(Math.random()*pbs.length)];
        if(!userData.pbInv) userData.pbInv = [];
        userData.pbInv.push(drop.id);
        showToast("📦 Mở ra: " + drop.name, "success");
    } else if (type === 'soul6') {
        if(userData.tinhHoa < 5000) { showToast("Không đủ Tinh Hoa", "error"); return; }
        userData.tinhHoa -= 5000;
        
        // SỬA Ở ĐÂY: Lấy TẤT CẢ tướng 6 sao chia đều tỉ lệ (bao gồm cả Thần Nhân)
        let pool = ANIME_SOULS.filter(s => s.star === 6);
        let drop = pool[Math.floor(Math.random()*pool.length)];
        
        if(drop.id === 'megumin' || drop.id === 'frieren') {
            showToast("💥 THẦN NHÂN GIÁNG THẾ: " + drop.name, "success");
        } else {
            showToast("🩸 Mở ra Cực Phẩm: " + drop.name, "success");
        }
        
        if(!userData.souls[drop.id]) userData.souls[drop.id] = { level: 1, exp: 0, count: 1 };
        else userData.souls[drop.id].count++;
    }
    saveData(); renderEquipmentTab();
}