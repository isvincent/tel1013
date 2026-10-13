import json

with open('pdf_items.json', encoding='utf-8') as f:
    items = json.load(f)

lines = []
for item in items:
    placed = False
    for line in lines:
        if abs(line['y'] - item['y']) <= 3.0:
            line['items'].append(item)
            placed = True
            break
    if not placed:
        lines.append({'y': item['y'], 'items': [item]})

lines.sort(key=lambda l: -l['y'])

with open('pdf_lines.txt', 'w', encoding='utf-8') as out:
    for i, line in enumerate(lines):
        line['items'].sort(key=lambda it: it['x'])
        line_str = '  |  '.join([f"[{it['x']:.0f}] {it['text']}" for it in line['items']])
        out.write(f"{i:02d} (y={line['y']:.1f}): {line_str}\n")

print(f"Processed {len(lines)} lines to pdf_lines.txt")
