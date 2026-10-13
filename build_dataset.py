import json

data = [
    # 校長室
    {"category": "校長室", "building": "行政大樓", "role": "傳真", "name": "", "ext": "", "direct": "4856117", "note": "傳真專線"},
    {"category": "校長室", "building": "行政大樓", "role": "校長", "name": "鍾校長", "ext": "1101", "direct": "", "note": ""},
    {"category": "校長室", "building": "行政大樓", "role": "秘書", "name": "黃秘書", "ext": "1102", "direct": "", "note": ""},
    {"category": "校長室", "building": "行政大樓", "role": "技工", "name": "劉小姐", "ext": "1103", "direct": "", "note": ""},
    {"category": "校長室", "building": "行政大樓", "role": "校長宿舍", "name": "", "ext": "1104", "direct": "", "note": ""},

    # 協力組織
    {"category": "協力組織", "building": "校園設施", "role": "警衛室", "name": "", "ext": "1110", "direct": "", "note": "校門口警衛室"},
    {"category": "協力組織", "building": "校園設施", "role": "聯合辦公室", "name": "", "ext": "1112", "direct": "", "note": ""},
    {"category": "協力組織", "building": "校園設施", "role": "第一會議室", "name": "", "ext": "1113", "direct": "", "note": ""},
    {"category": "協力組織", "building": "校園設施", "role": "交通安全教室", "name": "", "ext": "1114", "direct": "", "note": ""},
    {"category": "協力組織", "building": "校園設施", "role": "第二會議室", "name": "", "ext": "1115", "direct": "", "note": ""},

    # 人事室
    {"category": "人事室", "building": "行政大樓", "role": "人事室專線", "name": "", "ext": "", "direct": "4784103", "note": "直撥電話"},
    {"category": "人事室", "building": "行政大樓", "role": "傳真", "name": "", "ext": "", "direct": "4755774", "note": "人事室傳真"},
    {"category": "人事室", "building": "行政大樓", "role": "主任", "name": "邱主任", "ext": "1121", "direct": "", "note": ""},
    {"category": "人事室", "building": "行政大樓", "role": "組員", "name": "陳先生", "ext": "1122", "direct": "", "note": ""},

    # 會計室
    {"category": "會計室", "building": "行政大樓", "role": "會計室專線", "name": "", "ext": "", "direct": "4789683", "note": "直撥電話"},
    {"category": "會計室", "building": "行政大樓", "role": "傳真", "name": "", "ext": "", "direct": "4782322", "note": "會計室傳真"},
    {"category": "會計室", "building": "行政大樓", "role": "主任", "name": "林主任", "ext": "1131", "direct": "", "note": ""},
    {"category": "會計室", "building": "行政大樓", "role": "組員", "name": "張小姐", "ext": "1132", "direct": "", "note": ""},
    {"category": "會計室", "building": "行政大樓", "role": "佐理員", "name": "陳小姐", "ext": "1133", "direct": "", "note": ""},

    # 教務處
    {"category": "教務處", "building": "行政大樓", "role": "教務處專線", "name": "", "ext": "", "direct": "4783574", "note": "直撥電話"},
    {"category": "教務處", "building": "行政大樓", "role": "傳真", "name": "", "ext": "", "direct": "4882675", "note": "教務處傳真"},
    {"category": "教務處", "building": "行政大樓", "role": "主任", "name": "李主任", "ext": "1201", "direct": "", "note": "教務主任"},
    {"category": "教務處", "building": "行政大樓", "role": "教學組長", "name": "邱組長", "ext": "1211", "direct": "", "note": ""},
    {"category": "教務處", "building": "行政大樓", "role": "幹事", "name": "張小姐", "ext": "1212", "direct": "", "note": "教學組"},
    {"category": "教務處", "building": "行政大樓", "role": "印刷室", "name": "陳先生", "ext": "1213", "direct": "", "note": ""},
    {"category": "教務處", "building": "行政大樓", "role": "註冊組長", "name": "賴組長", "ext": "1221", "direct": "", "note": ""},
    {"category": "教務處", "building": "行政大樓", "role": "幹事", "name": "曾小姐", "ext": "1222", "direct": "", "note": "註冊組"},
    {"category": "教務處", "building": "行政大樓", "role": "設備組長", "name": "鄭組長", "ext": "1231", "direct": "", "note": ""},
    {"category": "教務處", "building": "行政大樓", "role": "助理員", "name": "謝小姐", "ext": "1232", "direct": "", "note": "設備組"},
    {"category": "教務處", "building": "行政大樓", "role": "書記", "name": "吳先生", "ext": "1233", "direct": "", "note": "設備組"},
    {"category": "教務處", "building": "行政大樓", "role": "數位前導助理", "name": "王小姐", "ext": "1234", "direct": "", "note": ""},
    {"category": "教務處", "building": "行政大樓", "role": "實驗研究組長", "name": "邱組長", "ext": "1241", "direct": "", "note": "實研組"},
    {"category": "教務處", "building": "行政大樓", "role": "幹事", "name": "宋先生", "ext": "1242", "direct": "", "note": "實研組"},
    {"category": "教務處", "building": "行政大樓", "role": "均質化專案助理", "name": "", "ext": "1243", "direct": "", "note": ""},
    {"category": "教務處", "building": "行政大樓", "role": "學期歷程檔案助理", "name": "楊小姐", "ext": "1244", "direct": "", "note": "學習歷程檔案"},
    {"category": "教務處", "building": "行政大樓", "role": "試務組組長", "name": "蘇組長", "ext": "1251", "direct": "", "note": ""},
    {"category": "教務處", "building": "行政大樓", "role": "幹事", "name": "蔡小姐", "ext": "1252", "direct": "", "note": "試務組"},
    {"category": "教務處", "building": "行政大樓", "role": "教務處分機", "name": "", "ext": "1261", "direct": "", "note": ""},
    {"category": "教務處", "building": "行政大樓", "role": "英語教師", "name": "", "ext": "1262", "direct": "", "note": ""},
    {"category": "教務處", "building": "行政大樓", "role": "雙語助理", "name": "葉先生", "ext": "1263", "direct": "", "note": ""},
    {"category": "教務處", "building": "行政大樓", "role": "雙語教師", "name": "高老師", "ext": "1264", "direct": "", "note": ""},

    # 總務處
    {"category": "總務處", "building": "行政大樓", "role": "總務處專線", "name": "", "ext": "", "direct": "4783349", "note": "直撥電話"},
    {"category": "總務處", "building": "行政大樓", "role": "傳真", "name": "", "ext": "", "direct": "4780164", "note": "總務處傳真"},
    {"category": "總務處", "building": "行政大樓", "role": "主任", "name": "劉主任", "ext": "1401", "direct": "", "note": "總務主任"},
    {"category": "總務處", "building": "行政大樓", "role": "文書組長", "name": "黃組長", "ext": "1411", "direct": "", "note": ""},
    {"category": "總務處", "building": "行政大樓", "role": "臨時人員", "name": "鍾小姐", "ext": "1412", "direct": "", "note": "文書組"},
    {"category": "總務處", "building": "行政大樓", "role": "出納組長", "name": "黃組長", "ext": "1421", "direct": "", "note": ""},
    {"category": "總務處", "building": "行政大樓", "role": "庶務組長", "name": "劉組長", "ext": "1431", "direct": "", "note": ""},
    {"category": "總務處", "building": "行政大樓", "role": "財管管理員", "name": "謝先生", "ext": "1432", "direct": "", "note": "庶務組"},
    {"category": "總務處", "building": "行政大樓", "role": "採購幹事", "name": "張先生", "ext": "1433", "direct": "", "note": "庶務組"},
    {"category": "總務處", "building": "行政大樓", "role": "學務創新人力", "name": "彭先生", "ext": "1434", "direct": "", "note": "總務處"},
    {"category": "總務處", "building": "行政大樓", "role": "臨時人員", "name": "宋先生", "ext": "1435", "direct": "", "note": ""},

    # 員生社
    {"category": "員生社", "building": "員生社", "role": "員生社專線", "name": "", "ext": "", "direct": "4750453", "note": "直撥電話"},
    {"category": "員生社", "building": "員生社", "role": "員生社", "name": "林小姐", "ext": "1491", "direct": "", "note": ""},

    # 導師辦公室
    {"category": "導師辦公室", "building": "悅知樓", "role": "悅知樓1樓導師室(高一)", "name": "高一導師", "ext": "1361, 1365", "direct": "", "note": "悅知樓 1F"},
    {"category": "導師辦公室", "building": "悅知樓", "role": "悅知樓2樓導師室(高一)", "name": "高一導師", "ext": "1366", "direct": "", "note": "悅知樓 2F"},
    {"category": "導師辦公室", "building": "悅知樓", "role": "悅知樓3樓導師室(高二)", "name": "高二導師", "ext": "1362, 1364", "direct": "", "note": "悅知樓 3F"},
    {"category": "導師辦公室", "building": "日新樓", "role": "日新樓1樓導師室(高三)", "name": "高三導師", "ext": "1363, 1367", "direct": "", "note": "日新樓 1F"},

    # 專任教師辦公室
    {"category": "專任教師辦公室", "building": "蘊慧樓", "role": "蘊慧樓1樓專一辦公室", "name": "專任教師", "ext": "1271, 1275", "direct": "", "note": "蘊慧樓 1F"},
    {"category": "專任教師辦公室", "building": "蘊慧樓", "role": "蘊慧樓2樓專二辦公室", "name": "專任教師", "ext": "1272", "direct": "", "note": "蘊慧樓 2F"},
    {"category": "專任教師辦公室", "building": "日新樓", "role": "日新樓2樓專三辦公室", "name": "專任教師", "ext": "1273", "direct": "", "note": "日新樓 2F"},
    {"category": "專任教師辦公室", "building": "日新樓", "role": "日新樓3樓專四辦公室", "name": "專任教師", "ext": "1274", "direct": "", "note": "日新樓 3F (原表記日樓新3樓)"},

    # 實驗室
    {"category": "實驗室", "building": "實驗大樓", "role": "化學實驗室", "name": "", "ext": "1373", "direct": "", "note": ""},
    {"category": "實驗室", "building": "實驗大樓", "role": "基礎理化實驗室", "name": "", "ext": "1374", "direct": "", "note": ""},
    {"category": "實驗室", "building": "實驗大樓", "role": "物理實驗室", "name": "", "ext": "1375", "direct": "", "note": ""},
    {"category": "實驗室", "building": "實驗大樓", "role": "生物實驗室", "name": "", "ext": "1376", "direct": "", "note": ""},
    {"category": "實驗室", "building": "實驗大樓", "role": "基礎生物實驗室", "name": "", "ext": "1378", "direct": "", "note": ""},
    {"category": "實驗室", "building": "實驗大樓", "role": "地科實驗室", "name": "", "ext": "1379", "direct": "", "note": "地球科學實驗室"},

    # 專科教室
    {"category": "專科教室", "building": "啟明樓/蘊慧樓/綜合", "role": "啟明樓校史室", "name": "", "ext": "1284", "direct": "", "note": "啟明樓"},
    {"category": "專科教室", "building": "綜合", "role": "語言教室", "name": "", "ext": "1285", "direct": "", "note": ""},
    {"category": "專科教室", "building": "蘊慧樓", "role": "蘊慧樓電腦機房", "name": "", "ext": "1286", "direct": "", "note": "機房管理"},
    {"category": "專科教室", "building": "綜合", "role": "電腦教室一", "name": "", "ext": "1287", "direct": "", "note": ""},
    {"category": "專科教室", "building": "綜合", "role": "視聽一教室", "name": "", "ext": "1288", "direct": "", "note": ""},
    {"category": "專科教室", "building": "綜合", "role": "電腦教室二", "name": "", "ext": "1289", "direct": "", "note": ""},
    {"category": "專科教室", "building": "綜合", "role": "美術教室", "name": "", "ext": "1291", "direct": "", "note": ""},
    {"category": "專科教室", "building": "綜合", "role": "科技應用教室", "name": "", "ext": "1292", "direct": "", "note": ""},
    {"category": "專科教室", "building": "綜合", "role": "新興科技推廣教室", "name": "", "ext": "1293", "direct": "", "note": ""},
    {"category": "專科教室", "building": "綜合", "role": "雙語教室", "name": "", "ext": "1294", "direct": "", "note": ""},
    {"category": "專科教室", "building": "綜合", "role": "電腦教室三", "name": "", "ext": "1295", "direct": "", "note": ""},
    {"category": "專科教室", "building": "綜合", "role": "探究與實作教室", "name": "", "ext": "1296", "direct": "", "note": ""},
    {"category": "專科教室", "building": "綜合", "role": "環境教育中心", "name": "", "ext": "1297", "direct": "", "note": ""},

    # 日新樓專科教室
    {"category": "日新樓專科教室", "building": "日新樓", "role": "英語情境教室", "name": "", "ext": "1711", "direct": "", "note": ""},
    {"category": "日新樓專科教室", "building": "日新樓", "role": "日新樓展演中心", "name": "", "ext": "1712", "direct": "", "note": ""},
    {"category": "日新樓專科教室", "building": "日新樓", "role": "護理教室", "name": "", "ext": "1751", "direct": "", "note": ""},
    {"category": "日新樓專科教室", "building": "日新樓", "role": "計概教室", "name": "", "ext": "1752", "direct": "", "note": "計算機概論教室"},
    {"category": "日新樓專科教室", "building": "日新樓", "role": "音樂教室", "name": "", "ext": "1761", "direct": "", "note": ""},
    {"category": "日新樓專科教室", "building": "日新樓", "role": "藝術生活教室", "name": "", "ext": "1764", "direct": "", "note": ""},
    {"category": "日新樓專科教室", "building": "日新樓", "role": "視覺藝術教室", "name": "", "ext": "1765", "direct": "", "note": ""},

    # 御風樓
    {"category": "御風樓", "building": "御風樓", "role": "御風2-1", "name": "", "ext": "2421", "direct": "", "note": "御風樓 2F"},
    {"category": "御風樓", "building": "御風樓", "role": "御風2-2", "name": "", "ext": "2422", "direct": "", "note": "御風樓 2F"},
    {"category": "御風樓", "building": "御風樓", "role": "御風2-3", "name": "", "ext": "2423", "direct": "", "note": "御風樓 2F"},
    {"category": "御風樓", "building": "御風樓", "role": "御風3-1", "name": "", "ext": "2431", "direct": "", "note": "御風樓 3F"},
    {"category": "御風樓", "building": "御風樓", "role": "御風3-2", "name": "", "ext": "2432", "direct": "", "note": "御風樓 3F"},
    {"category": "御風樓", "building": "御風樓", "role": "御風3-3", "name": "", "ext": "2433", "direct": "", "note": "御風樓 3F"},
    {"category": "御風樓", "building": "御風樓", "role": "御風3-4", "name": "", "ext": "2434", "direct": "", "note": "御風樓 3F"},
    {"category": "御風樓", "building": "御風樓", "role": "社團教室2", "name": "", "ext": "2435", "direct": "", "note": "御風樓"},

    # 生科大樓
    {"category": "生科大樓", "building": "生科大樓", "role": "體育器材室", "name": "", "ext": "1811", "direct": "", "note": ""},
    {"category": "生科大樓", "building": "生科大樓", "role": "烹飪教室", "name": "", "ext": "1822", "direct": "", "note": ""},
    {"category": "生科大樓", "building": "生科大樓", "role": "生活科技教室", "name": "", "ext": "1821", "direct": "", "note": ""},
    {"category": "生科大樓", "building": "生科大樓", "role": "家政教室", "name": "", "ext": "1822", "direct": "", "note": ""},

    # 實習處
    {"category": "實習處", "building": "實習大樓", "role": "實習處主任", "name": "簡主任", "ext": "1701", "direct": "", "note": ""},
    {"category": "實習處", "building": "實習大樓", "role": "實習就業組長", "name": "蔡組長", "ext": "1702", "direct": "", "note": ""},
    {"category": "實習處", "building": "實習大樓", "role": "資訊科主任", "name": "廖主任", "ext": "1703", "direct": "", "note": ""},
    {"category": "實習處", "building": "實習大樓", "role": "技佐", "name": "林先生", "ext": "1704", "direct": "", "note": ""},
    {"category": "實習處", "building": "實習大樓", "role": "電子科主任", "name": "余主任", "ext": "1705", "direct": "", "note": ""},
    {"category": "實習處", "building": "實習大樓", "role": "技士", "name": "卓小姐", "ext": "1706", "direct": "", "note": ""},

    # 學務處
    {"category": "學務處", "building": "行政大樓", "role": "學務處專線", "name": "", "ext": "", "direct": "4758950", "note": "直撥電話"},
    {"category": "學務處", "building": "行政大樓", "role": "傳真", "name": "", "ext": "", "direct": "4757034", "note": "學務處傳真"},
    {"category": "學務處", "building": "行政大樓", "role": "主任", "name": "呂主任", "ext": "1301", "direct": "", "note": "學務主任"},
    {"category": "學務處", "building": "行政大樓", "role": "午餐秘書", "name": "李老師", "ext": "1302", "direct": "", "note": ""},
    {"category": "學務處", "building": "行政大樓", "role": "學務創新人力", "name": "呂先生", "ext": "1303", "direct": "", "note": ""},
    {"category": "學務處", "building": "行政大樓", "role": "訓育組長", "name": "簡組長", "ext": "1311", "direct": "", "note": ""},
    {"category": "學務處", "building": "行政大樓", "role": "幹事", "name": "傅小姐", "ext": "1312", "direct": "", "note": "訓育組"},
    {"category": "學務處", "building": "行政大樓", "role": "活動組長", "name": "魏組長", "ext": "1321", "direct": "", "note": ""},
    {"category": "學務處", "building": "行政大樓", "role": "學務創新人力", "name": "林先生", "ext": "1322", "direct": "", "note": "活動組"},
    {"category": "學務處", "building": "體育館/校園", "role": "體育組長", "name": "廖組長", "ext": "1331", "direct": "", "note": ""},
    {"category": "學務處", "building": "游泳池", "role": "游泳池", "name": "陳先生", "ext": "1333", "direct": "", "note": ""},
    {"category": "學務處", "building": "體育館/校園", "role": "管理員", "name": "鍾小姐", "ext": "1334", "direct": "", "note": "體育組"},
    {"category": "學務處", "building": "體育館/校園", "role": "跆拳道館", "name": "", "ext": "1335", "direct": "", "note": ""},
    {"category": "學務處", "building": "行政大樓", "role": "衛生組長", "name": "詹組長", "ext": "1341", "direct": "", "note": ""},
    {"category": "學務處", "building": "健康中心", "role": "護理師(健康中心)", "name": "陳小姐", "ext": "1342", "direct": "", "note": ""},
    {"category": "學務處", "building": "行政大樓", "role": "學務創新人力", "name": "張先生", "ext": "1343", "direct": "", "note": "衛生組"},
    {"category": "學務處", "building": "健康中心", "role": "健康中心", "name": "陳小姐", "ext": "1119", "direct": "", "note": ""},
    {"category": "學務處", "building": "禮堂", "role": "禮堂準備室", "name": "", "ext": "1324", "direct": "", "note": ""},

    # 校安中心
    {"category": "校安中心", "building": "校安中心", "role": "校安中心專線", "name": "", "ext": "", "direct": "4854998", "note": "直撥電話 / 24小時校安緊急專線"},
    {"category": "校安中心", "building": "校安中心", "role": "傳真", "name": "", "ext": "", "direct": "4780428", "note": "校安中心傳真"},
    {"category": "校安中心", "building": "校安中心", "role": "學務創新人力", "name": "廖先生", "ext": "1351", "direct": "", "note": ""},
    {"category": "校安中心", "building": "校安中心", "role": "生輔組長", "name": "張組長", "ext": "1352", "direct": "", "note": "生活輔導組"},
    {"category": "校安中心", "building": "校安中心", "role": "學務創新人力", "name": "李先生", "ext": "1353", "direct": "", "note": ""},
    {"category": "校安中心", "building": "校安中心", "role": "學務創新人力", "name": "陳先生", "ext": "1354", "direct": "", "note": ""},
    {"category": "校安中心", "building": "校安中心", "role": "幹事", "name": "范小姐", "ext": "1355", "direct": "", "note": "生輔組"},
    {"category": "校安中心", "building": "校安中心", "role": "學務創新人力", "name": "郭先生", "ext": "1356", "direct": "", "note": ""},
    {"category": "校安中心", "building": "校安中心", "role": "學務創新人力", "name": "彭先生", "ext": "1357", "direct": "", "note": ""},

    # 輔導室
    {"category": "輔導室", "building": "輔導大樓", "role": "輔導室專線", "name": "", "ext": "", "direct": "4758437", "note": "直撥電話"},
    {"category": "輔導室", "building": "輔導大樓", "role": "輔導主任", "name": "林主任", "ext": "1503", "direct": "", "note": ""},
    {"category": "輔導室", "building": "輔導大樓", "role": "專任輔導教師", "name": "陳老師", "ext": "1504", "direct": "", "note": ""},
    {"category": "輔導室", "building": "輔導大樓", "role": "專任輔導教師", "name": "吳老師", "ext": "1507", "direct": "", "note": ""},
    {"category": "輔導室", "building": "輔導大樓", "role": "專任輔導教師", "name": "金老師", "ext": "1501", "direct": "", "note": ""},
    {"category": "輔導室", "building": "輔導大樓", "role": "專任輔導教師", "name": "陳老師", "ext": "1502", "direct": "", "note": ""},
    {"category": "輔導室", "building": "輔導大樓", "role": "特教教師1", "name": "何老師", "ext": "1505", "direct": "", "note": "特殊教育"},
    {"category": "輔導室", "building": "輔導大樓", "role": "特教教師2", "name": "林老師", "ext": "1506", "direct": "", "note": "特殊教育"},
    {"category": "輔導室", "building": "輔導大樓", "role": "特教教師3", "name": "曾老師", "ext": "1511", "direct": "", "note": "特殊教育"},
    {"category": "輔導室", "building": "輔導大樓", "role": "生涯資訊室", "name": "", "ext": "1508", "direct": "", "note": ""},
    {"category": "輔導室", "building": "輔導大樓", "role": "團體諮商室", "name": "", "ext": "1509", "direct": "", "note": ""},
    {"category": "輔導室", "building": "輔導大樓", "role": "學習中心", "name": "", "ext": "1510", "direct": "", "note": ""},

    # 圖書館
    {"category": "圖書館", "building": "圖書館", "role": "圖書館專線", "name": "", "ext": "", "direct": "4780586", "note": "直撥電話"},
    {"category": "圖書館", "building": "圖書館", "role": "主任", "name": "施主任", "ext": "1601", "direct": "", "note": "圖書館主任"},
    {"category": "圖書館", "building": "圖書館", "role": "讀者服務組長", "name": "何組長", "ext": "1602", "direct": "", "note": ""},
    {"category": "圖書館", "building": "圖書館", "role": "資訊媒體組長", "name": "賴組長", "ext": "1603", "direct": "", "note": ""},
    {"category": "圖書館", "building": "圖書館", "role": "幹事/讀者服務櫃台", "name": "呂小姐", "ext": "1605", "direct": "", "note": "流通櫃台"},
    {"category": "圖書館", "building": "圖書館", "role": "喜閱學堂", "name": "", "ext": "1606", "direct": "", "note": "自主學習空間"},
    {"category": "圖書館", "building": "圖書館", "role": "演藝廳", "name": "", "ext": "1607", "direct": "", "note": ""}
]

meta = {
    "title": "桃園市立楊梅高級中學語音電話分機一覽表",
    "shortTitle": "楊梅高中分機一覽表",
    "schoolName": "桃園市立楊梅高級中學",
    "switchboard": [
        {"name": "代表號", "number": "03-4789618"},
        {"name": "二線", "number": "03-4780449"},
        {"name": "三線", "number": "03-4780740"}
    ],
    "compiledBy": "總務處",
    "version": "115/09/07",
    "dataCount": len(data)
}

output = {
    "meta": meta,
    "entries": data
}

with open("contacts_data.json", "w", encoding="utf-8") as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print(f"Generated contacts_data.json with {len(data)} entries.")
