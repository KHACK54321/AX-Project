var APP_VERSION    = "1.0.0"; 
var SCHEMA_VERSION = 8;       
var SAVE_KEY       = "OppoWaifuDataCloudPro";
var GOOGLE_CLIENT_ID = "1079643410856-qkshh8ibj1qjk89k9snvogl71kq50unv.apps.googleusercontent.com";    

const loadingAvatars = ['img/image_4.png','img/image_5.png','img/image_6.png','img/image_7.png'];
const waifuImages    = ['img/image_0.png','img/image_1.png','img/image_2.png','img/image_3.png'];
const ICON_FIRE        = "img/image_fire1.png";
const ICON_BLUE_FIRE   = "img/image_fire2.png";
const ICON_PURPLE_FIRE = "img/image_fire3.png";

const realms = [
    { name:"Phàm Nhân",maxExp:100 },{ name:"Ngưng Khí Tầng 1",maxExp:200 },{ name:"Ngưng Khí Tầng 2",maxExp:400 },{ name:"Ngưng Khí Tầng 3",maxExp:600 },{ name:"Ngưng Khí Tầng 4",maxExp:800 },{ name:"Ngưng Khí Tầng 5",maxExp:1000 },
    { name:"Ngưng Khí Tầng 6",maxExp:1500 },{ name:"Ngưng Khí Tầng 7",maxExp:2000 },{ name:"Ngưng Khí Tầng 8",maxExp:2500 },{ name:"Ngưng Khí Tầng 9",maxExp:3000 },{ name:"Ngưng Khí Tầng 10",maxExp:4000 },{ name:"Ngưng Khí Tầng 11",maxExp:5000 },
    { name:"Ngưng Khí Tầng 12",maxExp:6000 },{ name:"Ngưng Khí Tầng 13",maxExp:8000 },{ name:"Ngưng Khí Tầng 14",maxExp:10000 },{ name:"Ngưng Khí Tầng 15",maxExp:15000 },{ name:"Trúc Cơ Sơ Kì",maxExp:20000 },{ name:"Trúc Cơ Trung Kì",maxExp:25000 },
    { name:"Trúc Cơ Hậu Kì",maxExp:30000 },{ name:"Trúc Cơ Viên Mãn",maxExp:35000 },{ name:"Kết Đan Sơ Kì",maxExp:40000 },{ name:"Kết Đan Trung Kì",maxExp:50000 },{ name:"Kết Đan Hậu Kì",maxExp:60000 },{ name:"Kết Đan Viên Mãn",maxExp:70000 },
    { name:"Nguyên Anh Sơ Kì",maxExp:80000 },{ name:"Nguyên Anh Trung Kì",maxExp:900000 },{ name:"Nguyên Anh Hậu Kì",maxExp:1000000 },{ name:"Nguyên Anh Viên Mãn",maxExp:1100000 },{ name:"Hóa Thần Sơ Kì",maxExp:1200000 },{ name:"Hóa Thần Trung Kì",maxExp:1300000 },
    { name:"Hóa Thần Hậu Kì",maxExp:1400000 },{ name:"Hóa Thần Viên Mãn",maxExp:1500000 },{ name:"Anh Biến Sơ Kì",maxExp:1600000 },{ name:"Anh Biến Trung Kì",maxExp:1700000 },{ name:"Anh Biến Hậu Kì",maxExp:1800000 },{ name:"Anh Biến Viên Mãn",maxExp:1900000 },
    { name:"Vấn Đỉnh Sơ Kỳ",maxExp:5000000 },{ name:"Vấn Đỉnh Trung Kỳ",maxExp:1000000 },{ name:"Vấn Đỉnh Hậu Kỳ",maxExp:2500000 },{ name:"Vấn Đỉnh Đại Viên Mãn",maxExp:30000000 },{ name:"Cảnh Giới Quá Độ Âm Hư",maxExp:40000000 },{ name:"Cảnh Giới Quá Độ Dương Thực",maxExp:50000000 }
];

const CROPS = [
    { name:"Tụ Linh Thảo",   img:"img/tulinhthao.png",  emoji:"🌿", duration:3600,   yield:50,   sellPrice:1,   desc:"1h · +50🌿" },
    { name:"Thanh Tâm Thảo", img:"img/crops/thanhtamthao.png",  emoji:"🍃", duration:14400,  yield:100,   sellPrice:1,   desc:"4h · +100🌿" },
    { name:"Luyện Khí Thảo", img:"img/crops/luyenkhithao.png",  emoji:"🌀", duration:57600,  yield:150,  sellPrice:1,  desc:"16h · +150🌿" },
    { name:"Hồi Linh Thảo",  img:"img/crops/hoilinhthao.png",  emoji:"💧", duration:86400,  yield:200,  sellPrice:1,  desc:"24h · +200🌿" },
    { name:"Ngũ Sắc Thảo",   img:"img/crops/ngusacthao.png",  emoji:"🌈", duration:604800, yield:250, sellPrice:1,  desc:"7 ngày · +250🌿" },
    { name:"Huyết Bồ Đề", img:"img/crops/huyetbode.png", emoji:"🍒", duration:3600, yield:10, sellPrice:5, desc:"Dùng luyện đan" },
    { name:"Băng Tuyết Liên", img:"img/crops/bangtuyetlien.png", emoji:"❄️", duration:7200, yield:10, sellPrice:10, desc:"Dùng luyện đan" },
    { name:"Viêm Long Quả", img:"img/crops/viemlongqua.png", emoji:"🔥", duration:7200, yield:10, sellPrice:10, desc:"Dùng luyện đan" },
    { name:"Tử Mộc Tinh", img:"img/crops/tumoc.png", emoji:"🪵", duration:14400, yield:10, sellPrice:20, desc:"Dùng luyện đan" },
    { name:"Thiên Tinh Thảo", img:"img/crops/thientinh.png", emoji:"✨", duration:14400, yield:10, sellPrice:20, desc:"Dùng luyện đan" },
    { name:"U Hồn Diệp", img:"img/crops/uhon.png", emoji:"👻", duration:28800, yield:10, sellPrice:40, desc:"Dùng luyện đan" },
    { name:"Kim Cương Căn", img:"img/crops/kimcuong.png", emoji:"💎", duration:28800, yield:10, sellPrice:40, desc:"Dùng luyện đan" },
    { name:"Xích Linh Chi", img:"img/crops/xichlinhchi.png", emoji:"🍄", duration:43200, yield:10, sellPrice:80, desc:"Dùng luyện đan" },
    { name:"Huyền Âm Quả", img:"img/crops/huyenam.png", emoji:"🌑", duration:43200, yield:10, sellPrice:80, desc:"Dùng luyện đan" },
    { name:"Vạn Năm Sâm", img:"img/crops/vannamsam.png", emoji:"🌿", duration:86400, yield:10, sellPrice:150, desc:"Dùng luyện đan" },
    { name:"Cửu Linh Liên", img:"img/crops/cuulinh.png", emoji:"🪷", duration:172800, yield:15, sellPrice:300, desc:"Dùng luyện đan" },
    { name:"Thái Dương Thảo", img:"img/crops/thai.png", emoji:"☀️", duration:172800, yield:15, sellPrice:300, desc:"Dùng luyện đan" },
    { name:"Thái Âm Hoa", img:"img/crops/thaiam.png", emoji:"🌙", duration:172800, yield:15, sellPrice:300, desc:"Dùng luyện đan" },
    { name:"Hỗn Độn Quả", img:"img/crops/hondon.png", emoji:"🌌", duration:259200, yield:20, sellPrice:500, desc:"Dùng luyện đan" },
    { name:"Tạo Hóa Chi Liên", img:"img/crops/taohoa.png", emoji:"💮", duration:604800, yield:1, sellPrice:5000, desc:"Thần Dược luyện đan" },
    { name:"Hỏa Kỳ Lân Thảo", img:"img/crops/hoakylan.png", emoji:"🦄", duration:432000, yield:5, sellPrice:1000, desc:"Dùng luyện đan VIP" },
    { name:"Băng Long Tu", img:"img/crops/banglongtu.png", emoji:"🐉", duration:432000, yield:5, sellPrice:1000, desc:"Dùng luyện đan VIP" }
];

const PILLS = [
    { name:"Tụ Linh Đan",   img:"img/dang_1.png", emoji:"🟢", cost:30,   craftDuration:7200,   exp:100 },
    { name:"Hồi Linh Đan",  img:"img/dang_2.png", emoji:"🟣", cost:100,  craftDuration:21600,  exp:400 },
    { name:"Thanh Tâm Đan", img:"img/dang_3.png", emoji:"🔵", cost:150,  craftDuration:64800,  exp:1500 },
    { name:"Luyện Khí Đan", img:"img/dang_4.png", emoji:"🔴", cost:250,  craftDuration:172800, exp:5000 },
    { name:"Sinh Cơ Đan",   img:"img/dang_5.png", emoji:"🟩", cost:300, craftDuration:604800, exp:15000 },
    { name:"Huyết Ma Đan", img:"img/huyetma.png", emoji:"🔴", cost:0, craftDuration:86400, exp:0, isPerm:true, stat:'hp', val:500, recipe:[{id:5,qty:2}, {id:12,qty:1}, {id:14,qty:1}], desc:"+500 HP (Vĩnh viễn)" },
    { name:"Băng Hỏa Âm Dương Đan", img:"img/banghoa.png", emoji:"☯️", cost:0, craftDuration:86400, exp:0, isPerm:true, stat:'atk', val:100, recipe:[{id:6,qty:2}, {id:7,qty:2}, {id:13,qty:1}], desc:"+100 DMG (Vĩnh viễn)" },
    { name:"Thiên Cương Thần Hồn Đan", img:"img/thiencuong.png", emoji:"🌪️", cost:0, craftDuration:172800, exp:0, isPerm:true, stat:'spd', val:10, recipe:[{id:8,qty:2}, {id:9,qty:2}, {id:10,qty:1}, {id:11,qty:1}], desc:"+10 Tốc độ (Vĩnh viễn)" },
    { name:"Nguyên Anh Đan", img:"img/nguyenanh.png", emoji:"🟨", cost:500, craftDuration:1209600, exp:50000, recipe:[{id:12,qty:2}, {id:13,qty:2}, {id:14,qty:1}] },
    { name:"Hóa Thần Đan", img:"img/hoathan.png", emoji:"🟧", cost:1000, craftDuration:2592000, exp:200000, recipe:[{id:15,qty:2}, {id:16,qty:2}, {id:17,qty:2}] },
    { name:"Cửu Chuyển Hoàn Hồn Đan", img:"img/cuuchuyen.png", emoji:"💊", cost:0, craftDuration:604800, exp:0, isPerm:true, stat:'hp', val:2000, recipe:[{id:18,qty:1}, {id:14,qty:5}], desc:"+2000 HP (Vĩnh viễn)" },
    { name:"Hỗn Độn Đan", img:"img/hondondan.png", emoji:"🌌", cost:0, craftDuration:604800, exp:0, isPerm:true, stat:'atk', val:500, recipe:[{id:18,qty:1}, {id:12,qty:5}, {id:13,qty:5}], desc:"+500 DMG (Vĩnh viễn)" },
    { name:"Tạo Hóa Thần Đan", img:"img/taohoadan.png", emoji:"✨", cost:0, craftDuration:1209600, exp:0, isPerm:true, stat:'spd', val:50, recipe:[{id:19,qty:1}, {id:18,qty:2}], desc:"+50 Tốc độ (Vĩnh viễn)" },
    { name:"Thánh Cực Phá Toái Đan", img:"img/thanhcuc.png", emoji:"🪐", cost:0, craftDuration:2592000, exp:0, isPerm:true, stat:'atk', val:2000, recipe:[{id:20,qty:2}, {id:21,qty:2}], desc:"+2000 DMG (Vĩnh viễn)" }
];

const FURNACES = [
    { name:"Lò Thạch Cơ",   img:"img/loluyen_1.png", price:100, timeRed:0.20, expBonus:1.0,  desc:"Giảm 20% thời gian" },
    { name:"Lò Huyền Thiết", img:"img/loluyen_2.png", price:300, timeRed:0.35, expBonus:1.25, desc:"Giảm 35% · +25% EXP" },
    { name:"Lò Long Uyên",   img:"img/loluyen_3.png", price:800, timeRed:0.50, expBonus:1.60, desc:"Giảm 50% · +60% EXP" },
    { name:"Lò Bát Quái", img:"img/loluyen_4.png", price:2500, timeRed:0.65, expBonus:2.0, desc:"Giảm 65% · +100% EXP" },
    { name:"Lò Hỗn Độn", img:"img/loluyen_5.png", price:10000, timeRed:0.80, expBonus:3.0, desc:"Giảm 80% · +200% EXP" }
];

// Nâng cấp bằng LINH THẠCH (Giá nhân lên x100)
const FARM_UPGRADES2 = [
    { id:'plotSlot',  name:'🌱 Mở rộng ô Trồng',     desc:'+1 ô trồng (tối đa 8 ô)',         maxLevel:5, baseCost:3000,  costMult:1.8 },
    { id:'queueSlot', name:'⚗️ Mở rộng Luyện Đan', desc:'+1 slot hàng chờ (tối đa 10)',   maxLevel:9, baseCost:5000,  costMult:2.0 },
    { id:'craftAll',  name:'🔄 Luyện Tất Cả',          desc:'Luyện đan song song cùng lúc',    maxLevel:1, baseCost:20000, costMult:1 },
    { id:'cropSpeed', name:'⚡ Tốc Độ Trồng',          desc:'Giảm 5% thời gian trồng/cấp',   maxLevel:5, baseCost:4000,  costMult:2.0 },
    { id:'waterSys',  name:'💧 Thủy Lợi',    desc:'Giảm 5% thời gian trồng/cấp',   maxLevel:5, baseCost:10000, costMult:2.0 },
    { id:'sellBonus', name:'💰 Bội Thu',               desc:'+15% Sản lượng cây/cấp',maxLevel:10, baseCost:6000, costMult:1.5 },
    { id:'afkCap',    name:'🧘 Thiền Định Hồn',       desc:'+2 giờ AFK tối đa/cấp',   maxLevel:5, baseCost:10000, costMult:2.5 },
    { id:'rareSeed', name:'🌟 Đột Biến', desc:'+5% tỉ lệ x2 sản lượng thu hoạch/cấp', maxLevel:10, baseCost:15000, costMult:2.0 },
    { id:'alchemyMastery', name:'💊 Đan Thần', desc:'+2% tỉ lệ x2 Đan Dược/cấp', maxLevel:10, baseCost:20000, costMult:2.5 },
    { id:'furnaceSpeed', name:'🔥 Ngọn Lửa Linh Thiêng', desc:'Giảm 5% thời gian luyện đan/cấp', maxLevel:10, baseCost:10000, costMult:2.0 }
];

const ACHIEVEMENTS = [
    { id:'ci_30', name:'Sơ Nhập', desc:'Ký danh 30 ngày', icon:'📅', buff:'checkin', bonus:0.1, check:d=>d.checkinStreak>=30 },
    { id:'ci_100', name:'Kiên Trì', desc:'Ký danh 100 ngày', icon:'🔥', buff:'checkin', bonus:0.2, check:d=>d.checkinStreak>=100 },
    { id:'ci_200', name:'Chuyên Cần', desc:'Ký danh 200 ngày', icon:'🌟', buff:'checkin', bonus:0.5, check:d=>d.checkinStreak>=200 },
    { id:'d_50', name:'Chăm Chỉ II', desc:'Làm 50 NV Ngày', icon:'📋', buff:'daily', bonus:0.2, check:d=>d.totalDailyTasksDone>=50 },
    { id:'d_250', name:'Chăm Chỉ IV', desc:'Làm 250 NV Ngày', icon:'📋', buff:'daily', bonus:0.4, check:d=>d.totalDailyTasksDone>=250 },
    { id:'w_10', name:'Trụ Cột II', desc:'Làm 10 NV Tuần', icon:'🏆', buff:'weekly', bonus:0.2, check:d=>d.totalWeeklyTasksDone>=10 },
    { id:'w_25', name:'Cột Trụ', desc:'Làm 25 NV Tuần', icon:'🏆', buff:'weekly', bonus:0.5, check:d=>d.totalWeeklyTasksDone>=25 },
    { id:'plant_100',  name:'Nông Dân Tập Sự', desc:'Thu 100 cây', icon:'🌾', buff:'farmSell', bonus:0.1, check:d=>(d.totalCropsHarvested||0)>=100 },
    { id:'plant_250',  name:'Lão Nông', desc:'Thu 250 cây', icon:'🏅', buff:'farmSell', bonus:0.2, check:d=>(d.totalCropsHarvested||0)>=250 },
    { id:'alc_100', name:'Luyện Đan Sơ Cấp', desc:'Luyện 100 đan', icon:'💊', buff:'alchemy', bonus:0.1, check:d=>(d.totalAlchemyDone||0)>=100 },
    { id:'alc_1000', name:'Đan Tôn', desc:'Luyện 1000 đan', icon:'✨', buff:'alchemy', bonus:0.5, check:d=>(d.totalAlchemyDone||0)>=1000 },
    { id:'cb_1', name:'Sát Thủ', desc:'Vượt Ải 3', icon:'⚔️', buff:'combat', bonus:0.1, check:d=>(d.combat&&d.combat.maxActCleared>=3) },
    { id:'cb_2', name:'Chiến Thần', desc:'Vượt Ải 10', icon:'👹', buff:'combat', bonus:0.3, check:d=>(d.combat&&d.combat.maxActCleared>=10) },
    { id:'med_3',  name:'Tâm Tĩnh', desc:'Streak AFK 3 ngày', icon:'🧘', buff:'meditation', bonus:0.1, check:d=>(d.meditation&&d.meditation.streak||0)>=3 },
    { id:'med_7',  name:'Tâm Định', desc:'Streak AFK 7 ngày', icon:'🌙', buff:'meditation', bonus:0.2, check:d=>(d.meditation&&d.meditation.streak||0)>=7 }
];

const PHAP_BAO_DATA = [
    { id: 'thap', type:'tuvi', name: "Tụ Linh Tháp", emoji: "🗼", img: "img/pb_thap.png", price: 15000, bonus: 0.3, desc: "+30% Tu Vi Bản Tôn" },
    { id: 'kinh', type:'tuvi', name: "Càn Khôn Kính", emoji: "🪞", img: "img/pb_kinh.png", price: 45000, bonus: 0.6, desc: "+60% Tu Vi Bản Tôn" },
    { id: 'chau', type:'tuvi', name: "Hỗn Nguyên Châu", emoji: "🔮", img: "img/pb_chau.png", price: 150000, bonus: 1.0, desc: "+100% Tu Vi Bản Tôn" },
    { id: 'cuoc', type:'farm', name: "Thần Nông Cuốc", emoji: "⛏️", img: "img/pb_cuoc.png", price: 20000, bonus: 0.3, desc: "+30% Sản lượng Cây" },
    { id: 'nuong', type:'farm', name: "Cửu Thiên Tức Nhưỡng", emoji: "🟫", img: "img/pb_nuong.png", price: 80000, bonus: 0.6, desc: "+60% Sản lượng Cây" },
    { id: 'dmg1', type:'dmg', name: "Kiếm Trảm Yêu", emoji: "🗡️", img: "img/pb_dmg1.png", price: 50000, bonus: 0.2, desc: "+20% DMG" },
    { id: 'dmg2', type:'dmg', name: "Huyết Sát Đao", emoji: "🪓", img: "img/pb_dmg2.png", price: 180000, bonus: 0.5, desc: "+50% DMG" },
    { id: 'dmg3', type:'dmg', name: "Tru Tiên Kiếm", emoji: "⚔️", img: "img/pb_dmg3.png", price: 500000, bonus: 1.0, desc: "+100% DMG" },
    { id: 'hp1', type:'hp', name: "Huyền Vũ Giáp", emoji: "🐢", img: "img/pb_hp1.png", price: 50000, bonus: 0.2, desc: "+20% HP" },
    { id: 'hp2', type:'hp', name: "Bát Hoang Thuẫn", emoji: "🛡️", img: "img/pb_hp2.png", price: 180000, bonus: 0.5, desc: "+50% HP" },
    { id: 'hp3', type:'hp', name: "Thái Cực Đồ", emoji: "☯️", img: "img/pb_hp3.png", price: 500000, bonus: 1.0, desc: "+100% HP" },
    { id: 'vip_farm', type:'farm', name: "Lục Bình Tịnh Thủy", emoji: "🏺", img: "img/pb_vip1.png", price: 1500000, bonus: 2.0, desc: "+200% Sản lượng Cây" },
    { id: 'vip_tuvi', type:'tuvi', name: "Bồ Đề Đạo Quả", emoji: "🌳", img: "img/pb_vip2.png", price: 3000000, bonus: 3.0, desc: "+300% Tu Vi Bản Tôn" },
    { id: 'vip_dmg', type:'dmg', name: "Bàn Cổ Phủ", emoji: "🪓", img: "img/pb_vip3.png", price: 5000000, bonus: 3.5, desc: "+350% DMG" },
    { id: 'vip_hp', type:'hp', name: "Hỗn Độn Chung", emoji: "🔔", img: "img/pb_vip4.png", price: 5000000, bonus: 4.0, desc: "+400% HP" },
    { id: 'vip_all', type:'dmg', name: "Đông Hoàng Cổ Chung", emoji: "⛩️", img: "img/pb_vip5.png", price: 15000000, bonus: 10.0, desc: "+1000% DMG (Siêu Phẩm)" }
];

const ANIME_SOULS = [
    { id: 'megumin', name: "Megumin", star: 6, hp: 1200, atk: 500, spd: 100, dmgType: 'magic', color: "#ff4444", img: "img/megumin.png", emoji: "💥", 
      desc: "• Cuồng nổ: Mỗi lượt tích 50% Năng lượng.<br>• EXPLOSION: Đủ 100%, gây 500-800% DMG kèm thiêu đốt 50% DMG trong 2 lượt.<br>• Phế nhân: Dùng xong chiêu cuối không thể đánh thường nữa." },
    { id: 'frieren', name: "Frieren", star: 6, hp: 1600, atk: 350, spd: 110, dmgType: 'magic', color: "#00d2ff", img: "img/frieren.png", emoji: "🌿", 
      desc: "• Thiên Niên Ma Pháp: Mỗi lượt buff 10% DMG cho toàn đội.<br>• Phân tích: Địch bị Frieren đánh chịu thêm 25% DMG từ mọi nguồn.<br>• Black Hole: Cứ 3 lượt ném lỗ đen gây 300-400% DMG.<br>• Passive Clutch: Máu < 40% tự tạo khiên 30% HP." },
    { id: 'shieldhero', name: "Shield Hero", star: 6, hp: 5000, atk: 50, spd: 80, dmgType: 'physical', color: "#10b981", img: "img/naofumi.png", emoji: "🛡️", 
      desc: "• Bao bọc: Gánh mọi sát thương thay đồng đội.<br>• Kiên cường: Máu < 50% thì giảm 30% sát thương nhận vào, tự hồi 10% HP mỗi lượt.<br>• Phản Phệ: Bị đánh tích 1 Ấn. Đủ 10 Ấn phản công DMG bằng 200% Max HP của bản thân." },
    { id: 'zerotwo', name: "Zero Two (Final Form)", star: 6, hp: 1500, atk: 250, spd: 130, dmgType: 'physical', color: "var(--red)", img: "img/zerotwo.png", emoji: "🩸", 
      desc: "• Blood Frenzy: Mỗi lượt mất 10% HP hiện tại, tự tăng 10% DMG (cộng dồn 3 lần).<br>• Final Form (3 stack): Tổng DMG x1.5 lần, Tốc độ (SPD) +30%.<br>• Darling Bond: Khi HP < 30%, sát thương x5 lần, SPD +200.<br>• Devour Life: Hồi 5% HP mỗi lần gây sát thương, hạ gục địch hồi 20% HP." },
    { id: 'gojo_sukuna', name: "Gojo & Sukuna", star: 6, hp: 1400, atk: 250, spd: 135, dmgType: 'magic', color: "var(--cyan)", img: "img/gojo_sukuna.png", emoji: "♾️", 
      desc: "• Cycle of Duality: Tự động đổi form mỗi lượt.<br>• Gojo Form (Thủ): Giảm 60% sát thương nhận vào, đòn đánh tăng 20% DMG.<br>• Sukuna Form (Công): Đòn đánh tăng 80% DMG. Gây hiệu ứng Rỉ Máu (Mất máu bằng 50% DMG trong 2 lượt)." },
    { id: 'rem', name: "Rem (Oni Form)", star: 5, hp: 1200, atk: 180, spd: 110, dmgType: 'physical', color: "var(--gold)", img: "img/rem.png", emoji: "👹", 
      desc: "• Huyết Quỷ: Càng mất máu đánh càng đau (Mất 10% HP = +8% DMG).<br>• Hóa Quỷ: Máu < 50% tăng thêm 75% DMG. Máu < 10% điên loạn tăng 120% DMG." },
    { id: 'cid', name: "Cid (Shadow)", star: 5, hp: 1000, atk: 200, spd: 150, dmgType: 'physical', color: "var(--gold)", img: "img/cid.png", emoji: "🌑", 
      desc: "• Shadow Step: Có 50% tỉ lệ né tránh đòn đánh. Mỗi lần né tích 1 'Shadow'.<br>• I AM ATOMIC: Đủ 3 Shadow, đòn đánh tiếp theo x5 Sát thương, giảm 20% Tốc độ địch." },
    { id: 'makima', name: "Makima", star: 5, hp: 1100, atk: 160, spd: 120, dmgType: 'magic', color: "var(--gold)", img: "img/makima.png", emoji: "🔗", 
      desc: "• Thao Túng: 50% tỉ lệ cướp 10% Tốc độ và 10% DMG của địch mỗi lượt.<br>• Khế Ước: Chặn 1 đòn chí mạng, giữ lại 1 HP." },
    { id: 'tatsumaki', name: "Tatsumaki", star: 5, hp: 900, atk: 210, spd: 130, dmgType: 'magic', color: "var(--gold)", img: "img/tatsumaki.png", emoji: "🌪️", 
      desc: "• Siêu Năng Lực: Đầu trận tạo Khiên bằng 30% HP. Cứ có khiên là tăng 50% DMG.<br>• Phá Giáp: Đòn đánh giảm 30% DMG của kẻ địch.<br>• Gọi Hội: Tỉ lệ cực thấp triệu hồi Saitama đấm phát chết luôn." },
    { id: 'raiden', name: "Raiden Shogun", star: 5, hp: 1300, atk: 190, spd: 115, dmgType: 'magic', color: "var(--gold)", img: "img/raiden.png", emoji: "⚡", 
      desc: "• Resolve: Đồng đội tấn công sẽ tích 1 điểm Ý Chí.<br>• Mộng Tưởng Chân Thuyết: Đủ 10 điểm, đòn đánh x2 Sát thương và làm choáng (mất lượt) kẻ địch." },
    { id: 'power', name: "Power", star: 5, hp: 1150, atk: 170, spd: 125, dmgType: 'physical', color: "var(--gold)", img: "img/power.png", emoji: "🩸", 
      desc: "• Huyết Ấn: Đánh thường tích ấn và gây Rỉ Máu (50% DMG/2 lượt).<br>• Nổ Máu: Đủ 3 ấn kích nổ sát thương bằng 100% HP tối đa của bản thân." },
    { id: 'rukia', name: "Rukia (Bankai)", star: 4, hp: 800, atk: 120, spd: 100, dmgType: 'magic', color: "var(--purple)", img: "img/rukia.png", emoji: "❄️", desc: "Linh hồn Sử Thi." },
    { id: 'rimuru', name: "Rimuru", star: 4, hp: 950, atk: 110, spd: 95, dmgType: 'magic', color: "var(--purple)", img: "img/rimuru.png", emoji: "💧", desc: "Linh hồn Sử Thi." },
    { id: 'asta', name: "Asta", star: 4, hp: 850, atk: 130, spd: 110, dmgType: 'physical', color: "var(--purple)", img: "img/asta.png", emoji: "⚔️", desc: "Linh hồn Sử Thi." },
    { id: 'ichigo', name: "Ichigo", star: 4, hp: 900, atk: 140, spd: 105, dmgType: 'physical', color: "var(--purple)", img: "img/ichigo.png", emoji: "🗡️", desc: "Linh hồn Sử Thi." },
    { id: 'gilgamesh', name: "Gilgamesh", star: 4, hp: 800, atk: 150, spd: 90, dmgType: 'magic', color: "var(--purple)", img: "img/gilgamesh.png", emoji: "👑", desc: "Linh hồn Sử Thi." },
    { id: 'arya', name: "Arya", star: 3, hp: 500, atk: 70, spd: 80, dmgType: 'physical', color: "#3B82F6", img: "img/arya.png", emoji: "👧", desc: "Phôi linh hồn." },
    { id: 'go', name: "Go", star: 3, hp: 550, atk: 65, spd: 75, dmgType: 'physical', color: "#3B82F6", img: "img/go.png", emoji: "🧑", desc: "Phôi linh hồn." },
    { id: 'jo', name: "Jo", star: 3, hp: 550, atk: 65, spd: 75, dmgType: 'physical', color: "#3B82F6", img: "img/jo.png", emoji: "🧑", desc: "Phôi linh hồn." },
    { id: 'sus', name: "Sus", star: 3, hp: 450, atk: 80, spd: 85, dmgType: 'physical', color: "#3B82F6", img: "img/sus.png", emoji: "🔪", desc: "Phôi linh hồn." }
];

const SOUL_EXP_REQ = [0, 500, 1500, 3000, 5000, 8000, 12000, 18000, 25000, 35000, 48000, 65000, 85000, 110000, 150000];
const CHAPTER_1_MOB_IMG = "img/chap1_mob.png";
const CHAPTER_1_BOSS_IMG = "img/chap1_boss.png";

const STORY_CHAPTER_1 = [
    { act: 1, name: "Cổng Không Gian", color: "#64748b", hpMul: 1.0, atkMul: 1.0, spd: 70, rwLt: 2000, rwExp: 5000 },
    { act: 2, name: "Rừng Slime", color: "#22c55e", hpMul: 1.5, atkMul: 1.2, spd: 80, rwLt: 4000, rwExp: 10000 },
    { act: 3, name: "Thung Lũng Gió", color: "#06b6d4", hpMul: 2.2, atkMul: 1.5, spd: 90, rwLt: 7000, rwExp: 15000 },
    { act: 4, name: "Hang Động Lửa", color: "#ef4444", hpMul: 3.5, atkMul: 2.0, spd: 100, rwLt: 10000, rwExp: 25000 },
    { act: 5, name: "Đầm Lầy Độc", color: "#a855f7", hpMul: 5.0, atkMul: 2.5, spd: 110, rwLt: 15000, rwExp: 40000 },
    { act: 6, name: "Sa Mạc Xương", color: "#f59e0b", hpMul: 7.0, atkMul: 3.5, spd: 120, rwLt: 20000, rwExp: 60000 },
    { act: 7, name: "Tàn Tích Cổ", color: "#6366f1", hpMul: 10.0, atkMul: 4.5, spd: 130, rwLt: 30000, rwExp: 80000 },
    { act: 8, name: "Cung Điện Băng", color: "#38bdf8", hpMul: 15.0, atkMul: 6.0, spd: 140, rwLt: 45000, rwExp: 120000 },
    { act: 9, name: "Vực Thẳm Tối", color: "#4c1d95", hpMul: 22.0, atkMul: 8.0, spd: 150, rwLt: 60000, rwExp: 180000 },
    { act: 10, name: "Đỉnh Hỗn Mang 1", color: "#e11d48", hpMul: 35.0, atkMul: 12.0, spd: 165, rwLt: 100000, rwExp: 300000 }
];
var userData = {
    points:0, exp:0, realmIndex:0,
    lastLoginMidnight:0, lastCheckinMidnight:0, lastWeeklyReset:0,
    checkinStreak:0, totalDailyTasksDone:0, totalWeeklyTasksDone:0,
    currentDailyTasks:[],
    weeklyTasks:{dailyDone:0,checkins:0,rw1:false,rw2:false,fullCompleted:false},
    afkPendingLt: 0, afkPendingExp: 0, afkStartTime: Date.now(), afkLastCheck: Date.now(), afkChests: 0,
    journal: {}, expense: {},
    gacha: { pity5: 0, pity6: 0, totalRolls: 0 },
    souls: {}, team: [null, null, null], combat: { maxActCleared: 0 },
    tinhHoa: 0, pbEquipped: [null, null, null, null, null, null]
};