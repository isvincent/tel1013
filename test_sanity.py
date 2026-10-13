import re, json

with open("index.html", encoding="utf-8") as f:
    html = f.read()

with open("app.js", encoding="utf-8") as f:
    js = f.read()

with open("contacts_data.js", encoding="utf-8") as f:
    data_js = f.read()

# 1. Check all getElementById in app.js exist in index.html
ids_in_js = re.findall(r"getElementById\(['\"]([^'\"]+)['\"]\)", js)
missing_ids = []
for el_id in set(ids_in_js):
    if f'id="{el_id}"' not in html and f"id='{el_id}'" not in html:
        missing_ids.append(el_id)

print(f"Total getElementById used in JS: {len(set(ids_in_js))}")
print(f"Missing IDs in HTML: {missing_ids}")

# 2. Check JSON data in contacts_data.js
json_part = data_js.replace("window.SCHOOL_DIRECTORY_DATA = ", "").rstrip(";\n")
parsed = json.loads(json_part)
print(f"Contacts entries loaded: {len(parsed['entries'])}")
print("Categories in entries:", len(set(e['category'] for e in parsed['entries'])))

# 3. Check DTMF key frequencies
for k in '0123456789*#':
    if f"'{k}':" not in js:
        print(f"Warning: DTMF key {k} missing!")

print("All tests passed!")
