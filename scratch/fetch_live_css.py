import urllib.request
import re
import urllib.parse

url = 'https://superdeluxesofties.in/'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        html = resp.read().decode('utf-8', errors='ignore')

    print("HTML Length:", len(html))
    
    # Find stylesheets
    css_hrefs = re.findall(r'href=[\'"]([^\'"]+\.css[^\'"]*)[\'"]', html)
    print("CSS Hrefs:", css_hrefs)
    
    for href in css_hrefs:
        full_url = urllib.parse.urljoin(url, href)
        print("Fetching CSS:", full_url)
        try:
            req_css = urllib.request.Request(full_url, headers={'User-Agent': 'Mozilla/5.0'})
            css_content = urllib.request.urlopen(req_css, timeout=10).read().decode('utf-8', errors='ignore')
            # Extract root variables
            root_vars = re.findall(r'(--[a-zA-Z0-9_-]+)\s*:\s*([^;]+);', css_content)
            print(f"Found {len(root_vars)} CSS variables in {href}:")
            for k, v in root_vars:
                print(f"  {k}: {v.strip()}")
            
            # Extract common color patterns
            hex_colors = set(re.findall(r'#[0-9a-fA-F]{3,8}', css_content))
            print("  Sample hex colors:", sorted(list(hex_colors))[:25])
        except Exception as e:
            print("  Failed to fetch css:", e)

    # Also check inline styles in HTML
    styles = re.findall(r'<style[^>]*>(.*?)</style>', html, re.DOTALL)
    for i, s in enumerate(styles):
        root_vars = re.findall(r'(--[a-zA-Z0-9_-]+)\s*:\s*([^;]+);', s)
        if root_vars:
            print(f"Inline style tag {i} root vars:")
            for k, v in root_vars:
                print(f"  {k}: {v.strip()}")
        hex_colors = set(re.findall(r'#[0-9a-fA-F]{3,8}', s))
        if hex_colors:
            print(f"Inline style tag {i} hex colors:", sorted(list(hex_colors))[:20])

except Exception as e:
    print("Error:", e)
