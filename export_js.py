import json

with open("contacts_data.json", encoding="utf-8") as f:
    data = json.load(f)

# Enhance entries with search keywords and tags
for item in data["entries"]:
    keywords = [
        item["category"],
        item["building"],
        item["role"],
        item["name"],
        item["ext"],
        item["direct"],
        item.get("note", "")
    ]
    # Add common aliases
    if "導師" in item["role"]:
        keywords.extend(["班導", "導師", "老師"])
    if "主任" in item["role"] or "主任" in item["name"]:
        keywords.append("主管")
    if "組長" in item["role"] or "組長" in item["name"]:
        keywords.append("組長")
    if "健康中心" in item["role"] or "護理" in item["role"]:
        keywords.extend(["保健室", "校醫", "受傷", "生病"])
    if "校安" in item["category"] or "教官" in item["role"]:
        keywords.extend(["緊急", "值星", "安輔", "通報"])
    if "警衛" in item["role"]:
        keywords.extend(["大門", "保全", "換證", "會客"])
    if "圖書" in item["category"]:
        keywords.extend(["借書", "自習", "閱覽"])
    if "員生社" in item["category"]:
        keywords.extend(["福利社", "合作社", "買制服", "午餐"])
    if "體育" in item["role"] or "游泳" in item["role"]:
        keywords.extend(["運動", "球場", "泳池"])
    if "高一" in item["role"]:
        keywords.extend(["一年級", "高1", "高一"])
    if "高二" in item["role"]:
        keywords.extend(["二年級", "高2", "高二"])
    if "高三" in item["role"]:
        keywords.extend(["三年級", "高3", "高三"])
    
    item["search_str"] = " ".join([k for k in keywords if k]).lower()

js_content = f"// 桃園市立楊梅高級中學語音電話分機資料集\nwindow.SCHOOL_DIRECTORY_DATA = {json.dumps(data, ensure_ascii=False, indent=2)};\n"

with open("contacts_data.js", "w", encoding="utf-8") as f:
    f.write(js_content)

print("Generated contacts_data.js successfully.")
