// ════════════════════════════════════════════
// CONSTANTS
// ════════════════════════════════════════════
var APP_VERSION    = "0.5.5";
var SCHEMA_VERSION = 4; // Update for Journal & Expense Tracker
var SAVE_KEY       = "OppoWaifuDataCloudPro";
var GOOGLE_CLIENT_ID = "1079643410856-qkshh8ibj1qjk89k9snvogl71kq50unv.apps.googleusercontent.com"; // User to provide their own Client ID

const loadingAvatars = ['img/image_4.png','img/image_5.png','img/image_6.png','img/image_7.png'];
const waifuImages    = ['img/image_0.png','img/image_1.png','img/image_2.png','img/image_3.png'];
const ICON_FIRE        = "img/image_fire1.png";
const ICON_BLUE_FIRE   = "img/image_fire2.png";
const ICON_PURPLE_FIRE = "img/image_fire3.png";

const realms = [
    { name:"Phàm Nhân",maxExp:100 },{ name:"Ngưng Khí Tầng 1",maxExp:200 },{ name:"Ngưng Khí Tầng 2",maxExp:400 },
    { name:"Ngưng Khí Tầng 3",maxExp:600 },{ name:"Ngưng Khí Tầng 4",maxExp:800 },{ name:"Ngưng Khí Tầng 5",maxExp:1000 },
    { name:"Ngưng Khí Tầng 6",maxExp:1500 },{ name:"Ngưng Khí Tầng 7",maxExp:2000 },{ name:"Ngưng Khí Tầng 8",maxExp:2500 },
    { name:"Ngưng Khí Tầng 9",maxExp:3000 },{ name:"Ngưng Khí Tầng 10",maxExp:4000 },{ name:"Ngưng Khí Tầng 11",maxExp:5000 },
    { name:"Ngưng Khí Tầng 12",maxExp:6000 },{ name:"Ngưng Khí Tầng 13",maxExp:8000 },{ name:"Ngưng Khí Tầng 14",maxExp:10000 },
    { name:"Ngưng Khí Tầng 15",maxExp:15000 },{ name:"Trúc Cơ Sơ Kì",maxExp:20000 },{ name:"Trúc Cơ Trung Kì",maxExp:25000 },
    { name:"Trúc Cơ Hậu Kì",maxExp:30000 },{ name:"Trúc Cơ Viên Mãn",maxExp:35000 },{ name:"Kết Đan Sơ Kì",maxExp:40000 },
    { name:"Kết Đan Trung Kì",maxExp:50000 },{ name:"Kết Đan Hậu Kì",maxExp:60000 },{ name:"Kết Đan Viên Mãn",maxExp:70000 },
    { name:"Nguyên Anh Sơ Kì",maxExp:80000 },{ name:"Nguyên Anh Trung Kì",maxExp:90000 },{ name:"Nguyên Anh Hậu Kì",maxExp:100000 },
    { name:"Nguyên Anh Viên Mãn",maxExp:110000 },{ name:"Hóa Thần Sơ Kì",maxExp:120000 },{ name:"Hóa Thần Trung Kì",maxExp:130000 },
    { name:"Hóa Thần Hậu Kì",maxExp:140000 },{ name:"Hóa Thần Viên Mãn",maxExp:150000 },{ name:"Anh Biến Sơ Kì",maxExp:160000 },
    { name:"Anh Biến Trung Kì",maxExp:170000 },{ name:"Anh Biến Hậu Kì",maxExp:180000 },{ name:"Anh Biến Viên Mãn",maxExp:190000 },
    { name:"Vấn Đỉnh Sơ Kỳ",maxExp:200000 },{ name:"Vấn Đỉnh Trung Kỳ",maxExp:220000 },{ name:"Vấn Đỉnh Hậu Kỳ",maxExp:250000 },
    { name:"Vấn Đỉnh Đại Viên Mãn",maxExp:300000 },{ name:"Cảnh Giới Quá Độ Âm Hư",maxExp:400000 },{ name:"Cảnh Giới Quá Độ Dương Thực",maxExp:500000 }
];

const CROPS = [
    { name:"Tụ Linh Thảo",   img:"img/tulinhthao.png",  emoji:"🌿", duration:3600,   yield:50,   sellPrice:1,   desc:"1h · +50🌿 · 1💎" },
    { name:"Thanh Tâm Thảo", img:"img/thanhtamthao.png",  emoji:"🍃", duration:14400,  yield:100,   sellPrice:1,   desc:"4h · +100🌿 · 1💎" },
    { name:"Luyện Khí Thảo", img:"img/luyenkhithao.png",  emoji:"🌀", duration:57600,  yield:150,  sellPrice:1,  desc:"16h · +150🌿 · 1💎" },
    { name:"Hồi Linh Thảo",  img:"img/hoilinhthao.png",  emoji:"💧", duration:86400,  yield:200,  sellPrice:1,  desc:"24h · +200🌿 · 1💎" },
    { name:"Ngũ Sắc Thảo",   img:"img/ngusacthao.png",  emoji:"🌈", duration:604800, yield:250, sellPrice:1,  desc:"7 ngày · +250🌿 · 1💎" },
];

const PILLS = [
    { name:"Tụ Linh Đan",   img:"img/dang_1.png", emoji:"🟢", cost:30,   craftDuration:7200,   exp:100 },
    { name:"Hồi Linh Đan",  img:"img/dang_2.png", emoji:"🟣", cost:100,  craftDuration:21600,  exp:400 },
    { name:"Thanh Tâm Đan", img:"img/dang_3.png", emoji:"🔵", cost:150,  craftDuration:64800,  exp:1500 },
    { name:"Luyện Khí Đan", img:"img/dang_4.png", emoji:"🔴", cost:250,  craftDuration:172800, exp:5000 },
    { name:"Sinh Cơ Đan",   img:"img/dang_5.png", emoji:"🟩", cost:300, craftDuration:604800, exp:15000 }
];

const FURNACES = [
    { name:"Lò Thạch Cơ",   img:"img/loluyen_1.png", price:100, timeRed:0.20, expBonus:1.0,  desc:"Giảm 20% thời gian luyện" },
    { name:"Lò Huyền Thiết", img:"img/loluyen_2.png", price:300, timeRed:0.35, expBonus:1.25, desc:"Giảm 35% · +25% EXP đan" },
    { name:"Lò Long Uyên",   img:"img/loluyen_3.png", price:800, timeRed:0.50, expBonus:1.60, desc:"Giảm 50% · +60% EXP đan" }
];

// Nâng cấp: Đã thêm Thiền Định Hồn
const FARM_UPGRADES2 = [
    { id:'plotSlot',  name:'🌱 Mở rộng ô Trồng',     desc:'+1 ô trồng cây (tối đa 8 ô)',         maxLevel:5, baseCost:30,  costMult:1.8 },
    { id:'queueSlot', name:'⚗️ Mở rộng ô Luyện Đan', desc:'+1 slot hàng chờ (tối đa 10 slot)',   maxLevel:5, baseCost:50,  costMult:2.0 },
    { id:'craftAll',  name:'🔄 Luyện Tất Cả',          desc:'Nâng cấp luyện đan song song',    maxLevel:1, baseCost:200, costMult:1 },
    { id:'cropSpeed', name:'⚡ Tốc Độ Trồng',          desc:'Giảm 5% thời gian trồng/cấp (≤5)',   maxLevel:5, baseCost:40,  costMult:2.0 },
    { id:'waterSys',  name:'💧 Thủy Lợi Nông Trại',    desc:'Giảm 5% thời gian trồng/cấp (≤5)',   maxLevel:5, baseCost:100, costMult:2.0 },
    { id:'sellBonus', name:'💰 Bội Thu',               desc:'+15% Linh Thạch khi bán cây/cấp (≤5)',maxLevel:5, baseCost:60, costMult:1.5 },
    { id:'afkCap',    name:'🧘 Thiền Định Hồn',       desc:'+2 giờ giới hạn treo máy AFK/cấp',   maxLevel:5, baseCost:100, costMult:2.5 }
];

const ACHIEVEMENTS = [
    { id:'ci_30', name:'Sơ Nhập', desc:'Ký danh 30 ngày', icon:'📅', buff:'checkin', bonus:0.1, check:d=>d.checkinStreak>=30 },
    { id:'ci_100', name:'Kiên Trì', desc:'Ký danh 100 ngày', icon:'🔥', buff:'checkin', bonus:0.2, check:d=>d.checkinStreak>=100 },
    { id:'ci_356', name:'Khổ Tu', desc:'Ký danh 356 ngày', icon:'🌟', buff:'checkin', bonus:0.3, check:d=>d.checkinStreak>=356 },
    { id:'d_10', name:'Chăm Chỉ I', desc:'Làm 10 NV Ngày', icon:'📋', buff:'daily', bonus:0.1, check:d=>d.totalDailyTasksDone>=10 },
    { id:'d_50', name:'Chăm Chỉ II', desc:'Làm 50 NV Ngày', icon:'📋', buff:'daily', bonus:0.2, check:d=>d.totalDailyTasksDone>=50 },
    { id:'d_100', name:'Chăm Chỉ III', desc:'Làm 100 NV Ngày', icon:'📋', buff:'daily', bonus:0.3, check:d=>d.totalDailyTasksDone>=100 },
    { id:'d_250', name:'Chăm Chỉ IV', desc:'Làm 250 NV Ngày', icon:'📋', buff:'daily', bonus:0.4, check:d=>d.totalDailyTasksDone>=250 },
    { id:'w_5', name:'Trụ Cột I', desc:'Làm 5 NV Tuần', icon:'🏆', buff:'weekly', bonus:0.1, check:d=>d.totalWeeklyTasksDone>=5 },
    { id:'w_10', name:'Trụ Cột II', desc:'Làm 10 NV Tuần', icon:'🏆', buff:'weekly', bonus:0.2, check:d=>d.totalWeeklyTasksDone>=10 },
    { id:'w_50', name:'Trụ Cột III', desc:'Làm 50 NV Tuần', icon:'🏆', buff:'weekly', bonus:0.4, check:d=>d.totalWeeklyTasksDone>=50 },
    { id:'plant_100',  name:'Nông Dân Tập Sự', desc:'Thu 100 cây', icon:'🌾', buff:'farmSell', bonus:0.1, check:d=>(d.totalCropsHarvested||0)>=100 },
    { id:'plant_500',  name:'Nông Dân Lành Nghề', desc:'Thu 500 cây', icon:'🌿', buff:'farmSell', bonus:0.2, check:d=>(d.totalCropsHarvested||0)>=500 },
    { id:'plant_1000', name:'Đại Nông Phu', desc:'Thu 1000 cây', icon:'🏅', buff:'farmSell', bonus:0.3, check:d=>(d.totalCropsHarvested||0)>=1000 },
    { id:'alc_100', name:'Luyện Đan Sơ Cấp', desc:'Luyện 100 đan', icon:'💊', buff:'alchemy', bonus:0.1, check:d=>(d.totalAlchemyDone||0)>=100 },
    { id:'alc_200', name:'Luyện Đan Trung Cấp', desc:'Luyện 200 đan', icon:'🌀', buff:'alchemy', bonus:0.2, check:d=>(d.totalAlchemyDone||0)>=200 },
    { id:'alc_500', name:'Luyện Đan Đại Thành', desc:'Luyện 500 đan', icon:'✨', buff:'alchemy', bonus:0.3, check:d=>(d.totalAlchemyDone||0)>=500 },
    { id:'med_3',  name:'Tâm Tĩnh', desc:'Streak thiền 3 ngày', icon:'🧘', buff:'meditation', bonus:0.1, check:d=>(d.meditation&&d.meditation.streak||0)>=3 },
    { id:'med_7',  name:'Tâm Định', desc:'Streak thiền 7 ngày', icon:'🌙', buff:'meditation', bonus:0.2, check:d=>(d.meditation&&d.meditation.streak||0)>=7 },
    { id:'med_30', name:'Đại Định', desc:'Streak thiền 30 ngày', icon:'⭐', buff:'meditation', bonus:0.4, check:d=>(d.meditation&&d.meditation.streak||0)>=30 }
];

const PHAP_BAO_DATA = [
    { id: 'thap', type:'tuvi', name: "Tụ Linh Tháp", emoji: "🗼", price: 2000, bonus: 0.3, desc: "+30% Tu Vi (Mọi nguồn)" },
    { id: 'kinh', type:'tuvi', name: "Càn Khôn Kính", emoji: "🪞", price: 8000, bonus: 0.6, desc: "+60% Tu Vi (Mọi nguồn)" },
    { id: 'chau', type:'tuvi', name: "Hỗn Nguyên Châu", emoji: "🔮", price: 25000, bonus: 1.0, desc: "+100% Tu Vi (Mọi nguồn)" },
    { id: 'tram', type:'afk', name: "An Thần Hương", emoji: "🎋", price: 1500, bonus: 0.5, desc: "+50% Linh Thạch AFK" },
    { id: 'doan', type:'afk', name: "Thanh Tâm Bồ Đoàn", emoji: "🪷", price: 6000, bonus: 1.0, desc: "+100% Linh Thạch AFK" },
    { id: 'coc', type:'afk', name: "Tĩnh Tâm Cốc", emoji: "🏕️", price: 20000, bonus: 2.0, desc: "+200% Linh Thạch AFK" },
    { id: 'dinh', type:'dan', name: "Hỏa Vũ Đỉnh", emoji: "🏺", price: 5000, bonus: 0.3, desc: "+30% Tốc độ & EXP Luyện Đan" },
    { id: 'batquai', type:'dan', name: "Bát Quái Lò", emoji: "☯️", price: 15000, bonus: 0.6, desc: "+60% Tốc độ & EXP Luyện Đan" },
    { id: 'cuoc', type:'farm', name: "Thần Nông Cuốc", emoji: "⛏️", price: 4000, bonus: 0.3, desc: "+30% Sản lượng Bán/Dùng Cây" },
    { id: 'nuong', type:'farm', name: "Cửu Thiên Tức Nhưỡng", emoji: "🟫", price: 12000, bonus: 0.6, desc: "+60% Sản lượng & +20% Tốc trồng" }
];

// ════════════════════════════════════════════
// STATE
// ════════════════════════════════════════════
var userData = {
    points:0, exp:0, realmIndex:0,
    lastLoginMidnight:0, lastCheckinMidnight:0, lastWeeklyReset:0,
    checkinStreak:0, totalDailyTasksDone:0, totalWeeklyTasksDone:0,
    currentDailyTasks:[],
    weeklyTasks:{dailyDone:0,checkins:0,rw1:false,rw2:false,fullCompleted:false},
    afkPendingLt: 0, afkStartTime: Date.now(), afkLastCheck: Date.now(),
    journal: {}, expense: {}
};