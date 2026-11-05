import os

dir_path = 'Super Deluxe Existing website/Product IMAGES'
files = sorted([f for f in os.listdir(dir_path) if f.endswith('.png')])

html = ['''<!DOCTYPE html>
<html>
<head><title>Product Gallery</title>
<style>
body { font-family: sans-serif; background: #eef2f8; padding: 20px; }
.grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.item { background: #fff; padding: 12px; border-radius: 12px; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
img { max-width: 100%; height: 220px; object-fit: contain; }
p { font-size: 11px; margin-top: 8px; color: #333; }
</style>
</head>
<body>
<h1>Product Images (41 items)</h1>
<div class="grid">''']

for f in files:
    # find thumbnail
    thumb_name = f'scratch/product_thumbs/thumb_{f}.jpg'
    # check if thumb file has index prefix
    found = None
    for t in os.listdir('scratch/product_thumbs'):
        if f in t:
            found = t
            break
    if found:
        html.append(f'<div class="item"><img src="product_thumbs/{found}" alt="{f}"><p>{f}</p></div>')

html.append('</div></body></html>')

with open('scratch/gallery.html', 'w', encoding='utf-8') as out:
    out.write('\n'.join(html))

print('Wrote scratch/gallery.html successfully')
